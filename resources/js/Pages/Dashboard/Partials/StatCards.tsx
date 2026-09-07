import { DashboardStats } from '../types';
import { CheckCircle, Activity, Flame, ArrowUpRight } from 'lucide-react';
import { Link } from '@inertiajs/react';

interface StatCardsProps {
    stats: DashboardStats;
}

export default function StatCards({ stats }: StatCardsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
                href={route('tasks.index')}
                className="group bg-white/70 dark:bg-gray-800/70 backdrop-blur-md overflow-hidden shadow-sm sm:rounded-2xl border border-gray-100 dark:border-gray-700/80 p-6 flex items-center justify-between hover:-translate-y-1 hover:shadow-md transition duration-300 cursor-pointer"
            >
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                        <CheckCircle size={28} />
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                            Tugas Selesai
                        </h3>
                        <p className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 mt-0.5">
                            {stats.completedTasks}
                        </p>
                    </div>
                </div>
                <span className="p-2 rounded-xl bg-gray-50 dark:bg-gray-700/50 text-gray-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-950/40 transition">
                    <ArrowUpRight size={18} />
                </span>
            </Link>

            <Link
                href={route('tasks.index')}
                className="group bg-white/70 dark:bg-gray-800/70 backdrop-blur-md overflow-hidden shadow-sm sm:rounded-2xl border border-gray-100 dark:border-gray-700/80 p-6 flex items-center justify-between hover:-translate-y-1 hover:shadow-md transition duration-300 cursor-pointer"
            >
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform">
                        <Activity size={28} />
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                            Tugas Pending
                        </h3>
                        <p className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 mt-0.5">
                            {stats.pendingTasks}
                        </p>
                    </div>
                </div>
                <span className="p-2 rounded-xl bg-gray-50 dark:bg-gray-700/50 text-gray-400 group-hover:text-amber-600 dark:group-hover:text-amber-400 group-hover:bg-amber-50 dark:group-hover:bg-amber-950/40 transition">
                    <ArrowUpRight size={18} />
                </span>
            </Link>

            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md overflow-hidden shadow-sm sm:rounded-2xl border border-gray-100 dark:border-gray-700/80 p-6 flex items-center gap-4 hover:-translate-y-1 transition duration-300">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400">
                    <Flame size={28} />
                </div>
                <div>
                    <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                        Streak Produktif
                    </h3>
                    <p className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 mt-0.5">
                        {stats.streak} {stats.streak === 1 ? 'Hari' : 'Hari'}
                    </p>
                </div>
            </div>
        </div>
    );
}

