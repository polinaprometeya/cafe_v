<?php

namespace App\Http\Controllers;

use App\Http\Requests\TableAvailabilityRequest;
use App\Models\Table;
use Illuminate\Http\Request;

class TableController extends Controller
{
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
            ->pluck('id')
            ->values();

        return response()->json([
            'available_table_ids' => $availableTableIds,
        ]);
    }

}
