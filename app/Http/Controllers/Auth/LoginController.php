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
        $request->validate([
            'email' => ['required', 'string'],
            'password' => ['required', 'string'],
        ]);

        $this->ensureIsNotRateLimited($request);

        try {
            // Call external API for authentication
            $apiUrl = config('api.url');
            $response = Http::timeout(config('api.timeout'))
                ->post("{$apiUrl}/session", [
                    'login' => $request->input('email'),
                    'password' => $request->input('password'),
                ]);

            if (!$response->successful()) {
                RateLimiter::hit($this->throttleKey($request));

                $errorMessage = $response->json('message') ?? trans('auth.failed');

                if ($request->expectsJson()) {
                    return response()->json([
                        'message' => $errorMessage,
                        'errors' => ['email' => [$errorMessage]]
                    ], $response->status());
                }

                throw ValidationException::withMessages([
                    'email' => $errorMessage,
                ]);
            }

            $data = $response->json();

            // Store authentication data in session
            $request->session()->regenerate();
            $request->session()->put('api_token', $data['token'] ?? null);
            $request->session()->put('user', $data['user'] ?? null);
            $request->session()->put('authenticated', true);

            RateLimiter::clear($this->throttleKey($request));

            if ($request->expectsJson()) {
                return response()->json([
                    'success' => true,
                    'message' => 'Login successful',
                    'redirect' => route('dashboard', absolute: false)
                ]);
            }

            return redirect()->intended(route('dashboard', absolute: false));

        } catch (\Exception $e) {
            if ($e instanceof ValidationException) {
                throw $e;
            }

            RateLimiter::hit($this->throttleKey($request));

            if ($request->expectsJson()) {
                return response()->json([
                    'message' => 'Unable to connect to authentication service. Please try again later.',
                    'errors' => ['email' => ['Unable to connect to authentication service. Please try again later.']]
                ], 500);
            }

            throw ValidationException::withMessages([
                'email' => 'Unable to connect to authentication service. Please try again later.',
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
