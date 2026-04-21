<?php
declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ReservationResource;
use App\Http\Requests\ReservationRequest;
use App\Http\Traits\CanLoadRelationships;
use App\Models\Reservation;
use Illuminate\Http\Request;

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

        $tableIds = $data['table_ids'] ?? [];   // e.g. [1,2,3] , make sure it is present , this does not silently fail
        unset($data['table_ids']); // keep only reservation columns
     
        $reservation = Reservation::create($data);
        $reservation->tables()->syncWithoutDetaching($tableIds);

        
        //$reservation = new ReservationResource($reservation);
        //this->authorize('create', Post::class);         //you can add manual authorization

        //$reservation = new ReservationResource($this->loadRelationships(Reservation::create($data)));

        return $event;
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
