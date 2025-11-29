<?php

use App\Models\ExGlobalSetting;

if (!function_exists('currentExhibition')) {
    /**
     * Get the current exhibition based on subdomain
     * Works everywhere: controllers, views, middleware, Blade, Inertia
     */
    function currentExhibition()
    {
        return app()->bound('currentExhibition')
            ? app('currentExhibition')
            : null;
    }
}
