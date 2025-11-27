<?php

namespace App\Http\Controllers\SubDomain\Dashboard;

use App\Http\Controllers\Controller;
use App\Http\Requests\SaLoginRequest;
use App\Http\Requests\SubDomain\SdLoginRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class SdAuthenticatedSessionController extends Controller
{
    public function login(Request $request){
        $pageData = [
            'pageTitle' => currentExhibition()->subdomain.' | Login',
            'pageDescription' => 'Enter your email and password below to log in',
            'status' => $request->session()->get('status'),
            'exhibition' => currentExhibition(),
        ];
        return Inertia::render('subDomain/dashboard/auth/login',$pageData);
    }
    public function doLogin(SdLoginRequest $request)
    {
        $request->authenticate();
        $request->session()->regenerate();
        $user = Auth::guard('exhibition')->user();
        if (! $user->hasAnyRole(['admin', 'developer', 'exhibitor'])) {
            Auth::guard('exhibition')->logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();
            return back()->withErrors(['email' => 'Access denied.']);
        }
        Auth::guard('visitor')->login($user);
        return redirect()->route('subDomain.dashboardPanel.dashboard',[
            'exhibitionSlug' => currentExhibition()->subdomain
        ])->with('success', 'Logged in successfully.');
    }
}
