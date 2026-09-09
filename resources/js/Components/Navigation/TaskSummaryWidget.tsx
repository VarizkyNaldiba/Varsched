import { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import { ListTodo, Layers, Target, Play, HelpCircle } from 'lucide-react';
import { isFirebaseConfigured } from '@/Services/firebase';
import { subscribeUserTasks } from '@/Services/firestoreService';

export default function TaskSummaryWidget() {
    const pageProps = usePage<PageProps & { taskSummary?: { all: number; pending: number; in_progress: number; done: number } }>().props;
    const { auth, taskSummary } = pageProps;

    const [summary, setSummary] = useState({
        all: taskSummary?.all ?? 0,
        pending: taskSummary?.pending ?? 0,
        in_progress: taskSummary?.in_progress ?? 0,
        done: taskSummary?.done ?? 0,
    });

    const [activeTab, setActiveTab] = useState<'summary' | 'categories' | 'target' | 'activity'>('summary');
    const isFirebaseActive = isFirebaseConfigured();

    useEffect(() => {
        if (taskSummary) {
            setSummary({
                all: taskSummary.all ?? 0,
                pending: taskSummary.pending ?? 0,
                in_progress: taskSummary.in_progress ?? 0,
                done: taskSummary.done ?? 0,
            });
        }
    }, [taskSummary]);

    useEffect(() => {
        if (!isFirebaseActive || !auth?.user?.id) return;
        const unsubscribe = subscribeUserTasks(auth.user.id, (cloudTasks) => {
            if (cloudTasks.length > 0) {
                const all = cloudTasks.length;
                const done = cloudTasks.filter((t) => t.status === 'done').length;
                const inProgress = cloudTasks.filter((t) => t.status === 'in-progress' || (t.status as any) === 'in_progress').length;
                const pending = cloudTasks.filter((t) => t.status === 'todo' || !t.status).length;

                setSummary({
                    all,
                    pending,
                    in_progress: inProgress,
                    done,
                });
            }
        });
        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, [auth?.user?.id, isFirebaseActive]);

    return (
        <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border border-gray-200/80 dark:border-gray-700/80 rounded-3xl p-4 sm:p-5 shadow-xl shadow-gray-200/40 dark:shadow-none flex items-center gap-4 sm:gap-5 transition-all duration-300 hover:shadow-2xl">
            {/* Left Vertical Icon Bar / Tab Strip */}
            <div className="flex flex-col items-center gap-2 pr-3 sm:pr-4 border-r border-gray-100 dark:border-gray-700/80">
                <div className="relative group">
                    <button
                        type="button"
                        onClick={() => setActiveTab('summary')}
                        className={`p-2.5 rounded-2xl transition-all duration-200 cursor-pointer ${
                            activeTab === 'summary'
                                ? 'bg-indigo-100 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/50 shadow-sm'
                                : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                        }`}
                        title="Ringkasan Task"
                    >
                        <ListTodo size={20} strokeWidth={2.2} />
                    </button>
                    {/* Tooltip badge like in image */}
                    <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2.5 py-1 bg-gray-900 text-white text-[11px] font-bold rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-30 shadow-lg">
                        Ringkasan Task
                    </div>
                </div>

                <button
                    type="button"
                    onClick={() => setActiveTab('categories')}
                    className={`p-2.5 rounded-2xl transition-all duration-200 cursor-pointer ${
                        activeTab === 'categories'
                            ? 'bg-indigo-100 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/50 shadow-sm'
                            : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                    }`}
                    title="Kategori Task"
                >
                    <Layers size={20} strokeWidth={2.2} />
                </button>

                <button
                    type="button"
                    onClick={() => setActiveTab('target')}
                    className={`p-2.5 rounded-2xl transition-all duration-200 cursor-pointer ${
                        activeTab === 'target'
                            ? 'bg-indigo-100 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/50 shadow-sm'
                            : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                    }`}
                    title="Target Task"
                >
                    <Target size={20} strokeWidth={2.2} />
                </button>

                <button
                    type="button"
                    onClick={() => setActiveTab('activity')}
                    className={`p-2.5 rounded-2xl transition-all duration-200 cursor-pointer ${
                        activeTab === 'activity'
                            ? 'bg-indigo-100 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/50 shadow-sm'
                            : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                    }`}
                    title="Aktivitas"
                >
                    <Play size={20} strokeWidth={2.2} />
                </button>
            </div>

            {/* Right Stat Grid Content */}
            <div className="flex-1 min-w-[210px]">
                <div className="flex items-center justify-between mb-3">
                    <h4 className="text-[11px] font-black tracking-widest text-slate-500 dark:text-gray-400 uppercase">
                        RINGKASAN TASK
                    </h4>
                    <div className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-help" title="Statistik Ringkasan Task Real-Time">
                        <HelpCircle size={16} />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    {/* All Task (Total) */}
                    <div className="bg-gray-50/80 dark:bg-gray-900/40 p-2.5 sm:p-3 rounded-2xl border border-gray-100 dark:border-gray-800">
                        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 block mb-0.5">
                            Total Task
                        </span>
                        <span className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-gray-100 leading-tight">
                            {summary.all}
                        </span>
                    </div>

                    {/* Pending Task */}
                    <div className="bg-amber-50/50 dark:bg-amber-950/20 p-2.5 sm:p-3 rounded-2xl border border-amber-100/60 dark:border-amber-900/30">
                        <span className="text-xs font-bold text-amber-600 dark:text-amber-400 block mb-0.5">
                            Menunggu
                        </span>
                        <span className="text-2xl sm:text-3xl font-black text-amber-500 dark:text-amber-400 leading-tight">
                            {summary.pending}
                        </span>
                    </div>

                    {/* In Progress */}
                    <div className="bg-blue-50/50 dark:bg-blue-950/20 p-2.5 sm:p-3 rounded-2xl border border-blue-100/60 dark:border-blue-900/30">
                        <span className="text-xs font-bold text-blue-600 dark:text-blue-400 block mb-0.5">
                            Diproses
                        </span>
                        <span className="text-2xl sm:text-3xl font-black text-blue-500 dark:text-blue-400 leading-tight">
                            {summary.in_progress}
                        </span>
                    </div>

                    {/* Done Task */}
                    <div className="bg-emerald-50/50 dark:bg-emerald-950/20 p-2.5 sm:p-3 rounded-2xl border border-emerald-100/60 dark:border-emerald-900/30">
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 block mb-0.5">
                            Selesai
                        </span>
                        <span className="text-2xl sm:text-3xl font-black text-emerald-500 dark:text-emerald-400 leading-tight">
                            {summary.done}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
