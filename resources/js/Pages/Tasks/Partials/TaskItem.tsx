import { Task } from '../types';
import { CheckCircle2, Circle, Clock, ChevronDown, Trash2 } from 'lucide-react';

interface TaskItemProps {
    task: Task;
    onUpdateStatus: (task: Task, status: string) => void;
    onDelete: (taskId: number) => void;
}

export default function TaskItem({
    task,
    onUpdateStatus,
    onDelete,
}: TaskItemProps) {
    const isDone = task.status === 'done';

    const getPriorityBadge = (priority: Task['priority']) => {
        switch (priority) {
            case 'high':
                return (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300">
                        High
                    </span>
                );
            case 'medium':
                return (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
                        Medium
                    </span>
                );
            case 'low':
                return (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                        Low
                    </span>
                );
        }
    };

    return (
        <div
            className={`p-4 rounded-xl border transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                isDone
                    ? 'bg-gray-50/70 dark:bg-gray-800/40 border-gray-100 dark:border-gray-700/50 opacity-75'
                    : 'bg-white dark:bg-gray-700/30 border-gray-100 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 shadow-xs'
            }`}
        >
            <div className="flex items-start gap-3 flex-1 min-w-0">
                <button
                    type="button"
                    onClick={() => onUpdateStatus(task, isDone ? 'todo' : 'done')}
                    className={`mt-0.5 shrink-0 rounded-full transition-colors cursor-pointer ${
                        isDone
                            ? 'text-emerald-500 hover:text-emerald-600'
                            : 'text-gray-300 dark:text-gray-600 hover:text-indigo-500'
                    }`}
                    title={isDone ? 'Mark as Incomplete' : 'Mark as Done'}
                >
                    {isDone ? (
                        <CheckCircle2 size={22} strokeWidth={2.5} />
                    ) : (
                        <Circle size={22} strokeWidth={2} />
                    )}
                </button>

                <div className="min-w-0 flex-1">
                    <h4
                        className={`text-sm font-semibold truncate ${
                            isDone
                                ? 'line-through text-gray-400 dark:text-gray-500'
                                : 'text-gray-800 dark:text-gray-200'
                        }`}
                    >
                        {task.title}
                    </h4>

                    <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                        {getPriorityBadge(task.priority)}

                        {(task.deadline || task.start_time) && (
                            <span className="inline-flex items-center gap-1 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-md font-medium">
                                <Clock size={12} className="text-gray-400" />
                                {task.deadline || 'No date'}
                                {task.start_time && ` • ${task.start_time.substring(0, 5)}`}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                <div className="relative">
                    <select
                        value={task.status}
                        onChange={(e) => onUpdateStatus(task, e.target.value)}
                        className={`appearance-none text-xs font-bold pl-2.5 pr-7 py-1.5 rounded-lg border outline-none cursor-pointer transition ${
                            task.status === 'done'
                                ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                                : task.status === 'in-progress'
                                ? 'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700'
                        }`}
                    >
                        <option value="todo">To Do</option>
                        <option value="in-progress">In Progress</option>
                        <option value="done">Done</option>
                    </select>
                    <ChevronDown
                        size={12}
                        className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-50"
                    />
                </div>

                <button
                    type="button"
                    onClick={() => onDelete(task.id)}
                    className="p-1.5 text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition cursor-pointer"
                    title="Delete Task"
                >
                    <Trash2 size={16} />
                </button>
            </div>
        </div>
    );
}

