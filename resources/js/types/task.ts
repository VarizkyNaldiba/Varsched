export interface Task {
    id: number;
    user_id?: number;
    title: string;
    description?: string | null;
    category: string | null;
    status: 'todo' | 'in-progress' | 'done';
    priority: 'low' | 'medium' | 'high';
    deadline: string | null;
    start_time?: string | null;
    firestore_id?: string;
}
