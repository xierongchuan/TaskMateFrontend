<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ApiAuthenticate
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Check if user is authenticated via API
        if (!$request->session()->get('authenticated')) {
            return redirect()->guest(route('login'));
        }

        // Check if we have an API token
        if (!$request->session()->get('api_token')) {
            $request->session()->flush();
            return redirect()->guest(route('login'));
        }

        return $next($request);
    }
}
