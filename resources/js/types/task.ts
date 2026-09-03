export interface Task {
    id: number;
    title: string;
    category: string | null;
    status: 'todo' | 'in-progress' | 'done';
    priority: 'low' | 'medium' | 'high';
    deadline: string | null;
    start_time: string | null;
}
