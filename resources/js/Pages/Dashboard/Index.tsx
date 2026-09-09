import { Head, usePage, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { DashboardProps } from './types';
import { Task } from '@/types/task';
import { PageProps } from '@/types';
import StatCards from './Partials/StatCards';
import ProductivityChart from './Partials/ProductivityChart';
import HabitTracker from './Partials/HabitTracker';
import UpcomingTasksWidget from './Partials/UpcomingTasksWidget';
import { isFirebaseConfigured } from '@/Services/firebase';
import { subscribeUserTasks, updateCloudTask } from '@/Services/firestoreService';
import { LayoutDashboard, TrendingUp, ChevronDown, X } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Dashboard({
    stats = { completedTasks: 0, pendingTasks: 0, streak: 0 },
    productivityTrends = [],
    habits = [],
    upcomingTasks = [],
}: DashboardProps) {
    const { auth } = usePage<PageProps>().props;
    const isFirebaseActive = isFirebaseConfigured();

    const [activeTasks, setActiveTasks] = useState<Task[]>(upcomingTasks);
    const [currentStats, setCurrentStats] = useState(stats);
    const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);

    useEffect(() => {
        setActiveTasks(upcomingTasks);
        setCurrentStats(stats);
    }, [upcomingTasks, stats]);

    useEffect(() => {
        if (!isFirebaseActive || !auth?.user?.id) return;
        const unsubscribe = subscribeUserTasks(auth.user.id, (cloudTasks) => {
            if (cloudTasks.length > 0) {
                setActiveTasks(cloudTasks);
                const completed = cloudTasks.filter((t) => t.status === 'done').length;
                const pending = cloudTasks.filter((t) => t.status !== 'done').length;
                setCurrentStats((prev) => ({
                    ...prev,
                    completedTasks: completed,
                    pendingTasks: pending,
                }));
            }
        });
        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, [auth?.user?.id, isFirebaseActive]);

    const handleUpdateStatus = (task: Task, newStatus: string) => {
        if (task.firestore_id) {
            updateCloudTask(task.firestore_id, { status: newStatus as any });
        }
        router.patch(route('tasks.update', task.id), { status: newStatus }, { preserveScroll: true });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 relative">
                    <div>
                        <h2 className="font-extrabold text-3xl text-gray-900 dark:text-gray-100 flex items-center gap-3">
                            <span className="p-2 rounded-2xl bg-primary-bg dark:bg-primary-dark/30 text-primary">
                                <LayoutDashboard size={28} strokeWidth={2.5} />
                            </span>
                            <span>Dashboard Produktivitas</span>
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Selamat datang kembali, <span className="font-bold text-gray-800 dark:text-gray-200">{auth?.user?.name}</span>! Berikut ringkasan aktivitas dan tugas Anda.
                        </p>
                    </div>

                    {/* Floating Analytics Trigger Button & Popup Dropdown Card */}
                    <div className="relative shrink-0">
                        <button
                            type="button"
                            onClick={() => setShowAnalyticsModal(!showAnalyticsModal)}
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800 hover:from-indigo-700 hover:to-indigo-900 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-indigo-600/30 transition-all cursor-pointer transform hover:scale-[1.02] active:scale-95 border border-indigo-500/30"
                        >
                            <TrendingUp size={18} strokeWidth={2.5} />
                            <span>Analisis & Habit Tracker</span>
                            <ChevronDown className={`transition-transform duration-200 ${showAnalyticsModal ? 'rotate-180' : ''}`} size={16} />
                        </button>

                        {/* Floating Popup Card (Dropdown / Popup Box) */}
                        {showAnalyticsModal && (
                            <div className="absolute right-0 top-full mt-3 w-[92vw] sm:w-[500px] md:w-[580px] bg-white/95 dark:bg-gray-800/95 backdrop-blur-2xl rounded-3xl border border-gray-200 dark:border-gray-700 shadow-2xl p-6 z-50 animate-in fade-in slide-in-from-top-3 duration-200 space-y-6">
                                <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-700">
                                    <div className="flex items-center gap-2.5">
                                        <div className="p-2.5 rounded-xl bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400">
                                            <TrendingUp size={20} strokeWidth={2.5} />
                                        </div>
                                        <div>
                                            <h3 className="font-extrabold text-base text-gray-900 dark:text-gray-100">Analisis & Habit Tracker</h3>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Statistik grafik produktivitas & pelacak kebiasaan</p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setShowAnalyticsModal(false)}
                                        className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition cursor-pointer"
                                        title="Tutup Popup"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>

                                <div className="space-y-6 max-h-[68vh] overflow-y-auto pr-1 custom-scrollbar">
                                    <ProductivityChart trends={productivityTrends} />
                                    <HabitTracker habits={habits} />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            }
        >
            <Head title="Dashboard" />

            <div className="py-8 pb-20">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 flex flex-col gap-8">
                    {/* Stat Cards Overview */}
                    <StatCards stats={currentStats} />

                    {/* Extended Full-Width Deadline Task List */}
                    <div className="w-full">
                        <UpcomingTasksWidget tasks={activeTasks} onUpdateStatus={handleUpdateStatus} />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

