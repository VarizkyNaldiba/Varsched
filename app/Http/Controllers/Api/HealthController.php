<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class HealthController extends Controller
{
    public function check(): JsonResponse
    {
        $dbStatus = 'healthy';
        try {
            DB::connection()->getPdo();
        } catch (\Throwable $e) {
            $dbStatus = 'unhealthy: ' . $e->getMessage();
        }

        $freeDisk = disk_free_space(base_path());
        $totalDisk = disk_total_space(base_path());

        return ApiResponse::success([
            'app_name' => config('app.name'),
            'environment' => config('app.env'),
            'database' => $dbStatus,
            'disk_usage' => [
                'free_gb' => round($freeDisk / 1024 / 1024 / 1024, 2),
                'total_gb' => round($totalDisk / 1024 / 1024 / 1024, 2),
            ],
            'timestamp' => now()->toIso8601String(),
        ], 'System is fully operational');
    }
}
