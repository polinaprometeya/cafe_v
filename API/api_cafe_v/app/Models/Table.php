<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Table extends Model
{
    protected $fillable = [
        'reservation_id'
    ];

    // public function user(): BelongsTo
    // {
    //     return $this->belongsTo(User::class);
    // }

    // public function reservation(): BelongsTo
    // {
    //     return $this->belongsTo(Reservation::class);
    // }

    public function reservation(): BelongsTo
    {
        return $this->hasMany(Reservation::class);
    }
}
