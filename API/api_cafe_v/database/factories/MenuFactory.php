<?php

namespace Database\Factories;

use App\Support\CategoryTypes;
use App\Models\Category;
use App\Models\MenuItem;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Database\Eloquent\Factories\Sequence;

/**
 * @extends Factory<MenuItem>
 */
class MenuFactory extends Factory
{
    protected $model = MenuItem::class;

    static $n = 0;
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'number' => 0,
            'name'=> fake()->sentence(4,true),
            'description'=>fake()->paragraph(5,true),
            'price'=>fake()->numberBetween(50,250),
            'category_id' => Category::firstOrCreate([
                'type' => fake()->randomElement(CategoryTypes::values()),
            ])->id,
        ];
    }
}
