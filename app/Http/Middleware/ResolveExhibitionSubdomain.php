<?php

namespace App\Http\Middleware;

use App\Models\Exhibition;
use Closure;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

class ResolveExhibitionSubdomain
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response | RedirectResponse | \Inertia\Response
    {
        $host = $request->getHost();
        $baseDomain = config('app.url');
        $baseDomain = parse_url($baseDomain, PHP_URL_HOST) ?? config('app.domain');
        if (!str_ends_with($host, $baseDomain)) {
            return $next($request);
        }

        $subdomain = str_replace('.'.$baseDomain, '', $host);

        // Ignore main domain, www, api, etc.
        if (empty($subdomain) || in_array($subdomain, ['www', 'admin', 'api'])) {
            return $next($request);
        }
        $exhibition = Exhibition::where('subdomain', $subdomain)->first();
        if($exhibition === null){
            abort(404);
        }
        if($exhibition->status !== 'active'){
            return Inertia::render('exhibitionNotActive');
        }
        app()->instance('currentExhibition', $exhibition);
        $request->attributes->add(['currentExhibition' => $exhibition]);

        return $next($request);
    }
}
