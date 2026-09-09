<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('tasks', function (Blueprint $table) {
            $table->index(['user_id', 'status'], 'idx_tasks_user_status');
            $table->index(['user_id', 'deadline'], 'idx_tasks_user_deadline');
            $table->index('created_at', 'idx_tasks_created_at');
        });

        Schema::table('habits', function (Blueprint $table) {
            $table->index('user_id', 'idx_habits_user_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tasks', function (Blueprint $table) {
            $table->dropIndex('idx_tasks_user_status');
            $table->dropIndex('idx_tasks_user_deadline');
            $table->dropIndex('idx_tasks_created_at');
        });

        Schema::table('habits', function (Blueprint $table) {
            $table->dropIndex('idx_habits_user_id');
        });
    }
};
