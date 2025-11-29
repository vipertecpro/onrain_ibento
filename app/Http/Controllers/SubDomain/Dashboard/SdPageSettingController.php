<?php

namespace App\Http\Controllers\SubDomain\Dashboard;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class SdPageSettingController extends Controller
{
    public function list(){
        $pageData = [
            'pageTitle' => currentExhibition()->subdomain.' |  Page Settings',
            'pageDescription' => 'Welcome to page settings',
        ];
        return Inertia::render('subDomain/dashboard/pageSettings/index',$pageData);
    }
}
