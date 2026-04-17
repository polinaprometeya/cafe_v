<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        //you have to seed the categories first, then the menu items

        $this->call([
            CategorySeeder::class,
            MenuItemSeeder::class,
            ReservationSeeder::class,
            TableSeeder::class,
        ]);
    }
}
