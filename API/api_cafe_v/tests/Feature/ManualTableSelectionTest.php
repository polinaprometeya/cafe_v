<?php

namespace Tests\Feature;

use App\Models\Reservation;
use App\Models\Table;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ManualTableSelectionTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_staff_can_fetch_tables_for_manual_selection(): void
    {
        Sanctum::actingAs(User::factory()->create()); //fake login

        $table1 = Table::factory()->create([
            'number' => 1,
            'seats' => 2,
        ]);
        $table2 = Table::factory()->create([
            'number' => 2,
            'seats' => 4,
        ]);
        $table3 = Table::factory()->create([
            'number' => 3,
            'seats' => 6,
        ]);

        $table1->neighbors()->syncWithoutDetaching([$table2->id]);
        $table2->neighbors()->syncWithoutDetaching([$table1->id, $table3->id]);
        $table3->neighbors()->syncWithoutDetaching([$table2->id]);

        $reservation = Reservation::factory()->create([
            'date' => '2026-05-11 00:00:00',
            'start_time' => '2026-05-11 18:00:00',
            'end_time' => '2026-05-11 20:00:00',
        ]);
        $reservation->tables()->syncWithoutDetaching([$table2->id]); // fake reservation link to table 2

        $holdId = DB::table('reservation_holds')->insertGetId([
            'start_time' => '2026-05-11 18:30:00',
            'end_time' => '2026-05-11 19:30:00',
            'guests_amount' => 2,
            'expires_at' => now()->addMinutes(5),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('reservation_hold_tables')->insert([
            'hold_id' => $holdId,
            'table_id' => $table3->id,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $response = $this->postJson('/api/tables/manual-selection', [
            'start_time' => '2026-05-11 18:15:00',
            'end_time' => '2026-05-11 19:15:00',
            'guests_amount' => 4,
        ]);

        $response->assertOk();
        $response->assertJsonCount(3, 'tables');
        $response->assertJsonPath('available_table_ids', [$table1->id]);

        $response->assertJsonPath('tables.0.id', $table1->id);
        $response->assertJsonPath('tables.0.number', 1);
        $response->assertJsonPath('tables.0.seats', 2);
        $response->assertJsonPath('tables.0.is_available', true);
        $response->assertJsonPath('tables.0.neighbor_table_ids', [$table2->id]);

        //table 2 & 3 should be unavailble
        $response->assertJsonPath('tables.1.id', $table2->id);
        $response->assertJsonPath('tables.1.number', 2);
        $response->assertJsonPath('tables.1.seats', 4);
        $response->assertJsonPath('tables.1.is_available', false);
        $response->assertJsonPath('tables.1.neighbor_table_ids', [$table1->id, $table3->id]);

        $response->assertJsonPath('tables.2.id', $table3->id);
        $response->assertJsonPath('tables.2.number', 3);
        $response->assertJsonPath('tables.2.seats', 6);
        $response->assertJsonPath('tables.2.is_available', false);
        $response->assertJsonPath('tables.2.neighbor_table_ids', [$table2->id]);
    }

    public function test_manual_selection_endpoint_requires_authentication(): void
    {
        $response = $this->postJson('/api/tables/manual-selection', [
            'start_time' => '2026-05-11 18:15:00',
            'end_time' => '2026-05-11 19:15:00',
            'guests_amount' => 4,
        ]);

        $response->assertUnauthorized();
    }
}
