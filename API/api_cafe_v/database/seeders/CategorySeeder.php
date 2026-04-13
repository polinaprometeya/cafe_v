<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Support\CategoryTypes;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        foreach (CategoryTypes::values() as $type) {
            Category::firstOrCreate(['type' => $type]);
        }
    }
}

