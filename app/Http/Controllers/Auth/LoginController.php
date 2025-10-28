<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Auth\Events\Lockout;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Illuminate\View\View;

class LoginController extends Controller
{
    public function create(): View
    {
        return view('auth.login');
    }

    public function store(Request $request): RedirectResponse|\Illuminate\Http\JsonResponse
    {
        // Frontend has already called the API and is just storing token/user in session
        $request->validate([
            'token' => ['required', 'string'],
            'user' => ['required', 'array'],
        ]);

        try {
            // Store authentication data in session
            $request->session()->regenerate();
            $request->session()->put('api_token', $request->input('token'));
            $request->session()->put('user', $request->input('user'));
            $request->session()->put('authenticated', true);

            if ($request->expectsJson()) {
                return response()->json([
                    'success' => true,
                    'message' => 'Session created successfully',
                    'redirect' => route('dashboard', absolute: false)
                ]);
            }

            return redirect()->intended(route('dashboard', absolute: false));

        } catch (\Exception $e) {
            if ($request->expectsJson()) {
                return response()->json([
                    'message' => 'Session creation failed',
                    'errors' => ['token' => ['Session creation failed']]
                ], 500);
            }

            throw ValidationException::withMessages([
                'token' => 'Session creation failed',
            ]);
        }
    }

    public function destroy(Request $request): RedirectResponse
    {
        try {
            // Call API logout if we have a token
            $token = $request->session()->get('api_token');
            if ($token) {
                $apiUrl = config('api.url');
                Http::timeout(config('api.timeout'))
                    ->withToken($token)
                    ->delete("{$apiUrl}/session");
            }
        } catch (\Exception $e) {
            // Log error but continue with local logout
            \Log::warning('API logout failed: ' . $e->getMessage());
        }

        // Clear session
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }

    protected function ensureIsNotRateLimited(Request $request): void
    {
        if (! RateLimiter::tooManyAttempts($this->throttleKey($request), 5)) {
            return;
        }

        event(new Lockout($request));

        $seconds = RateLimiter::availableIn($this->throttleKey($request));

        throw ValidationException::withMessages([
            'email' => trans('auth.throttle', [
                'seconds' => $seconds,
                'minutes' => ceil($seconds / 60),
            ]),
        ]);
    }

    public function throttleKey(Request $request): string
    {
        return Str::transliterate(Str::lower($request->string('email')).'|'.$request->ip());
    }
}
