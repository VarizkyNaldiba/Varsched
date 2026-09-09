<?php

namespace App\Http\Controllers;

use App\Http\Requests\Tasks\StoreTaskRequest;
use App\Http\Requests\Tasks\UpdateTaskRequest;
use App\Models\Task;
use App\Notifications\TaskReminderNotification;
use App\Services\ActivityLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

use Illuminate\Support\Facades\Cache;

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
        $user = $request->user();
        $task = $user->tasks()->create($request->validated());

        ActivityLogger::log('TASK_CREATE', "Tugas baru dibuat: '{$task->title}' [{$task->category}]", $user, $request);
        Cache::forget("user_{$user->id}_dashboard_data");

        try {
            $user->notify(new TaskReminderNotification($task));
        } catch (\Throwable $e) {
            Log::warning('Task email notification failed: ' . $e->getMessage());
        }

        return back()->with('success', 'Tugas baru berhasil dibuat!');
    }

    public function update(UpdateTaskRequest $request, $id): RedirectResponse
    {
        $task = Task::where('user_id', $request->user()->id)->where('id', $id)->first();

        if ($task) {
            $data = $request->validated();

            if (array_key_exists('deadline', $data) && empty($data['deadline'])) {
                $data['deadline'] = null;
            }
            if (array_key_exists('start_time', $data) && empty($data['start_time'])) {
                $data['start_time'] = null;
            }

            $task->update($data);

            ActivityLogger::log('TASK_UPDATE', "Tugas '{$task->title}' diperbarui (status: {$task->status}).", $request->user(), $request);
            Cache::forget("user_{$request->user()->id}_dashboard_data");
        }

        return back()->with('success', 'Tugas berhasil diperbarui!');
    }

    public function destroy(Request $request, $id): RedirectResponse
    {
        $task = Task::where('user_id', $request->user()->id)->where('id', $id)->first();

        if ($task) {
            $title = $task->title;
            $task->delete();

            ActivityLogger::log('TASK_DELETE', "Tugas '{$title}' dihapus.", $request->user(), $request);
            Cache::forget("user_{$request->user()->id}_dashboard_data");
        }

        return back()->with('success', 'Tugas berhasil dihapus!');
    }
}
