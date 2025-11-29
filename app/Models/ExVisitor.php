<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ExVisitor extends Model
{
    protected $fillable = [
        'exhibition_id',
        'user_id',
        'fields',
        'status'
    ];

    protected function casts(): array
    {
        return [
            'fields' => 'array'
        ];
    }

    public function user(){
        return $this->belongsTo(User::class);
    }
}
