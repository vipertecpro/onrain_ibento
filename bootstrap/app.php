<?php

use App\Http\Middleware\CaptureExhibitionVisitor;
use App\Http\Middleware\CaptureStallVisitor;
use App\Http\Middleware\HandleInertiaRequests;
use App\Http\Middleware\ResolveExhibitionSubdomain;
use App\Http\Middleware\DynamicAuthenticationRedirect;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Spatie\Permission\Middleware\PermissionMiddleware;
use Spatie\Permission\Middleware\RoleMiddleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )

    ->withMiddleware(function (Middleware $middleware) {
        $middleware->alias([
            'auth'                  => DynamicAuthenticationRedirect::class,
            'resolveSubDomain'      => ResolveExhibitionSubdomain::class,
            'capture.exhibition'    => CaptureExhibitionVisitor::class,
            'capture.stall'         => CaptureStallVisitor::class,
            'role'                  => RoleMiddleware::class,
            'permission'            => PermissionMiddleware::class,
        ]);

        $middleware->web(append: [
            HandleInertiaRequests::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })

    ->create();
