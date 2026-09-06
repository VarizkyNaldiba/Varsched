<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class TaskDigestNotification extends Notification
{
    use Queueable;

    /**
     * @param Collection $tasks
     */
    public function __construct(public Collection $tasks)
    {
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $mail = (new MailMessage)
            ->subject('[Varsched] Pengingat Jadwal Tugas Anda')
            ->greeting('Halo, ' . $notifiable->name . '!')
            ->line('Berikut adalah ringkasan daftar tugas aktif Anda yang terhubung dengan email ' . $notifiable->email . ':');

        if ($this->tasks->isEmpty()) {
            $mail->line('🎉 Hebat! Anda tidak memiliki tugas pending saat ini.');
        } else {
            $count = $this->tasks->count();
            $mail->line("Anda memiliki **{$count} tugas** yang perlu diselesaikan:");

            foreach ($this->tasks->take(7) as $task) {
                $deadline = $task->deadline ? " (Deadline: {$task->deadline})" : '';
                $mail->line("• **{$task->title}** [{$task->category}]{$deadline}");
            }

            if ($count > 7) {
                $remaining = $count - 7;
                $mail->line("...dan {$remaining} tugas lainnya.");
            }
        }

        return $mail
            ->action('Buka Kalender & Jadwal', url('/calendar'))
            ->line('Pesan ini dikirim secara otomatis ke email terdaftar Anda: ' . $notifiable->email)
            ->salutation('Semangat beraktivitas, Tim Varsched');
    }
}
