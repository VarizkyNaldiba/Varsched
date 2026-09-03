import { Layers, CheckCircle2, ChevronDown, Sparkles } from 'lucide-react';

interface TasksSummaryBarProps {
    categoryCount: number;
    completedTaskCount: number;
    totalTaskCount: number;
    allCollapsed: boolean;
    onToggleAllCollapse: () => void;
    onOpenCreateModal: () => void;
}

export default function TasksSummaryBar({
    categoryCount,
    completedTaskCount,
    totalTaskCount,
    allCollapsed,
    onToggleAllCollapse,
    onOpenCreateModal,
}: TasksSummaryBarProps) {
    return (
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-2xl border border-gray-100 dark:border-gray-700 p-4 sm:p-6 shadow-sm flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                    <span className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400">
                        <Layers size={18} />
                    </span>
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Categories</p>
                        <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{categoryCount}</p>
                    </div>
                </div>

                <div className="h-8 w-px bg-gray-200 dark:bg-gray-700" />

                <div className="flex items-center gap-2">
                    <span className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 size={18} />
                    </span>
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Total Tasks</p>
                        <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                            {completedTaskCount} / {totalTaskCount} Done
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <button
                    type="button"
                    onClick={onToggleAllCollapse}
                    className="text-xs font-semibold px-3.5 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                    title={allCollapsed ? 'Expand all cards' : 'Minimize all cards'}
                >
                    <ChevronDown
                        size={14}
                        className={`transition-transform duration-200 ${allCollapsed ? '-rotate-90' : 'rotate-0'}`}
                    />
                    <span>{allCollapsed ? 'Expand All Cards' : 'Minimize All Cards'}</span>
                </button>

                <button
                    type="button"
                    onClick={onOpenCreateModal}
                    className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 flex items-center gap-1.5 transition cursor-pointer"
                >
                    <Sparkles size={16} /> Add Task
                </button>
            </div>
        </div>
    );
}

