<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Reservation extends Model
{
    /** @use HasFactory<\Database\Factories\ReservationFactory> */
    use HasFactory;

    protected $fillable = [
        'guests_amount',
        'date',
        'start_time',
        'end_time',
        'reservation_name',
        'reservation_number'
    ];

    // public function user(): BelongsTo
    // {
    //     return $this->belongsTo(User::class);
    //     'reservation_name' would be accompanied user_id
    // }

    public function tables(): BelongsToMany
    {
        return $this->belongsToMany(
            Table::class,
            'reservation_tables',
            'reservation_id',
            'table_id'
        );
    }
}
