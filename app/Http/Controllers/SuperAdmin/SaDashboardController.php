<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class SaDashboardController extends Controller
{
    public function index(){
        $pageData = [
            'pageTitle' => 'Dashboard',
            'pageDescription' => 'Welcome to super admin panel dashboard',
        ];
        return Inertia::render('superAdmin/dashboard/index',$pageData);
    }
    public function logout(Request $request)
    {
        Auth::guard('superadmin')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect()->route('bankai.login');
    }
}
