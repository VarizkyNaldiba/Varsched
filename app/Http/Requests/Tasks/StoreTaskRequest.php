<?php

namespace App\Http\Requests\Tasks;

use Illuminate\Foundation\Http\FormRequest;

class StoreTaskRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'category' => ['required', 'string', 'max:255'],
            'status' => ['required', 'in:todo,in-progress,done'],
            'priority' => ['required', 'in:low,medium,high'],
            'deadline' => ['required', 'date'],
            'start_time' => ['required', 'date_format:H:i'],
        ];
    }
}

