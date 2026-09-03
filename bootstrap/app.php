<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

$app = Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->trustProxies(at: '*');
        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();

if ($storagePath = ($_ENV['LARAVEL_STORAGE_PATH'] ?? $_SERVER['LARAVEL_STORAGE_PATH'] ?? null)) {
    $app->useStoragePath($storagePath);
}

// Fallback safeguard: ensure critical drivers are never empty strings
$app->booting(function () use ($app) {
    $config = $app['config'];
    if (empty($config->get('session.driver'))) {
        $config->set('session.driver', 'cookie');
    }
    if (empty($config->get('cache.default'))) {
        $config->set('cache.default', 'array');
    }
    if (empty($config->get('queue.default'))) {
        $config->set('queue.default', 'sync');
    }
    if (empty($config->get('filesystems.default'))) {
        $config->set('filesystems.default', 'local');
    }
    if (empty($config->get('app.maintenance.driver'))) {
        $config->set('app.maintenance.driver', 'file');
    }
});

return $app;
