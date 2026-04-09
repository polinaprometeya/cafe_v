<?php

namespace Database\Seeders;

use App\Enums\CategoryType;
use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        foreach (CategoryType::cases() as $type) {
            Category::firstOrCreate(['type' => $type]);
        }
    }
}

