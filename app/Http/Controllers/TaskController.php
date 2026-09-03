<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class TaskController extends Controller
{
    public function index(Request $request): Response
    {
        $tasks = $request->user()->tasks()->latest()->get();
        return Inertia::render('Tasks', [
            'tasks' => $tasks,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        if (empty($request->deadline)) {
            $request->merge(['deadline' => null]);
        }
        if (empty($request->start_time)) {
            $request->merge(['start_time' => null]);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'nullable|string|max:255',
            'status' => 'required|in:todo,in-progress,done',
            'priority' => 'required|in:low,medium,high',
            'deadline' => 'nullable|date',
            'start_time' => 'nullable|date_format:H:i',
        ]);

        $request->user()->tasks()->create($validated);

        return back();
    }

    public function update(Request $request, Task $task): RedirectResponse
    {
        if ($task->user_id !== $request->user()->id) {
            abort(403);
        }

        if (empty($request->deadline)) {
            $request->merge(['deadline' => null]);
        }
        if (empty($request->start_time)) {
            $request->merge(['start_time' => null]);
        }

        $validated = $request->validate([
            'status' => 'required|in:todo,in-progress,done',
        ]);

        $task->update($validated);

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
