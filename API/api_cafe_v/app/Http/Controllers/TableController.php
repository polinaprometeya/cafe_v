<?php

namespace App\Http\Controllers;

use App\Http\Requests\TableAvailabilityRequest;
use App\Models\Table;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TableController extends Controller
{

    public function __construct()
    {
        /**
         * Auth model:
         * - Customers (public) can check availability.
         * - Staff (authenticated) can mutate tables (future).
         */
        $this->middleware('auth:sanctum')->only(['store', 'update', 'destroy']);

        // Rate limit public availability checks too (prevents scraping/spam).
        $this->middleware('throttle:api')->only([ 'store', 'update', 'destroy']);
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Table $table)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Table $table)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Table $table)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Table $table)
    {
        //
    }

    public function availability(TableAvailabilityRequest $request)
    {
        $data = $request->validated();

        $start = $data['start_time'];
        $end = $data['end_time'];

        $availableTableIds = Table::query()
            ->whereDoesntHave('reservations', function ($q) use ($start, $end) {
                // overlap condition: existing.start < requested.end AND existing.end > requested.start
                $q->where('start_time', '<', $end)
                    ->where('end_time', '>', $start);
            })
            // Exclude tables that are currently held (unexpired holds) and overlap the requested window.
            //      ->where('h.expires_at', '>', DB::raw('NOW()'))
            ->whereNotExists(function ($q) use ($start, $end) {
                $q->select(DB::raw(1))
                    ->from('reservation_hold_tables as ht')
                    ->join('reservation_holds as h', 'h.id', '=', 'ht.hold_id')
                    ->whereColumn('ht.table_id', 'tables.id')
                    ->where('h.expires_at', '>', now())
                    ->where('h.start_time', '<', $end)
                    ->where('h.end_time', '>', $start);
            })
            ->pluck('id')
            ->values();

        return response()->json([
            'available_table_ids' => $availableTableIds,
        ]);
    }

}
