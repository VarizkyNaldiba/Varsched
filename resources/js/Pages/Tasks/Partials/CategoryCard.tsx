import { Task } from '../types';
import { CategoryTheme } from './themes';
import TaskItem from './TaskItem';
import { Folder, Plus, ChevronDown, ChevronRight } from 'lucide-react';

interface CategoryCardProps {
    category: string;
    tasks: Task[];
    theme: CategoryTheme;
    isCollapsed: boolean;
    onToggleCollapse: (category: string) => void;
    onOpenCreateModal: (category: string) => void;
    onUpdateStatus: (task: Task, status: string) => void;
    onDeleteTask: (taskId: number) => void;
}

export default function CategoryCard({
    category,
    tasks,
    theme,
    isCollapsed,
    onToggleCollapse,
    onOpenCreateModal,
    onUpdateStatus,
    onDeleteTask,
}: CategoryCardProps) {
    const completedCount = tasks.filter((t) => t.status === 'done').length;
    const totalCount = tasks.length;
    const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700/80 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col">
            {/* Category Card Header */}
            <div
                className={`p-5 sm:p-6 ${theme.bg} ${
                    !isCollapsed ? 'border-b border-gray-100 dark:border-gray-700/80' : ''
                } transition-all`}
            >
                <div className="flex items-center justify-between gap-3">
                    <div
                        onClick={() => onToggleCollapse(category)}
                        className="flex items-center gap-3 cursor-pointer group flex-1 min-w-0"
                        title={isCollapsed ? `Click to expand ${category}` : `Click to minimize ${category}`}
                    >
                        <div
                            className={`w-12 h-12 rounded-xl flex items-center justify-center ${theme.iconBg} ${theme.iconText} shadow-sm group-hover:scale-105 transition-transform shrink-0`}
                        >
                            <Folder size={22} />
                        </div>
                        <div className="min-w-0">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                <span className="truncate">{category}</span>
                            </h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                {completedCount} of {totalCount} tasks completed ({progressPct}%)
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                        <button
                            type="button"
                            onClick={() => onOpenCreateModal(category)}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 text-xs font-bold rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm hover:shadow transition cursor-pointer"
                            title={`Add task to ${category}`}
                        >
                            <Plus size={15} />
                            <span>Add Task</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => onToggleCollapse(category)}
                            className="p-2 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm transition hover:scale-105 cursor-pointer flex items-center justify-center"
                            title={isCollapsed ? 'Expand card' : 'Minimize card'}
                        >
                            <ChevronDown
                                size={16}
                                className={`transition-transform duration-300 ${
                                    isCollapsed ? '-rotate-90 text-indigo-600 dark:text-indigo-400' : 'rotate-0'
                                }`}
                            />
                        </button>
                    </div>
                </div>

                <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full mt-4 overflow-hidden">
                    <div
                        className={`h-full transition-all duration-500 rounded-full ${theme.progress}`}
                        style={{ width: `${progressPct}%` }}
                    />
                </div>

                {isCollapsed && (
                    <div
                        onClick={() => onToggleCollapse(category)}
                        className="mt-3 pt-2 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer flex items-center justify-center gap-1.5 transition border-t border-gray-200/50 dark:border-gray-700/50"
                    >
                        <ChevronRight size={14} className="text-indigo-500" />
                        <span>Card minimized • Click to show {totalCount} {totalCount === 1 ? 'task' : 'tasks'}</span>
                    </div>
                )}
            </div>

            {/* Task List Inside Category Card */}
            {!isCollapsed && (
                <>
                    <div className="p-5 sm:p-6 space-y-3.5 flex-1">
                        {tasks.map((task) => (
                            <TaskItem
                                key={task.id}
                                task={task}
                                onUpdateStatus={onUpdateStatus}
                                onDelete={onDeleteTask}
                            />
                        ))}
                    </div>

                    <div className="p-4 border-t border-gray-100 dark:border-gray-700/80 bg-gray-50/50 dark:bg-gray-800/50 text-center">
                        <button
                            type="button"
                            onClick={() => onOpenCreateModal(category)}
                            className="text-xs font-semibold text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 inline-flex items-center gap-1 transition cursor-pointer"
                        >
                            <Plus size={14} /> Add another task to {category}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

