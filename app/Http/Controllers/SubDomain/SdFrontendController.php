<?php

namespace App\Http\Controllers\SubDomain;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SdFrontendController extends Controller
{
    public function index(Request $request){
       return redirect()->route('subDomain.lobby-page',[
           'exhibitionSlug' => currentExhibition()->subdomain,
       ]);
    }
    public function lobbyPage(){
        $pageData = [
            'pageTitle' => 'Home Page',
            'pageDescription' => 'Enter your email below to log in',
            'exhibition' => currentExhibition(),
        ];
        return Inertia::render('subDomain/lobbyPage',$pageData);
    }
}
