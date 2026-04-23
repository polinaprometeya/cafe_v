<?php
declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ReservationResource;
use App\Http\Requests\ReservationRequest;
use App\Http\Traits\CanLoadRelationships;
use App\Models\Reservation;
use Illuminate\Http\Request;
use App\Services\ReservationCreator;
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
            $reservation = app(ReservationCreator::class)->create($data);
        } catch (RuntimeException $e) {
            $message = $e->getMessage();

            if (str_starts_with($message, 'UNAVAILABLE_TABLES:')) {
                $csv = substr($message, strlen('UNAVAILABLE_TABLES:'));
                $ids = $csv === '' ? [] : array_map('intval', explode(',', $csv));

                return response()->json([
                    'message' => 'Some selected tables are not available for the requested time.',
                    'unavailable_table_ids' => $ids,
                ], 422);
            }

            return response()->json([
                'message' => $message,
            ], 422);
        }

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
