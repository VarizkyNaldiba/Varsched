<?php

namespace App\Notifications;

use App\Models\Task;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class TaskReminderNotification extends Notification
{
    use Queueable;

    public function __construct(public Task $task)
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
        $priorityLabel = strtoupper($this->task->priority ?? 'MEDIUM');
        $deadlineText = $this->task->deadline ?? 'Tidak ditentukan';
        if ($this->task->start_time) {
            $deadlineText .= ' pukul ' . substr($this->task->start_time, 0, 5);
        }

        return (new MailMessage)
            ->subject('[Varsched] Notifikasi Tugas: ' . $this->task->title)
            ->greeting('Halo, ' . $notifiable->name . '!')
            ->line('Tugas baru telah berhasil dijadwalkan dan terhubung ke email Anda.')
            ->line('📌 **Judul Tugas**: ' . $this->task->title)
            ->line('🏷 **Kategori**: ' . ($this->task->category ?? 'General'))
            ->line('⏰ **Deadline / Waktu**: ' . $deadlineText)
            ->line('⚡ **Prioritas**: ' . $priorityLabel)
            ->action('Lihat Jadwal di Varsched', url('/tasks'))
            ->line('Notifikasi otomatis ini dikirim ke email terdaftar: ' . $notifiable->email)
            ->salutation('Salam produktif, Tim Varsched');
    }
}
