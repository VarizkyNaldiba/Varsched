import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import SchedulePanel from './Partials/SchedulePanel';
import { Task } from '@/types/task';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { useState } from 'react';

interface Props {
    tasks?: Task[];
}

export default function CalendarIndex({ tasks = [] }: Props) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
    const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

    const formatDateStr = (d: Date) => {
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    };

    const getTasksForDate = (dateStr: string) => {
        return tasks.filter((t) => t.deadline === dateStr);
    };

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

    const selectedDateStr = selectedDate ? formatDateStr(selectedDate) : '';
    const dayTasks = selectedDate ? getTasksForDate(selectedDateStr) : [];

    return (
        <AuthenticatedLayout
            header={
                <h2 className="font-extrabold text-4xl tracking-wide text-primary-dark dark:text-gray-100 flex items-center gap-3">
                    <span className="p-2 rounded-2xl bg-primary-bg dark:bg-primary-dark/30 text-primary">
                        <CalendarIcon size={28} strokeWidth={2.5} />
                    </span>
                    <span>Calendar</span>
                </h2>
            }
        >
            <Head title="Calendar" />

            <div className="py-8 pb-20 relative">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 rounded-[32px] shadow-card border-[3px] border-primary/20 dark:border-gray-700 p-8">
                        {/* Header */}
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-3xl font-extrabold text-primary-dark dark:text-primary-light flex items-center gap-3">
                                {monthNames[month]} {year}
                            </h3>
                            <div className="flex gap-3">
                                <button
                                    onClick={prevMonth}
                                    className="p-3 bg-cream dark:bg-gray-700 rounded-full hover:bg-accent-light hover:text-accent-dark text-primary-dark dark:text-primary-light transition-all shadow-sm bounce-scale border-[3px] border-primary-bg dark:border-gray-600 cursor-pointer"
                                >
                                    <ChevronLeft size={24} strokeWidth={3} />
                                </button>
                                <button
                                    onClick={nextMonth}
                                    className="p-3 bg-cream dark:bg-gray-700 rounded-full hover:bg-accent-light hover:text-accent-dark text-primary-dark dark:text-primary-light transition-all shadow-sm bounce-scale border-[3px] border-primary-bg dark:border-gray-600 cursor-pointer"
                                >
                                    <ChevronRight size={24} strokeWidth={3} />
                                </button>
                            </div>
                        </div>

                        {/* Calendar Grid */}
                        <div className="grid grid-cols-7 gap-3">
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                                <div
                                    key={day}
                                    className="text-center font-extrabold text-primary/60 dark:text-gray-500 py-2 uppercase tracking-wider text-sm border-b-[3px] border-dashed border-primary/20"
                                >
                                    {day}
                                </div>
                            ))}

                            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                                <div key={`empty-${i}`} className="min-h-[120px] p-2 bg-transparent" />
                            ))}

                            {Array.from({ length: daysInMonth }).map((_, i) => {
                                const day = i + 1;
                                const dateStr = formatDateStr(new Date(year, month, day));
                                const tasksOnDay = getTasksForDate(dateStr);
                                const isToday = dateStr === formatDateStr(new Date());

                                return (
                                    <div
                                        key={day}
                                        onClick={() => setSelectedDate(new Date(year, month, day))}
                                        className={`min-h-[140px] p-3 border-[3px] rounded-[24px] flex flex-col gap-2 transition-all cursor-pointer bounce-scale
                                            ${
                                                isToday
                                                    ? 'bg-primary-bg dark:bg-primary-dark/20 border-primary-light shadow-teal-glow'
                                                    : 'bg-surface-base dark:bg-gray-900/50 border-white hover:border-primary-light dark:border-gray-800'
                                            }`}
                                    >
                                        <div className="flex justify-between items-start mb-1">
                                            <span
                                                className={`font-extrabold w-8 h-8 flex items-center justify-center rounded-full text-lg ${
                                                    isToday
                                                        ? 'bg-primary text-white shadow-md'
                                                        : 'text-primary-dark dark:text-primary-light'
                                                }`}
                                            >
                                                {day}
                                            </span>
                                            {tasksOnDay.length > 0 && (
                                                <span className="text-[11px] font-bold bg-accent text-primary-dark px-2 py-1 rounded-full shadow-accent-glow">
                                                    {tasksOnDay.length}
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex flex-col gap-1.5 overflow-y-auto max-h-[85px] custom-scrollbar">
                                            {tasksOnDay.map((task) => (
                                                <div
                                                    key={task.id}
                                                    className={`text-[11px] px-2 py-1.5 rounded-lg border-l-[4px] truncate font-bold ${getPriorityColor(
                                                        task.priority
                                                    )} ${task.status === 'done' ? 'line-through opacity-50' : ''}`}
                                                >
                                                    {task.start_time ? `${task.start_time.substring(0, 5)} ` : ''}
                                                    {task.title}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Schedule Panel Slide-over */}
            {selectedDate && (
                <SchedulePanel
                    selectedDate={selectedDate}
                    tasks={dayTasks}
                    onClose={() => setSelectedDate(null)}
                />
            )}
        </AuthenticatedLayout>
    );
}

