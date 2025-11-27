<?php

namespace App\Http\Controllers\SubDomain\Dashboard;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class SdDashboardController extends Controller
{
    public function index(){
        $pageData = [
            'pageTitle' => currentExhibition()->subdomain.' |  Dashboard',
            'pageDescription' => 'Welcome to super admin panel dashboard',
        ];
        return Inertia::render('subDomain/dashboard/index',$pageData);
    }
    public function logout(Request $request)
    {
        Auth::guard('exhibition')->logout();
        Auth::guard('visitor')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect()->route('subDomain.dashboardPanel.login',[
            'exhibitionSlug' => currentExhibition()->subdomain
        ]);
    }
}
