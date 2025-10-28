<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->alias([
            'api.auth' => \App\Http\Middleware\ApiAuthenticate::class,
            'api.guest' => \App\Http\Middleware\ApiGuest::class,
        ]);

        // Exclude auth routes from CSRF verification since they communicate directly with external API
        $middleware->validateCsrfTokens(except: [
            '/login',
            '/register',
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
