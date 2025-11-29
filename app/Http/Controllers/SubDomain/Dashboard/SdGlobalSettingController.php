<?php

namespace App\Http\Controllers\SubDomain\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\ExGlobalSetting;
use App\Models\Exhibition;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class SdGlobalSettingController extends Controller
{
    public function edit()
    {
        $exhibition = currentExhibition();

        // Fetch all settings for this exhibition
        $settings = ExGlobalSetting::where('exhibition_id', $exhibition->id)
            ->get()
            ->mapWithKeys(function ($row) {
                return [
                    $row->meta_key => [
                        'value' => $row->meta_value,
                        'url'   => $row->meta_value
                            ? asset('storage/' . $row->meta_value)
                            : null,
                    ]
                ];
            });

        return Inertia::render('subDomain/dashboard/globalSettingsForm', [
            'pageTitle' => $exhibition->subdomain . ' | Dashboard',
            'settings'  => $settings,
        ]);
    }



    public function update(Request $request)
    {
        $exhibition = currentExhibition();
        $exhibitionId = $exhibition->id;

        /**
         * IMPORTANT:
         * React form decides field names.
         * We loop over request fields dynamically.
         */
        foreach ($request->allFiles() as $key => $file) {

            // Store new file
            $path = $file->store($exhibition->subdomain.'/'.$key, 'public');

            // Create row if missing
            ExGlobalSetting::updateOrCreate(
                ['exhibition_id' => $exhibitionId, 'meta_key' => $key],
                ['meta_value' => $path]
            );
        }

        // Handle normal input fields
        foreach ($request->except(['_method', '_token']) as $key => $value) {

            // Skip file fields (already processed)
            if ($request->hasFile($key)) {
                continue;
            }

            // Create or update key
            ExGlobalSetting::updateOrCreate(
                ['exhibition_id' => $exhibitionId, 'meta_key' => $key],
                ['meta_value' => $value]
            );
        }

        return back()->with('success', 'Settings saved successfully.');
    }


    public function deleteFile(Request $request)
    {
        $exhibition = currentExhibition();
        $setting = ExGlobalSetting::where('exhibition_id', $exhibition->id)
            ->where('meta_key', $request->get('key'))
            ->first();

        if (!$setting) {
            return back()->with('error', 'Setting not found.');
        }
        if ($setting->meta_value && Storage::disk('public')->exists($setting->meta_value)) {
            Storage::disk('public')->delete($setting->meta_value);
        }

        $setting->update(['meta_value' => null]);

        return back()->with('success', 'File removed.');
    }
}
