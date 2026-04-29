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
use Illuminate\Http\Response;
use Illuminate\Support\Carbon;

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
        $ttlSeconds = $data['ttl_seconds'] ?? 300; //Determine TTL (time-to-live), I do not actually have a default

        //Call a stored procedure to create the hold
        try {
            $result = DB::select('CALL sp_create_hold(?, ?, ?, ?, ?)', [
                $data['start_time'],
                $data['end_time'],
                $data['guests_amount'],
                $tableIdsJson,
                $ttlSeconds,
            ]);
        } catch (QueryException $e) {
            //This happens if no table are available
            $msg = $e->getMessage();

            if (str_contains($msg, 'TABLES_NOT_AVAILABLE')) {
                return response()->json([
                    'message' => 'Some selected tables are not available for the requested time.',
                ], 422);
            }

            throw $e;
        }

        //Extract and normalize the stored procedure result row
        $row = $result[0] ?? null;
        $rowArr = is_object($row) ? (array) $row : (is_array($row) ? $row : []);
        $rowArrLower = array_change_key_case($rowArr, CASE_LOWER);

        // Stored procedure implementations vary. Some return `hold_id`/`expires_at`,
        // others may only return `id` (the created hold primary key).
        $holdId = $rowArrLower['hold_id']
            ?? $rowArrLower['holdid']
            ?? $rowArrLower['id']
            ?? $rowArrLower['v_hold_id']
            ?? $rowArrLower['reservation_id']
            ?? null;

        $expiresAt = $rowArrLower['expires_at']
            ?? $rowArrLower['expiresat']
            ?? $rowArrLower['expires']
            ?? $rowArrLower['v_expires_at']
            ?? null;

        // If procedure didn't return expires_at, fetch it from DB using the hold id.
        if ($holdId !== null && $expiresAt === null) {
            $expiresAt = DB::table('reservation_holds')->where('id', $holdId)->value('expires_at');
        }

        /**
         * Last-resort fallback:
         * Some stored procedure versions may create the hold row but forget to set `expires_at`.
         * If the row exists, compute expires_at from ttl and persist it.
         */
        if ($holdId !== null && $expiresAt === null) {
            $exists = DB::table('reservation_holds')->where('id', $holdId)->exists();
            if ($exists) {
                $expiresAt = Carbon::now()->addSeconds($ttlSeconds)->toDateTimeString();
                DB::table('reservation_holds')->where('id', $holdId)->update(['expires_at' => $expiresAt]);
            }
        }

        //error handling
        if ($holdId === null || $expiresAt === null) {
            return response()->json([
                'message' => 'Hold was created, but API could not read hold_id/expires_at from stored procedure result.',
                'returned_columns' => array_keys($rowArrLower),
            ], 500);
        }

        //success
        return response()->json([
            'hold_id' => $holdId,
            'expires_at' => $expiresAt,
        ]);
    }

    public function releaseHold(int|string $hold): Response
    {
        /**
         * Releases a hold early (before TTL).
         *
         * The tables are linked via `reservation_hold_tables` with `cascadeOnDelete()`,
         * so deleting the hold row releases the associated table rows too.
         */
        $deleted = DB::table('reservation_holds')->where('id', $hold)->delete();

        if ($deleted === 0) {
            return response('', 404);
        }

        return response('', 204);
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
