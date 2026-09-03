import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Task } from './types';
import TasksSummaryBar from './Partials/TasksSummaryBar';
import CategoryCard from './Partials/CategoryCard';
import CreateTaskModal from './Partials/CreateTaskModal';
import { CATEGORY_THEMES } from './Partials/themes';
import { Plus } from 'lucide-react';
import { useState } from 'react';

interface Props {
    tasks: Task[];
}

export default function TasksIndex({ tasks }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalCategory, setModalCategory] = useState<string | null>(null);
    const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});

    const openCreateModal = (categoryPreset?: string) => {
        setModalCategory(categoryPreset || null);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setModalCategory(null);
    };

    const updateStatus = (task: Task, newStatus: string) => {
        router.patch(
            route('tasks.update', task.id),
            { status: newStatus },
            { preserveScroll: true }
        );
    };

    const deleteTask = (taskId: number) => {
        if (confirm('Are you sure you want to delete this task?')) {
            router.delete(route('tasks.destroy', taskId), {
                preserveScroll: true,
            });
        }
    };

    // Group tasks by category
    const groupedTasks = tasks.reduce((groups, task) => {
        const cat = task.category || 'General';
        if (!groups[cat]) {
            groups[cat] = [];
        }
        groups[cat].push(task);
        return groups;
    }, {} as Record<string, Task[]>);

    const categories = Object.keys(groupedTasks);

    const toggleCategoryCollapse = (cat: string) => {
        setCollapsedCategories((prev) => ({
            ...prev,
            [cat]: !prev[cat],
        }));
    };

    const allCollapsed = categories.length > 0 && categories.every((cat) => Boolean(collapsedCategories[cat]));

    const toggleAllCollapse = () => {
        const shouldCollapse = !allCollapsed;
        const newState: Record<string, boolean> = {};
        categories.forEach((cat) => {
            newState[cat] = shouldCollapse;
        });
        setCollapsedCategories(newState);
    };

    const completedTasksCount = tasks.filter((t) => t.status === 'done').length;

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h2 className="font-extrabold text-3xl text-gray-900 dark:text-gray-100 flex items-center gap-3">
                            <span>🎯</span> Tasks by Category
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Manage and organize your tasks separated into category cards
                        </p>
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
                    {/* Summary Bar */}
                    <TasksSummaryBar
                        categoryCount={categories.length}
                        completedTaskCount={completedTasksCount}
                        totalTaskCount={tasks.length}
                        allCollapsed={allCollapsed}
                        onToggleAllCollapse={toggleAllCollapse}
                        onOpenCreateModal={() => openCreateModal()}
                    />

                    {/* Category Cards Grid */}
                    {categories.length === 0 ? (
                        <div className="text-center py-20 bg-white/50 dark:bg-gray-800/50 rounded-3xl border-2 border-dashed border-gray-300 dark:border-gray-700 p-8">
                            <div className="text-6xl mb-4">📂</div>
                            <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-300">
                                No categories or tasks yet
                            </h3>
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
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                            {categories.map((category, idx) => (
                                <CategoryCard
                                    key={category}
                                    category={category}
                                    tasks={groupedTasks[category]}
                                    theme={CATEGORY_THEMES[idx % CATEGORY_THEMES.length]}
                                    isCollapsed={Boolean(collapsedCategories[category])}
                                    onToggleCollapse={toggleCategoryCollapse}
                                    onOpenCreateModal={openCreateModal}
                                    onUpdateStatus={updateStatus}
                                    onDeleteTask={deleteTask}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Create Task Modal */}
            <CreateTaskModal
                isOpen={isModalOpen}
                presetCategory={modalCategory}
                availableCategories={categories}
                onClose={closeModal}
            />
        </AuthenticatedLayout>
    );
}

