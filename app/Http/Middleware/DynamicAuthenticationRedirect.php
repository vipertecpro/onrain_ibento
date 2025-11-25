<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Auth\Middleware\Authenticate as BaseAuthenticate;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DynamicAuthenticationRedirect extends BaseAuthenticate
{
    /**
     * Handle an incoming request.
     *
     * @param  Request  $request
     * @return RedirectResponse|mixed
     */
    protected function redirectTo(Request $request)
    {
        $route = $request->route();
        $name = optional($route)->getName();

        // SUPER ADMIN AREA
        if ($name && str_starts_with($name, 'bankai.')) {
            return route('bankai.login');
        }

        // EXHIBITION DASHBOARD AREA
        if ($name && str_starts_with($name, 'dashboard.')) {
            return url('/login');
        }

        // EXHIBITION FRONTEND
        if ($name && $name === 'exhibition.frontend') {
            return url('/login');
        }

        return '/login';
    }
}
