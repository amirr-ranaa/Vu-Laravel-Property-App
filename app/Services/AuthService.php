<?php

namespace App\Services;

use App\Enums\ApiResponseEnum;
use App\Models\User;
use App\Notifications\VerifyEmail;
use App\Services\BaseService\BaseService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Validator;

class AuthService extends BaseService
{
    /**
     * @param Request $request
     *
     *  Method for sending Verification token to user email
     *
     * @return Array
     */
    public function resetPasswordByEmail(Request $request)
    {
        $data = $request->all();
        if ($data['email']['resendEmail']) {
            $codeData = $this->customDecode($data['email']['encodedToken']['_value']);
            $codeDataArray = explode('|', $codeData);
            $email = $codeDataArray[1] ?? null;
        } else {
            $rules = array('email' => 'required|exists:users,email');
            $v = Validator::make($data, $rules);
//            dd($v->fails());
            if ($v->fails()) {
                $this->setApiErrorMessage($v->errors()->first());
                return;
            }
            $email = $data['email']['userEmail'] ?? '';
        }
        $user = User::where('email', $email)->first();
        if ($user) {
            $userId = !is_null($user->id) ? $user->id : 0;
            if ($userId != '') {
                $verification = $this->updateOrCreateVerificationToken(['user_id' => $userId, 'type' => 'reset_password', 'type_value' => $email]);
                $verificationCode = $verification->code ?? null;
                if ($verificationCode) {
                    $verificationCode = $verification->type . '|' . $user->email . '|' . $verification->id;
                    $encodedToken = $this->customEncode($verificationCode);
                    Notification::send($user, new VerifyEmail(['token' => $verificationCode]));
                    $this->setApiSuccessMessage(trans('auth.email_sent'), ['token' => $encodedToken]);
                } else {
                    $this->setApiErrorMessage(trans('auth.verify_email_not_sent'));
                }
            } else {
                $this->setApiErrorMessage(trans('auth.verify_email_not_sent'));
            }
        } else {
            $this->setApiErrorMessage(trans('auth.email_not_found'));
        }
//        }
    }

    /**
     * @param Request $request
     *
     *  Method for Verify Email Token
     *
     * @return array
     */
    public function resetPassword(Request $request)
    {
        $data = $request->all();
        $rules = array('verificationCode' => 'required', 'encodedToken' => 'required');
        $validator = Validator::make($data, $rules);
        if ($validator->fails()) {
            $this->setApiErrorMessage($validator->errors()->first());
        } else {
            $codeData = $this->customDecode($request->encodedToken);
            $codeDataArray = explode('|', $codeData);
            $type = $codeDataArray[0] ?? null;
            $userEmail = $codeDataArray[1] ?? null;

            $user = User::where('email', $userEmail)->first();
            if ($user != null) {
                $userId = $user->id ?? 0;
                $response = $this->verifyVerificationToken(['user_id' => $userId, 'type' => $type, 'code' => $request->verificationCode]);
                if (isset($response->status) && trim($response->status) == ApiResponseEnum::SUCCESS_RESPONSE) {
                    if ($request->password === $request->password_confirmation) {
                        $user->password = Hash::make($request->password);
                        $user->save();
                        $this->setApiSuccessMessage(trans('auth.password_updated'));
                    } else {
                        $this->setApiErrorMessage(trans('auth.password_not_match'));
                    }

                } else {
                    $this->setApiErrorMessage(trans('auth.password_not_updated'));
                }
            } else {
                $this->setApiErrorMessage(trans('auth.user_not_found'));
            }
        }
    }

}