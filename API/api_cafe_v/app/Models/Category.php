<?php

namespace App\Models;

use App\Enums\CategoryType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Category extends Model
{
    /** @use HasFactory<\Database\Factories\MenuFactory> */
    use HasFactory;

    //So you can filter by cetegory
    protected $fillable = [
        'type',
    ];

    public static array $categoryType = [
        ['id' => 1, 'type' => 'Drink'],
        ['id' => 2, 'type' => 'Food'],
        ['id' => 3, 'type' => 'Starter'],
        ['id' => 4, 'type' => 'Dessert'],
    ];
 

    //cast the type to the CategoryType enum
    //cast converts database values into PHP types
    protected $casts = [
        'type' => CategoryType::class,
    ];

    //one category_id can have many menu items
    public function menuItems(): HasMany
    {
        return $this->hasMany(MenuItem::class, 'category_id');
    }
}
