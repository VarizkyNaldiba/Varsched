import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { BarChart3, Activity, CheckCircle, Flame } from 'lucide-react';

export default function Dashboard() {
    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Dashboard</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 flex flex-col gap-6">
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md overflow-hidden shadow-sm sm:rounded-lg border border-gray-100 dark:border-gray-700 p-6 flex items-center gap-4 hover:-translate-y-1 transition duration-300">
                            <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
                                <CheckCircle size={28} />
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Completed Tasks</h3>
                                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-1">12</p>
                            </div>
                        </div>

                        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md overflow-hidden shadow-sm sm:rounded-lg border border-gray-100 dark:border-gray-700 p-6 flex items-center gap-4 hover:-translate-y-1 transition duration-300">
                            <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
                                <Activity size={28} />
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Pending Tasks</h3>
                                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-1">5</p>
                            </div>
                        </div>

                        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md overflow-hidden shadow-sm sm:rounded-lg border border-gray-100 dark:border-gray-700 p-6 flex items-center gap-4 hover:-translate-y-1 transition duration-300">
                            <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400">
                                <Flame size={28} />
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Current Streak</h3>
                                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-1">7 Days</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 bg-white/70 dark:bg-gray-800/70 backdrop-blur-md overflow-hidden shadow-sm sm:rounded-lg border border-gray-100 dark:border-gray-700 p-6">
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Productivity Trends</h3>
                                <BarChart3 className="text-gray-400" />
                            </div>
                            <div className="h-48 border-b border-gray-200 dark:border-gray-700 flex items-end justify-around pb-2">
                                {[40, 70, 45, 90, 60, 80, 50].map((height, i) => (
                                    <div key={i} className="flex flex-col items-center gap-2 h-full justify-end group">
                                        <div className="w-8 bg-indigo-500 dark:bg-indigo-600 rounded-t-md transition-all group-hover:bg-indigo-400 group-hover:opacity-90" style={{ height: `${height}%` }}></div>
                                        <span className="text-xs text-gray-500 dark:text-gray-400">{['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][i]}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md overflow-hidden shadow-sm sm:rounded-lg border border-gray-100 dark:border-gray-700 p-6">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-6">Habit Tracker</h3>
                            <div className="space-y-6">
                                <div>
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">Read 30 mins</span>
                                    <div className="flex gap-1.5">
                                        {[1,1,1,0,1,1,0].map((done, i) => (
                                            <div key={i} className={`w-6 h-6 rounded ${done ? 'bg-emerald-500' : 'bg-gray-200 dark:bg-gray-700'}`}></div>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">Workout</span>
                                    <div className="flex gap-1.5">
                                        {[0,1,0,1,1,0,0].map((done, i) => (
                                            <div key={i} className={`w-6 h-6 rounded ${done ? 'bg-emerald-500' : 'bg-gray-200 dark:bg-gray-700'}`}></div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
