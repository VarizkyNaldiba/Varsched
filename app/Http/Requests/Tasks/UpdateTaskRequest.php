<?php

namespace App\Http\Requests\Tasks;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTaskRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->task && $this->task->user_id === $this->user()->id;
    }

    public function rules(): array
    {
        return [
            'title' => ['sometimes', 'string', 'max:255'],
            'category' => ['sometimes', 'string', 'max:255'],
            'status' => ['required', 'in:todo,in-progress,done'],
            'priority' => ['sometimes', 'in:low,medium,high'],
            'deadline' => ['nullable', 'date'],
            'start_time' => ['nullable'],
        ];
    }
}

