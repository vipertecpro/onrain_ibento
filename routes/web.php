<?php

use App\Http\Controllers\LandingController;
use App\Http\Controllers\FrontendController;
use App\Http\Controllers\Dashboard\DashboardController;
use App\Http\Controllers\Dashboard\ExhibitorController;
use App\Http\Controllers\Dashboard\GlobalSettingController;
use App\Http\Controllers\Dashboard\HallController;
use App\Http\Controllers\Dashboard\StallCategoryController;
use App\Http\Controllers\Dashboard\StallController;
use App\Http\Controllers\Dashboard\VisitorController;
use App\Http\Controllers\SuperAdmin\SaAuthenticatedSessionController;
use App\Http\Controllers\SuperAdmin\SaDashboardController;
use App\Http\Controllers\SuperAdmin\SaExhibitionController;
use App\Http\Controllers\SuperAdmin\SaPermissionController;
use App\Http\Controllers\SuperAdmin\SaRoleController;
use Illuminate\Support\Facades\Route;


Route::domain('onrain_ibento.test')->group(function () {
    Route::get('/', [LandingController::class, 'index'])->name('landing');
    Route::prefix('super-admin')
    ->as('bankai.')
    ->group(function () {
        Route::middleware('guest')->group(function () {
            Route::get('/login', [SaAuthenticatedSessionController::class, 'login'])->name('login');
            Route::post('/doLogin', [SaAuthenticatedSessionController::class, 'doLogin'])->name('doLogin');
        });
        Route::middleware(['auth', 'role:admin|developer'])->group(function(){
            Route::get('/', [SaDashboardController::class,'index'])->name('dashboard');
            Route::post('/logout', [SaDashboardController::class, 'logout'])->name('logout');
            Route::controller(SaRoleController::class)->group(function () {
                Route::get('roles', 'list')->name('roles.list');
                Route::get('roles/create', 'create')->name('roles.create');
                Route::post('roles', 'store')->name('roles.store');
                Route::get('roles/edit/{role}', 'edit')->name('roles.edit');
                Route::put('roles/{role}', 'update')->name('roles.update');
                Route::delete('roles/{role}', 'remove')->name('roles.remove');
                Route::delete('roles/removeAll', 'removeAll')->name('roles.removeAll');
            });
            Route::controller(SaPermissionController::class)->group(function () {
                Route::get('permissions', 'list')->name('permissions.list');
                Route::get('permissions/create', 'create')->name('permissions.create');
                Route::post('permissions', 'store')->name('permissions.store');
            });
            Route::controller(SaExhibitionController::class)->group(function () {
                Route::get('exhibitions', 'list')->name('exhibitions.list');
                Route::get('exhibitions/create', 'create')->name('exhibitions.create');
                Route::post('exhibitions', 'store')->name('exhibitions.store');
                Route::get('exhibitions/edit/{exhibition}', 'edit')->name('exhibitions.edit');
                Route::put('exhibitions/{exhibition}', 'update')->name('exhibitions.update');
                Route::delete('exhibitions/{exhibition}', 'remove')->name('exhibitions.remove');
                Route::delete('exhibitions/removeAll', 'removeAll')->name('exhibitions.removeAll');
            });
        });
    });
});

/*
|--------------------------------------------------------------------------
| SUBDOMAIN: {slug}.onrain_ibento.test → Exhibition Dashboard + Frontend
|--------------------------------------------------------------------------
*/
Route::domain('{exhibitionSlug}.onrain_ibento.test')
    ->middleware([
        'web',
        'exhibition.subdomain',
        'auth',
        'role:admin|developer|exhibitor|visitor',
        'capture.exhibition',
    ])
    ->group(function () {

        Route::middleware('role:admin|developer|exhibitor')
            ->prefix('dashboard')
            ->as('dashboard.')
            ->group(function () {
                Route::get('/', [DashboardController::class, 'index'])->name('index');

                // Halls
                Route::controller(HallController::class)->group(function () {
                    Route::get('halls', 'list')->name('halls.list');
                    Route::get('halls/create', 'create')->name('halls.create');
                    Route::post('halls', 'store')->name('halls.store');
                    Route::get('halls/edit/{hall}', 'edit')->name('halls.edit');
                    Route::put('halls/{hall}', 'update')->name('halls.update');
                    Route::delete('halls/{hall}', 'remove')->name('halls.remove');
                    Route::delete('halls/removeAll', 'removeAll')->name('halls.removeAll');
                });

                // Stall Categories
                Route::controller(StallCategoryController::class)->group(function () {
                    Route::get('stall-categories', 'list')->name('stall-categories.list');
                    Route::get('stall-categories/create', 'create')->name('stall-categories.create');
                    Route::post('stall-categories', 'store')->name('stall-categories.store');
                    Route::get('stall-categories/edit/{stallCategory}', 'edit')->name('stall-categories.edit');
                    Route::put('stall-categories/{stallCategory}', 'update')->name('stall-categories.update');
                    Route::delete('stall-categories/{stallCategory}', 'remove')->name('stall-categories.remove');
                });

                // Stalls
                Route::controller(StallController::class)->group(function () {
                    Route::get('stalls', 'list')->name('stalls.list');
                    Route::get('stalls/create', 'create')->name('stalls.create');
                    Route::post('stalls', 'store')->name('stalls.store');
                    Route::get('stalls/edit/{stall}', 'edit')->name('stalls.edit');
                    Route::put('stalls/{stall}', 'update')->name('stalls.update');
                    Route::delete('stalls/{stall}', 'remove')->name('stalls.remove');
                    Route::delete('stalls/removeAll', 'removeAll')->name('stalls.removeAll');
                });

                // Visitors
                Route::controller(VisitorController::class)->group(function () {
                    Route::get('visitors', 'list')->name('visitors.list');
                    Route::get('visitors/create', 'create')->name('visitors.create');
                    Route::post('visitors', 'store')->name('visitors.store');
                    Route::get('visitors/edit/{visitor}', 'edit')->name('visitors.edit');
                    Route::put('visitors/{visitor}', 'update')->name('visitors.update');
                    Route::delete('visitors/{visitor}', 'remove')->name('visitors.remove');
                });

                // Exhibitors
                Route::controller(ExhibitorController::class)->group(function () {
                    Route::get('exhibitors', 'list')->name('exhibitors.list');
                    Route::get('exhibitors/create', 'create')->name('exhibitors.create');
                    Route::post('exhibitors', 'store')->name('exhibitors.store');
                    Route::get('exhibitors/edit/{exhibitor}', 'edit')->name('exhibitors.edit');
                    Route::put('exhibitors/{exhibitor}', 'update')->name('exhibitors.update');
                    Route::delete('exhibitors/{exhibitor}', 'remove')->name('exhibitors.remove');
                });

                // Global Settings
                Route::controller(GlobalSettingController::class)->group(function () {
                    Route::get('global-settings', 'edit')->name('global-settings.edit');
                    Route::put('global-settings', 'update')->name('global-settings.update');
                });
            });

        // Frontend SPA (all other URLs)
        Route::get('/{any?}', [FrontendController::class, 'index'])
            ->where('any', '.*')
            ->name('exhibition.frontend');
    });

/*
|--------------------------------------------------------------------------
| Fallback: Any unknown subdomain → redirect to main landing
| (Laravel 12 safe way – no ->where() on domain)
|--------------------------------------------------------------------------
*/
Route::any('{any}', function () {
    return redirect()->route('landing');
})->where('any', '.*');
