<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Http\Requests\SaLoginRequest;
use Illuminate\Http\Request;
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
        return redirect()->intended(route('bankai.dashboard', absolute: false));
    }
}
