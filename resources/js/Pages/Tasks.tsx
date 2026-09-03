import { Head, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Plus, GripVertical, Trash2, Check, Clock } from 'lucide-react';
import { FormEvent } from 'react';

interface Task {
    id: number;
    title: string;
    status: 'todo' | 'in-progress' | 'done';
    priority: 'low' | 'medium' | 'high';
    deadline: string | null;
}

interface Props {
    tasks: Task[];
}

export default function Tasks({ tasks }: Props) {
    const { data, setData, post, processing, reset, errors } = useForm({
        title: '',
        status: 'todo',
        priority: 'medium',
        deadline: ''
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!data.title.trim()) return;
        post(route('tasks.store'), {
            onSuccess: () => reset(),
        });
    };

    const updateStatus = (id: number, status: string) => {
        router.patch(route('tasks.update', id), { status });
    };

    const deleteTask = (id: number) => {
        router.delete(route('tasks.destroy', id));
    };

    const columns = [
        { id: 'todo', title: 'To Do' },
        { id: 'in-progress', title: 'In Progress' },
        { id: 'done', title: 'Done' }
    ];

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return 'border-l-4 border-rose-500';
            case 'medium': return 'border-l-4 border-amber-500';
            case 'low': return 'border-l-4 border-emerald-500';
            default: return '';
        }
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Tasks & Kanban</h2>}
        >
            <Head title="Tasks" />

            <div className="py-12 h-[calc(100vh-65px)] flex flex-col">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 w-full flex-1 flex flex-col gap-6">
                    
                    {/* Add Task Form */}
                    <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md overflow-hidden shadow-sm sm:rounded-lg border border-gray-100 dark:border-gray-700">
                        <form onSubmit={handleSubmit} className="p-4 flex gap-4">
                            <div className="flex-1">
                                <input 
                                    type="text" 
                                    placeholder="What needs to be done?" 
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    className="w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                />
                                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                            </div>
                            <button 
                                type="submit" 
                                disabled={processing}
                                className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 focus:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition ease-in-out duration-150 disabled:opacity-50"
                            >
                                <Plus size={16} className="mr-1" /> Add Task
                            </button>
                        </form>
                    </div>

                    {/* Kanban Board */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
                        {columns.map(column => (
                            <div key={column.id} className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-md rounded-lg border border-gray-100 dark:border-gray-700 flex flex-col overflow-hidden">
                                <div className="p-4 flex justify-between items-center border-b border-gray-100 dark:border-gray-700">
                                    <h3 className="font-semibold text-gray-800 dark:text-gray-200">{column.title}</h3>
                                    <span className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full text-xs font-bold">
                                        {tasks.filter(t => t.status === column.id).length}
                                    </span>
                                </div>
                                <div className="p-4 flex-1 overflow-y-auto space-y-3">
                                    {tasks.filter(t => t.status === column.id).map(task => (
                                        <div key={task.id} className={`bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-3 transition hover:shadow-md hover:-translate-y-0.5 ${getPriorityColor(task.priority)}`}>
                                            <div className="text-gray-400 cursor-grab">
                                                <GripVertical size={16} />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">{task.title}</h4>
                                                {task.deadline && (
                                                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                        <Clock size={12} className="mr-1" /> {task.deadline}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex gap-1">
                                                {column.id !== 'done' && (
                                                    <button onClick={() => updateStatus(task.id, 'done')} className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded transition">
                                                        <Check size={16} />
                                                    </button>
                                                )}
                                                {column.id === 'done' && (
                                                    <button onClick={() => updateStatus(task.id, 'todo')} className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded transition">
                                                        <Clock size={16} />
                                                    </button>
                                                )}
                                                <button onClick={() => deleteTask(task.id)} className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded transition">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
