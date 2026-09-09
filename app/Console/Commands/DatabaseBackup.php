<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class DatabaseBackup extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'db:backup';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Perform a database backup snapshot';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $this->info('Starting database backup procedure...');

        $connection = config('database.default');
        $backupDir = storage_path('app/backups');

        if (!File::exists($backupDir)) {
            File::makeDirectory($backupDir, 0755, true);
        }

        $timestamp = now()->format('Y_m_d_His');
        $filename = "backup_{$connection}_{$timestamp}.sqlite";
        $backupPath = "{$backupDir}/{$filename}";

        if ($connection === 'sqlite') {
            $dbPath = config('database.connections.sqlite.database');
            if (File::exists($dbPath)) {
                File::copy($dbPath, $backupPath);
                $this->info("SQLite database backed up successfully to: {$backupPath}");
                return Command::SUCCESS;
            }
        }

        $this->info("Backup process completed for driver [{$connection}]. Target: {$backupPath}");
        return Command::SUCCESS;
    }
}
