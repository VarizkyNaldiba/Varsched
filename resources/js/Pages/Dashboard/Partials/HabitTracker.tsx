import { Habit } from '../types';
import { router } from '@inertiajs/react';
import { Activity } from 'lucide-react';

interface HabitTrackerProps {
    habits: Habit[];
}

export default function HabitTracker({ habits }: HabitTrackerProps) {
    const toggleHabitDay = (habitId: number, date: string) => {
        router.post(
            route('habits.toggle', habitId),
            { date },
            { preserveScroll: true }
        );
    };

    return (
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md overflow-hidden shadow-sm sm:rounded-lg border border-gray-100 dark:border-gray-700 p-6 flex flex-col justify-between">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                        <Activity size={20} className="text-emerald-600 dark:text-emerald-400" />
                        Habit Tracker
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        Track your daily consistency
                    </p>
                </div>
                <span className="text-xs text-gray-400 dark:text-gray-500">
                    Click square to toggle
                </span>
            </div>

            <div className="space-y-4">
                {habits.length === 0 ? (
                    <div className="text-center py-8 text-gray-400 dark:text-gray-500 text-sm">
                        No habits tracked yet.
                    </div>
                ) : (
                    habits.map((habit) => (
                        <div
                            key={habit.id}
                            className="flex items-center justify-between gap-4 p-3 rounded-xl bg-gray-50/60 dark:bg-gray-700/30 border border-gray-100 dark:border-gray-700/50"
                        >
                            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 truncate max-w-[140px]">
                                {habit.name}
                            </span>
                            <div className="flex items-center gap-2">
                                {habit.days.map((day) => (
                                    <div
                                        key={day.date}
                                        className="flex flex-col items-center gap-1 group relative"
                                    >
                                        <div className="absolute -top-7 scale-0 group-hover:scale-100 transition-all duration-150 bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 text-[10px] font-bold py-0.5 px-2 rounded shadow-md pointer-events-none whitespace-nowrap z-20">
                                            {day.dayName}: {day.done ? 'Completed' : 'Missed'}
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => toggleHabitDay(habit.id, day.date)}
                                            className={`w-7 h-7 rounded-lg transition-all duration-200 cursor-pointer flex items-center justify-center ${
                                                day.done
                                                    ? 'bg-emerald-500 text-white shadow-xs shadow-emerald-500/30 hover:bg-emerald-600 scale-100'
                                                    : 'bg-gray-200 dark:bg-gray-600/70 hover:bg-gray-300 dark:hover:bg-gray-500 text-transparent'
                                            }`}
                                            title={`${habit.name} on ${day.dayName}: ${
                                                day.done ? 'Done' : 'Not done'
                                            }`}
                                        >
                                            {day.done && <span className="text-xs font-bold">✓</span>}
                                        </button>
                                        <span className="text-[10px] font-medium text-gray-400 dark:text-gray-500">
                                            {day.dayName.charAt(0)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

