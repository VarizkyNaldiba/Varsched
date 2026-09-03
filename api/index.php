<?php

// Prepare writable storage directory in /tmp for Vercel serverless environment
$storageDirs = [
    '/tmp/storage/framework/views',
    '/tmp/storage/framework/sessions',
    '/tmp/storage/framework/cache/data',
    '/tmp/storage/logs',
    '/tmp/storage/app/public',
];

foreach ($storageDirs as $dir) {
    if (!is_dir($dir)) {
        mkdir($dir, 0755, true);
    }
}

putenv('LARAVEL_STORAGE_PATH=/tmp/storage');
$_ENV['LARAVEL_STORAGE_PATH'] = '/tmp/storage';
$_SERVER['LARAVEL_STORAGE_PATH'] = '/tmp/storage';

putenv('VIEW_COMPILED_PATH=/tmp/storage/framework/views');
$_ENV['VIEW_COMPILED_PATH'] = '/tmp/storage/framework/views';
$_SERVER['VIEW_COMPILED_PATH'] = '/tmp/storage/framework/views';

// Support SQLite fallback if DB_CONNECTION is sqlite and no external DB configured
$dbConnection = getenv('DB_CONNECTION') ?: ($_ENV['DB_CONNECTION'] ?? 'sqlite');
if ($dbConnection === 'sqlite') {
    $dbFile = '/tmp/database.sqlite';
    if (!file_exists($dbFile)) {
        $sourceDb = __DIR__ . '/../database/database.sqlite';
        if (file_exists($sourceDb)) {
            copy($sourceDb, $dbFile);
        } else {
            touch($dbFile);
        }
    }
    putenv("DB_DATABASE={$dbFile}");
    $_ENV['DB_DATABASE'] = $dbFile;
    $_SERVER['DB_DATABASE'] = $dbFile;
}

// Forward to Laravel's public entrypoint
require __DIR__ . '/../public/index.php';

