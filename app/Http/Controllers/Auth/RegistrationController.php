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

            return redirect(route('dashboard', absolute: false));

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
}
