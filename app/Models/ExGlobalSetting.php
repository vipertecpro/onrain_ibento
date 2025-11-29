<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ExGlobalSetting extends Model
{
    protected $fillable = ['exhibition_id', 'meta_key', 'meta_value'];
    public $timestamps = true;

    public static function get($exhibitionId, $key, $default = null)
    {
        $setting = static::where('exhibition_id', $exhibitionId)
            ->where('meta_key', $key)
            ->first();

        return $setting ? $setting->meta_value : $default;
    }

    public static function set($exhibitionId, $key, $value)
    {
        return static::updateOrCreate(
            [
                'exhibition_id' => $exhibitionId,
                'meta_key'      => $key,
            ],
            [
                'meta_value' => $value,
            ]
        );
    }
}
