import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { DashboardStats, TrendDay, Habit } from './types';
import StatCards from './Partials/StatCards';
import ProductivityChart from './Partials/ProductivityChart';
import HabitTracker from './Partials/HabitTracker';

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
    return (
        <AuthenticatedLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 flex flex-col gap-6">
                    {/* Top Stats Cards */}
                    <StatCards stats={stats} />

                    {/* Lower Grid: Productivity Trends & Habit Tracker */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <ProductivityChart trends={productivityTrends} />
                        <HabitTracker habits={habits} />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

