<?php

namespace App\Http\Middleware;

use App\Models\ExVisitorActivity;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class CaptureExhibitionVisitor
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (Auth::check()) {
            $exhibition = $request->attributes->get('exhibition');
            ExVisitorActivity::updateOrCreate(
                [
                    'exhibition_id' => $exhibition->id,
                    'user_id'       => Auth::id(),
                ],
                [
                    'ip_address'    => $request->ip(),
                    'user_agent'    => $request->userAgent(),
                    'visited_at'    => now(),
                ]
            );
        }
        return $next($request);
    }
}
