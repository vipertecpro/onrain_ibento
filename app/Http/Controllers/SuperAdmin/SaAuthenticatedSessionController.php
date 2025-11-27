<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Http\Requests\SaLoginRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class SaAuthenticatedSessionController extends Controller
{
    public function login(Request $request){
        $pageData = [
            'pageTitle' => 'Login',
            'pageDescription' => 'Enter your email and password below to log in',
            'status' => $request->session()->get('status'),
        ];
        return Inertia::render('superAdmin/auth/login',$pageData);
    }
    public function doLogin(SaLoginRequest $request)
    {
        $request->authenticate();
        $request->session()->regenerate();
        $user = Auth::guard('superadmin')->user();
        if (! $user->hasRole(['admin', 'developer'])) {
            Auth::guard('superadmin')->logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();
            return back()->withErrors(['email' => 'Unauthorized access.']);
        }
        return redirect()->intended(route('bankai.dashboard', absolute: false));
    }
}
