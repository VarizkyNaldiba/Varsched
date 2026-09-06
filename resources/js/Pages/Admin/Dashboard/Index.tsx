import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {
    ShieldCheck,
    Users,
    CheckSquare,
    Sparkles,
    Activity,
    ArrowLeftRight,
    History,
    ArrowRight,
    Clock,
    UserCheck,
} from 'lucide-react';

interface ActivityItem {
    id: number;
    user_name: string;
    user_email: string | null;
    action: string;
    description: string;
    ip_address: string | null;
    created_at: string;
}

interface RecentUser {
    id: number;
    name: string;
    email: string;
    role: string;
    last_login_at: string | null;
    tasks_count: number;
    habits_count: number;
    created_at: string;
}

interface Props {
    stats: {
        totalUsers: number;
        adminUsers: number;
        regularUsers: number;
        totalTasks: number;
        completedTasks: number;
        inProgressTasks: number;
        todoTasks: number;
        totalHabits: number;
        activeUsers24h: number;
    };
    recentActivities: ActivityItem[];
    recentUsers: RecentUser[];
}

export default function AdminDashboard({ stats, recentActivities, recentUsers }: Props) {
    const getActionBadge = (action: string) => {
        switch (action) {
            case 'LOGIN':
            case 'LOGOUT':
                return 'bg-sky-blue/20 text-sky-blue border-sky-blue/30';
            case 'TASK_CREATE':
            case 'TASK_UPDATE':
            case 'TASK_STATUS':
                return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-300/40';
            case 'DATA_MIGRATION':
                return 'bg-coral-light/20 text-coral-dark dark:text-coral-light border-coral/30';
            case 'ROLE_CHANGE':
            case 'USER_CREATE':
            case 'USER_UPDATE':
                return 'bg-accent-light/30 text-accent-dark border-accent-dark/40';
            default:
                return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border-gray-300 dark:border-gray-700';
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h2 className="font-extrabold text-3xl text-gray-900 dark:text-gray-100 flex items-center gap-3">
                            <span className="p-2 rounded-2xl bg-coral/20 text-coral">
                                <ShieldCheck size={28} strokeWidth={2.5} />
                            </span>
                            <span>Admin Control Center</span>
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Pantau metrik aplikasi, manajemen akun pengguna, migrasi data, dan log aktivitas sistem.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link
                            href={route('admin.migrations.index')}
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-coral hover:bg-coral-dark text-white text-xs font-bold shadow-coral-glow transition cursor-pointer"
                        >
                            <ArrowLeftRight size={15} />
                            <span>Migrasi Data</span>
                        </Link>
                        <Link
                            href={route('admin.users.index')}
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white text-xs font-bold shadow-teal-glow transition cursor-pointer"
                        >
                            <Users size={15} />
                            <span>Kelola Akun</span>
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title="Admin Dashboard" />

            <div className="py-8 pb-20">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-8">
                    {/* Stat Cards Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {/* Total Users */}
                        <div className="p-6 bg-white dark:bg-gray-800 rounded-3xl shadow-card border-[3px] border-primary/20 dark:border-gray-700">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-black uppercase tracking-wider text-primary">
                                    Total Akun
                                </span>
                                <div className="p-2.5 rounded-xl bg-primary-bg dark:bg-primary-dark/30 text-primary">
                                    <Users size={20} />
                                </div>
                            </div>
                            <div className="mt-4">
                                <div className="text-3xl font-extrabold text-gray-900 dark:text-gray-100">
                                    {stats.totalUsers}
                                </div>
                                <div className="flex items-center gap-2 mt-1.5 text-xs text-gray-500 dark:text-gray-400 font-semibold">
                                    <span className="text-coral font-bold">{stats.adminUsers} Admin</span>
                                    <span>•</span>
                                    <span>{stats.regularUsers} Reguler</span>
                                </div>
                            </div>
                        </div>

                        {/* Active Users 24h */}
                        <div className="p-6 bg-white dark:bg-gray-800 rounded-3xl shadow-card border-[3px] border-emerald-500/20 dark:border-gray-700">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                                    Aktif 24 Jam
                                </span>
                                <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
                                    <Activity size={20} />
                                </div>
                            </div>
                            <div className="mt-4">
                                <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                                    <span>{stats.activeUsers24h}</span>
                                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                </div>
                                <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400 font-semibold">
                                    Pengguna login 24 jam terakhir
                                </p>
                            </div>
                        </div>

                        {/* Total Tasks */}
                        <div className="p-6 bg-white dark:bg-gray-800 rounded-3xl shadow-card border-[3px] border-accent/30 dark:border-gray-700">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-black uppercase tracking-wider text-accent-dark">
                                    Total Tugas Sistem
                                </span>
                                <div className="p-2.5 rounded-xl bg-accent-light/30 text-accent-dark">
                                    <CheckSquare size={20} />
                                </div>
                            </div>
                            <div className="mt-4">
                                <div className="text-3xl font-extrabold text-gray-900 dark:text-gray-100">
                                    {stats.totalTasks}
                                </div>
                                <div className="flex items-center gap-2 mt-1.5 text-xs text-gray-500 dark:text-gray-400 font-semibold">
                                    <span className="text-emerald-600 font-bold">{stats.completedTasks} Selesai</span>
                                    <span>•</span>
                                    <span>{stats.inProgressTasks + stats.todoTasks} Aktif</span>
                                </div>
                            </div>
                        </div>

                        {/* Total Habits */}
                        <div className="p-6 bg-white dark:bg-gray-800 rounded-3xl shadow-card border-[3px] border-coral/20 dark:border-gray-700">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-black uppercase tracking-wider text-coral">
                                    Kebiasaan (Habits)
                                </span>
                                <div className="p-2.5 rounded-xl bg-coral-light/20 text-coral">
                                    <Sparkles size={20} />
                                </div>
                            </div>
                            <div className="mt-4">
                                <div className="text-3xl font-extrabold text-gray-900 dark:text-gray-100">
                                    {stats.totalHabits}
                                </div>
                                <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400 font-semibold">
                                    Rangkaian kebiasaan harian
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Quick Shortcuts */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <Link
                            href={route('admin.users.index')}
                            className="p-5 bg-white dark:bg-gray-800 rounded-2xl border-2 border-primary/20 dark:border-gray-700 hover:border-primary hover:shadow-md transition flex items-center justify-between group"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-primary-bg dark:bg-primary-dark/30 text-primary flex items-center justify-center font-bold">
                                    <UserCheck size={20} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 dark:text-gray-100 group-hover:text-primary transition">
                                        Manajemen Akun
                                    </h4>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        Lihat, edit role, dan pantau last login
                                    </p>
                                </div>
                            </div>
                            <ArrowRight size={18} className="text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition" />
                        </Link>

                        <Link
                            href={route('admin.migrations.index')}
                            className="p-5 bg-white dark:bg-gray-800 rounded-2xl border-2 border-coral/20 dark:border-gray-700 hover:border-coral hover:shadow-md transition flex items-center justify-between group"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-coral-light/20 text-coral flex items-center justify-center font-bold">
                                    <ArrowLeftRight size={20} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 dark:text-gray-100 group-hover:text-coral transition">
                                        Migrasi Data
                                    </h4>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        Pindahkan tugas antar akun pengguna
                                    </p>
                                </div>
                            </div>
                            <ArrowRight size={18} className="text-gray-400 group-hover:text-coral group-hover:translate-x-1 transition" />
                        </Link>

                        <Link
                            href={route('admin.activity.index')}
                            className="p-5 bg-white dark:bg-gray-800 rounded-2xl border-2 border-sky-blue/20 dark:border-gray-700 hover:border-sky-blue hover:shadow-md transition flex items-center justify-between group"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-sky-blue/20 text-sky-blue flex items-center justify-center font-bold">
                                    <History size={20} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 dark:text-gray-100 group-hover:text-sky-blue transition">
                                        Log Aktivitas
                                    </h4>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        Pantau riwayat audit & tindakan pengguna
                                    </p>
                                </div>
                            </div>
                            <ArrowRight size={18} className="text-gray-400 group-hover:text-sky-blue group-hover:translate-x-1 transition" />
                        </Link>
                    </div>

                    {/* Main Content Grid: Recent Users & Recent Activities */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                        {/* Recent Users */}
                        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-card border-[3px] border-primary/20 dark:border-gray-700 p-6 space-y-4">
                            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-700">
                                <h3 className="text-lg font-extrabold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                                    <Users size={18} className="text-primary" />
                                    <span>Pengguna Terbaru</span>
                                </h3>
                                <Link
                                    href={route('admin.users.index')}
                                    className="text-xs font-bold text-primary hover:underline"
                                >
                                    Lihat Semua &rarr;
                                </Link>
                            </div>

                            <div className="divide-y divide-gray-100 dark:divide-gray-700/60">
                                {recentUsers.map((u) => (
                                    <div key={u.id} className="py-3 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-xl bg-primary-bg dark:bg-primary-dark/30 text-primary font-bold flex items-center justify-center text-sm">
                                                {u.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                                                        {u.name}
                                                    </span>
                                                    {u.role === 'admin' && (
                                                        <span className="text-[10px] font-black px-1.5 py-0.5 bg-coral text-white rounded">
                                                            ADMIN
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[200px]">
                                                    {u.email}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="text-right">
                                            <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                                                {u.tasks_count} Tasks
                                            </span>
                                            <p className="text-[11px] text-gray-400">
                                                {u.last_login_at
                                                    ? new Date(u.last_login_at).toLocaleDateString('id-ID', {
                                                          day: 'numeric',
                                                          month: 'short',
                                                      })
                                                    : 'Belum login'}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Recent Activity Log Feed */}
                        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-card border-[3px] border-primary/20 dark:border-gray-700 p-6 space-y-4">
                            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-700">
                                <h3 className="text-lg font-extrabold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                                    <History size={18} className="text-coral" />
                                    <span>Aktivitas Sistem Terkini</span>
                                </h3>
                                <Link
                                    href={route('admin.activity.index')}
                                    className="text-xs font-bold text-coral hover:underline"
                                >
                                    Log Lengkap &rarr;
                                </Link>
                            </div>

                            {recentActivities.length === 0 ? (
                                <p className="text-center py-8 text-sm text-gray-400">
                                    Belum ada log aktivitas tercatat.
                                </p>
                            ) : (
                                <div className="space-y-3">
                                    {recentActivities.map((act) => (
                                        <div
                                            key={act.id}
                                            className="p-3 rounded-2xl bg-surface-base dark:bg-gray-900/50 border border-primary/10 dark:border-gray-700 flex items-start gap-3"
                                        >
                                            <span
                                                className={`text-[10px] font-black px-2 py-0.5 rounded-lg border uppercase tracking-wider shrink-0 mt-0.5 ${getActionBadge(
                                                    act.action
                                                )}`}
                                            >
                                                {act.action}
                                            </span>

                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 leading-snug">
                                                    {act.description}
                                                </p>
                                                <div className="flex items-center gap-2 mt-1 text-[10px] text-gray-400">
                                                    <span>{act.user_name}</span>
                                                    <span>•</span>
                                                    <span className="flex items-center gap-1">
                                                        <Clock size={10} />
                                                        {new Date(act.created_at).toLocaleTimeString('id-ID', {
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                        })}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
