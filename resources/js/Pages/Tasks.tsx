import { Head, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Plus, Trash2, Clock, Folder, AlertCircle, ChevronDown, CheckCircle2, Circle } from 'lucide-react';
import { FormEvent } from 'react';

interface Task {
    id: number;
    title: string;
    category: string | null;
    status: 'todo' | 'in-progress' | 'done';
    priority: 'low' | 'medium' | 'high';
    deadline: string | null;
    start_time: string | null;
}

interface Props {
    tasks: Task[];
}

export default function Tasks({ tasks }: Props) {
    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        category: '',
        status: 'todo',
        priority: 'medium',
        deadline: '',
        start_time: ''
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post(route('tasks.store'), {
            onSuccess: () => reset(),
        });
    };

    const updateStatus = (task: Task, newStatus: string) => {
        router.patch(route('tasks.update', task.id), {
            status: newStatus,
        });
    };

    const deleteTask = (taskId: number) => {
        router.delete(route('tasks.destroy', taskId));
    };

    // Group tasks by category
    const groupedTasks = tasks.reduce((groups, task) => {
        const cat = task.category || 'Uncategorized';
        if (!groups[cat]) {
            groups[cat] = [];
        }
        groups[cat].push(task);
        return groups;
    }, {} as Record<string, Task[]>);

    // Get color accent for the card left border based on status/priority
    const getCardAccent = (task: Task) => {
        if (task.status === 'done') return 'border-l-success';
        if (task.priority === 'high') return 'border-l-coral shadow-coral-glow';
        if (task.priority === 'medium') return 'border-l-accent shadow-accent-glow';
        return 'border-l-primary shadow-card';
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="font-extrabold text-4xl tracking-wide text-primary-dark dark:text-gray-100 flex items-center gap-3">
                    <span className="text-4xl">🎯</span> My Tasks
                </h2>
            }
        >
            <Head title="Tasks" />

            <div className="py-8 pb-20">
                <div className="max-w-5xl mx-auto sm:px-6 lg:px-8 space-y-10">
                    
                    {/* Add Task Form (Card Style) */}
                    <div className="bg-white dark:bg-gray-800 rounded-[24px] shadow-card border-l-[6px] border-l-primary-light p-6 md:p-8 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -z-0"></div>
                        <h3 className="text-2xl font-bold mb-6 text-primary-dark dark:text-primary-light relative z-10 flex items-center gap-2">
                            <span>✨</span> Create New Task
                        </h3>
                        
                        {Object.keys(errors).length > 0 && (
                            <div className="mb-6 p-4 bg-coral/10 text-coral-dark rounded-xl border border-coral/20 font-medium text-sm flex items-center gap-2">
                                <AlertCircle size={18} /> Please fill out the required fields correctly.
                            </div>
                        )}
                        
                        <form onSubmit={handleSubmit} className="flex flex-col gap-5 relative z-10">
                            <div className="flex flex-col md:flex-row gap-5">
                                <div className="flex-1">
                                    <input 
                                        type="text" 
                                        placeholder="Task title (e.g. Journal Research)" 
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        className="w-full bg-cream dark:bg-gray-900 border-2 border-transparent focus:border-primary focus:ring-4 focus:ring-primary/20 dark:text-gray-200 rounded-2xl px-5 py-4 font-medium transition"
                                    />
                                </div>
                                <div className="w-full md:w-64 relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Folder size={20} className="text-primary-dark/50" />
                                    </div>
                                    <input 
                                        type="text" 
                                        placeholder="Category" 
                                        value={data.category}
                                        onChange={(e) => setData('category', e.target.value)}
                                        className="w-full pl-12 bg-cream dark:bg-gray-900 border-2 border-transparent focus:border-primary focus:ring-4 focus:ring-primary/20 dark:text-gray-200 rounded-2xl px-5 py-4 font-medium transition"
                                    />
                                </div>
                            </div>
                            
                            <div className="flex flex-col md:flex-row gap-5 items-center">
                                <div className="flex gap-3 flex-1 w-full">
                                    <input 
                                        type="date" 
                                        value={data.deadline}
                                        onChange={(e) => setData('deadline', e.target.value)}
                                        className="flex-1 bg-cream dark:bg-gray-900 border-2 border-transparent focus:border-primary focus:ring-4 focus:ring-primary/20 dark:text-gray-200 rounded-2xl px-5 py-4 font-medium transition text-gray-600 dark:text-gray-300"
                                        title="Date"
                                    />
                                    <input 
                                        type="time" 
                                        value={data.start_time}
                                        onChange={(e) => setData('start_time', e.target.value)}
                                        className="w-32 md:w-40 bg-cream dark:bg-gray-900 border-2 border-transparent focus:border-primary focus:ring-4 focus:ring-primary/20 dark:text-gray-200 rounded-2xl px-5 py-4 font-medium transition text-gray-600 dark:text-gray-300"
                                        title="Start Time"
                                    />
                                </div>
                                <button 
                                    type="submit" 
                                    disabled={processing}
                                    className="w-full md:w-auto h-[64px] min-w-[160px] inline-flex justify-center items-center px-8 bg-gradient-to-b from-accent-light to-accent border-b-4 border-accent-dark rounded-full font-extrabold text-lg text-primary-dark tracking-wide hover:brightness-110 active:border-b-0 active:translate-y-1 transition-all disabled:opacity-50 shadow-accent-glow relative overflow-hidden bounce-scale"
                                >
                                    {/* Gloss overlay */}
                                    <div className="absolute top-0 inset-x-0 h-1/2 bg-white/20 rounded-t-full pointer-events-none"></div>
                                    <Plus size={22} className="mr-2" strokeWidth={3} /> Add Task
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Task List (Grouped) */}
                    <div className="space-y-12 mt-12">
                        {Object.keys(groupedTasks).length === 0 ? (
                            <div className="text-center py-20 bg-white/50 dark:bg-gray-800/50 rounded-[32px] border-[3px] border-dashed border-gray-300 dark:border-gray-700">
                                <div className="text-6xl mb-4">📭</div>
                                <h3 className="text-2xl font-bold text-gray-400 dark:text-gray-500">No tasks yet</h3>
                                <p className="text-gray-400 font-medium mt-2">Time to add your first Flip7 task!</p>
                            </div>
                        ) : (
                            Object.keys(groupedTasks).map(category => (
                                <div key={category} className="space-y-6">
                                    <div className="flex items-center gap-4">
                                        <h3 className="text-2xl font-extrabold text-primary-dark dark:text-primary-light flex items-center gap-2">
                                            <span className="bg-primary/10 p-2 rounded-xl text-primary"><Folder size={24} /></span>
                                            {category}
                                        </h3>
                                        <div className="h-[3px] flex-1 bg-gray-200 dark:bg-gray-700 border-b-[3px] border-dashed border-gray-300 dark:border-gray-600 rounded-full"></div>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 gap-5">
                                        {groupedTasks[category].map(task => (
                                            <div 
                                                key={task.id} 
                                                className={`bg-white dark:bg-gray-800 rounded-[24px] border-l-[6px] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-300 hover:-translate-y-1 ${getCardAccent(task)} ${task.status === 'done' ? 'opacity-70 bg-gray-50 dark:bg-gray-800/80' : ''}`}
                                            >
                                                <div className="flex items-start sm:items-center gap-4">
                                                    <button 
                                                        onClick={() => updateStatus(task, task.status === 'done' ? 'todo' : 'done')}
                                                        className={`shrink-0 rounded-full p-1 transition-colors ${task.status === 'done' ? 'text-success hover:text-success/80' : 'text-gray-300 hover:text-primary'}`}
                                                    >
                                                        {task.status === 'done' ? <CheckCircle2 size={28} strokeWidth={2.5} /> : <Circle size={28} strokeWidth={2.5} />}
                                                    </button>
                                                    
                                                    <div>
                                                        <h4 className={`text-lg font-bold ${task.status === 'done' ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-white'}`}>
                                                            {task.title}
                                                        </h4>
                                                        {(task.deadline || task.start_time) && (
                                                            <div className="flex items-center text-sm font-medium text-gray-500 dark:text-gray-400 mt-1.5 bg-surface-base dark:bg-gray-900 w-fit px-2.5 py-1 rounded-lg">
                                                                <Clock size={14} className="mr-1.5 text-primary" /> 
                                                                {task.deadline || 'No date'} {task.start_time && `• ${task.start_time.substring(0, 5)}`}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                
                                                <div className="flex items-center gap-3 self-end sm:self-auto">
                                                    {/* Status Dropdown */}
                                                    <div className="relative group/dropdown">
                                                        <select
                                                            value={task.status}
                                                            onChange={(e) => updateStatus(task, e.target.value)}
                                                            className={`appearance-none font-bold text-sm px-4 py-2 pr-10 rounded-full border-2 outline-none cursor-pointer transition-all ${
                                                                task.status === 'done' ? 'bg-success/10 text-success border-success/20' : 
                                                                task.status === 'in-progress' ? 'bg-accent/10 text-accent-dark border-accent/30' : 
                                                                'bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600'
                                                            }`}
                                                        >
                                                            <option value="todo">To Do</option>
                                                            <option value="in-progress">In Progress</option>
                                                            <option value="done">Done</option>
                                                        </select>
                                                        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-50" />
                                                    </div>
                                                    
                                                    <button 
                                                        onClick={() => deleteTask(task.id)}
                                                        className="p-2.5 bg-gray-100 hover:bg-coral hover:text-white dark:bg-gray-700 text-gray-400 dark:hover:bg-coral dark:hover:text-white rounded-full transition-colors bounce-scale"
                                                        title="Delete Task"
                                                    >
                                                        <Trash2 size={18} strokeWidth={2.5} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
