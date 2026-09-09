import Modal from '@/Components/Modal';
import { useForm, usePage } from '@inertiajs/react';
import { Edit2, X, AlertCircle, Save } from 'lucide-react';
import { FormEvent, useEffect } from 'react';
import { updateCloudTask } from '@/Services/firestoreService';
import { Task } from '../types';
import { PageProps } from '@/types';

interface EditTaskModalProps {
    isOpen: boolean;
    task: Task | null;
    availableCategories: string[];
    onClose: () => void;
}

const inputClass = "w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:text-gray-200 rounded-xl px-4 py-2.5 text-sm transition";
const labelClass = "block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5";

export default function EditTaskModal({
    isOpen,
    task,
    availableCategories,
    onClose,
}: EditTaskModalProps) {
    const { data, setData, patch, processing, errors, reset, clearErrors } = useForm({
        title: '',
        category: '',
        status: 'todo',
        priority: 'medium',
        deadline: '',
        start_time: '',
    });

    useEffect(() => {
        if (isOpen && task) {
            clearErrors();
            setData({
                title: task.title || '',
                category: task.category || '',
                status: task.status || 'todo',
                priority: task.priority || 'medium',
                deadline: task.deadline || '',
                start_time: task.start_time ? task.start_time.substring(0, 5) : '',
            });
        }
    }, [isOpen, task]);

    if (!task) return null;

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        if (task.firestore_id) {
            updateCloudTask(task.firestore_id, {
                title: data.title,
                category: data.category || 'General',
                status: data.status as any,
                priority: data.priority as any,
                deadline: data.deadline,
                start_time: data.start_time,
            });
        }

        patch(route('tasks.update', task.id), {
            preserveScroll: true,
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
                        <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                            <Edit2 size={20} strokeWidth={2.5} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                                Edit Task
                            </h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Update the details of your task</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition cursor-pointer"
                    >
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
                            placeholder="Task title"
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
                            list="editCategoryModalList"
                            placeholder="e.g. Study, Work, Personal"
                            value={data.category}
                            onChange={(e) => setData('category', e.target.value)}
                            required
                            className={inputClass}
                        />
                        <datalist id="editCategoryModalList">
                            {availableCategories.map((cat) => <option key={cat} value={cat} />)}
                        </datalist>
                        {errors.category && <p className="text-rose-500 text-xs mt-1">{errors.category}</p>}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>Status</label>
                            <select
                                value={data.status}
                                onChange={(e) => setData('status', e.target.value)}
                                className={inputClass}
                            >
                                <option value="todo">To Do</option>
                                <option value="in-progress">In Progress</option>
                                <option value="done">Done</option>
                            </select>
                            {errors.status && <p className="text-rose-500 text-xs mt-1">{errors.status}</p>}
                        </div>

                        <div>
                            <label className={labelClass}>Priority</label>
                            <select
                                value={data.priority}
                                onChange={(e) => setData('priority', e.target.value)}
                                className={inputClass}
                            >
                                <option value="low">Low Priority</option>
                                <option value="medium">Medium Priority</option>
                                <option value="high">High Priority</option>
                            </select>
                            {errors.priority && <p className="text-rose-500 text-xs mt-1">{errors.priority}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>Deadline Date</label>
                            <input
                                type="date"
                                value={data.deadline}
                                onChange={(e) => setData('deadline', e.target.value)}
                                className={inputClass}
                            />
                            {errors.deadline && <p className="text-rose-500 text-xs mt-1">{errors.deadline}</p>}
                        </div>

                        <div>
                            <label className={labelClass}>Start Time</label>
                            <input
                                type="time"
                                value={data.start_time}
                                onChange={(e) => setData('start_time', e.target.value)}
                                className={inputClass}
                            />
                            {errors.start_time && <p className="text-rose-500 text-xs mt-1">{errors.start_time}</p>}
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm font-bold transition cursor-pointer"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={processing}
                            className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-sm font-bold shadow-md shadow-amber-600/30 transition disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                        >
                            {processing ? (
                                <span>Updating...</span>
                            ) : (
                                <>
                                    <Save size={16} strokeWidth={2.5} />
                                    <span>Save Changes</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}
