import { Task } from '@/types/task';
import { X, Clock, Sparkles } from 'lucide-react';

interface SchedulePanelProps {
    selectedDate: Date;
    tasks: Task[];
    onClose: () => void;
}

export default function SchedulePanel({
    selectedDate,
    tasks,
    onClose,
}: SchedulePanelProps) {
    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high':
                return 'bg-coral-light/20 text-coral-dark border-coral';
            case 'medium':
                return 'bg-accent-light/30 text-accent-dark border-accent-dark';
            case 'low':
                return 'bg-primary-bg text-primary-dark border-primary-light';
            default:
                return 'bg-gray-100 dark:bg-gray-800 text-gray-700 border-gray-500';
        }
    };

    const allDayTasks = tasks.filter((t) => !t.start_time);
    const timedTasks = tasks.filter((t) => t.start_time);

    const hours = Array.from({ length: 24 }, (_, i) => {
        const hourStr = String(i).padStart(2, '0');
        return `${hourStr}:00`;
    }).filter((hour) => {
        const hourPrefix = hour.substring(0, 2);
        return timedTasks.some((t) => t.start_time?.startsWith(hourPrefix));
    });

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            <div
                className="absolute inset-0 bg-primary-dark/20 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            <div className="relative w-full max-w-md bg-white dark:bg-gray-800 h-full shadow-2xl flex flex-col z-10 animate-slide-in-right border-l-[3px] border-primary-light/50">
                {/* Panel Header */}
                <div className="p-8 border-b-[3px] border-dashed border-primary/20 flex justify-between items-center bg-cream/50 dark:bg-gray-800/50">
                    <div>
                        <span className="text-xs font-black tracking-widest text-primary uppercase">
                            Daily Schedule
                        </span>
                        <h3 className="text-2xl font-extrabold text-primary-dark dark:text-gray-100">
                            {selectedDate.toLocaleDateString('en-US', { weekday: 'long' })}
                        </h3>
                        <p className="text-primary font-bold">
                            {selectedDate.toLocaleDateString('en-US', {
                                month: 'long',
                                day: 'numeric',
                            })}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-3 bg-gray-100 hover:bg-coral hover:text-white dark:bg-gray-700 rounded-full transition-colors bounce-scale text-gray-500 relative z-10 cursor-pointer"
                    >
                        <X size={24} strokeWidth={3} />
                    </button>
                </div>

                {/* Schedule Content */}
                <div className="flex-1 overflow-y-auto p-8 space-y-8 relative custom-scrollbar bg-surface-base dark:bg-gray-900">
                    {/* All Day Tasks */}
                    {allDayTasks.length > 0 && (
                        <div className="mb-8 bg-white dark:bg-gray-800 p-5 rounded-[24px] shadow-sm border-2 border-primary/10">
                            <h4 className="text-sm font-extrabold uppercase tracking-widest text-primary mb-4 flex items-center gap-2">
                                <Sparkles size={16} /> All Day
                            </h4>
                            <div className="flex flex-col gap-3">
                                {allDayTasks.map((task) => (
                                    <div
                                        key={task.id}
                                        className={`p-4 rounded-xl border-l-[6px] shadow-sm bg-white dark:bg-gray-800 ${getPriorityColor(
                                            task.priority
                                        )}`}
                                    >
                                        <div className="font-extrabold">{task.title}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* 24-Hour Timeline */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-[32px] shadow-sm border-2 border-primary/10">
                        <h4 className="text-sm font-extrabold uppercase tracking-widest text-primary mb-6 flex items-center gap-2">
                            <Clock size={16} /> Timeline
                        </h4>
                        {hours.length === 0 ? (
                            <div className="text-center py-8 text-gray-400 dark:text-gray-500 font-medium">
                                No timed tasks scheduled for this day.
                            </div>
                        ) : (
                            <div className="relative border-l-[3px] border-dashed border-primary-light/50 ml-6 space-y-0">
                                {hours.map((hour) => {
                                    const hourPrefix = hour.substring(0, 2);
                                    const tasksInHour = timedTasks.filter((t) =>
                                        t.start_time?.startsWith(hourPrefix)
                                    );

                                    return (
                                        <div
                                            key={hour}
                                            className="relative pl-8 py-5 border-b-[3px] border-dashed border-gray-100 dark:border-gray-800/50 min-h-[90px] group"
                                        >
                                            <div className="absolute -left-[45px] top-5 bg-cream dark:bg-gray-800 px-2 py-1 rounded-md text-xs font-extrabold text-primary/60 group-hover:text-primary group-hover:bg-primary-bg transition-colors border-2 border-transparent group-hover:border-primary-light">
                                                {hour}
                                            </div>
                                            <div className="absolute -left-[9px] top-7 w-4 h-4 rounded-full bg-cream border-[4px] border-primary-light group-hover:bg-accent group-hover:border-accent-dark transition-colors shadow-sm"></div>

                                            {tasksInHour.length > 0 && (
                                                <div className="flex flex-col gap-3 mt-2">
                                                    {tasksInHour.map((task) => (
                                                        <div
                                                            key={task.id}
                                                            className={`p-4 rounded-[16px] border-l-[6px] shadow-sm bg-white dark:bg-gray-900 hover:-translate-y-1 transition-transform ${getPriorityColor(
                                                                task.priority
                                                            )}`}
                                                        >
                                                            <div className="flex justify-between items-start">
                                                                <div className="font-extrabold text-sm">
                                                                    {task.title}
                                                                </div>
                                                                <span className="text-[10px] font-black bg-white/50 dark:bg-black/20 px-2 py-1 rounded-md">
                                                                    {task.start_time?.substring(0, 5)}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

