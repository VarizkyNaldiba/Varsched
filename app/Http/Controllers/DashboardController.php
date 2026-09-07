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

        return back();
    }

    public function toggleHabit(Request $request, Habit $habit): RedirectResponse
    {
        if ($habit->user_id !== $request->user()->id) {
            abort(403);
        }

        $this->dashboardService->toggleHabit($habit, $request->input('date'));

        return back();
    }

    public function destroyHabit(Request $request, Habit $habit): RedirectResponse
    {
        if ($habit->user_id !== $request->user()->id) {
            abort(403);
        }

        $this->dashboardService->destroyHabit($habit);

        return back();
    }
}
