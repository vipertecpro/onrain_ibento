<?php

namespace App\Models;

use Database\Factories\ExhibitionVisitorFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ExhibitionVisitor extends Model
{
    /** @use HasFactory<ExhibitionVisitorFactory> */
    use HasFactory;

    protected $fillable = [
        'exhibition_id',
        'user_id',
        'ip_address',
        'user_agent',
        'visited_at',
    ];
}
