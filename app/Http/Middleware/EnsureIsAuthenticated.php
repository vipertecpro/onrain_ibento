<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;

class EnsureIsAuthenticated
{
    public function handle($request, Closure $next)
    {
        if (Auth::guard('visitor')->check() || Auth::guard('exhibition')->check()) {
            // Optionally set the correct guard
            if (Auth::guard('exhibition')->check()) {
                Auth::shouldUse('exhibition');
            }
            return $next($request);
        }

        return redirect()->route('subDomain.login-page',[
            'exhibitionSlug' => currentExhibition()->subdomain
        ]);
    }
}
