<?php

namespace App\Models;

use Database\Factories\ExhibitionVisitorFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ExRegistrationFormField extends Model
{
    protected $fillable = [
        'ex_exhibitor_id',
        'ex_visitor_id',
        'type',
        'message',
    ];
}
