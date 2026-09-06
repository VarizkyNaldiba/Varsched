import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {
    History,
    Search,
    Clock,
    Globe,
    User as UserIcon,
    Filter,
} from 'lucide-react';
import { FormEvent, useState } from 'react';

interface ActivityItem {
    id: number;
    user_id: number | null;
    user_name: string;
    user_email: string | null;
    action: string;
    description: string;
    ip_address: string | null;
    user_agent: string | null;
    created_at: string;
}

interface PaginationProps {
    data: ActivityItem[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
}

interface Props {
    activities: PaginationProps;
    availableActions: string[];
    filters: {
        search?: string;
        action?: string;
    };
}

export default function AdminActivityIndex({
    activities,
    availableActions,
    filters,
}: Props) {
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [selectedAction, setSelectedAction] = useState(filters.action || '');

    const handleSearch = (e: FormEvent) => {
        e.preventDefault();
        router.get(
            route('admin.activity.index'),
            { search: searchQuery, action: selectedAction || undefined },
            { preserveState: true }
        );
    };

    const handleFilterAction = (action: string) => {
        setSelectedAction(action);
        router.get(
            route('admin.activity.index'),
            { search: searchQuery, action: action || undefined },
            { preserveState: true }
        );
    };

    const getActionBadge = (action: string) => {
        switch (action) {
            case 'LOGIN':
            case 'LOGOUT':
                return 'bg-sky-blue/20 text-sky-blue border-sky-blue/30';
            case 'TASK_CREATE':
            case 'TASK_UPDATE':
            case 'TASK_STATUS':
                return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-300/40';
            case 'TASK_DELETE':
            case 'USER_DELETE':
                return 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-300 border-rose-300/40';
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
                <div>
                    <h2 className="font-extrabold text-3xl text-gray-900 dark:text-gray-100 flex items-center gap-3">
                        <span className="p-2 rounded-2xl bg-sky-blue/20 text-sky-blue">
                            <History size={28} strokeWidth={2.5} />
                        </span>
                        <span>Riwayat Aktivitas Aplikasi</span>
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Catatan audit seluruh aktivitas login, tugas, dan manajemen akun sistem ({activities.total} aktivitas tercatat).
                    </p>
                </div>
            }
        >
            <Head title="Log Aktivitas" />

            <div className="py-8 pb-20">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    {/* Search & Action Filters */}
                    <div className="p-4 bg-white dark:bg-gray-800 rounded-2xl border-[2px] border-primary/20 dark:border-gray-700 space-y-4">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                            <form onSubmit={handleSearch} className="flex items-center gap-2 w-full md:w-96">
                                <div className="relative flex-1">
                                    <input
                                        type="text"
                                        placeholder="Cari user, deskripsi, atau email..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 bg-surface-base dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 text-sm focus:border-sky-blue focus:ring-sky-blue"
                                    />
                                    <Search size={16} className="absolute left-3 top-3 text-gray-400" />
                                </div>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-sky-blue text-white text-sm font-bold rounded-xl hover:bg-sky-blue/90 transition cursor-pointer"
                                >
                                    Cari
                                </button>
                            </form>

                            {selectedAction && (
                                <button
                                    onClick={() => handleFilterAction('')}
                                    className="text-xs font-bold text-coral hover:underline"
                                >
                                    Reset Filter
                                </button>
                            )}
                        </div>

                        {/* Action Pills */}
                        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-gray-100 dark:border-gray-700/60">
                            <span className="text-xs font-bold text-gray-400 flex items-center gap-1 mr-1">
                                <Filter size={12} /> Filter Aksi:
                            </span>
                            <button
                                onClick={() => handleFilterAction('')}
                                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                                    !selectedAction
                                        ? 'bg-sky-blue text-white'
                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
                                }`}
                            >
                                Semua
                            </button>
                            {availableActions.map((act) => (
                                <button
                                    key={act}
                                    onClick={() => handleFilterAction(act)}
                                    className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase transition cursor-pointer ${
                                        selectedAction === act
                                            ? 'bg-sky-blue text-white'
                                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
                                    }`}
                                >
                                    {act}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Table */}
                    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-card border-[3px] border-primary/20 dark:border-gray-700 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b-[2px] border-dashed border-primary/20 bg-cream/30 dark:bg-gray-900/40 text-[11px] font-black uppercase text-primary tracking-wider">
                                        <th className="p-4 pl-6">Waktu</th>
                                        <th className="p-4">Aksi</th>
                                        <th className="p-4">Pengguna</th>
                                        <th className="p-4">Deskripsi Aktivitas</th>
                                        <th className="p-4 pr-6">IP / Perangkat</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-700 text-sm">
                                    {activities.data.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="p-8 text-center text-gray-400">
                                                Tidak ada log aktivitas yang cocok dengan kriteria.
                                            </td>
                                        </tr>
                                    ) : (
                                        activities.data.map((item) => (
                                            <tr
                                                key={item.id}
                                                className="hover:bg-primary-bg/20 dark:hover:bg-primary-dark/10 transition"
                                            >
                                                {/* Timestamp */}
                                                <td className="p-4 pl-6 text-xs whitespace-nowrap">
                                                    <div className="font-bold text-gray-900 dark:text-gray-100 flex items-center gap-1.5">
                                                        <Clock size={12} className="text-gray-400" />
                                                        <span>
                                                            {new Date(item.created_at).toLocaleDateString('id-ID', {
                                                                day: 'numeric',
                                                                month: 'short',
                                                                year: 'numeric',
                                                            })}
                                                        </span>
                                                    </div>
                                                    <div className="text-[11px] text-gray-400 pl-4">
                                                        {new Date(item.created_at).toLocaleTimeString('id-ID', {
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                            second: '2-digit',
                                                        })}
                                                    </div>
                                                </td>

                                                {/* Action */}
                                                <td className="p-4 whitespace-nowrap">
                                                    <span
                                                        className={`text-[10px] font-black px-2.5 py-1 rounded-lg border uppercase tracking-wider ${getActionBadge(
                                                            item.action
                                                        )}`}
                                                    >
                                                        {item.action}
                                                    </span>
                                                </td>

                                                {/* User */}
                                                <td className="p-4 text-xs">
                                                    <div className="font-bold text-gray-900 dark:text-gray-100 flex items-center gap-1.5">
                                                        <UserIcon size={12} className="text-gray-400" />
                                                        <span>{item.user_name}</span>
                                                    </div>
                                                    {item.user_email && (
                                                        <div className="text-[11px] text-gray-400 truncate max-w-[180px]">
                                                            {item.user_email}
                                                        </div>
                                                    )}
                                                </td>

                                                {/* Description */}
                                                <td className="p-4 text-xs font-semibold text-gray-800 dark:text-gray-200">
                                                    {item.description}
                                                </td>

                                                {/* IP / User Agent */}
                                                <td className="p-4 pr-6 text-xs whitespace-nowrap text-gray-500">
                                                    <div className="flex items-center gap-1 text-[11px] font-mono">
                                                        <Globe size={11} className="text-gray-400" />
                                                        <span>{item.ip_address || '127.0.0.1'}</span>
                                                    </div>
                                                    {item.user_agent && (
                                                        <div className="text-[10px] text-gray-400 truncate max-w-[150px]" title={item.user_agent}>
                                                            {item.user_agent.split(' ')[0]}
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {activities.last_page > 1 && (
                            <div className="p-4 border-t border-gray-100 dark:border-gray-700 flex justify-center gap-1.5">
                                {activities.links.map((link, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => link.url && router.get(link.url)}
                                        disabled={!link.url}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className={`px-3 py-1.5 text-xs font-bold rounded-xl transition ${
                                            link.active
                                                ? 'bg-sky-blue text-white'
                                                : link.url
                                                ? 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
                                                : 'text-gray-400 cursor-not-allowed'
                                        }`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
