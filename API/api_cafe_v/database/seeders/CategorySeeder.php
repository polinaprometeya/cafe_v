<?php

namespace Database\Seeders;

use App\Models\Menu;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;


class CategorySeeder extends Seeder
{
    public function run(): void
    {
            DB::table('users')->insert([
            'category' => fake()->randomElement(Menu::$category),
        ]);
    }
}
