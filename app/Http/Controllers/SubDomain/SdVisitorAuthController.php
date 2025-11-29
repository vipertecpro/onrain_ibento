<?php

namespace App\Http\Controllers\SubDomain;

use App\Http\Controllers\Controller;
use App\Http\Requests\SaLoginRequest;
use App\Models\ExRegistrationFormField;
use App\Models\ExVisitor;
use App\Models\ExVisitorActivity;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class SdVisitorAuthController extends Controller
{
    public function loginPage(Request $request){
        $pageData = [
            'pageTitle' => 'Login',
            'pageDescription' => '',
            'status' => $request->session()->get('status'),
            'exhibition' => currentExhibition(),
        ];
        return Inertia::render('subDomain/auth/login',$pageData);
    }
    public function doLogin(SaLoginRequest $request)
    {
        $request->validate(['email' => 'required|email']);
        $user = User::where('email', $request->email)->first();
        if (!$user) {
            return back()->withErrors(['email' => 'You are not registered yet. Please register as visitor.']);
        }
        $exVisitor = ExVisitor::where('exhibition_id', currentExhibition()->id)->where('user_id', $user->id)->first();
        if (!$exVisitor || !$user->hasRole('visitor')) {
            return back()->withErrors(['email' => 'Access denied for this exhibition.']);
        }
        Auth::guard('visitor')->login($user, true);
        ExVisitorActivity::create([
            'ex_visitor_id' => $exVisitor->id,
            'type' => 'login',
            'message' => 'Visitor logged in',
        ]);
        return redirect()->route('subDomain.frontend',[
            'exhibitionSlug' => currentExhibition()->subdomain
        ]);
    }
    public function register(Request $request){
        $form = ExRegistrationFormField::where('exhibition_id', currentExhibition()->id)->first();

        return Inertia::render('subDomain/auth/register', [
            'pageTitle' => 'Register',
            'pageDescription' => '',
            'exhibition' => currentExhibition(),
            'builderSchema' => $form?->builder_schema ?? [],
        ]);
    }
    public function doRegister(Request $request)
    {
        $exhibition = currentExhibition();
        $schema = ExRegistrationFormField::where('exhibition_id', $exhibition->id)->first()?->builder_schema ?? [];
        $validationRules = [
            'email' => 'required|email',
        ];
        foreach ($schema as $item) {
            if ($item['type'] === 'input' && ($item['required'] ?? false)) {
                $validationRules[$item['id']] = 'required';
            }
            if ($item['type'] === 'select' && ($item['required'] ?? false)) {
                $validationRules[$item['id']] = 'required';
            }
            if ($item['type'] === 'inputGroup') {
                foreach ($item['inputs'] as $input) {
                    if ($input['required'] ?? false) {
                        $validationRules[$input['id']] = 'required';
                    }
                }
            }
        }
        $request->validate($validationRules);
        $existingVisitor = ExVisitor::where('exhibition_id', $exhibition->id)
            ->whereHas('user', function ($q) use ($request) {
                $q->where('email', $request->email);
            })
            ->first();
        if ($existingVisitor) {
            return back()->withErrors([
                'email' => 'You are already registered for this exhibition.',
            ]);
        }
        $user = User::create([
                'email' => $request->email,
                'name' => $request->name ?? $request->email,
                'password' => null,
            ]);
        $user->assignRole('visitor');
        $formData = $request->except('email');
        $exhibitionVisitor = ExVisitor::create([
            'exhibition_id' => $exhibition->id,
            'user_id' => $user->id,
            'fields' => $formData,
            'status' => 'active',
        ]);
        Auth::guard('visitor')->login($user, true);
        ExVisitorActivity::create([
            'ex_visitor_id' => $exhibitionVisitor->id,
            'type' => 'login',
            'message' => 'Visitor registered and logged in',
        ]);
        return redirect()->route('subDomain.frontend', [
            'exhibitionSlug' => $exhibition->subdomain
        ]);
    }
}
