import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { DashboardStats, TrendDay, Habit } from './types';
import StatCards from './Partials/StatCards';
import ProductivityChart from './Partials/ProductivityChart';
import HabitTracker from './Partials/HabitTracker';
import { isFirebaseConfigured } from '@/Services/firebase';
import { Cloud, Database } from 'lucide-react';

interface DashboardProps {
    stats?: DashboardStats;
    productivityTrends?: TrendDay[];
    habits?: Habit[];
}

export default function Dashboard({
    stats = { completedTasks: 0, pendingTasks: 0, streak: 0 },
    productivityTrends = [],
    habits = [],
}: DashboardProps) {
    const isFirebaseActive = isFirebaseConfigured();

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Dashboard
                    </h2>
                    {isFirebaseActive ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/40">
                            <Cloud size={13} /> Firebase Cloud Connected
                        </span>
                    ) : (
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 border border-gray-200 dark:border-gray-700">
                            <Database size={13} /> Local / SQLite Storage
                        </span>
                    )}
                </div>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 flex flex-col gap-6">
                    <StatCards stats={stats} />
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <ProductivityChart trends={productivityTrends} />
                        <HabitTracker habits={habits} />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
