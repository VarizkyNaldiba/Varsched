<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Habit;
use App\Models\HabitLog;
use App\Models\Task;
use App\Models\User;
use App\Services\ActivityLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class AdminMigrationController extends Controller
{
    public function index(): Response
    {
        $users = User::select('id', 'name', 'email', 'role')
            ->withCount(['tasks', 'habits'])
            ->orderBy('name')
            ->get();

        $recentMigrations = ActivityLog::where('action', 'DATA_MIGRATION')
            ->latest()
            ->take(10)
            ->get();

        return Inertia::render('Admin/Migrations/Index', [
            'users' => $users,
            'recentMigrations' => $recentMigrations,
        ]);
    }

    public function migrate(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'source_user_id' => ['required', 'exists:users,id', 'different:target_user_id'],
            'target_user_id' => ['required', 'exists:users,id'],
            'migrate_tasks' => ['boolean'],
            'migrate_habits' => ['boolean'],
            'mode' => ['required', 'in:transfer,copy'],
            'delete_source' => ['boolean'],
        ]);

        $sourceUser = User::findOrFail($validated['source_user_id']);
        $targetUser = User::findOrFail($validated['target_user_id']);

        $tasksMigrated = 0;
        $habitsMigrated = 0;

        DB::transaction(function () use (
            $sourceUser,
            $targetUser,
            $validated,
            &$tasksMigrated,
            &$habitsMigrated
        ) {
            $mode = $validated['mode'];
            $migrateTasks = $validated['migrate_tasks'] ?? true;
            $migrateHabits = $validated['migrate_habits'] ?? true;

            // 1. Migrate Tasks
            if ($migrateTasks) {
                $sourceTasks = $sourceUser->tasks()->get();
                $tasksMigrated = $sourceTasks->count();

                if ($mode === 'transfer') {
                    $sourceUser->tasks()->update(['user_id' => $targetUser->id]);
                } else {
                    // Copy mode: duplicate tasks
                    foreach ($sourceTasks as $task) {
                        $newTask = $task->replicate();
                        $newTask->user_id = $targetUser->id;
                        $newTask->save();
                    }
                    if (!empty($validated['delete_source'])) {
                        $sourceUser->tasks()->delete();
                    }
                }
            }

            // 2. Migrate Habits & Logs
            if ($migrateHabits) {
                $sourceHabits = $sourceUser->habits()->with('logs')->get();
                $habitsMigrated = $sourceHabits->count();

                if ($mode === 'transfer') {
                    $sourceUser->habits()->update(['user_id' => $targetUser->id]);
                } else {
                    // Copy mode: duplicate habits & their logs
                    foreach ($sourceHabits as $habit) {
                        $newHabit = $habit->replicate();
                        $newHabit->user_id = $targetUser->id;
                        $newHabit->save();

                        foreach ($habit->logs as $log) {
                            $newLog = $log->replicate();
                            $newLog->habit_id = $newHabit->id;
                            $newLog->save();
                        }
                    }
                    if (!empty($validated['delete_source'])) {
                        foreach ($sourceHabits as $habit) {
                            $habit->logs()->delete();
                            $habit->delete();
                        }
                    }
                }
            }
        });

        $modeText = $validated['mode'] === 'transfer' ? 'Transfer Kepemilikan' : 'Duplikasi (Copy)';
        $summary = "Migrasi {$tasksMigrated} tasks & {$habitsMigrated} habits dari [{$sourceUser->name} ({$sourceUser->email})] ke [{$targetUser->name} ({$targetUser->email})] dengan mode {$modeText}.";

        ActivityLogger::log('DATA_MIGRATION', $summary);

        return back()->with('success', "Migrasi data berhasil! {$summary}");
    }
}
