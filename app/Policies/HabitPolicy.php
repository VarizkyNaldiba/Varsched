<?php

namespace App\Policies;

use App\Models\Habit;
use App\Models\User;

class HabitPolicy
{
    /**
     * Determine whether the user can view the habit.
     */
    public function view(User $user, Habit $habit): bool
    {
        return $user->role === 'admin' || $habit->user_id === $user->id;
    }

    /**
     * Determine whether the user can update/toggle the habit.
     */
    public function update(User $user, Habit $habit): bool
    {
        return $user->role === 'admin' || $habit->user_id === $user->id;
    }

    /**
     * Determine whether the user can delete the habit.
     */
    public function delete(User $user, Habit $habit): bool
    {
        return $user->role === 'admin' || $habit->user_id === $user->id;
    }
}
