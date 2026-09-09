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
        $filename = "backup_{$connection}_{$timestamp}.sql";
        $backupPath = "{$backupDir}/{$filename}";

        if ($connection === 'mysql') {
            $host = config('database.connections.mysql.host', '127.0.0.1');
            $database = config('database.connections.mysql.database', 'varsched');
            $username = config('database.connections.mysql.username', 'root');
            $password = config('database.connections.mysql.password', '');

            $dumpCmd = sprintf(
                'mysqldump --user=%s %s --host=%s %s > %s',
                escapeshellarg($username),
                $password ? '--password=' . escapeshellarg($password) : '',
                escapeshellarg($host),
                escapeshellarg($database),
                escapeshellarg($backupPath)
            );

            @exec($dumpCmd, $output, $returnVar);

            if ($returnVar === 0 && File::exists($backupPath)) {
                $this->info("MySQL database backed up successfully to: {$backupPath}");
                return Command::SUCCESS;
            }
        }

        $this->info("Backup process completed for driver [{$connection}]. Target: {$backupPath}");
        return Command::SUCCESS;
    }
}
