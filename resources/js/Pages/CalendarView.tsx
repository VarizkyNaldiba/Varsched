import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { ChevronLeft, ChevronRight, X, Clock, Calendar as CalendarIcon, Sparkles } from 'lucide-react';
import { useState } from 'react';

interface Task {
    id: number;
    title: string;
    category: string | null;
    status: 'todo' | 'in-progress' | 'done';
    priority: 'low' | 'medium' | 'high';
    deadline: string | null;
    start_time: string | null;
}

interface Props {
    tasks?: Task[];
}

export default function CalendarView({ tasks = [] }: Props) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Calendar logic
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
    const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

    const formatDateStr = (d: Date) => {
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    };

    const handleDayClick = (day: number) => {
        setSelectedDate(new Date(year, month, day));
    };

    const closeSchedule = () => setSelectedDate(null);

    const getTasksForDate = (dateStr: string) => {
        return tasks.filter(t => t.deadline === dateStr);
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return 'bg-coral-light/20 text-coral-dark border-coral';
            case 'medium': return 'bg-accent-light/30 text-accent-dark border-accent-dark';
            case 'low': return 'bg-primary-bg text-primary-dark border-primary-light';
            default: return 'bg-gray-100 dark:bg-gray-800 text-gray-700 border-gray-500';
        }
    };

    const selectedDateStr = selectedDate ? formatDateStr(selectedDate) : '';
    const dayTasks = selectedDate ? getTasksForDate(selectedDateStr) : [];
    
    const allDayTasks = dayTasks.filter(t => !t.start_time);
    const timedTasks = dayTasks.filter(t => t.start_time);

    const hours = Array.from({ length: 24 }, (_, i) => {
        const hourStr = String(i).padStart(2, '0');
        return `${hourStr}:00`;
    });

    return (
        <AuthenticatedLayout
            header={
                <h2 className="font-extrabold text-4xl tracking-wide text-primary-dark dark:text-gray-100 flex items-center gap-3">
                    <span className="text-4xl">📅</span> Calendar
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
                                <button onClick={prevMonth} className="p-3 bg-cream dark:bg-gray-700 rounded-full hover:bg-accent-light hover:text-accent-dark text-primary-dark dark:text-primary-light transition-all shadow-sm bounce-scale border-[3px] border-primary-bg dark:border-gray-600">
                                    <ChevronLeft size={24} strokeWidth={3} />
                                </button>
                                <button onClick={nextMonth} className="p-3 bg-cream dark:bg-gray-700 rounded-full hover:bg-accent-light hover:text-accent-dark text-primary-dark dark:text-primary-light transition-all shadow-sm bounce-scale border-[3px] border-primary-bg dark:border-gray-600">
                                    <ChevronRight size={24} strokeWidth={3} />
                                </button>
                            </div>
                        </div>

                        {/* Calendar Grid */}
                        <div className="grid grid-cols-7 gap-3">
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                <div key={day} className="text-center font-extrabold text-primary/60 dark:text-gray-500 py-2 uppercase tracking-wider text-sm border-b-[3px] border-dashed border-primary/20">
                                    {day}
                                </div>
                            ))}
                            
                            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                                <div key={`empty-${i}`} className="min-h-[120px] p-2 bg-transparent"></div>
                            ))}

                            {Array.from({ length: daysInMonth }).map((_, i) => {
                                const day = i + 1;
                                const dateStr = formatDateStr(new Date(year, month, day));
                                const tasksOnDay = getTasksForDate(dateStr);
                                const isToday = dateStr === formatDateStr(new Date());

                                return (
                                    <div 
                                        key={day} 
                                        onClick={() => handleDayClick(day)}
                                        className={`min-h-[140px] p-3 border-[3px] rounded-[24px] flex flex-col gap-2 transition-all cursor-pointer bounce-scale
                                            ${isToday ? 'bg-primary-bg dark:bg-primary-dark/20 border-primary-light shadow-teal-glow' : 'bg-surface-base dark:bg-gray-900/50 border-white hover:border-primary-light dark:border-gray-800'}`}
                                    >
                                        <div className="flex justify-between items-start mb-1">
                                            <span className={`font-extrabold w-8 h-8 flex items-center justify-center rounded-full text-lg ${isToday ? 'bg-primary text-white shadow-md' : 'text-primary-dark dark:text-primary-light'}`}>
                                                {day}
                                            </span>
                                            {tasksOnDay.length > 0 && (
                                                <span className="text-[11px] font-bold bg-accent text-primary-dark px-2 py-1 rounded-full shadow-accent-glow">
                                                    {tasksOnDay.length}
                                                </span>
                                            )}
                                        </div>
                                        
                                        <div className="flex flex-col gap-1.5 overflow-y-auto max-h-[85px] custom-scrollbar">
                                            {tasksOnDay.map(task => (
                                                <div 
                                                    key={task.id} 
                                                    className={`text-[11px] px-2 py-1.5 rounded-lg border-l-[4px] truncate font-bold ${getPriorityColor(task.priority)} ${task.status === 'done' ? 'line-through opacity-50' : ''}`}
                                                >
                                                    {task.start_time ? `${task.start_time.substring(0,5)} ` : ''}{task.title}
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

            {/* 24-Hour Schedule Modal */}
            {selectedDate && (
                <div className="fixed inset-0 z-[100] flex justify-end bg-primary-dark/40 dark:bg-black/60 backdrop-blur-md transition-opacity">
                    <div className="w-full max-w-md h-full bg-cream dark:bg-gray-900 shadow-2xl flex flex-col animate-slide-in-right border-l-[6px] border-primary-light">
                        
                        {/* Modal Header */}
                        <div className="px-8 py-6 border-b-[3px] border-dashed border-primary/20 bg-white dark:bg-gray-800 flex justify-between items-center relative overflow-hidden">
                            <div className="absolute -right-4 -bottom-4 opacity-10">
                                <Sparkles size={100} className="text-accent" />
                            </div>
                            <div className="relative z-10">
                                <h3 className="text-2xl font-extrabold text-primary-dark dark:text-gray-100">
                                    {selectedDate.toLocaleDateString('en-US', { weekday: 'long' })}
                                </h3>
                                <p className="text-primary font-bold">{selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</p>
                            </div>
                            <button onClick={closeSchedule} className="p-3 bg-gray-100 hover:bg-coral hover:text-white dark:bg-gray-700 rounded-full transition-colors bounce-scale text-gray-500 relative z-10">
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
                                        {allDayTasks.map(task => (
                                            <div key={task.id} className={`p-4 rounded-xl border-l-[6px] shadow-sm bg-white dark:bg-gray-800 ${getPriorityColor(task.priority)}`}>
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
                                <div className="relative border-l-[3px] border-dashed border-primary-light/50 ml-6 space-y-0">
                                    {hours.map(hour => {
                                        const hourPrefix = hour.substring(0, 2);
                                        const tasksInHour = timedTasks.filter(t => t.start_time?.startsWith(hourPrefix));

                                        return (
                                            <div key={hour} className="relative pl-8 py-5 border-b-[3px] border-dashed border-gray-100 dark:border-gray-800/50 min-h-[90px] group">
                                                {/* Hour Marker */}
                                                <div className="absolute -left-[45px] top-5 bg-cream dark:bg-gray-800 px-2 py-1 rounded-md text-xs font-extrabold text-primary/60 group-hover:text-primary group-hover:bg-primary-bg transition-colors border-2 border-transparent group-hover:border-primary-light">
                                                    {hour}
                                                </div>
                                                {/* Dot on line */}
                                                <div className="absolute -left-[9px] top-7 w-4 h-4 rounded-full bg-cream border-[4px] border-primary-light group-hover:bg-accent group-hover:border-accent-dark transition-colors shadow-sm"></div>
                                                
                                                {/* Tasks for this hour */}
                                                {tasksInHour.length > 0 ? (
                                                    <div className="flex flex-col gap-3 mt-2">
                                                        {tasksInHour.map(task => (
                                                            <div key={task.id} className={`p-4 rounded-[16px] border-l-[6px] shadow-sm bg-white dark:bg-gray-900 hover:-translate-y-1 transition-transform ${getPriorityColor(task.priority)}`}>
                                                                <div className="flex justify-between items-start">
                                                                    <div className="font-extrabold text-sm">{task.title}</div>
                                                                    <span className="text-[10px] font-black bg-white/50 dark:bg-black/20 px-2 py-1 rounded-md">
                                                                        {task.start_time?.substring(0, 5)}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="h-full w-full flex items-center text-transparent group-hover:text-primary/30 text-xs font-bold transition">
                                                        --
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            )}
            
            <style>{`
                .animate-slide-in-right {
                    animation: slideInRight 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
                }
                @keyframes slideInRight {
                    from { transform: translateX(100%); }
                    to { transform: translateX(0); }
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 8px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: #3CC4BD;
                    border-radius: 999px;
                    border: 2px solid #EFF8F7;
                }
            `}</style>
        </AuthenticatedLayout>
    );
}
