import { Habit } from '../types';
import { router } from '@inertiajs/react';
import { Activity, Check, Plus, Trash2, X } from 'lucide-react';
import { useState, FormEvent } from 'react';

interface HabitTrackerProps {
    habits: Habit[];
}

export default function HabitTracker({ habits }: HabitTrackerProps) {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newHabitName, setNewHabitName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const toggleHabitDay = (habitId: number, date: string) => {
        router.post(
            route('habits.toggle', habitId),
            { date },
            { preserveScroll: true }
        );
    };

    const handleCreateHabit = (e: FormEvent) => {
        e.preventDefault();
        if (!newHabitName.trim()) return;

        setIsSubmitting(true);
        router.post(
            route('habits.store'),
            { name: newHabitName.trim() },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setNewHabitName('');
                    setIsAddModalOpen(false);
                    setIsSubmitting(false);
                },
                onError: () => {
                    setIsSubmitting(false);
                },
            }
        );
    };

    const handleDeleteHabit = (habit: Habit) => {
        if (confirm(`Hapus kebiasaan "${habit.name}"?`)) {
            router.delete(route('habits.destroy', habit.id), { preserveScroll: true });
        }
    };

    return (
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md overflow-hidden shadow-sm sm:rounded-lg border border-gray-100 dark:border-gray-700 p-6 flex flex-col justify-between relative">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                        <Activity size={20} className="text-emerald-600 dark:text-emerald-400" />
                        Habit Tracker
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        Lacak konsistensi harian Anda
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => setIsAddModalOpen(true)}
                    className="inline-flex items-center gap-1 text-xs font-extrabold px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 transition cursor-pointer"
                >
                    <Plus size={14} /> Tambah Kebiasaan
                </button>
            </div>

            <div className="space-y-4">
                {habits.length === 0 ? (
                    <div className="text-center py-8 text-gray-400 dark:text-gray-500 text-sm">
                        Belum ada kebiasaan yang dilacak. Klik tombol di atas untuk menambah.
                    </div>
                ) : (
                    habits.map((habit) => (
                        <div
                            key={habit.id}
                            className="group flex items-center justify-between gap-4 p-3 rounded-xl bg-gray-50/60 dark:bg-gray-700/30 border border-gray-100 dark:border-gray-700/50"
                        >
                            <div className="flex items-center gap-2 min-w-0">
                                <button
                                    type="button"
                                    onClick={() => handleDeleteHabit(habit)}
                                    className="opacity-0 group-hover:opacity-100 transition p-1 text-gray-400 hover:text-red-500 rounded-md hover:bg-red-50 dark:hover:bg-red-950/40 cursor-pointer"
                                    title="Hapus Habit"
                                >
                                    <Trash2 size={13} />
                                </button>
                                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 truncate max-w-[140px]">
                                    {habit.name}
                                </span>
                            </div>

                            <div className="flex items-center gap-2">
                                {habit.days.map((day) => (
                                    <div
                                        key={day.date}
                                        className="flex flex-col items-center gap-1 group/day relative"
                                    >
                                        <div className="absolute -top-7 scale-0 group-hover/day:scale-100 transition-all duration-150 bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 text-[10px] font-bold py-0.5 px-2 rounded shadow-md pointer-events-none whitespace-nowrap z-20">
                                            {day.dayName}: {day.done ? 'Selesai' : 'Belum'}
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => toggleHabitDay(habit.id, day.date)}
                                            className={`w-7 h-7 rounded-lg transition-all duration-200 cursor-pointer flex items-center justify-center ${
                                                day.done
                                                    ? 'bg-emerald-500 text-white shadow-xs shadow-emerald-500/30 hover:bg-emerald-600 scale-100'
                                                    : 'bg-gray-200 dark:bg-gray-600/70 hover:bg-gray-300 dark:hover:bg-gray-500 text-transparent'
                                            }`}
                                            title={`${habit.name} pada ${day.dayName}: ${
                                                day.done ? 'Selesai' : 'Belum'
                                            }`}
                                        >
                                            {day.done && <Check size={14} strokeWidth={3} />}
                                        </button>
                                        <span className="text-[10px] font-medium text-gray-400 dark:text-gray-500">
                                            {day.dayName.charAt(0)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Modal Tambah Habit */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-xs">
                    <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-2xl border border-gray-100 dark:border-gray-700 animate-in fade-in zoom-in duration-150">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="text-base font-extrabold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                                <Activity className="text-emerald-500" size={18} />
                                Tambah Kebiasaan Baru
                            </h4>
                            <button
                                type="button"
                                onClick={() => setIsAddModalOpen(false)}
                                className="p-1 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleCreateHabit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                                    Nama Kebiasaan
                                </label>
                                <input
                                    type="text"
                                    value={newHabitName}
                                    onChange={(e) => setNewHabitName(e.target.value)}
                                    placeholder="Contoh: Olahraga 30 Menit, Minum Air 2L..."
                                    required
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm font-medium text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="px-4 py-2 text-xs font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition cursor-pointer"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting || !newHabitName.trim()}
                                    className="px-4 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition shadow-sm cursor-pointer disabled:opacity-50"
                                >
                                    {isSubmitting ? 'Saving...' : 'Simpan Kebiasaan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}


