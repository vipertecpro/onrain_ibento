<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StallVisitor extends Model
{
    /** @use HasFactory<\Database\Factories\StallVisitorFactory> */
    use HasFactory;

    protected $fillable = [
        'stall_id',
        'user_id',
        'ip_address',
        'user_agent',
        'visited_at',
    ];
}
