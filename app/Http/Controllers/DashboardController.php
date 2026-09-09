<?php

namespace App\Http\Controllers;

use App\Models\Habit;
use App\Services\DashboardService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __construct(
        protected DashboardService $dashboardService
    ) {}

    public function index(Request $request): Response
    {
        $dashboardData = $this->dashboardService->getDashboardData($request->user());

        return Inertia::render('Dashboard/Index', $dashboardData);
    }

    public function storeHabit(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $this->dashboardService->storeHabit($request->user(), $validated['name']);

        return back()->with('success', 'Habit baru berhasil ditambahkan!');
    }

    public function toggleHabit(Request $request, $id): RedirectResponse
    {
        $habit = Habit::where('user_id', $request->user()->id)->where('id', $id)->first();

        if ($habit) {
            $this->dashboardService->toggleHabit($habit, $request->input('date'));
        }

        return back()->with('success', 'Status habit berhasil diperbarui!');
    }

    public function destroyHabit(Request $request, $id): RedirectResponse
    {
        $habit = Habit::where('user_id', $request->user()->id)->where('id', $id)->first();

        if ($habit) {
            $this->dashboardService->destroyHabit($habit);
        }

        return back()->with('success', 'Habit berhasil dihapus!');
    }
}
