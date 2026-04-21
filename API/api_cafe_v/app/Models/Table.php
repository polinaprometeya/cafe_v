<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;


class Table extends Model
{
    use HasFactory;

    protected $fillable = [
        'number',
        'seats',
    ];

    public function reservations(): BelongsToMany
    {
        return $this->belongsToMany(
            Reservation::class,
            'reservation_tables',
            'table_id',
            'reservation_id'
        );
    }

    public function neighbors(): BelongsToMany
    {
        return $this->belongsToMany(
            Table::class,
            'table_neighbors',
            'table_id',
            'neighbor_table_id'
        );
    }

    // public function user(): BelongsTo
    // {
    //     return $this->belongsTo(User::class);
    // }

    // public function reservation(): BelongsTo
    // {
    //     return $this->belongsTo(Reservation::class);
    // }


}
