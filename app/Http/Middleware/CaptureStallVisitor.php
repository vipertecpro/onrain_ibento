<?php

namespace App\Http\Middleware;

use App\Models\Stall;
use App\Models\StallVisitor;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class CaptureStallVisitor
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Only capture if route has {stall} or stall_id in request
        $stall = null;

        if ($request->route('stall')) {
            $stall = $request->route('stall');
        } elseif ($request->stall_id) {
            $stall = Stall::find($request->stall_id);
        }

        if ($stall) {
            StallVisitor::create([
                'stall_id'      => $stall->id,
                'user_id'       => Auth::id(),
                'ip_address'    => $request->ip(),
                'user_agent'    => $request->userAgent(),
                'visited_at'    => now(),
            ]);
        }

        return $next($request);
    }
}
