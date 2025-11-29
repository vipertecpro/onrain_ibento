<?php

namespace App\Models;

use Database\Factories\ExhibitionFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Exhibition extends Model
{
    /** @use HasFactory<ExhibitionFactory> */
    use HasFactory;
    protected $fillable = [
        'name',
        'subdomain',
        'status'
    ];
    public function registration_form(): HasOne|Exhibition
    {
        return $this->hasOne(ExRegistrationFormField::class);
    }

}
