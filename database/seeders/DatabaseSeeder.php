<?php

namespace Database\Seeders;

use App\Models\Habit;
use App\Models\HabitLog;
use App\Models\Task;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Find existing user (e.g. Varizky) or create test user
        $user = User::first();

        if (!$user) {
            $user = User::create([
                'name' => 'Varizky Naldiba Rimra',
                'email' => 'varizkynr@gmail.com',
                'password' => Hash::make('12345678'),
            ]);
        }

        // Clean up previous tasks and habits if needed, or populate if empty
        if ($user->tasks()->count() === 0) {
            $now = Carbon::now();
            $startOfWeek = Carbon::now()->startOfWeek(Carbon::MONDAY);

            $sampleTasks = [
                // Completed tasks throughout this week
                [
                    'title' => 'Review React & Inertia documentation',
                    'category' => 'Study',
                    'status' => 'done',
                    'priority' => 'high',
                    'deadline' => $startOfWeek->copy()->addDays(0)->toDateString(),
                    'start_time' => '09:00',
                    'updated_at' => $startOfWeek->copy()->addDays(0)->setHour(11),
                ],
                [
                    'title' => 'Design wireframe for mobile app',
                    'category' => 'Work',
                    'status' => 'done',
                    'priority' => 'medium',
                    'deadline' => $startOfWeek->copy()->addDays(1)->toDateString(),
                    'start_time' => '10:00',
                    'updated_at' => $startOfWeek->copy()->addDays(1)->setHour(15),
                ],
                [
                    'title' => 'Team weekly sync meeting',
                    'category' => 'Work',
                    'status' => 'done',
                    'priority' => 'high',
                    'deadline' => $startOfWeek->copy()->addDays(1)->toDateString(),
                    'start_time' => '13:30',
                    'updated_at' => $startOfWeek->copy()->addDays(1)->setHour(14),
                ],
                [
                    'title' => 'Grocery shopping for weekly meal prep',
                    'category' => 'Personal',
                    'status' => 'done',
                    'priority' => 'low',
                    'deadline' => $startOfWeek->copy()->addDays(2)->toDateString(),
                    'start_time' => '17:00',
                    'updated_at' => $startOfWeek->copy()->addDays(2)->setHour(18),
                ],
                [
                    'title' => 'Backend API integration with Laravel',
                    'category' => 'Work',
                    'status' => 'done',
                    'priority' => 'high',
                    'deadline' => $startOfWeek->copy()->addDays(3)->toDateString(),
                    'start_time' => '08:30',
                    'updated_at' => $startOfWeek->copy()->addDays(3)->setHour(12),
                ],
                [
                    'title' => 'Algorithm practice & LeetCode',
                    'category' => 'Study',
                    'status' => 'done',
                    'priority' => 'medium',
                    'deadline' => $startOfWeek->copy()->addDays(3)->toDateString(),
                    'start_time' => '14:00',
                    'updated_at' => $startOfWeek->copy()->addDays(3)->setHour(16),
                ],
                [
                    'title' => 'Database migration and seeding script',
                    'category' => 'Work',
                    'status' => 'done',
                    'priority' => 'high',
                    'deadline' => $startOfWeek->copy()->addDays(3)->toDateString(),
                    'start_time' => '16:00',
                    'updated_at' => $startOfWeek->copy()->addDays(3)->setHour(17),
                ],
                // Active/Pending tasks
                [
                    'title' => 'Setup automated CI/CD pipeline',
                    'category' => 'Work',
                    'status' => 'in-progress',
                    'priority' => 'high',
                    'deadline' => $now->toDateString(),
                    'start_time' => '10:00',
                    'updated_at' => $now,
                ],
                [
                    'title' => 'Write unit tests for authentication',
                    'category' => 'Work',
                    'status' => 'in-progress',
                    'priority' => 'medium',
                    'deadline' => $now->copy()->addDays(1)->toDateString(),
                    'start_time' => '11:00',
                    'updated_at' => $now,
                ],
                [
                    'title' => 'Read Clean Architecture book - Chapter 4',
                    'category' => 'Study',
                    'status' => 'todo',
                    'priority' => 'low',
                    'deadline' => $now->copy()->addDays(2)->toDateString(),
                    'start_time' => '20:00',
                    'updated_at' => $now,
                ],
                [
                    'title' => 'Plan weekend cycling trip',
                    'category' => 'Personal',
                    'status' => 'todo',
                    'priority' => 'low',
                    'deadline' => $now->copy()->addDays(3)->toDateString(),
                    'start_time' => '15:00',
                    'updated_at' => $now,
                ],
            ];

            foreach ($sampleTasks as $taskData) {
                $user->tasks()->create($taskData);
            }
        }

        // Seed habits if none exist
        if ($user->habits()->count() === 0) {
            $startOfWeek = Carbon::now()->startOfWeek(Carbon::MONDAY);

            $habit1 = $user->habits()->create(['name' => 'Read 30 mins']);
            $habit2 = $user->habits()->create(['name' => 'Workout']);

            // Seed logs for this week
            $habit1Pattern = [true, true, true, false, true, true, false];
            $habit2Pattern = [false, true, false, true, true, false, false];

            for ($i = 0; $i < 7; $i++) {
                $dateStr = $startOfWeek->copy()->addDays($i)->toDateString();

                HabitLog::create([
                    'habit_id' => $habit1->id,
                    'date' => $dateStr,
                    'completed' => $habit1Pattern[$i],
                ]);

                HabitLog::create([
                    'habit_id' => $habit2->id,
                    'date' => $dateStr,
                    'completed' => $habit2Pattern[$i],
                ]);
            }
        }
    }
}
