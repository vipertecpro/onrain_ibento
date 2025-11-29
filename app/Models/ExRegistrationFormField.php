<?php

namespace App\Models;

use Database\Factories\ExhibitionVisitorFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ExRegistrationFormField extends Model
{
    protected $fillable = [
        'exhibition_id',
        'builder_schema',
        'created_by',
    ];
    protected $casts = [
        'builder_schema' => 'array',
    ];

    public function exhibition(): BelongsTo
    {
        return $this->belongsTo(Exhibition::class);
    }
}
