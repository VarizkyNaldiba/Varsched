<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();
        $taskSummary = null;

        if ($user) {
            $tasks = $user->tasks();
            $taskSummary = [
                'all' => (clone $tasks)->count(),
                'pending' => (clone $tasks)->where('status', 'todo')->count(),
                'in_progress' => (clone $tasks)->whereIn('status', ['in-progress', 'in_progress'])->count(),
                'done' => (clone $tasks)->where('status', 'done')->count(),
            ];
        }

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user,
            ],
            'taskSummary' => $taskSummary,
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
        ];
    }
}
