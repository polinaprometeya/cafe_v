<?php

namespace Database\Factories;

use App\Support\CategoryTypes;
use App\Models\Category;
use App\Models\MenuItem;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<MenuItem>
 */

 //this is a blueprint of how data should be generated when seeder runs
 //so you can generate random data for the menu items table
class MenuItemFactory extends Factory
{
    protected $model = MenuItem::class;

    public function definition(): array
    {
        return [
            'number' => (function () {
                static $n = 0;
                return ++$n;
            })(),
            'name'=> fake()->sentence(2, true),
            'description'=> fake()->paragraph(5, true),
            'price'=> fake()->numberBetween(50, 250),
            'category_id' => Category::firstOrCreate([
                'type' => fake()->randomElement(CategoryTypes::values()),
            ])->id,
        ];
    }
}

