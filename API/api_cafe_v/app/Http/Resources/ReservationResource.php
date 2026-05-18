<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReservationResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */

    
    public function toArray(Request $request): array
    {
        return
        [
        'id' => $this->id,
        'guests_amount' => $this->guests_amount,
        'date' => $this->date,
        'start_time' => $this->start_time,
        'end_time' => $this->end_time,
        'reservation_name' => $this->reservation_name,
        'reservation_number' => $this->reservation_number,
        'table' => TableResource::collection(
            $this->whenLoaded('tables')
        )
        ];

    }
}
