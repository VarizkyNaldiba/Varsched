import { useState, useEffect, useRef } from 'react';
import { usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import { ListTodo, X } from 'lucide-react';
import { isFirebaseConfigured } from '@/Services/firebase';
import { subscribeUserTasks } from '@/Services/firestoreService';

export default function TaskSummaryWidget() {
    const pageProps = usePage<PageProps & { taskSummary?: { all: number; pending: number; in_progress: number; done: number } }>().props;
    const { auth, taskSummary } = pageProps;

    const [isOpen, setIsOpen] = useState(false);
    const [summary, setSummary] = useState({
        all: taskSummary?.all ?? 0,
        pending: taskSummary?.pending ?? 0,
        in_progress: taskSummary?.in_progress ?? 0,
        done: taskSummary?.done ?? 0,
    });

    const isFirebaseActive = isFirebaseConfigured();
    const widgetRef = useRef<HTMLDivElement>(null);

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

    // Handle outside click & escape key to close pop-up
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (widgetRef.current && !widgetRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setIsOpen(false);
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('keydown', handleKeyDown);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen]);

    return (
        <div ref={widgetRef} className="relative inline-block">
            {/* Single Floating Trigger Icon Button */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`p-3 rounded-2xl transition-all duration-200 cursor-pointer flex items-center justify-center relative shadow-md hover:shadow-lg ${
                    isOpen
                        ? 'bg-indigo-600 text-white shadow-indigo-600/30 ring-4 ring-indigo-500/20'
                        : 'bg-white/90 dark:bg-gray-800/90 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-gray-200/80 dark:border-gray-700/80 backdrop-blur-xl'
                }`}
                title="Ringkasan Task"
            >
                <ListTodo size={22} strokeWidth={2.5} />
                
                {/* Badge Number Indicator */}
                {summary.all > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 px-2 py-0.5 text-[10px] font-extrabold bg-amber-500 text-white rounded-full shadow-sm border-2 border-white dark:border-gray-800 animate-pulse">
                        {summary.all}
                    </span>
                )}
            </button>

            {/* Clean Popup Card Layout Modal with Smooth Swipe Left Animation */}
            <div
                className={`absolute right-0 top-full mt-3 w-[92vw] sm:w-[350px] bg-white/95 dark:bg-gray-800/95 backdrop-blur-2xl rounded-3xl border border-gray-200/90 dark:border-gray-700/90 p-4 sm:p-5 shadow-2xl z-50 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] transform origin-top-right ${
                    isOpen
                        ? 'opacity-100 translate-x-0 scale-100 pointer-events-auto'
                        : 'opacity-0 translate-x-12 scale-95 pointer-events-none'
                }`}
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100 dark:border-gray-700/80">
                    <h4 className="text-[11px] font-black tracking-widest text-slate-500 dark:text-gray-400 uppercase">
                        RINGKASAN TASK
                    </h4>
                    <button
                        type="button"
                        onClick={() => setIsOpen(false)}
                        className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition cursor-pointer"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Stat Grid (Total Task, Diproses, Selesai) */}
                <div className="grid grid-cols-3 gap-2.5">
                    {/* All Task (Total) */}
                    <div className="bg-gray-50/90 dark:bg-gray-900/50 p-3 rounded-2xl border border-gray-100 dark:border-gray-700/60 text-center">
                        <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 block mb-0.5">
                            Total Task
                        </span>
                        <span className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-gray-100 leading-tight">
                            {summary.all}
                        </span>
                    </div>

                    {/* In Progress */}
                    <div className="bg-blue-50/60 dark:bg-blue-950/30 p-3 rounded-2xl border border-blue-100 dark:border-blue-900/40 text-center">
                        <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 block mb-0.5">
                            Diproses
                        </span>
                        <span className="text-2xl sm:text-3xl font-black text-blue-500 dark:text-blue-400 leading-tight">
                            {summary.in_progress}
                        </span>
                    </div>

                    {/* Done Task */}
                    <div className="bg-emerald-50/60 dark:bg-emerald-950/30 p-3 rounded-2xl border border-emerald-100 dark:border-emerald-900/40 text-center">
                        <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 block mb-0.5">
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

