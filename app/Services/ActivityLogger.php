<?php

namespace App\Services;

use App\Models\ActivityLog;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ActivityLogger
{
    /**
     * Log a system or user action.
     */
    public static function log(
        string $action,
        string $description,
        ?User $user = null,
        ?Request $request = null
    ): ?ActivityLog {
        try {
            $user = $user ?? Auth::user();
            $request = $request ?? request();

            return ActivityLog::create([
                'user_id' => $user?->id,
                'user_name' => $user?->name ?? 'Guest / System',
                'user_email' => $user?->email,
                'action' => strtoupper($action),
                'description' => $description,
                'ip_address' => $request?->ip(),
                'user_agent' => $request ? substr((string) $request->userAgent(), 0, 255) : null,
            ]);
        } catch (\Throwable $e) {
            \Log::warning('Failed to write activity log: ' . $e->getMessage());
            return null;
        }
    }
}
