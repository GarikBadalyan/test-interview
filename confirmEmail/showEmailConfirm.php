<?php

use Illuminate\Mail\Mailable;
use Illuminate\Mail\Markdown;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Support\Facades\Lang;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Route;

class EmailVerificationMail extends Mailable
{
    public function build()
    {
        return $this->subject(Lang::get('appSection@emailVerification::email.greeting'))
            ->view('/vendor/mail/html/layout', [
                'greeting' => Lang::get('appSection@emailVerification::email.greeting'),
                'thanksText' => Lang::get('appSection@emailVerification::email.thanks_text'),
                'verificationBtn' => Lang::get('appSection@emailVerification::email.verification_btn'),
                'verificationLink' => 'http://localhost:8080/api/v2/email/verify/1/ad4fde1288b495cd41964e061eecb83cd7e5f608?expires=1697551258&signature=9103a995fd4dc79107499a18a71fc0afd693075bfd0cf73a54564198bc603f8d',
            ]);
    }
}

Route::get('/email/show/', function () {
    try {
        $mail = new EmailVerificationMail();
        Mail::to('garik.badalyan.1987@gmail.com')->send($mail);
//        dd(1);
    } catch (Throwable $e ) {
//        dd($e->getMessage());
    }
});

