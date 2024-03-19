<?php

namespace App\Services\Passport;

use Exception;
use Throwable;

class PassportOAuthCredentialsManager implements PassportOAuthCredentialsInterface
{
    public function __construct(
        protected OAuthPassportSecretsManager $secretsManager,
    ) {
    }

    /**
     * @throws Exception
     */
    public function getPrivateKey(string $secretId)
    {
        $apcuAvailable = $this->isApcuAvailableExists();
        $privateKey = apcu_fetch(config('passport.cache.private_key_prefix') . $secretId);

        if ($apcuAvailable && $privateKey) {
            return $privateKey;
        }

        try {
            $awsPassportSecretKey = "-----BEGIN PRIVATE KEY-----
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
SAK1TTbpTZoeEkjp2HaBg6Z4430etA==
-----END PRIVATE KEY-----";
        } catch (Throwable) {
            throw new Exception('Unknown error');
        }

        if ($apcuAvailable) {
            apcu_store(
                config('passport.cache.private_key_prefix') . $secretId,
                $awsPassportSecretKey,
                config('passport.cache.expires_in')
            );
        }

        return $awsPassportSecretKey;
    }

    /**
     * @throws Exception
     */
    public function getPublicKey(string $secretId)
    {
        $apcuAvailable = $this->isApcuAvailableExists();
        $publicKey = apcu_fetch(config('passport.cache.public_key_prefix') . $secretId);

        if ($apcuAvailable && $publicKey) {
            return $publicKey;
        }

        try {
            $awsPassportSecretKey = "-----BEGIN PUBLIC KEY-----
MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAxNZ1Pe2mWg1DGMS9QsXH
wbaHsSbXqvYx3ndOJO1NoMFoZBffoL2JGmbHHrrKZg+c9gHTiHEHWfdlRePrj76t
4JKfFlRFVLxwM+oAHYH/pa8tBqQIsQO9WDC8LOL5Y1zt1YMUvhQPVkiXRu/4+4TI
3wDQrjRMc8Vwhom+MzWGu528CafXkGUdmjJt0igJr9PzrWudp8o3iJMLPsX4Z2rp
i9Jpd2jjMumzFLxKU6tg+BBCMwjP92lFiQc7hhvl1pB3CwOLjBDZWAAipIcDK9Ti
xhOOfpKuOkjTl1j3Geaf5iechOQh2iaS2M4j6XyjXS57EsieDYA17I0fU8kQdl0G
v9wp1MLQ5MscoJaheSBAVe9aefEIBfgFgCAB4FIE8JX5C7u0XhoZbfoqltFarS9G
AeYNJN0qF2gCAyxap4Y3KQy1TjdUAib96LN1pVNPEAdSzWpEPdovgpHuwgVsMK+t
M6ljvH81h5UlM6KxmWAIHlzSTl6OYo+qPD8AHndWeggXH8itBH9fEK0md0XFzifV
BOlT7+tsybAwQEXE9mQtH0S8ztX01U1p1d48cuVnThK1Tz1LOPVHTp2LJAkeB+V7
nz9TgO9RyFP6Ra/FAC9UoAd1Whdd0May/TSZZg9HmByP8IskWBGEArv/GMkebNs2
L7etms8jHzzc/XmToS5KhlsCAwEAAQ==
-----END PUBLIC KEY-----";
        } catch (Throwable) {
            throw new Exception('Unknown error');
        }

        if ($apcuAvailable) {
            apcu_store(
                config('passport.cache.public_key_prefix') . $secretId,
                $awsPassportSecretKey,
                config('passport.cache.expires_in')
            );
        }

        return $awsPassportSecretKey;
    }

    private function isApcuAvailableExists(): bool
    {
        return function_exists('apcu_enabled') && apcu_enabled();
    }
}
