<?php

namespace App\Http\Controllers;

use App\Http\Requests\Tasks\StoreTaskRequest;
use App\Http\Requests\Tasks\UpdateTaskRequest;
use App\Models\Task;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TaskController extends Controller
{
    public function index(Request $request): Response
    {
        $tasks = $request->user()->tasks()->latest()->get();

        return Inertia::render('Tasks/Index', [
            'tasks' => $tasks,
        ]);
    }

    public function store(StoreTaskRequest $request): RedirectResponse
    {
        $request->user()->tasks()->create($request->validated());

        return back();
    }

    public function update(UpdateTaskRequest $request, Task $task): RedirectResponse
    {
        $data = $request->validated();

        if (empty($data['deadline'])) {
            $data['deadline'] = null;
        }
        if (empty($data['start_time'])) {
            $data['start_time'] = null;
        }

        $task->update($data);

        return back();
    }

    public function destroy(Request $request, Task $task): RedirectResponse
    {
        if ($task->user_id !== $request->user()->id) {
            abort(403);
        }

        $task->delete();

        return back();
    }
}
