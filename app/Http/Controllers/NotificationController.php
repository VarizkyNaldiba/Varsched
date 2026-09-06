<?php

namespace App\Http\Controllers;

use App\Notifications\TaskDigestNotification;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    /**
     * Send instant task schedule digest to the user's registered email.
     */
    public function sendReminder(Request $request): RedirectResponse
    {
        $user = $request->user();

        $activeTasks = $user->tasks()
            ->where('status', '!=', 'done')
            ->orderBy('deadline', 'asc')
            ->get();

        $user->notify(new TaskDigestNotification($activeTasks));

        return back()->with('success', 'Notifikasi ringkasan tugas telah berhasil dikirim ke ' . $user->email);
    }
}
