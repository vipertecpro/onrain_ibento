<?php

namespace App\Models;

use Database\Factories\ExhibitionVisitorFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ExVisitorActivity extends Model
{
    protected $fillable = [
        'ex_visitor_id',
        'type',
        'message',
    ];
}
