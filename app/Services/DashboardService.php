<?php

namespace App\Services;

use App\Models\Habit;
use App\Models\HabitLog;
use App\Models\User;
use Carbon\Carbon;

use Illuminate\Support\Facades\Cache;

class DashboardService
{
    /**
     * Get aggregated and optimized dashboard data for user.
     */
    public function getDashboardData(User $user): array
    {
        $cacheKey = "user_{$user->id}_dashboard_data";

        return Cache::remember($cacheKey, 30, function () use ($user) {
            try {
                $tasksQuery = $user->tasks();

                // 1. Task counts
                $completedTasks = (clone $tasksQuery)->where('status', 'done')->count();
                $pendingTasks = (clone $tasksQuery)->where('status', '!=', 'done')->count();

                // 2. Streak calculation
                $streak = $this->calculateStreak($user);

                // 3. Productivity Trends (Current week Mon - Sun)
                $startOfWeek = Carbon::now()->startOfWeek(Carbon::MONDAY);
                $endOfWeek = Carbon::now()->endOfWeek(Carbon::SUNDAY);
                $productivityTrends = $this->getProductivityTrends($user, $startOfWeek, $endOfWeek);

                // 4. Habit Tracker with eager loading for current week
                $habits = $this->getHabitsForWeek($user, $startOfWeek, $endOfWeek);

                // 5. Pending tasks ordered by closest deadline first (top list, excluding past deadlines)
                $todayStr = Carbon::today()->toDateString();
                $upcomingTasks = (clone $tasksQuery)
                    ->where('status', '!=', 'done')
                    ->where(function ($q) use ($todayStr) {
                        $q->whereNull('deadline')
                          ->orWhere('deadline', '')
                          ->orWhere('deadline', '>=', $todayStr);
                    })
                    ->orderByRaw('CASE WHEN deadline IS NULL OR deadline = "" THEN 1 ELSE 0 END, deadline ASC')
                    ->get();

                return [
                    'stats' => [
                        'completedTasks' => $completedTasks,
                        'pendingTasks' => $pendingTasks,
                        'streak' => $streak,
                    ],
                    'productivityTrends' => $productivityTrends,
                    'habits' => $habits,
                    'upcomingTasks' => $upcomingTasks,
                ];
            } catch (\Throwable $e) {
                return [
                    'stats' => [
                        'completedTasks' => 0,
                        'pendingTasks' => 0,
                        'streak' => 0,
                    ],
                    'productivityTrends' => [],
                    'habits' => [],
                    'upcomingTasks' => [],
                ];
            }
        });
    }

    /**
     * Calculate consecutive active days streak.
     */
    protected function calculateStreak(User $user): int
    {
        $completedDates = $user->tasks()
            ->where('status', 'done')
            ->pluck('updated_at')
            ->map(fn($d) => $d ? Carbon::parse($d)->toDateString() : null)
            ->filter()
            ->unique();

        $habitCompletedDates = HabitLog::whereHas('habit', function ($q) use ($user) {
                $q->where('user_id', $user->id);
            })
            ->where('completed', true)
            ->pluck('date')
            ->map(fn($d) => Carbon::parse($d)->toDateString())
            ->unique();

        $allActiveDates = $completedDates->merge($habitCompletedDates)->unique()->flip();

        $streak = 0;
        $checkDate = Carbon::today();

        if (!isset($allActiveDates[$checkDate->toDateString()])) {
            $checkDate = $checkDate->subDay();
        }

        while (isset($allActiveDates[$checkDate->toDateString()])) {
            $streak++;
            $checkDate = $checkDate->subDay();
        }

        return $streak;
    }

    /**
     * Get 7-day productivity trends for the current week.
     */
    protected function getProductivityTrends(User $user, Carbon $startOfWeek, Carbon $endOfWeek): array
    {
        $weekTasks = $user->tasks()
            ->where('status', 'done')
            ->whereBetween('updated_at', [$startOfWeek->copy()->startOfDay(), $endOfWeek->copy()->endOfDay()])
            ->select('updated_at')
            ->get();

        $dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        $trends = [];
        $maxCount = 0;

        for ($i = 0; $i < 7; $i++) {
            $currentDay = $startOfWeek->copy()->addDays($i);
            $dateStr = $currentDay->toDateString();
            $dayName = $dayNames[$i];

            $count = $weekTasks->filter(function ($task) use ($dateStr) {
                return Carbon::parse($task->updated_at)->toDateString() === $dateStr;
            })->count();

            if ($count > $maxCount) {
                $maxCount = $count;
            }

            $trends[] = [
                'day' => $dayName,
                'date' => $dateStr,
                'count' => $count,
            ];
        }

        return array_map(function ($item) use ($maxCount) {
            if ($maxCount === 0) {
                $item['height'] = 8;
            } else {
                $item['height'] = $item['count'] > 0
                    ? max(18, (int) round(($item['count'] / $maxCount) * 100))
                    : 8;
            }
            return $item;
        }, $trends);
    }

    /**
     * Get habits and 7-day completion grid.
     */
    protected function getHabitsForWeek(User $user, Carbon $startOfWeek, Carbon $endOfWeek): array
    {
        $habits = $user->habits()->with(['logs' => function ($query) use ($startOfWeek, $endOfWeek) {
            $query->whereDate('date', '>=', $startOfWeek->toDateString())
                  ->whereDate('date', '<=', $endOfWeek->toDateString());
        }])->get();

        $dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

        return $habits->map(function ($habit) use ($startOfWeek, $dayNames) {
            $days = [];
            for ($i = 0; $i < 7; $i++) {
                $dayDate = $startOfWeek->copy()->addDays($i)->toDateString();
                $log = $habit->logs->first(function ($l) use ($dayDate) {
                    return Carbon::parse($l->date)->toDateString() === $dayDate;
                });

                $days[] = [
                    'date' => $dayDate,
                    'dayName' => $dayNames[$i],
                    'done' => $log ? (bool) $log->completed : false,
                ];
            }

            return [
                'id' => $habit->id,
                'name' => $habit->name,
                'days' => $days,
            ];
        })->toArray();
    }

    /**
     * Toggle habit completion for a specific date.
     */
    public function toggleHabit(Habit $habit, ?string $date): void
    {
        $targetDate = $date ? Carbon::parse($date)->toDateString() : Carbon::today()->toDateString();

        $log = HabitLog::where('habit_id', $habit->id)
            ->whereDate('date', $targetDate)
            ->first();

        if ($log) {
            $log->update(['completed' => !$log->completed]);
        } else {
            HabitLog::create([
                'habit_id' => $habit->id,
                'date' => $targetDate,
                'completed' => true,
            ]);
        }

        Cache::forget("user_{$habit->user_id}_dashboard_data");
    }

    /**
     * Store a new habit for the user.
     */
    public function storeHabit(User $user, string $name): Habit
    {
        Cache::forget("user_{$user->id}_dashboard_data");

        return Habit::create([
            'user_id' => $user->id,
            'name' => $name,
        ]);
    }

    /**
     * Delete a habit and its associated logs.
     */
    public function destroyHabit(Habit $habit): void
    {
        Cache::forget("user_{$habit->user_id}_dashboard_data");

        $habit->logs()->delete();
        $habit->delete();
    }
}

