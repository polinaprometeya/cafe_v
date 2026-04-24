<?php
declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class ReservationRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        // This request is used for both:
        // - ReservationController@store (full reservation)
        // - ReservationController@hold (temporary hold)
        $action = optional($this->route())->getActionMethod();

        if ($action === 'hold') {
            return [
                'start_time' => 'required|date',
                'end_time' => 'required|date|after:start_time',
                'guests_amount' => 'required|integer|min:1|max:8',
                'table_ids' => 'required|array|min:1',
                'table_ids.*' => 'integer|exists:tables,id',
                'ttl_seconds' => 'sometimes|integer|min:30|max:900',
            ];
        }

        return [
            'guests_amount' => 'required|integer|min:1|max:8',
            'date' => 'required|date',
            'start_time' => 'required|date',
            'end_time' => 'required|date|after:start_time',
            'reservation_name' => 'required|string|max:255',
            'reservation_number' => 'required|string',
            'table_ids' => 'required|array|min:1',
            'table_ids.*' => 'integer|exists:tables,id',
        ];
    }
}

