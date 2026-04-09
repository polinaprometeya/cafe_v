<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\Menu;

class Category extends Model
{
    /** @use HasFactory<\Database\Factories\MenuFactory> */
    use HasFactory;

    protected $fillable = [
        'type',
    ];

    public static array $category = ['Drink', 'Food', 'Starter', 'Dessert'];

    public function menu(): BelongsTo
    {
        return $this->belongsTo(Menu::class);
    }
}
