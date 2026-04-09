<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MenuItem extends Model
{
    /** @use HasFactory<\Database\Factories\MenuFactory> */
    use HasFactory;

    //this is technically unnecessary
    protected $table = 'menu';

    //so you can fill the table with data
    protected $fillable = [
        'name',
        'description',
        'price',
        'category_id',
    ];

    //one menu item belongs to one category, it is the other end of the relationship
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class, 'category_id');
    }
}
