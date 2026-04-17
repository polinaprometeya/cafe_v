<?php

namespace Database\Seeders;

use App\Models\MenuItem;
use Illuminate\Database\Seeder;

class MenuItemSeeder extends Seeder
{
    public function run(): void
    {
        MenuItem::factory()
        ->count(50)
        ->create()
        ->each(fn (MenuItem $item) => $item->update(['number' => $item->id]));
    }
}
