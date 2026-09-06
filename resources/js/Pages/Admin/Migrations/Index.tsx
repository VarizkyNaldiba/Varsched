import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {
    ArrowLeftRight,
    ArrowRight,
    CheckCircle2,
    Clock,
    AlertCircle,
    Copy,
    MoveRight,
} from 'lucide-react';
import { FormEvent, useState } from 'react';

interface SimpleUser {
    id: number;
    name: string;
    email: string;
    role?: string;
    tasks_count?: number;
    habits_count?: number;
}

interface ActivityItem {
    id: number;
    user_name: string;
    description: string;
    created_at: string;
}

interface Props {
    users: SimpleUser[];
    recentMigrations: ActivityItem[];
}

export default function AdminMigrationsIndex({ users, recentMigrations }: Props) {
    const { data, setData, post, processing, errors, reset } = useForm({
        source_user_id: '',
        target_user_id: '',
        migrate_tasks: true,
        migrate_habits: true,
        mode: 'transfer' as 'transfer' | 'copy',
        delete_source: false,
    });

    const [showConfirm, setShowConfirm] = useState(false);

    const sourceUser = users.find((u) => String(u.id) === String(data.source_user_id));
    const targetUser = users.find((u) => String(u.id) === String(data.target_user_id));

    const handleFormSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!data.source_user_id || !data.target_user_id) {
            alert('Silakan pilih akun asal dan akun tujuan terlebih dahulu.');
            return;
        }
        if (data.source_user_id === data.target_user_id) {
            alert('Akun asal dan akun tujuan tidak boleh sama!');
            return;
        }
        setShowConfirm(true);
    };

    const confirmExecuteMigration = () => {
        post(route('admin.migrations.migrate'), {
            onSuccess: () => {
                setShowConfirm(false);
                reset();
            },
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="font-extrabold text-3xl text-gray-900 dark:text-gray-100 flex items-center gap-3">
                        <span className="p-2 rounded-2xl bg-coral-light/20 text-coral">
                            <ArrowLeftRight size={28} strokeWidth={2.5} />
                        </span>
                        <span>Migrasi Data Antar Akun</span>
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Pindahkan atau duplikasi data tugas dan kebiasaan dari satu akun pengguna ke akun lainnya.
                    </p>
                </div>
            }
        >
            <Head title="Migrasi Data" />

            <div className="py-8 pb-20">
                <div className="max-w-5xl mx-auto sm:px-6 lg:px-8 space-y-8">
                    {/* Migration Form Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-card border-[3px] border-coral/20 dark:border-gray-700 p-8">
                        <form onSubmit={handleFormSubmit} className="space-y-8">
                            {/* Source and Target Pickers */}
                            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-center">
                                {/* Source User */}
                                <div className="md:col-span-2 space-y-2">
                                    <label className="block text-xs font-black uppercase tracking-wider text-coral">
                                        1. Akun Asal (Sumber Data) *
                                    </label>
                                    <select
                                        value={data.source_user_id}
                                        onChange={(e) => setData('source_user_id', e.target.value)}
                                        required
                                        className="w-full px-4 py-3 rounded-2xl border-2 border-primary/20 dark:border-gray-700 bg-surface-base dark:bg-gray-900 text-sm font-bold focus:border-coral focus:ring-coral"
                                    >
                                        <option value="">-- Pilih Akun Asal --</option>
                                        {users.map((u) => (
                                            <option key={u.id} value={u.id}>
                                                {u.name} ({u.email}) - {u.tasks_count || 0} tasks
                                            </option>
                                        ))}
                                    </select>
                                    {sourceUser && (
                                        <div className="p-3 bg-coral-light/10 rounded-xl text-xs text-coral-dark dark:text-coral-light flex items-center justify-between font-semibold border border-coral/20">
                                            <span>{sourceUser.tasks_count || 0} Tugas</span>
                                            <span>•</span>
                                            <span>{sourceUser.habits_count || 0} Kebiasaan</span>
                                        </div>
                                    )}
                                    {errors.source_user_id && (
                                        <p className="text-xs text-rose-500 font-bold">{errors.source_user_id}</p>
                                    )}
                                </div>

                                {/* Arrow Indicator */}
                                <div className="md:col-span-1 flex flex-col items-center justify-center pt-6">
                                    <div className="w-12 h-12 rounded-2xl bg-coral/10 text-coral flex items-center justify-center shadow-sm">
                                        <ArrowRight size={24} className="hidden md:block" />
                                        <MoveRight size={24} className="md:hidden rotate-90" />
                                    </div>
                                    <span className="text-[11px] font-extrabold text-coral uppercase mt-1">
                                        {data.mode === 'transfer' ? 'Transfer' : 'Copy'}
                                    </span>
                                </div>

                                {/* Target User */}
                                <div className="md:col-span-2 space-y-2">
                                    <label className="block text-xs font-black uppercase tracking-wider text-primary">
                                        2. Akun Tujuan (Penerima) *
                                    </label>
                                    <select
                                        value={data.target_user_id}
                                        onChange={(e) => setData('target_user_id', e.target.value)}
                                        required
                                        className="w-full px-4 py-3 rounded-2xl border-2 border-primary/20 dark:border-gray-700 bg-surface-base dark:bg-gray-900 text-sm font-bold focus:border-primary focus:ring-primary"
                                    >
                                        <option value="">-- Pilih Akun Tujuan --</option>
                                        {users.map((u) => (
                                            <option key={u.id} value={u.id}>
                                                {u.name} ({u.email})
                                            </option>
                                        ))}
                                    </select>
                                    {targetUser && (
                                        <div className="p-3 bg-primary-bg rounded-xl text-xs text-primary-dark dark:bg-primary-dark/30 dark:text-primary-light flex items-center justify-between font-semibold border border-primary/20">
                                            <span>Data saat ini: {targetUser.tasks_count || 0} Tugas</span>
                                            <span>•</span>
                                            <span>{targetUser.habits_count || 0} Kebiasaan</span>
                                        </div>
                                    )}
                                    {errors.target_user_id && (
                                        <p className="text-xs text-rose-500 font-bold">{errors.target_user_id}</p>
                                    )}
                                </div>
                            </div>

                            {/* Options */}
                            <div className="p-6 bg-surface-base dark:bg-gray-900/50 rounded-2xl border border-primary/10 dark:border-gray-700 space-y-4">
                                <h4 className="text-sm font-black uppercase text-gray-700 dark:text-gray-300">
                                    Pilihan Data & Mode Migrasi
                                </h4>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {/* Data selection */}
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={data.migrate_tasks}
                                                onChange={(e) => setData('migrate_tasks', e.target.checked)}
                                                className="rounded text-primary focus:ring-primary"
                                            />
                                            <span>Pindahkan Semua Tugas (Tasks)</span>
                                        </label>

                                        <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={data.migrate_habits}
                                                onChange={(e) => setData('migrate_habits', e.target.checked)}
                                                className="rounded text-primary focus:ring-primary"
                                            />
                                            <span>Pindahkan Kebiasaan & Riwayat Logs (Habits)</span>
                                        </label>
                                    </div>

                                    {/* Mode selection */}
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="mode"
                                                value="transfer"
                                                checked={data.mode === 'transfer'}
                                                onChange={() => setData('mode', 'transfer')}
                                                className="text-coral focus:ring-coral"
                                            />
                                            <span className="flex items-center gap-1.5">
                                                <MoveRight size={15} className="text-coral" />
                                                <strong>Transfer Kepemilikan</strong> (Pindah total)
                                            </span>
                                        </label>

                                        <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="mode"
                                                value="copy"
                                                checked={data.mode === 'copy'}
                                                onChange={() => setData('mode', 'copy')}
                                                className="text-coral focus:ring-coral"
                                            />
                                            <span className="flex items-center gap-1.5">
                                                <Copy size={15} className="text-sky-blue" />
                                                <strong>Duplikasi (Copy)</strong> (Akun asal tetap punya)
                                            </span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-8 py-3.5 bg-coral hover:bg-coral-dark text-white font-extrabold rounded-2xl shadow-coral-glow transition hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-50 flex items-center gap-2"
                                >
                                    <ArrowLeftRight size={18} strokeWidth={2.5} />
                                    <span>Lanjutkan Migrasi Data</span>
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Migration History Log */}
                    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-card border-[3px] border-primary/20 dark:border-gray-700 p-6 space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-700">
                            <h3 className="text-lg font-extrabold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                                <Clock size={18} className="text-coral" />
                                <span>Riwayat Migrasi Data Terakhir</span>
                            </h3>
                        </div>

                        {recentMigrations.length === 0 ? (
                            <p className="text-center py-6 text-sm text-gray-400">
                                Belum ada riwayat migrasi data tercatat.
                            </p>
                        ) : (
                            <div className="divide-y divide-gray-100 dark:divide-gray-700/60">
                                {recentMigrations.map((item) => (
                                    <div key={item.id} className="py-3 flex items-start gap-3">
                                        <div className="p-2 rounded-xl bg-coral-light/20 text-coral mt-0.5">
                                            <CheckCircle2 size={16} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                                                {item.description}
                                            </p>
                                            <p className="text-[11px] text-gray-400 mt-0.5">
                                                {new Date(item.created_at).toLocaleString('id-ID')}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Confirmation Modal */}
            {showConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary-dark/40 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white dark:bg-gray-800 rounded-3xl max-w-md w-full p-6 shadow-2xl border-[3px] border-coral space-y-5">
                        <div className="flex items-center gap-3 text-coral">
                            <AlertCircle size={28} />
                            <h3 className="text-lg font-black">Konfirmasi Migrasi Data</h3>
                        </div>

                        <p className="text-sm text-gray-600 dark:text-gray-300">
                            Anda akan melakukan migrasi data dari <strong>{sourceUser?.name}</strong> ke <strong>{targetUser?.name}</strong>.
                        </p>

                        <div className="p-4 rounded-xl bg-surface-base dark:bg-gray-900 text-xs space-y-1 font-semibold border border-primary/10">
                            <div>Mode: <span className="font-bold text-coral">{data.mode === 'transfer' ? 'Transfer Kepemilikan' : 'Duplikasi (Copy)'}</span></div>
                            <div>Pindahkan Tasks: <span className="font-bold">{data.migrate_tasks ? 'Ya' : 'Tidak'}</span></div>
                            <div>Pindahkan Habits: <span className="font-bold">{data.migrate_habits ? 'Ya' : 'Tidak'}</span></div>
                        </div>

                        <div className="flex justify-end gap-3 pt-3">
                            <button
                                type="button"
                                onClick={() => setShowConfirm(false)}
                                className="px-4 py-2 text-xs font-bold text-gray-600 dark:text-gray-300 rounded-xl border hover:bg-gray-100"
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                onClick={confirmExecuteMigration}
                                disabled={processing}
                                className="px-5 py-2 text-xs font-bold text-white bg-coral hover:bg-coral-dark rounded-xl shadow-coral-glow disabled:opacity-50"
                            >
                                {processing ? 'Memproses...' : 'Ya, Eksekusi Sekarang'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
