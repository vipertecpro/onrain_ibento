<?php

namespace App\Models;

use Database\Factories\GlobalSettingFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GlobalSetting extends Model
{
    /** @use HasFactory<GlobalSettingFactory> */
    use HasFactory;
    protected $fillable = ['meta_key', 'meta_value'];
    public $timestamps = true;
    public static function get($key, $default = null)
    {
        $setting = static::where('meta_key', $key)->first();
        return $setting ? $setting->meta_value : $default;
    }
    public static function set($key, $value)
    {
        return static::updateOrCreate(
            ['meta_key' => $key],
            ['meta_value' => $value]
        );
    }
}
