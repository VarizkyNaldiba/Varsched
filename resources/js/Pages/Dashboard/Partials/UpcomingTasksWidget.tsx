import { Task } from '@/types/task';
import { Link, router } from '@inertiajs/react';
import { Calendar, CheckCircle2, Clock, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';

interface UpcomingTasksWidgetProps {
    tasks: Task[];
    onUpdateStatus?: (task: Task, newStatus: string) => void;
}

export default function UpcomingTasksWidget({ tasks, onUpdateStatus }: UpcomingTasksWidgetProps) {
    const handleToggleDone = (task: Task) => {
        const newStatus = task.status === 'done' ? 'todo' : 'done';
        if (onUpdateStatus) {
            onUpdateStatus(task, newStatus);
        } else {
            router.patch(route('tasks.update', task.id), { status: newStatus }, { preserveScroll: true });
        }
    };

    const getTodayString = () => {
        const now = new Date();
        const yyyy = now.getFullYear();
        const mm = String(now.getMonth() + 1).padStart(2, '0');
        const dd = String(now.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    };

    const getTomorrowString = () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const yyyy = tomorrow.getFullYear();
        const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
        const dd = String(tomorrow.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    };

    const todayStr = getTodayString();
    const tomorrowStr = getTomorrowString();

    const formatDeadlineBadge = (deadline: string | null) => {
        if (!deadline) {
            return (
                <span className="text-[11px] font-medium text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-md">
                    Tanpa Tenggat
                </span>
            );
        }

        if (deadline === todayStr) {
            return (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600 bg-rose-50 dark:bg-rose-950/50 dark:text-rose-400 border border-rose-200 dark:border-rose-900 px-2 py-0.5 rounded-md animate-pulse">
                    <AlertCircle size={12} /> Hari Ini
                </span>
            );
        }

        if (deadline === tomorrowStr) {
            return (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/50 dark:text-amber-400 border border-amber-200 dark:border-amber-900 px-2 py-0.5 rounded-md">
                    <Clock size={12} /> Besok
                </span>
            );
        }

        const isPast = deadline < todayStr;
        return (
            <span
                className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md border ${
                    isPast
                        ? 'text-red-700 bg-red-100 dark:bg-red-950/60 dark:text-red-300 border-red-300'
                        : 'text-indigo-600 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200/60 dark:border-indigo-800/40'
                }`}
            >
                <Calendar size={12} /> {deadline}
            </span>
        );
    };

    const getPriorityBadge = (priority: string) => {
        switch (priority) {
            case 'high':
                return (
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-coral/15 text-coral dark:text-coral-light">
                        Tinggi
                    </span>
                );
            case 'medium':
                return (
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300">
                        Sedang
                    </span>
                );
            case 'low':
                return (
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">
                        Rendah
                    </span>
                );
            default:
                return null;
        }
    };

    // Filter tasks: exclude tasks with a past deadline (deadline < todayStr)
    const validTasks = tasks.filter((task) => {
        if (!task.deadline) return true;
        return task.deadline >= todayStr;
    });

    // Sort remaining tasks: pending tasks first (closest deadline first, null deadlines last), completed tasks at very bottom
    const sortedTasks = [...validTasks].sort((a, b) => {
        if (a.status === 'done' && b.status !== 'done') return 1;
        if (a.status !== 'done' && b.status === 'done') return -1;
        if (!a.deadline && !b.deadline) return 0;
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        return a.deadline.localeCompare(b.deadline);
    });

    return (
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md overflow-hidden shadow-sm sm:rounded-lg border border-gray-100 dark:border-gray-700 p-6 flex flex-col justify-between">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                        <Clock size={20} className="text-coral" />
                        Tugas Berdasarkan Deadline
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        Tenggat waktu terdekat ditampilkan di paling atas
                    </p>
                </div>
                <Link
                    href={route('tasks.index')}
                    className="inline-flex items-center gap-1 text-xs font-extrabold text-primary hover:text-primary-dark dark:hover:text-primary-light transition group"
                >
                    <span>Kelola Tugas</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>

            {sortedTasks.length === 0 ? (
                <div className="text-center py-10 px-4 rounded-2xl bg-gray-50/50 dark:bg-gray-900/30 border border-dashed border-gray-200 dark:border-gray-700">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                        <Sparkles size={24} />
                    </div>
                    <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200">Tidak ada tugas aktif!</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-xs mx-auto">
                        Semua tugas Anda telah selesai atau belum dibuat. Silakan tambahkan tugas baru.
                    </p>
                    <Link
                        href={route('tasks.index')}
                        className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-primary hover:bg-primary-dark text-white text-xs font-bold rounded-xl transition shadow-sm"
                    >
                        Buat Tugas Baru
                    </Link>
                </div>
            ) : (
                <div className="space-y-3 max-h-[380px] overflow-y-auto custom-scrollbar pr-1">
                    {sortedTasks.map((task) => {
                        const isDone = task.status === 'done';
                        return (
                            <div
                                key={task.id}
                                className={`group flex items-start justify-between gap-3 p-3.5 rounded-2xl border transition-all duration-200 ${
                                    isDone
                                        ? 'bg-gray-50/40 dark:bg-gray-900/20 border-gray-200/50 dark:border-gray-800 opacity-60'
                                        : task.deadline === todayStr
                                        ? 'bg-rose-50/40 dark:bg-rose-950/20 border-rose-200/80 dark:border-rose-900/50 shadow-xs hover:border-rose-400'
                                        : 'bg-white/80 dark:bg-gray-900/40 border-gray-100 dark:border-gray-700/70 hover:border-primary-light hover:shadow-sm'
                                }`}
                            >
                                <div className="flex items-start gap-3 min-w-0">
                                    <button
                                        type="button"
                                        onClick={() => handleToggleDone(task)}
                                        className={`mt-0.5 w-5 h-5 rounded-lg border flex items-center justify-center transition cursor-pointer shrink-0 ${
                                            isDone
                                                ? 'bg-emerald-500 border-emerald-500 text-white'
                                                : 'border-gray-300 dark:border-gray-600 hover:border-primary text-transparent'
                                        }`}
                                        title={isDone ? 'Tandai Belum Selesai' : 'Tandai Selesai'}
                                    >
                                        <CheckCircle2 size={14} strokeWidth={3} className={isDone ? 'block' : 'hidden'} />
                                    </button>

                                    <div className="min-w-0 space-y-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <p
                                                className={`text-sm font-extrabold truncate ${
                                                    isDone
                                                        ? 'line-through text-gray-400 dark:text-gray-500'
                                                        : 'text-gray-900 dark:text-gray-100'
                                                }`}
                                            >
                                                {task.title}
                                            </p>
                                            {task.category && (
                                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary-bg dark:bg-primary-dark/30 text-primary-dark dark:text-primary-light">
                                                    {task.category}
                                                </span>
                                            )}
                                        </div>

                                        {task.description && (
                                            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                                                {task.description}
                                            </p>
                                        )}

                                        <div className="flex flex-wrap items-center gap-2 pt-0.5">
                                            {formatDeadlineBadge(task.deadline)}
                                            {getPriorityBadge(task.priority)}
                                            {task.start_time && (
                                                <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                                    <Clock size={11} /> {task.start_time.substring(0, 5)}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
