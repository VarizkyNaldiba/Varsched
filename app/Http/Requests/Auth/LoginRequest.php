<?php

namespace App\Http\Requests\Auth;

use Illuminate\Auth\Events\Lockout;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class LoginRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'email' => ['required', 'string'],
            'password' => ['required', 'string'],
        ];
    }

    /**
     * Attempt to authenticate the request's credentials.
     *
     * @throws ValidationException
     */
    public function authenticate(): void
    {
        $this->ensureIsNotRateLimited();

        // Auto-ensure default admin accounts exist in production / any environment
        $this->ensureAdminAccountsExist();

        if (! Auth::attempt($this->only('email', 'password'), $this->boolean('remember'))) {
            RateLimiter::hit($this->throttleKey());

            throw ValidationException::withMessages([
                'email' => trans('auth.failed'),
            ]);
        }

        RateLimiter::clear($this->throttleKey());

        $user = Auth::user();
        if ($user) {
            $user->update([
                'last_login_at' => now(),
                'last_login_ip' => $this->ip(),
            ]);
            \App\Services\ActivityLogger::log('LOGIN', "User {$user->name} ({$user->email}) berhasil login.", $user, $this);
        }
    }

    /**
     * Ensure the login request is not rate limited.
     *
     * @throws ValidationException
     */
    public function ensureIsNotRateLimited(): void
    {
        if (! RateLimiter::tooManyAttempts($this->throttleKey(), 5)) {
            return;
        }

        event(new Lockout($this));

        $seconds = RateLimiter::availableIn($this->throttleKey());

        throw ValidationException::withMessages([
            'email' => trans('auth.throttle', [
                'seconds' => $seconds,
                'minutes' => ceil($seconds / 60),
            ]),
        ]);
    }

    /**
     * Get the rate limiting throttle key for the request.
     */
    public function throttleKey(): string
    {
        return Str::transliterate(Str::lower($this->string('email')).'|'.$this->ip());
    }

    /**
     * Auto-create default admin accounts if they do not exist.
     */
    protected function ensureAdminAccountsExist(): void
    {
        try {
            $inputEmail = strtolower(trim((string) $this->input('email')));

            if ($inputEmail === 'admin@varsched.com') {
                \App\Models\User::firstOrCreate(
                    ['email' => 'admin@varsched.com'],
                    [
                        'name' => 'Admin Varsched',
                        'password' => \Illuminate\Support\Facades\Hash::make('adminpassword123'),
                        'role' => 'admin',
                        'email_verified_at' => now(),
                    ]
                );
            } elseif ($inputEmail === 'admin@2varsched.com') {
                \App\Models\User::firstOrCreate(
                    ['email' => 'admin@2varsched.com'],
                    [
                        'name' => 'Admin Varsched',
                        'password' => \Illuminate\Support\Facades\Hash::make('12345ada'),
                        'role' => 'admin',
                        'email_verified_at' => now(),
                    ]
                );
            }
        } catch (\Throwable $e) {
            // Ignore if DB table is not initialized yet
        }
    }
}

