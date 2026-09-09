import Sidebar from '@/Components/Navigation/Sidebar';
import TaskSummaryWidget from '@/Components/Navigation/TaskSummaryWidget';
import { PropsWithChildren, ReactNode, useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export default function Authenticated({
    header,
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const { flash } = usePage<PageProps>().props;
    const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    useEffect(() => {
        if (flash?.success) {
            setAlert({ message: flash.success, type: 'success' });
            const timer = setTimeout(() => setAlert(null), 4000);
            return () => clearTimeout(timer);
        } else if (flash?.error) {
            setAlert({ message: flash.error, type: 'error' });
            const timer = setTimeout(() => setAlert(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    return (
        <div className="min-h-screen bg-surface-base dark:bg-surface-dark-base text-gray-900 dark:text-cream transition-colors duration-300 flex flex-col relative">
            {/* Floating Alert Toast Notification */}
            {alert && (
                <div className="fixed top-5 right-5 z-50 animate-bounce-short max-w-md w-full px-4">
                    <div
                        className={`p-4 rounded-2xl shadow-xl border flex items-center justify-between gap-3 backdrop-blur-xl transition-all duration-300 ${
                            alert.type === 'success'
                                ? 'bg-emerald-500/95 dark:bg-emerald-600/95 text-white border-emerald-400 shadow-emerald-500/20'
                                : 'bg-rose-500/95 dark:bg-rose-600/95 text-white border-rose-400 shadow-rose-500/20'
                        }`}
                    >
                        <div className="flex items-center gap-3 min-w-0">
                            {alert.type === 'success' ? (
                                <CheckCircle2 size={22} className="shrink-0 text-white" />
                            ) : (
                                <AlertCircle size={22} className="shrink-0 text-white" />
                            )}
                            <p className="text-sm font-bold truncate">{alert.message}</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setAlert(null)}
                            className="p-1 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition cursor-pointer"
                        >
                            <X size={18} />
                        </button>
                    </div>
                </div>
            )}

            <Sidebar />

            <div className="lg:pl-64 flex flex-col flex-1">
                <header className="bg-transparent pt-6 pb-2">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <div className="flex-1 min-w-0">{header}</div>
                        {/* Top-Right Task Summary Bar Layout (Visible from any page) */}
                        <div className="shrink-0 self-end md:self-auto">
                            <TaskSummaryWidget />
                        </div>
                    </div>
                </header>

                <main className="flex-1">{children}</main>
            </div>
        </div>
    );
}
