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
            'pageDescription' => 'Enter your email and password below to log in',
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
            return back()->withErrors(['email' => 'User not found. Please register.']);
        }

        $exVisitor = ExVisitor::where('exhibition_id', currentExhibition()->id)
            ->where('user_id', $user->id)
            ->first();

        if (!$exVisitor || !$user->hasRole('visitor')) {
            return back()->withErrors(['email' => 'Access denied for this exhibition.']);
        }

        Auth::guard('visitor')->login($user, true);

        ExVisitorActivity::create([
            'ex_exhibitor_id' => null,
            'ex_visitor_id' => $exVisitor->id,
            'type' => 'login',
            'message' => 'Visitor logged in',
        ]);

        return redirect()->route('subDomain.frontend',[
            'exhibitionSlug' => currentExhibition()->subdomain
        ]);
    }
    public function register(Request $request){
        $fields = ExRegistrationFormField::where('exhibition_id', currentExhibition()->id)
            ->orderBy('order')
            ->get();

        return Inertia::render('subDomain/auth/register', [
            'exhibition' => currentExhibition(),
            'formFields' => $fields,
        ]);
    }
    public function doRegister(Request $request){
        $fields = ExRegistrationFormField::where('exhibition_id', currentExhibition()->id)->get();
        $validationRules = ['email' => 'required|email|unique:users,email'];

        foreach ($fields as $field) {
            if ($field->required) {
                $validationRules[$field->name] = 'required';
            }
        }

        $validated = $request->validate($validationRules);

        $user = User::create([
            'email' => $validated['email'],
            'name' => $request->name ?? $validated['email'],
            'password' => null,
        ]);

        $user->assignRole('visitor');

        $formData = $request->except('email');
        ExVisitor::create([
            'exhibition_id' => currentExhibition()->id,
            'user_id' => $user->id,
            'fields' => json_encode($formData),
            'status' => 'active',
        ]);

        Auth::guard('visitor')->login($user, true);

        ExVisitorActivity::create([
            'ex_exhibitor_id' => null,
            'ex_visitor_id' => $user->id,
            'type' => 'login',
            'message' => 'Visitor registered and logged in',
        ]);

        return redirect()->route('subDomain.frontend');
    }
}
