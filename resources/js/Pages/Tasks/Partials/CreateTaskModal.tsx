import Modal from '@/Components/Modal';
import { useForm } from '@inertiajs/react';
import { Plus, X, AlertCircle } from 'lucide-react';
import { FormEvent, useEffect } from 'react';
import { addCloudTask } from '@/Services/firestoreService';

interface CreateTaskModalProps {
    isOpen: boolean;
    presetCategory: string | null;
    availableCategories: string[];
    authUserId?: number;
    onClose: () => void;
}

const inputClass = "w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:text-gray-200 rounded-xl px-4 py-2.5 text-sm transition";
const labelClass = "block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5";

export default function CreateTaskModal({
    isOpen,
    presetCategory,
    availableCategories,
    authUserId,
    onClose,
}: CreateTaskModalProps) {
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        title: '',
        category: '',
        status: 'todo',
        priority: 'medium',
        deadline: new Date().toISOString().split('T')[0],
        start_time: '09:00',
    });

    useEffect(() => {
        if (isOpen) {
            clearErrors();
            setData({
                title: '',
                category: presetCategory || '',
                status: 'todo',
                priority: 'medium',
                deadline: new Date().toISOString().split('T')[0],
                start_time: '09:00',
            });
        }
    }, [isOpen, presetCategory]);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (authUserId) {
            addCloudTask(authUserId, {
                title: data.title,
                category: data.category || 'General',
                status: data.status,
                priority: data.priority,
                deadline: data.deadline,
            });
        }
        post(route('tasks.store'), {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    return (
        <Modal show={isOpen} onClose={onClose} maxWidth="lg">
            <div className="p-6 sm:p-8">
                <div className="flex items-center justify-between pb-4 mb-6 border-b border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                            <Plus size={22} strokeWidth={2.5} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                                {presetCategory ? `Add Task to "${presetCategory}"` : 'Create New Task'}
                            </h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Fill in the task details below</p>
                        </div>
                    </div>
                    <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition cursor-pointer">
                        <X size={20} />
                    </button>
                </div>

                {Object.keys(errors).length > 0 && (
                    <div className="mb-6 p-4 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 rounded-xl border border-rose-200 dark:border-rose-800 text-sm flex items-center gap-2">
                        <AlertCircle size={18} className="shrink-0" />
                        <span>Please check the required fields below.</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className={labelClass}>Task Title <span className="text-rose-500">*</span></label>
                        <input
                            type="text"
                            placeholder="e.g. Complete math assignment"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            required
                            className={inputClass}
                        />
                        {errors.title && <p className="text-rose-500 text-xs mt-1">{errors.title}</p>}
                    </div>

                    <div>
                        <label className={labelClass}>Category <span className="text-rose-500">*</span></label>
                        <input
                            type="text"
                            list="categoryModalList"
                            placeholder="e.g. Study, Work, Personal"
                            value={data.category}
                            onChange={(e) => setData('category', e.target.value)}
                            required
                            className={inputClass}
                        />
                        <datalist id="categoryModalList">
                            {availableCategories.map((cat) => <option key={cat} value={cat} />)}
                        </datalist>
                        {errors.category && <p className="text-rose-500 text-xs mt-1">{errors.category}</p>}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>Status</label>
                            <select value={data.status} onChange={(e) => setData('status', e.target.value)} className={inputClass}>
                                <option value="todo">To Do</option>
                                <option value="in-progress">In Progress</option>
                                <option value="done">Done</option>
                            </select>
                            {errors.status && <p className="text-rose-500 text-xs mt-1">{errors.status}</p>}
                        </div>

                        <div>
                            <label className={labelClass}>Priority</label>
                            <select value={data.priority} onChange={(e) => setData('priority', e.target.value)} className={inputClass}>
                                <option value="low">Low Priority</option>
                                <option value="medium">Medium Priority</option>
                                <option value="high">High Priority</option>
                            </select>
                            {errors.priority && <p className="text-rose-500 text-xs mt-1">{errors.priority}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>Deadline Date <span className="text-rose-500">*</span></label>
                            <input type="date" value={data.deadline} onChange={(e) => setData('deadline', e.target.value)} required className={inputClass} />
                            {errors.deadline && <p className="text-rose-500 text-xs mt-1">{errors.deadline}</p>}
                        </div>

                        <div>
                            <label className={labelClass}>Start Time <span className="text-rose-500">*</span></label>
                            <input type="time" value={data.start_time} onChange={(e) => setData('start_time', e.target.value)} required className={inputClass} />
                            {errors.start_time && <p className="text-rose-500 text-xs mt-1">{errors.start_time}</p>}
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700 mt-6">
                        <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm font-bold transition cursor-pointer">
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={processing}
                            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-md shadow-indigo-600/30 transition disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                        >
                            {processing ? <span>Saving...</span> : <><Plus size={16} strokeWidth={2.5} /><span>Create Task</span></>}
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}

