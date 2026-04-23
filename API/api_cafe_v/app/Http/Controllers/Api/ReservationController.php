<?php
declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ReservationResource;
use App\Http\Requests\ReservationRequest;
use App\Http\Traits\CanLoadRelationships;
use App\Models\Reservation;
use App\Models\Table;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

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

        //sp_create_reservation <--- name of the stored procedure

        // $tableIdsJson = json_encode($request->input('table_ids'));
        //     $result = DB::select('CALL sp_create_reservation(?, ?, ?, ?, ?, ?, ?)', [
        //         $request->guests_amount,
        //         $request->date,
        //         $request->start_time,
        //         $request->end_time,
        //         $request->reservation_name,
        //         $request->reservation_number,
        //         $tableIdsJson,
        //     ]);
        //     $reservationId = $result[0]->reservation_id ?? null;

        $data = $request->validated();

        $tableIds = $data['table_ids'] ?? [];   // e.g. [1,2,3] , make sure it is present , this does not silently fail
        unset($data['table_ids']); // keep only reservation columns

        $start = $data['start_time'];
        $end = $data['end_time'];

        $unavailableTableIds = Table::query()
            ->whereIn('id', $tableIds)
            ->whereHas('reservations', function ($q) use ($start, $end) {
                $q->where('start_time', '<', $end)
                    ->where('end_time', '>', $start);
            })
            ->pluck('id')
            ->values();

        if ($unavailableTableIds->isNotEmpty()) {
            return response()->json([
                'message' => 'Some selected tables are not available for the requested time.',
                'unavailable_table_ids' => $unavailableTableIds,
            ], 422);
        }
     
        $reservation = Reservation::create($data);
        $reservation->tables()->syncWithoutDetaching($tableIds);

        
        //$reservation = new ReservationResource($reservation);
        //this->authorize('create', Post::class);         //you can add manual authorization

        //$reservation = new ReservationResource($this->loadRelationships(Reservation::create($data)));

        return $reservation;
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
