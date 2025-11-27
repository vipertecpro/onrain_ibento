<?php

namespace App\Models;

use Database\Factories\ExhibitionFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Exhibition extends Model
{
    /** @use HasFactory<ExhibitionFactory> */
    use HasFactory;
    protected $fillable = [
        'name',
        'subdomain',
        'status'
    ];
}
