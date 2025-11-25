<?php

namespace Database\Seeders;

use App\Models\GlobalSetting;
use Illuminate\Database\Seeder;

class GlobalSettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $settings = [
            'site_name'        => 'Virtual Expo',
            'site_logo'        => null,
            'primary_color'    => '#1e40af',
            'secondary_color'  => '#1e293b',
            'support_email'    => 'support@example.com',
            'timezone'         => 'UTC',
            'date_format'      => 'd M Y',
            'time_format'      => 'h:i A',
            'maintenance_mode' => '0',
            'registration_open'=> '1',
        ];

        foreach ($settings as $key => $value) {
            GlobalSetting::updateOrCreate(
                ['meta_key' => $key],
                ['meta_value' => $value]
            );
        }
    }
}
