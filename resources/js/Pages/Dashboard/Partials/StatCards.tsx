import { DashboardStats } from '../types';
import { CheckCircle, Activity, Flame } from 'lucide-react';

interface StatCardsProps {
    stats: DashboardStats;
}

export default function StatCards({ stats }: StatCardsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md overflow-hidden shadow-sm sm:rounded-lg border border-gray-100 dark:border-gray-700 p-6 flex items-center gap-4 hover:-translate-y-1 transition duration-300">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
                    <CheckCircle size={28} />
                </div>
                <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Completed Tasks
                    </h3>
                    <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                        {stats.completedTasks}
                    </p>
                </div>
            </div>

            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md overflow-hidden shadow-sm sm:rounded-lg border border-gray-100 dark:border-gray-700 p-6 flex items-center gap-4 hover:-translate-y-1 transition duration-300">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
                    <Activity size={28} />
                </div>
                <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Pending Tasks
                    </h3>
                    <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                        {stats.pendingTasks}
                    </p>
                </div>
            </div>

            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md overflow-hidden shadow-sm sm:rounded-lg border border-gray-100 dark:border-gray-700 p-6 flex items-center gap-4 hover:-translate-y-1 transition duration-300">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400">
                    <Flame size={28} />
                </div>
                <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Current Streak
                    </h3>
                    <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                        {stats.streak} {stats.streak === 1 ? 'Day' : 'Days'}
                    </p>
                </div>
            </div>
        </div>
    );
}

