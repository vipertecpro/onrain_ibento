<?php

namespace App\Http\Middleware;

use Illuminate\Auth\AuthenticationException;
use Illuminate\Auth\Middleware\Authenticate as BaseAuthenticate;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class DynamicAuthenticationRedirect extends BaseAuthenticate
{
    /**
     * Handle an incoming request.
     * @throws AuthenticationException
     */
    public function handle($request, $next, ...$guards)
    {
        $this->authenticate($request, $guards);

        return $next($request);
    }

    /**
     * Override authenticate to properly check multiple guards
     * @throws AuthenticationException
     */
    protected function authenticate($request, array $guards): void
    {
        if (empty($guards)) {
            $guards = [null];
        }

        foreach ($guards as $guard) {
            if ($this->auth->guard($guard)->check()) {
                $this->auth->shouldUse($guard);
                return;
            }
        }

        $this->unauthenticated($request, $guards);
    }

    /**
     * Redirect unauthenticated users to the correct login page
     */
    protected function redirectTo(Request $request): ?string
    {
        if ($request->expectsJson()) return null;

        $host = $request->getHost();
        $main = config('app.domain'); // onrain_ibento.test

        // MAIN DOMAIN — Super Admin
        if ($host === $main || $host === "www.$main") {
            return route('bankai.login');
        }

        // SUBDOMAIN — Exhibition
        if (str_ends_with($host, ".$main")) {

            $slug = Str::before($host, ".".$main);
            $path = $request->path();

            // DASHBOARD PANEL
            if (str_starts_with($path, 'dashboardPanel')) {
                return route('subDomain.dashboardPanel.login', [
                    'exhibitionSlug' => $slug
                ]);
            }

            // VISITOR LOGIN
            return route('subDomain.login-page', [
                'exhibitionSlug' => $slug
            ]);
        }

        return route('landing');
    }

}
