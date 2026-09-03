<?php

// Enable error reporting for debugging
ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
error_reporting(E_ALL);

// Prepare writable storage directories in /tmp for Vercel serverless environment
$writableDirs = [
    '/tmp/storage/framework/views',
    '/tmp/storage/framework/sessions',
    '/tmp/storage/framework/cache/data',
    '/tmp/storage/logs',
    '/tmp/storage/app/public',
    '/tmp/bootstrap/cache',
];

foreach ($writableDirs as $dir) {
    if (!is_dir($dir)) {
        @mkdir($dir, 0755, true);
    }
}

// Redirect storage and bootstrap cache paths
putenv('LARAVEL_STORAGE_PATH=/tmp/storage');
$_ENV['LARAVEL_STORAGE_PATH'] = '/tmp/storage';
$_SERVER['LARAVEL_STORAGE_PATH'] = '/tmp/storage';

putenv('VIEW_COMPILED_PATH=/tmp/storage/framework/views');
$_ENV['VIEW_COMPILED_PATH'] = '/tmp/storage/framework/views';
$_SERVER['VIEW_COMPILED_PATH'] = '/tmp/storage/framework/views';

putenv('APP_SERVICES_CACHE=/tmp/bootstrap/cache/services.php');
putenv('APP_PACKAGES_CACHE=/tmp/bootstrap/cache/packages.php');
putenv('APP_CONFIG_CACHE=/tmp/bootstrap/cache/config.php');
putenv('APP_ROUTES_CACHE=/tmp/bootstrap/cache/routes.php');
putenv('APP_EVENTS_CACHE=/tmp/bootstrap/cache/events.php');

// Sanitize critical environment variables to prevent empty string driver errors
$criticalEnv = [
    'SESSION_DRIVER' => 'cookie',
    'CACHE_STORE' => 'array',
    'QUEUE_CONNECTION' => 'sync',
    'FILESYSTEM_DISK' => 'local',
    'LOG_CHANNEL' => 'stderr',
    'DB_CONNECTION' => 'sqlite',
    'APP_MAINTENANCE_DRIVER' => 'file',
    'APP_ENV' => 'production',
    'APP_DEBUG' => 'true',
    'APP_KEY' => 'base64:tY3ISpij6qxZcZlbM8Dra3karPqvZQyY+e17ENJ1VHE=',
];

foreach ($criticalEnv as $key => $default) {
    $val = getenv($key);
    if ($val === false || trim((string) $val) === '') {
        $val = $_ENV[$key] ?? '';
    }
    if ($val === false || trim((string) $val) === '') {
        putenv("{$key}={$default}");
        $_ENV[$key] = $default;
        $_SERVER[$key] = $default;
    }
}

// Support SQLite fallback
$dbConnection = getenv('DB_CONNECTION') ?: ($_ENV['DB_CONNECTION'] ?? 'sqlite');
if ($dbConnection === 'sqlite') {
    $dbFile = '/tmp/database.sqlite';
    if (!file_exists($dbFile) || filesize($dbFile) === 0) {
        $sourceDb = __DIR__ . '/../database/database.sqlite';
        if (file_exists($sourceDb) && filesize($sourceDb) > 0) {
            @copy($sourceDb, $dbFile);
        } else {
            @touch($dbFile);
        }
    }
    putenv("DB_DATABASE={$dbFile}");
    $_ENV['DB_DATABASE'] = $dbFile;
    $_SERVER['DB_DATABASE'] = $dbFile;
}

// Forward to Laravel's public entrypoint with exception handling
try {
    require __DIR__ . '/../public/index.php';
} catch (\Throwable $e) {
    http_response_code(500);
    echo '<div style="font-family: sans-serif; padding: 2rem; max-width: 800px; margin: 0 auto;">';
    echo '<h1 style="color: #e11d48;">Application Error</h1>';
    echo '<p style="color: #4b5563; font-size: 1.1rem;"><strong>' . htmlspecialchars($e->getMessage()) . '</strong></p>';
    echo '<p style="color: #6b7280; font-size: 0.875rem;">File: ' . htmlspecialchars($e->getFile()) . ':' . $e->getLine() . '</p>';
    echo '<pre style="background: #f3f4f6; padding: 1rem; border-radius: 8px; overflow: auto; font-size: 0.8rem;">' . htmlspecialchars($e->getTraceAsString()) . '</pre>';
    echo '</div>';
}
