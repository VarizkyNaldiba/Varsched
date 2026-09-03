import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function CalendarView() {
    const daysInMonth = Array.from({ length: 30 }, (_, i) => i + 1);
    const startOffset = 3;

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Calendar</h2>}
        >
            <Head title="Calendar" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md overflow-hidden shadow-sm sm:rounded-lg border border-gray-100 dark:border-gray-700 p-6">
                        
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">September 2026</h3>
                            <div className="flex gap-2">
                                <button className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300">
                                    <ChevronLeft size={20} />
                                </button>
                                <button className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300">
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-7 gap-2">
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                <div key={day} className="text-center font-semibold text-gray-500 dark:text-gray-400 py-2">
                                    {day}
                                </div>
                            ))}
                            
                            {Array.from({ length: startOffset }).map((_, i) => (
                                <div key={`empty-${i}`} className="min-h-[100px] p-2 bg-transparent"></div>
                            ))}

                            {daysInMonth.map(day => (
                                <div key={day} className={`min-h-[100px] p-2 border rounded-lg flex flex-col gap-1 transition cursor-pointer hover:border-indigo-500 bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700 ${day === 3 ? 'border-2 border-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/20' : ''}`}>
                                    <span className="font-medium text-gray-700 dark:text-gray-300 self-end mb-1">{day}</span>
                                    {day === 5 && (
                                        <div className="text-xs px-2 py-1 rounded bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 border-l-2 border-rose-500 truncate">
                                            Design UI mockup
                                        </div>
                                    )}
                                    {day === 10 && (
                                        <div className="text-xs px-2 py-1 rounded bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border-l-2 border-amber-500 truncate">
                                            Frontend Logic
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
