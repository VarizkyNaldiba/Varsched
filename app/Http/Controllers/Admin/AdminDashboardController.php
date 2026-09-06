<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Habit;
use App\Models\Task;
use App\Models\User;
use Carbon\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class AdminDashboardController extends Controller
{
    public function index(): Response
    {
        $totalUsers = User::count();
        $adminUsers = User::where('role', 'admin')->count();
        $regularUsers = User::where('role', '!=', 'admin')->count();

        $totalTasks = Task::count();
        $completedTasks = Task::where('status', 'done')->count();
        $inProgressTasks = Task::where('status', 'in-progress')->count();
        $todoTasks = Task::where('status', 'todo')->count();

        $totalHabits = Habit::count();
        $activeUsers24h = User::where('last_login_at', '>=', Carbon::now()->subDay())->count();

        $recentActivities = ActivityLog::latest()->take(8)->get();
        $recentUsers = User::withCount(['tasks', 'habits'])->latest()->take(5)->get();

        return Inertia::render('Admin/Dashboard/Index', [
            'stats' => [
                'totalUsers' => $totalUsers,
                'adminUsers' => $adminUsers,
                'regularUsers' => $regularUsers,
                'totalTasks' => $totalTasks,
                'completedTasks' => $completedTasks,
                'inProgressTasks' => $inProgressTasks,
                'todoTasks' => $todoTasks,
                'totalHabits' => $totalHabits,
                'activeUsers24h' => $activeUsers24h,
            ],
            'recentActivities' => $recentActivities,
            'recentUsers' => $recentUsers,
        ]);
    }
}
