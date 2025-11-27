<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\Exhibition;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Inertia\Inertia;

class SaExhibitionController extends Controller
{
    public function list(Request $request){
        $users = Exhibition::select(['id', 'name', 'subdomain', 'status', 'created_at'])
            ->when($request->search, fn($q, $s) =>
                $q->where('name', 'like', "%$s%")
                ->orWhere('subdomain', 'like', "%$s%")
                ->orWhere('status', 'like', "%$s%"))
            ->when($request->status, fn($q, $d) => $q->where('status', '=', $d))
            ->when($request->from_date, fn($q, $d) => $q->whereDate('created_at', '>=', $d))
            ->when($request->to_date, fn($q, $d) => $q->whereDate('created_at', '<=', $d))
            ->orderBy($request->sort ?? 'created_at', $request->order ?? 'desc')
            ->paginate(20);
        $users->appends($request->all());
        return Inertia::render('superAdmin/dashboard/exhibitions/list', [
            'tableData' => $users,
            'tableFilters' => $request->only(['search', 'from_date', 'to_date', 'status']),
        ]);
    }
    public function create(){
        return Inertia::render('superAdmin/dashboard/exhibitions/form',[
            'mode' => 'create',
        ]);
    }
    public function store(Request $request){
        $validated = $request->validate([
            'name' => ['required', 'string'],
            'subdomain' => ['required', 'unique:exhibitions,subdomain'],
            'status' => 'required|in:active,inactive'
        ]);

        Exhibition::create([
            'name' => $validated['name'],
            'subdomain' => $validated['subdomain'],
            'status' => $validated['status'],
        ]);
        if (app()->environment('local')  && PHP_OS_FAMILY === 'Windows') {
            Artisan::call('herd:subdomain', [
                'subdomain' => $validated['subdomain']
            ]);
        }
        return redirect()->route('bankai.exhibitions.list')->with('success', 'Exhibition has been created successfully');
    }
    public function edit(Exhibition $exhibition){
        return Inertia::render('superAdmin/dashboard/exhibitions/form', [
            'formData' => $exhibition,
            'mode' => 'edit',
        ]);
    }
    public function update(Request $request, Exhibition $exhibition){
        $validated = $request->validate([
            'name' => ['required', 'string', 'unique:exhibitions,name,'.$exhibition->id],
            'subdomain' => ['required','string', 'unique:exhibitions,subdomain,'.$exhibition->id],
            'status' => 'required|in:active,inactive'
        ]);
        $oldSubdomain = $exhibition->subdomain;
        $exhibition->update($validated);
        if (app()->environment('local') && PHP_OS_FAMILY === 'Windows' && $validated['subdomain'] !== $oldSubdomain) {
            Artisan::call('herd:subdomain', [
                'subdomain' => $validated['subdomain'],
                '--old' => $oldSubdomain
            ]);
        }
        return redirect()->route('bankai.exhibitions.list')->with('success', 'Exhibition has been updated successfully');
    }
    public function remove(Exhibition $exhibition)
    {
        if (app()->environment('local')  && PHP_OS_FAMILY === 'Windows') {
            Artisan::call('herd:subdomain', [
                '--old' => $exhibition->subdomain,
                '--delete' => true
            ]);
        }
        $exhibition->delete();
        return redirect()->route('bankai.exhibitions.list')->with('success', 'User deleted successfully');
    }
    public function removeAll(Request $request){
        Exhibition::whereIn('id', $request->ids)->delete();
        return redirect()->route('bankai.exhibitions.list')->with('success', 'Users deleted successfully');
    }
}
