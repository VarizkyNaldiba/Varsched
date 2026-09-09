<?php

use App\Http\Controllers\Api\HealthController;
use App\Http\Responses\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

Route::prefix('v1')->group(function () {
    // Health Check Endpoint (Rate limited)
    Route::get('/health', [HealthController::class, 'check'])->middleware('throttle:60,1');

    // Authenticated API Endpoints
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/user', function (Request $request) {
            return ApiResponse::success($request->user());
        });

        Route::get('/tasks', function (Request $request) {
            $tasks = $request->user()->tasks()->latest()->get();
            return ApiResponse::success($tasks, 'Tasks retrieved successfully');
        });
    });
});
