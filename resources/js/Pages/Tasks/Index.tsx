import { Head, router, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Task } from './types';
import { PageProps } from '@/types';
import TasksSummaryBar from './Partials/TasksSummaryBar';
import CategoryCard from './Partials/CategoryCard';
import CreateTaskModal from './Partials/CreateTaskModal';
import { CATEGORY_THEMES } from './Partials/themes';
import { Plus, ListTodo, FolderArchive, Cloud, Database } from 'lucide-react';
import { useState, useEffect } from 'react';
import { isFirebaseConfigured } from '@/Services/firebase';
import { subscribeUserTasks, updateCloudTask, deleteCloudTask } from '@/Services/firestoreService';

interface Props {
    tasks: Task[];
}

export default function TasksIndex({ tasks }: Props) {
    const { auth } = usePage<PageProps>().props;
    const [activeTasks, setActiveTasks] = useState<Task[]>(tasks);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalCategory, setModalCategory] = useState<string | null>(null);
    const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});
    const isFirebaseActive = isFirebaseConfigured();

    useEffect(() => {
        setActiveTasks(tasks);
    }, [tasks]);

    useEffect(() => {
        if (!isFirebaseActive || !auth?.user?.id) return;
        const unsubscribe = subscribeUserTasks(auth.user.id, (cloudTasks) => {
            if (cloudTasks.length > 0) {
                setActiveTasks(cloudTasks);
            }
        });
        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, [auth?.user?.id, isFirebaseActive]);

    const openCreateModal = (preset?: string) => {
        setModalCategory(preset || null);
        setIsModalOpen(true);
    };

    const updateStatus = (task: Task, newStatus: string) => {
        if (task.firestore_id) {
            updateCloudTask(task.firestore_id, { status: newStatus as any });
        }
        router.patch(route('tasks.update', task.id), { status: newStatus }, { preserveScroll: true });
    };

    const deleteTask = (taskId: number) => {
        if (confirm('Are you sure you want to delete this task?')) {
            const target = activeTasks.find((t) => t.id === taskId);
            if (target?.firestore_id) {
                deleteCloudTask(target.firestore_id);
            }
            router.delete(route('tasks.destroy', taskId), { preserveScroll: true });
        }
    };

    const groupedTasks = activeTasks.reduce((groups, task) => {
        const cat = task.category || 'General';
        if (!groups[cat]) groups[cat] = [];
        groups[cat].push(task);
        return groups;
    }, {} as Record<string, Task[]>);

    const categories = Object.keys(groupedTasks);

    const toggleCollapse = (cat: string) => {
        setCollapsedCategories((prev) => ({ ...prev, [cat]: !prev[cat] }));
    };

    const allCollapsed = categories.length > 0 && categories.every((cat) => Boolean(collapsedCategories[cat]));

    const toggleAllCollapse = () => {
        const shouldCollapse = !allCollapsed;
        const next: Record<string, boolean> = {};
        categories.forEach((cat) => { next[cat] = shouldCollapse; });
        setCollapsedCategories(next);
    };

    const completedCount = activeTasks.filter((t) => t.status === 'done').length;

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h2 className="font-extrabold text-3xl text-gray-900 dark:text-gray-100 flex items-center gap-3">
                            <span className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
                                <ListTodo size={24} strokeWidth={2.5} />
                            </span>
                            <span>Tasks by Category</span>
                        </h2>
                        <div className="flex flex-wrap items-center gap-2.5 mt-1">
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Manage and organize your tasks separated into category cards
                            </p>
                            {isFirebaseActive ? (
                                <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/40">
                                    <Cloud size={12} /> Firebase Realtime
                                </span>
                            ) : (
                                <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 border border-gray-200 dark:border-gray-700">
                                    <Database size={12} /> Local / SQLite
                                </span>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={() => openCreateModal()}
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/25 transition-all hover:scale-105 active:scale-95 cursor-pointer shrink-0"
                    >
                        <Plus size={20} strokeWidth={2.5} />
                        <span>Create Task</span>
                    </button>
                </div>
            }
        >
            <Head title="Tasks" />
            <div className="py-8 pb-20">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-8">
                    <TasksSummaryBar
                        categoryCount={categories.length}
                        completedTaskCount={completedCount}
                        totalTaskCount={activeTasks.length}
                        allCollapsed={allCollapsed}
                        onToggleAllCollapse={toggleAllCollapse}
                        onOpenCreateModal={() => openCreateModal()}
                    />
                    {categories.length === 0 ? (
                        <div className="text-center py-20 bg-white/50 dark:bg-gray-800/50 rounded-3xl border-2 border-dashed border-gray-300 dark:border-gray-700 p-8">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-500 flex items-center justify-center">
                                <FolderArchive size={32} />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-300">No categories or tasks yet</h3>
                            <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-md mx-auto">
                                Start organizing your productivity by creating your first task with a category!
                            </p>
                            <button
                                onClick={() => openCreateModal()}
                                className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/25 transition cursor-pointer"
                            >
                                <Plus size={18} /> Create Your First Task
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
                            {categories.map((category, idx) => (
                                <CategoryCard
                                    key={category}
                                    category={category}
                                    tasks={groupedTasks[category]}
                                    theme={CATEGORY_THEMES[idx % CATEGORY_THEMES.length]}
                                    isCollapsed={Boolean(collapsedCategories[category])}
                                    onToggleCollapse={toggleCollapse}
                                    onOpenCreateModal={openCreateModal}
                                    onUpdateStatus={updateStatus}
                                    onDeleteTask={deleteTask}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <CreateTaskModal
                isOpen={isModalOpen}
                presetCategory={modalCategory}
                availableCategories={categories}
                authUserId={auth?.user?.id}
                onClose={() => { setIsModalOpen(false); setModalCategory(null); }}
            />
        </AuthenticatedLayout>
    );
}
