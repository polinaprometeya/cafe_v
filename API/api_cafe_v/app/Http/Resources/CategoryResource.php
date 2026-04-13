<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CategoryResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */

    //this class is in no way tied to Event model or controller and therefore we would need to write those classes explicitly
    public function toArray(Request $request): array
    {
        return
        [
        'id' => $this->id,
        'number' => $this->number,
        'type' => $this->type,
        'menu' => MenuResource::collection(
            $this->whenLoaded('menuItems')
        )
        ];

    }
}
