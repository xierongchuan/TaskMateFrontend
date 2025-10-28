<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Validation\ValidationException;
use Illuminate\View\View;

class RegistrationController extends Controller
{
    public function create(): View
    {
        return view('auth.register');
    }

    public function store(Request $request): RedirectResponse|\Illuminate\Http\JsonResponse
    {
        $request->validate([
            'login' => ['required', 'string', 'max:255'],
            'password' => ['required', 'confirmed', 'min:12'],
        ]);

        try {
            // Call external API for registration
            $apiUrl = config('api.url');
            $response = Http::timeout(config('api.timeout'))
                ->post("{$apiUrl}/register", [
                    'login' => $request->input('login'),
                    'password' => $request->input('password'),
                ]);

            if (!$response->successful()) {
                $errors = $response->json('errors') ?? [];
                $message = $response->json('message') ?? 'Registration failed';

                if (empty($errors)) {
                    $errors = ['login' => [$message]];
                }

                if ($request->expectsJson()) {
                    return response()->json([
                        'message' => $message,
                        'errors' => $errors
                    ], $response->status());
                }

                throw ValidationException::withMessages($errors);
            }

            $data = $response->json();

            // Store authentication data in session
            $request->session()->regenerate();
            $request->session()->put('api_token', $data['token'] ?? null);
            $request->session()->put('user', $data['user'] ?? null);
            $request->session()->put('authenticated', true);

            if ($request->expectsJson()) {
                return response()->json([
                    'success' => true,
                    'message' => 'Registration successful',
                    'redirect' => route('dashboard', absolute: false)
                ]);
            }

            return redirect(route('dashboard', absolute: false));

        } catch (\Exception $e) {
            if ($e instanceof ValidationException) {
                throw $e;
            }

            if ($request->expectsJson()) {
                return response()->json([
                    'message' => 'Unable to connect to registration service. Please try again later.',
                    'errors' => ['login' => ['Unable to connect to registration service. Please try again later.']]
                ], 500);
            }

            throw ValidationException::withMessages([
                'login' => 'Unable to connect to registration service. Please try again later.',
            ]);
        }
    }
}
