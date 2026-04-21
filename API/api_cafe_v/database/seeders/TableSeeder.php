<?php

namespace Database\Seeders;

use App\Models\Table;
use Illuminate\Database\Seeder;

class TableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create 10 physical tables: numbers 1..10, 2 seats each
        $tables = collect(range(1, 10))->map(function (int $number) {
            return Table::firstOrCreate(
                ['number' => $number],
                ['seats' => 2],
            );
        });

        // Define adjacency (1<->2, 2<->3, ..., 9<->10)
        $byNumber = $tables->keyBy('number');

        foreach (range(1, 9) as $n) {
            $a = $byNumber[$n];
            $b = $byNumber[$n + 1];

            // Store both directions so neighbors() works naturally either way
            $a->neighbors()->syncWithoutDetaching([$b->id]);
            $b->neighbors()->syncWithoutDetaching([$a->id]);
        }
    }
}
