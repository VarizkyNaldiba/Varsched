<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminActivityController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->input('search');
        $action = $request->input('action');

        $activities = ActivityLog::when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('user_name', 'like', "%{$search}%")
                      ->orWhere('user_email', 'like', "%{$search}%")
                      ->orWhere('description', 'like', "%{$search}%");
                });
            })
            ->when($action, function ($query, $action) {
                $query->where('action', $action);
            })
            ->latest('id')
            ->paginate(20)
            ->withQueryString();

        $availableActions = ActivityLog::distinct()->pluck('action')->filter()->values();

        return Inertia::render('Admin/Activity/Index', [
            'activities' => $activities,
            'availableActions' => $availableActions,
            'filters' => [
                'search' => $search,
                'action' => $action,
            ],
        ]);
    }
}
