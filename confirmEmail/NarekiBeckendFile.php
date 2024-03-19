<?php

namespace App\Http\Controllers;

use Amplitude;
use App\Jobs\RickAiJob;
use App\Mail\ResetPasswordMailable;
use App\Models\AuthHistory;
use App\Models\Experiment;
use App\Models\Promo;
use App\Models\RecoveryCode;
use App\Models\Team;
use App\Models\UsedRecoverCode;
use App\Models\User;
use App\Models\UserOauthTokenAlreadyUse;
use App\Services\Auth\AuthorizeUserService;
use App\Services\RateLimit\LoginWithRateLimitService;
use App\Services\SplitTariffTestService;
use App\Services\SplitTestService;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\RateLimiter;
use Laravel\Passport\RefreshToken;
use Laravel\Passport\Token;
use Nyholm\Psr7\Factory\Psr17Factory;
use romanzipp\Turnstile\Rules\TurnstileCaptcha;
use Symfony\Bridge\PsrHttpMessage\Factory\PsrHttpFactory;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;
use Illuminate\Validation\ValidationException;
use Laravel\Fortify\Contracts\TwoFactorAuthenticationProvider;
use Throwable;

class AuthController extends Controller
{
    private $splitTestService;
    protected TwoFactorAuthenticationProvider $provider;
    private $authorizeUserService;
    private LoginWithRateLimitService $loginRateLimitService;

    public function __construct(
        SplitTestService $splitTestService,
        SplitTariffTestService $splitTariffTestService,
        TwoFactorAuthenticationProvider $provider,
        AuthorizeUserService $authorizeUserService,
        LoginWithRateLimitService $loginRateLimitService
    ) {
        $this->splitTestService = $splitTestService;
        $this->splitTariffTestService = $splitTariffTestService;
        $this->authorizeUserService = $authorizeUserService;
        $this->provider = $provider;
        $this->loginRateLimitService = $loginRateLimitService;
    }

    public function register(Request $request): JsonResponse|Response
    {
        $data = $this->validate($request, [
            'username'      => 'required|unique:users|email',
            'password'      => 'required|min:5',
            'telegram'      => 'string',
            'promo'         => 'string',
            'ref'           => 'string',
            'yandexMetrica' => 'string',
            'cookies'       => 'string',
            'utm_source'    => '',
            'utm_medium'    => '',
            'utm_campaign'  => '',
            'utm_term'      => '',
            'utm_content'   => '',
            'language_browser' => '',
            'language_landing' => '',
            'ip' => 'string',
        ]);

        $ip = $data['ip'] ??
            $request->header(
                'X-Forwarded-For',
                $request->header(
                    'X-The-Most-Real-Ip',
                    $request->ip()
                )
            );

        //
        // RATE LIMITING
        //
        $rateLimiterKeyByIp = 'register:' . $ip;
        $maxAttempts = env('RATE_LIMIT_REGISTER_REQUESTS_PER_MINUTE', 5);

        if (RateLimiter::tooManyAttempts($rateLimiterKeyByIp, $maxAttempts)) {
            return response(['too many attempts'], 429);
        }

        RateLimiter::hit($rateLimiterKeyByIp);

        if (!empty($data['promo'])) {
            $promo = Promo::firstWhere([
                'code' => strtoupper(trim($data['promo']))
            ]);

            if (empty($promo->id)) {
                return $this->jsonPrettyError(
                    'E_PROMO',
                    'E_PROMO_NOT_FOUND',
                    'Promo code not found',
                    404
                );
            }
        }

        $refUserId = $promo->userId ?? $data['ref'] ?? 0;
        $refUserId = (int)$refUserId;

        $expiration = Carbon::now('UTC');

        $googleGaId = null;
        if (!empty($data['cookies'])) {
            foreach (explode('; ', $data['cookies']) as $v) {
                preg_match('/^(.*?)=(.*?)$/i', trim($v), $matches);
                if (!empty($matches[1]) && trim($matches[1]) === '_ga_cid') {
                    $parts = explode('.', urldecode($matches[2]));
                    if (count($parts) === 2) {
                        $googleGaId = $parts[0] . '.' . $parts[1];
                    }
                }
            }
        }

        $team = Team::create([
            'name'                            => $data['username'],
            'refUserId'                       => $refUserId,
            'plan'                            => 'free',
            'usersLimit'                      => 1,
            'usersCount'                      => 1,
            'browserProfilesCount'            => 0,
            'browserProfilesLimit'            => 10,
            'subscriptionExpiration'          => $expiration,
            'subscriptionExpirationTimestamp' => $expiration->timestamp,
            'yandexMetrica'                   => !empty($data['yandexMetrica'])
                ? trim($data['yandexMetrica'])
                : null,
            'cookies'                         => !empty($data['cookies'])
                ? trim($data['cookies'])
                : null,
            'googleGaId'                      => $googleGaId
        ]);

        $user = User::create([
            'teamId'        => $team->id,
            'username'      => $data['username'],
            'role'          => 'admin',
            'password'      => password_hash($data['password'], PASSWORD_DEFAULT),
            'telegram'      => !empty($data['telegram']) ? $data['telegram'] : '',
            'promoId'       => !empty($promo->id) ? $promo->id : 0,
            'yandexMetrica' => !empty($data['yandexMetrica'])
                ? trim($data['yandexMetrica'])
                : null,
            'cookies'       => !empty($data['cookies'])
                ? trim($data['cookies'])
                : null,
            'columns'       => json_encode(["status", "notes", "tags", "proxy"]),
            'googleGaId'    => $googleGaId
        ]);


        $testOnboardingGroup = $this->splitTestService->createTest($user);


        $user->generateRoistatData();

        $team->userId = $user->id;
        $team->save();

        try {
            $serverRequest = (new PsrHttpFactory(
                new Psr17Factory(),
                new Psr17Factory(),
                new Psr17Factory(),
                new Psr17Factory()
            ))->createRequest($request);
            $oauthTokens = $this->authorizeUserService->authorize($serverRequest, $data);
        } catch (Exception $exception) {
            return response('Unauthorized ', ResponseAlias::HTTP_UNAUTHORIZED);
        }

        UserOauthTokenAlreadyUse::create([
            'userId' => $user->id,
            'isOauthAlreadyUsed' => true,
        ]);

//        $emailMessage = '<span style="font-size: 24px;">Confirm your registration with'
//            . '&nbsp;<a href="https://anty.dolphin.ru.com/activate/?email='
//            . urlencode($user->username)
//            . '" target="_blank">this link</a>.</span>';
//        $emailData = [
//            'api_key' => env('UNIONE_API_KEY'),
//            'message' => [
//                'recipients' => [
//                    [
//                        'email' => $user->username,
//                    ],
//                ],
//                'body'       => [
//                    'html' => $emailMessage,
//                ],
//                'subject'    => 'Confirm registration',
//                'from_email' => 'anty@dolphin.ru.com',
//                'from_name'  => 'Dolphin Anty',
//            ],
//        ];
        // remove because of spam
//        $ch = curl_init();
//        curl_setopt($ch, CURLOPT_URL, "https://eu1.unione.io/ru/transactional/api/v1/email/send.json");
//        curl_setopt($ch, CURLOPT_POST, 1);
//        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($emailData));
//        curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
//        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
//        curl_exec($ch);
//        curl_close($ch);

        try {
            $rickJob = new RickAiJob(
                $team->id,
                RickAiJob::RICK_LEAD,
                RickAiJob::SOURCE_WEB,
                RickAiJob::NEW_LEAD
            );

            $rickJob->onQueue('subscription')
                ->delay(Carbon::now()->addMinutes(1));

            $this->dispatch($rickJob);
        } catch (\Throwable $e) {
        }

        //
        // AMPLITUDE
        //

        $userProperties = [
            'promocode'                => trim($data['promo'] ?? ''),
            'refferal user'            => User::find($refUserId)->username ?? '',
            'team owner'               => true,
            'cohort week'              => Carbon::now()->dayOfWeek,
            'cohort month'             => Carbon::now()->month,
            'utm_source'               => $data['utm_source'] ?? '',
            'utm_medium'               => $data['utm_medium'] ?? '',
            'utm_campaign'             => $data['utm_campaign'] ?? '',
            'utm_term'                 => $data['utm_term'] ?? '',
            'utm_content'              => $data['utm_content'] ?? '',
            'split fucking tests'      => $testOnboardingGroup,
            'language_landing'         => $data['language_landing'] ?? '',
            'language_browser'         => $data['language_browser'] ?? '',
            'plan'                     => 'free',
            'split fucking alert test' => $user->id % 2 == 0 ? 'test alert group A' : 'test alert group B',
            'split fucking test C2 offer' => $this->getExperiment1ForUserGroup($user) == Experiment::GROUP_A ? 'group A' : 'group B',
            'sft video obzor'             => $this->getExperiment3ForUserGroup($user) === Experiment::GROUP_A ?
                'group A' : 'group B',
        ];

        $this->getExperiment2ForUserGroup($user);

        try {
            $amplitudeResponse = Amplitude::sendEvent(
                $user->username,
                'Registration',
                [],
                $userProperties,
                true,
                $ip
            );
            //@codeCoverageIgnoreStart
        } catch (\Throwable $e) {
        }
        //@codeCoverageIgnoreEnd
        return response()->json([
            'success' => true,
            'token' => $oauthTokens->access_token,
            'refresh_token' => $oauthTokens->refresh_token,
            'expires' => $oauthTokens->expires_in,
            'a' => $amplitudeResponse ?? '',
        ]);
    }

    public function login(Request $request): JsonResponse|Response
    {
        $response401 = response('Unauthorized', 401);

        $requestIp = getRequestIp();

        # --------------
        # VALIDATING
        # --------------

        try {
            $data = $this->validate($request, [
                'username' => 'required',
                'password' => 'required',
            ]);
        } catch (ValidationException $e) {
            return $response401;
        }

        $tryToAuthUser = User::query()
            ->select('id')
            ->where('username', $data['username'])
            ->first();

        if (!empty($tryToAuthUser->id)) {
            $authHistory = AuthHistory::query()->make([
                'userId' => $tryToAuthUser->id,
                'ip' => $requestIp['ip'] ?? '',
                'source' => $this->getSource($request),
                'login_success' => false,
            ]);
        }

        # -----------------
        # RATE LIMITING
        # -----------------

        $this->loginRateLimitService->setRateLimiterKeys($data, $requestIp);
        $this->loginRateLimitService->initRateLimitAttempts();

        if (!$requestIp['ip']) {
            app('sentry')->captureMessage('No ip in login request');
        }

        $whiteIps = explode(',', config('rateLimiter.white_ip_list'));
        $isWhiteIpsRequestInIpRequest = (!empty($requestIp['ip']) && in_array($requestIp['ip'], $whiteIps));

        if (!($isWhiteIpsRequestInIpRequest || config('rateLimiter.white_ip_list') == 'all')) {
            if ($this->loginRateLimitService->checkTooManyAttemptsByIpHard()) {
                $this->loginRateLimitService->addRateLimitByIpExtraHardAttempt();
                if (isset($authHistory)) {
                    $authHistory->type_error = AuthHistory::LOGIN_LIMIT;
                    $authHistory->save();
                }

//                return response('Unauthorized.', ResponseAlias::HTTP_TOO_MANY_REQUESTS);
            }

            if ($this->loginRateLimitService->checkTooManyAttemptsByIpExtraHard()) {
                if (isset($authHistory)) {
                    $authHistory->type_error = AuthHistory::LOGIN_LIMIT;
                    $authHistory->save();
                }

//                return response('Unauthorized.', ResponseAlias::HTTP_TOO_MANY_REQUESTS);
            }

            if ($this->loginRateLimitService->checkIsCaptchaRequired()) {
                try {
                    if ($request->has('cloudflareCaptcha')) {
                        $key = 'cloudflareCaptcha';
                        $validation = ['required', 'string', new TurnstileCaptcha()];
                    } elseif ($request->has('captcha')) {
                        $key = 'captcha';
                        $validation = 'required|mtcaptcha';
                    } else {
                        throw ValidationException::withMessages(['captcha require']);
                    }

                    $this->validate($request, [
                        $key => $validation,
                    ]);
                } catch (ValidationException) {
                    $this->loginRateLimitService->addRateLimitByAllKeys();

                    if (isset($authHistory)) {
                        $authHistory->type_error = AuthHistory::CAPTCHA_ERROR;
                        $authHistory->save();
                    }

//                    return response('Captcha required.', ResponseAlias::HTTP_BAD_REQUEST);
                }
            }
        }

        # -----------------
        # LOGIN
        # -----------------

        try {
            $oauthTokens = $this->authorizeUserService->getOAuthTokenByServerRequest($request, $data);
        } catch (Exception) {
            $this->loginRateLimitService->addRateLimitByAllKeys();
            if ($this->loginRateLimitService->reachedLimitOfMaxLoginAttempts()) {
                return response('Captcha required.', ResponseAlias::HTTP_BAD_REQUEST);
            }

            return $response401;
        }

        $user = User::select(
            'id',
            'teamId',
            'username',
            'password',
            'role',
            'twoFactorEnableDisable',
            'twoFactorPasswordVerify'
        )
            ->where('username', $data['username'])
            ->first();

        UserOauthTokenAlreadyUse::create([
            'userId' => $user->id,
            'isOauthAlreadyUsed' => true,
        ]);


        if ($user && password_verify($data['password'], $user->password)) {
            if ($user->twoFactorEnableDisable) {
                $user->forceFill([
                    'twoFactorPasswordVerify' => User::TWO_FACTORY_PASSWORD_VERIFY,
                ])->save();

                return response(['twoFactory' => true]);
            } else {
                try {
                    Amplitude::sendEvent(
                        $user->username,
                        'Authorization',
                        [],
                        [],
                        true,
                        $ip ?? ''
                    );
                } catch (\Throwable $e) {
                }
                if (isset($authHistory)) {
                    $authHistory->login_success = true;
                    $authHistory->save();
                }
                return response()->json([
                    'token' => $oauthTokens->access_token,
                    'refresh_token' => $oauthTokens->refresh_token,
                    'expires' => $oauthTokens->expires_in,
                ]);
            }
        }
        if (isset($authHistory)) {
            $authHistory->type_error = AuthHistory::WRONG_PASSWORD;
            $authHistory->save();
        }
        return $response401;
    }

    public function refreshToken(Request $request): JsonResponse|Response
    {
        $data = $this->validate($request, [
            'refreshToken' => 'required',
        ]);

        try {
            $serverRequest = (new PsrHttpFactory(
                new Psr17Factory(),
                new Psr17Factory(),
                new Psr17Factory(),
                new Psr17Factory()
            ))->createRequest($request);

            $oauthTokens = $this->authorizeUserService->authorizeWithRefreshToken(
                $serverRequest,
                $data['refreshToken']
            );
        } catch (Exception $exception) {
            return response('Unauthorized', ResponseAlias::HTTP_UNAUTHORIZED);
        }

        return response()->json([
            'token' => $oauthTokens->access_token,
            'refresh_token' => $oauthTokens->refresh_token,
            'expires' => $oauthTokens->expires_in,
        ]);
    }

    public function loginTwoFactory(Request $request): JsonResponse|Response
    {
        $response401 = response('Unauthorized', 401);

        $data = $this->validate($request, [
            'username' => 'required',
            'password' => 'required',
            'code' => 'required_if:recovery_code,==,""|size:6',
            'recovery_code' => 'required_if:code,==,""'
        ]);

        $user = User::select(
            'id',
            'teamId',
            'role',
            'username',
            'twoFactorPasswordVerify',
            'two_factor_secret',
            'two_factor_recovery_codes'
        )
            ->where('username', $data['username'])
            ->first();

        if ($request->code && $user->two_factor_secret) {
            if (!$this->provider->verify(decrypt($user->two_factor_secret), $request->code)) {
                throw ValidationException::withMessages([
                    'code' => [__('The provided two factor authentication code was invalid.')],
                ]);
            };
        }

        if ($user->two_factor_recovery_codes && $request->recovery_code) {
            $usedRecoverCode = UsedRecoverCode::query()
                ->where('userId', $user->id)
                ->where('recoveryCode', $request->recovery_code)
                ->get();

            if ($usedRecoverCode->isNotEmpty()) {
                throw ValidationException::withMessages([
                    'code' => [__('The provided two factor authentication recovery_code was invalid.')],
                ]);
            }

            $code = $user->recoveryCodes();

            if (!in_array($request->recovery_code, $code)) {
                throw ValidationException::withMessages([
                    'code' => [__('The provided two factor authentication recovery_code was invalid.')],
                ]);
            }

            UsedRecoverCode::insert(['userId' => $user->id, 'recoveryCode' => $request->recovery_code]);
        }

        if ($user && $user->twoFactorPasswordVerify) {
            $user->forceFill([
                'twoFactorPasswordVerify' => User::TWO_FACTORY_PASSWORD_VERIFY_DISABLE,
            ])->save();
            try {
                $serverRequest = (new PsrHttpFactory(
                    new Psr17Factory(),
                    new Psr17Factory(),
                    new Psr17Factory(),
                    new Psr17Factory()
                ))->createRequest($request);

                $oauthTokens = $this->authorizeUserService->authorize($serverRequest, $data);
            } catch (Exception $exception) {
                return response('Unauthorized', ResponseAlias::HTTP_UNAUTHORIZED);
            }
            $requestIp = getRequestIp();
            AuthHistory::create([
                'userId' => $user->id,
                'ip' => $requestIp['ip'] ?? '',
                'source' => $this->getSource($request),
                'login_success' => true,
            ]);

            return response()->json([
                'token' => $oauthTokens->access_token,
                'refresh_token' => $oauthTokens->refresh_token,
                'expires' => $oauthTokens->expires_in,
            ]);
        }

        return $response401;
    }

    public function recoverPassword(Request $request): JsonResponse|Response
    {
        if ($request->has('cloudflareCaptcha')) {
            $key = 'cloudflareCaptcha';
            $validation = ['required', 'string', new TurnstileCaptcha()];
        } elseif ($request->has('captcha')) {
            $key = 'captcha';
            $validation = 'required|mtcaptcha';
        } else {
            throw ValidationException::withMessages(['captcha require']);
        }

        $data = $this->validate($request, [
            'username' => 'required',
            $key => $validation,
        ]);
        $ip = getRequestIp()['ip'];

        $maxAttempts = 2;
        $limiterKey =  'recoverPassword:' . $ip;
        if (
            RateLimiter::tooManyAttempts($limiterKey, $maxAttempts)
        ) {
            return response(['error' => 'Too many attempts. Please wait 1 minute'], 429);
        }

        RateLimiter::hit($limiterKey, 60 * 60);

        $user = User::where('username', $data['username'])
            ->first();

        if (!$user) {
            return response(null, 404);
        }


        $recoveryCode = RecoveryCode::create([
            'teamId' => $user->teamId,
            'userId' => $user->id,
            'code'   => rand(1000000000, (int)mb_strimwidth(PHP_INT_MAX, 0, 10)),
        ]);

        Mail::to($user->username)->send(new ResetPasswordMailable($recoveryCode));
        return response()->json(['success' => true]);
    }

    public function resetPassword(Request $request): JsonResponse|Response
    {
        //
        // VALIDATING
        //

        $data = $this->validate($request, [
            'username' => 'string|required',
            'password' => 'string|required|min:5',
            'code'     => 'string|required'
        ]);

        // SLEEP 2 SECS TO THROTTLE BRUTEFORCE ATTEMPTS
        sleep(rand(1, 5));

        //
        // RATE LIMITING
        //

        $ip = $request->header(
            'X-Forwarded-For',
            $request->header(
                'X-The-Most-Real-Ip',
                $request->ip()
            )
        );

        $rateLimiterKeyByIp = 'resetPassword:' . $ip;
        $rateLimiterKeyByUsername = 'resetPassword:' . $data['username'];
        $maxAttempts = env('RATE_LIMIT_PASSWORD_RESET_REQUESTS_PER_MINUTE', 5);

        if (
            RateLimiter::tooManyAttempts($rateLimiterKeyByIp, $maxAttempts)
            || RateLimiter::tooManyAttempts($rateLimiterKeyByUsername, $maxAttempts)
        ) {
            return response(['error' => 'too many attempts'], 429);
        }

        RateLimiter::hit($rateLimiterKeyByIp);
        RateLimiter::hit($rateLimiterKeyByUsername);

        //
        // PASSWORD RESET
        //

        $user = User::where('username', $data['username'])
            ->first();

        if (!$user) {
            return response(null, 404);
        }

        $recoveryCode = RecoveryCode::where('userId', $user->id)
            ->where('teamId', $user->teamId)
            ->where('code', trim($data['code']))
            ->first();

        if (!$recoveryCode) {
            return response(['error' => 'invalid code'], 422);
        }

        if (
            time() - strtotime($recoveryCode->created_at) > 60 * 60
            || $recoveryCode->status !== 0
        ) {
            return response(['error' => 'expired code'], 422);
        }

        $ids = Token::query()
            ->where('user_id', $user->id)
            ->where('client_id', config('passport.passport_grant_client.id'))
            ->where('revoked', false)
            ->pluck('id')
            ->toArray();

        Token::query()
            ->whereIn('id', $ids)
            ->update(['revoked' => 1]);

        RefreshToken::query()
            ->whereIn('access_token_id', $ids)
            ->update(['revoked' => 1]);

        $user->password = password_hash($data['password'], PASSWORD_DEFAULT);
        $user->lastPasswordChangeTimestamp = time();
        $user->save();

        $recoveryCode->status = 1;
        $recoveryCode->save();

        return response()->json(['success' => true]);
    }

    protected function getExperiment1ForUserGroup($user): string
    {
        $groups = [Experiment::GROUP_A, Experiment::GROUP_B];
        $groupExperiment1 = $groups[array_rand($groups)];
        $experiment = new Experiment();
        $experiment = $experiment->fill([
            'group' => $groupExperiment1,
            'name'  => Experiment::EXPERIMENT_1
        ]);
        $user->experiments()->save($experiment);
        return $groupExperiment1;
    }

    protected function getExperiment2ForUserGroup($user): string
    {
        $groups = [ Experiment::GROUP_A, Experiment::GROUP_B];
        $groupExperiment1 = $groups[array_rand($groups)];
        $experiment = new Experiment();
        $experiment = $experiment->fill([
            'group' => $groupExperiment1,
            'name' => Experiment::EXPERIMENT_2
        ]);
        $user->experiments()->save($experiment);
        return $groupExperiment1;
    }

    public function getExperiment3ForUserGroup($user): string
    {
        $groups = [ Experiment::GROUP_A, Experiment::GROUP_B];
        $groupExperiment1 = $groups[array_rand($groups)];
        $experiment = new Experiment();
        $experiment = $experiment->fill([
            'group' => $groupExperiment1,
            'name' => Experiment::EXPERIMENT_3
        ]);
        $user->experiments()->save($experiment);
        return $groupExperiment1;
    }

    private function getSource($request): string
    {
        $source = 'API';
        if (mb_strtolower($request->header('X-Content-Pragma')) == 'hard') {
            $source = 'Application';
        } elseif (mb_strtolower($request->header('X-Content-Pragma')) == 'soft') {
            $source = 'Web';
        }
        return $source;
    }
}
