<?php

namespace App\Http\Controllers\Api;

use App\Models\MenuItem;
use App\Http\Controllers\Controller;
use App\Http\Resources\MenuResource;


class MenuController extends Controller
{
     /**
        * Display a listing of the resource.
        *
        * @return Response
        */
    public function index()
    {
        $menu = MenuResource::collection(
            MenuItem::query()->latest()->get()
        );

     //this returns sorted data from the database, with latest first. get() returns a collection of menu items. 
     //collection() is a helper function that converts the collection to a resource collection.
        return $menu;
    }

    /**
        * Show the form for creating a new resource.
        *
        * @return Response
        */
    public function create()
    {
        //first or create is a helper function that check if it exists first
        $user = User::firstOrCreate(
            ['id' => '51'],
            [
                'name' => 'Fish and Chips',
                'price' => 150,
                'category_id' => Category::query()->inRandomOrder()->value('id'),
            ]
        );
    }

    /**
        * Store a newly created resource in storage.
        *
        * @return Response
        */
    public function store()
    {
        //
    }

    /**
        * Display the specified resource.
        *
        * @param  int  $id
        * @return Response
        */
    public function show(MenuItem $menuItem)
    {
        return new MenuResource($menuItem);
    }

    /**
        * Show the form for editing the specified resource.
        *
        * @param  int  $id
        * @return Response
        */
    public function edit($id)
    {
        $menuItem = MenuItem::findOrFail($id);

        $menuItem->fill([
            'name' => 'New Name',
            'price' => 'New Price',
            'category_id' => 'Dropdown category id',
        ]);
        $menuItem->save();

        return new MenuResource($menuItem);
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
