<?php

use App\Http\Controllers\Admin\AdminActivityController;
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\AdminMigrationController;
use App\Http\Controllers\Admin\AdminUserController;
use App\Http\Controllers\CalendarController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\PomodoroController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TaskController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return auth()->check() ? redirect()->route('dashboard') : redirect()->route('login');
});

Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard & Habits
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::post('/habits', [DashboardController::class, 'storeHabit'])->name('habits.store');
    Route::post('/habits/{habit}/toggle', [DashboardController::class, 'toggleHabit'])->name('habits.toggle');
    Route::delete('/habits/{habit}', [DashboardController::class, 'destroyHabit'])->name('habits.destroy');

    // Tasks
    Route::get('/tasks', [TaskController::class, 'index'])->name('tasks.index');
    Route::post('/tasks', [TaskController::class, 'store'])->name('tasks.store');
    Route::patch('/tasks/{task}', [TaskController::class, 'update'])->name('tasks.update');
    Route::delete('/tasks/{task}', [TaskController::class, 'destroy'])->name('tasks.destroy');

    // Calendar
    Route::get('/calendar', [CalendarController::class, 'index'])->name('calendar');

    // Pomodoro Timer
    Route::get('/pomodoro', [PomodoroController::class, 'index'])->name('pomodoro');

    // Notifications
    Route::post('/notifications/send-reminder', [NotificationController::class, 'sendReminder'])->name('notifications.send-reminder');
});

// Admin Panel Routes
Route::middleware(['auth', 'verified', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');

    // Users Management
    Route::get('/users', [AdminUserController::class, 'index'])->name('users.index');
    Route::post('/users', [AdminUserController::class, 'store'])->name('users.store');
    Route::patch('/users/{user}', [AdminUserController::class, 'update'])->name('users.update');
    Route::post('/users/{user}/toggle-role', [AdminUserController::class, 'toggleRole'])->name('users.toggle-role');
    Route::delete('/users/{user}', [AdminUserController::class, 'destroy'])->name('users.destroy');

    // Data Migration
    Route::get('/migrations', [AdminMigrationController::class, 'index'])->name('migrations.index');
    Route::post('/migrations', [AdminMigrationController::class, 'migrate'])->name('migrations.migrate');

    // Activity History
    Route::get('/activity', [AdminActivityController::class, 'index'])->name('activity.index');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';

// Fallback Route for 404 Page Not Found
Route::fallback(function () {
    return Inertia::render('Error', ['status' => 404]);
});

