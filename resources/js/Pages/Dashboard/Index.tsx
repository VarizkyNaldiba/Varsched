import { Head, usePage, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { DashboardProps } from './types';
import { Task } from '@/types/task';
import { PageProps } from '@/types';
import StatCards from './Partials/StatCards';
import UpcomingTasksWidget from './Partials/UpcomingTasksWidget';
import { isFirebaseConfigured } from '@/Services/firebase';
import { subscribeUserTasks, updateCloudTask } from '@/Services/firestoreService';
import { LayoutDashboard } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Dashboard({
    stats = { completedTasks: 0, pendingTasks: 0, streak: 0 },
    upcomingTasks = [],
}: DashboardProps) {
    const { auth } = usePage<PageProps>().props;
    const isFirebaseActive = isFirebaseConfigured();

    const [activeTasks, setActiveTasks] = useState<Task[]>(upcomingTasks);
    const [currentStats, setCurrentStats] = useState(stats);

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

