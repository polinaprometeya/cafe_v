<?php
declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ReservationResource;
use App\Http\Requests\ReservationRequest;
use App\Http\Traits\CanLoadRelationships;
use App\Models\Reservation;
use Illuminate\Http\Request;
use App\Services\ReservationService;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class ReservationController extends Controller
{
    use CanLoadRelationships;

    protected function relations(): array
    {
        return ['tables'];
    }
     /**
        * Display a listing of the resource.
        *
        * @return Response
        */
    public function index()
    {
        $query = $this->loadRelationships(Reservation::query());

        $reservations = ReservationResource::collection(
            $query->latest()->paginate()
        );

        return $reservations;

    }

    /**
        * Show the form for creating a new resource.
        *
        * @return Response
        */
    public function create()
    {

    }

    /**
        * Store a newly created resource in storage.
        *
        * @return Response
        */
    public function store(ReservationRequest $request)
    {
        $data = $request->validated();

        try {
            $reservation = app(ReservationService::class)->create($data);
        } catch (RuntimeException $e) {
            $message = $e->getMessage();

            $prefix = 'UNAVAILABLE_TABLES:';

            // ReservationService throws: "UNAVAILABLE_TABLES:1,2,3"
            // This parses the ids (1,2,3) into an integer array [1, 2, 3]
            if (str_starts_with($message, $prefix)) {
                $csvIds = substr($message, strlen($prefix)); // "1,2,3"

                $unavailableIds = $csvIds === ''
                    ? []
                    : array_map('intval', explode(',', $csvIds));

                return response()->json([
                    'message' => 'Some selected tables are not available for the requested time.',
                    'unavailable_table_ids' => $unavailableIds,
                ], 422);
            }

            return response()->json([
                'message' => $message,
            ], 422);
        }

        return $reservation;
    }

    public function hold(ReservationRequest $request)
    {
        $data = $request->validated();

        $tableIdsJson = json_encode($data['table_ids'], JSON_THROW_ON_ERROR);
        $ttlSeconds = $data['ttl_seconds'] ?? 300;

        try {
            $result = DB::select('CALL sp_create_hold(?, ?, ?, ?, ?)', [
                $data['start_time'],
                $data['end_time'],
                $data['guests_amount'],
                $tableIdsJson,
                $ttlSeconds,
            ]);
        } catch (QueryException $e) {
            $msg = $e->getMessage();

            if (str_contains($msg, 'TABLES_NOT_AVAILABLE')) {
                return response()->json([
                    'message' => 'Some selected tables are not available for the requested time.',
                ], 422);
            }

            throw $e;
        }

        $row = $result[0] ?? null;

        return response()->json([
            'hold_id' => $row->hold_id ?? null,
            'expires_at' => $row->expires_at ?? null,
        ]);
    }

    /**
        * Display the specified resource.
        *
        * @param  int  $id
        * @return Response
        */
    public function show($id)
    {
        //
    }

    /**
        * Show the form for editing the specified resource.
        *
        * @param  int  $id
        * @return Response
        */
    public function edit($id)
    {
        //$reservation->tables()->syncWithoutDetaching([1, 2, 3]);
    }

    /**
        * Update the specified resource in storage.
        *
        * @param  int  $id
        * @return Response
        */
    public function update($id)
    {
        //
    }

    /**
        * Remove the specified resource from storage.
        *
        * @param  int  $id
        * @return Response
        */
    public function destroy($id)
    {
        //
    }


}
