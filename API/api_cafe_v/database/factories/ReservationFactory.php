<?php

namespace Database\Factories;

use App\Models\Reservation;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Reservation>
 */
class ReservationFactory extends Factory
{
    

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $start = fake()->dateTimeBetween('now', '+1 month');
        
        return [
   
            'guests_amount' => fake()->numberBetween(1,4),
            'date' => \Carbon\Carbon::instance($start)->toDateString(),
            'start_time' => \Carbon\Carbon::instance($start)->format('H:i:s'),
            'end_time' => \Carbon\Carbon::instance($start)->addHour()->format('H:i:s'),
            'reservation_name'  => fake()->unique()->name(),
            'reservation_number' => fake()->numerify('########'),

        ];
    }
}
