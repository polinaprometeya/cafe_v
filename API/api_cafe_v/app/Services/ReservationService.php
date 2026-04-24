<?php
declare(strict_types=1);

namespace App\Services;

use App\Models\Reservation;
use App\Models\Table;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class ReservationService
{
    /**
     * @param array{
     *   guests_amount:int,
     *   date:string,
     *   start_time:string,
     *   end_time:string,
     *   reservation_name:string,
     *   reservation_number:string,
     *   table_ids:array<int,int>
     * } $validated
     */
    public function create(array $validated): Reservation
    {
        $tableIds = $validated['table_ids'] ?? [];

        if (empty($tableIds)) {
            throw new RuntimeException('table_ids is required.');
        }

        $reservationData = $validated;
        unset($reservationData['table_ids']);

        $start = $reservationData['start_time'];
        $end = $reservationData['end_time'];

  
        //Do any of these table_ids already have a reservation whose time window overlaps my requested
        return DB::transaction(function () use ($reservationData, $tableIds, $start, $end) {
            $unavailableTableIds = $this->getUnavailableTableIds($tableIds, $start, $end);

            if ($unavailableTableIds->isNotEmpty()) {
                // Controller will translate this into a 422.
                throw new RuntimeException('UNAVAILABLE_TABLES:' . $unavailableTableIds->implode(','));
            }

            $reservation = Reservation::create($reservationData);
            $reservation->tables()->syncWithoutDetaching($tableIds);

            return $reservation;
        });
    }

    /**
     * @param array<int,int> $tableIds
     * @return \Illuminate\Support\Collection<int,int>
     */
    private function getUnavailableTableIds(array $tableIds, string $start, string $end)
    {
            //List of booked tables
        return Table::query()
            ->whereIn('id', $tableIds)
            ->whereHas('reservations', function ($q) use ($start, $end) {
                // overlap condition: existing.start < requested.end AND existing.end > requested.start
                $q->where('start_time', '<', $end)
                    ->where('end_time', '>', $start);
            })
            ->pluck('id')
            ->values();
    }
}

