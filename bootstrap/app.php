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
        $middleware->alias([
            'admin' => \App\Http\Middleware\EnsureUserIsAdmin::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->respond(function (\Symfony\Component\HttpFoundation\Response $response, \Throwable $exception, \Illuminate\Http\Request $request) {
            if (in_array($response->getStatusCode(), [404, 500, 503, 403])) {
                return \Inertia\Inertia::render('Error', ['status' => $response->getStatusCode()])
                    ->toResponse($request)
                    ->setStatusCode($response->getStatusCode());
            }

            return $response;
        });
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
