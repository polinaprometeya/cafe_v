<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\MenuController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\AuthController;
use Illuminate\Http\Request;


Route::apiResource('category', CategoryController::class);

Route::apiResource('menu', MenuController::class);

//this is a current user endpoint not a specific one
//middleware('auth:sanctum') protects the route, you need authentication Bearer token in order to access this route
//Route::middleware('auth:sanctum')->get('/user', function(Request $request){return $request->user();}); <--- laravel 11 , this is no more
//Route::get('/user', function (Request $request) {
//    return $request->user();
//})->middleware('auth:sanctum');

//Route::post('/login', [AuthController::class, 'login']);
//Route::post('logout', [AuthController::class, 'logout'])
//->middleware('auth:sanctum');

//Route::apiResource('events.attendees', AttendeeController::class)
//->scoped()->except('update');


//-->attendee is always part of an event, if you use route model binding it will look for attendee in a parent event.
//In that case they both parameter are required and need to be present or the query fails.  GET|HEAD        api/event/{event}/attendees/{attendee}
//

// Route::apiResource('event.attendees', AttendeeController::class)
// ->scoped(['attendee' => 'event']);
