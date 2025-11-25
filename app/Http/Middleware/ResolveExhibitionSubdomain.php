<?php

namespace App\Http\Middleware;

use App\Models\Exhibition;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ResolveExhibitionSubdomain
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $slug = $request->route('exhibitionSlug');
        $exhibition = Exhibition::with('globalSetting')
            ->where('slug', $slug)
            ->firstOrFail();
        app()->instance('currentExhibition', $exhibition);
        config(['app.url' => "https://{$slug}." . config('app.domain')]);
        $request->attributes->add(['exhibition' => $exhibition]);
        return $next($request);
    }
}
