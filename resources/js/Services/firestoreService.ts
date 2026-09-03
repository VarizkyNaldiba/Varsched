import { db, isFirebaseConfigured } from './firebase';
import { Task } from '@/types/task';
import {
    collection,
    query,
    where,
    onSnapshot,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    serverTimestamp,
} from 'firebase/firestore';

const TASKS_COLLECTION = 'tasks';

/**
 * Subscribe to realtime tasks from Firestore for a specific user.
 * Returns unsubscribe function, or null if Firebase is not configured.
 */
export const subscribeUserTasks = (
    userId: number,
    onUpdate: (tasks: Task[]) => void
): (() => void) | null => {
    if (!isFirebaseConfigured() || !db) {
        return null;
    }

    try {
        const q = query(
            collection(db, TASKS_COLLECTION),
            where('user_id', '==', userId)
        );

        return onSnapshot(
            q,
            (snapshot) => {
                const tasks: Task[] = [];
                snapshot.forEach((docSnap) => {
                    const data = docSnap.data();
                    tasks.push({
                        id: Number(data.local_id || docSnap.id.replace(/\D/g, '').slice(0, 8) || Date.now()),
                        user_id: data.user_id,
                        title: data.title || '',
                        description: data.description || '',
                        category: data.category || 'General',
                        status: data.status || 'todo',
                        priority: data.priority || 'medium',
                        deadline: data.deadline || '',
                        completed_at: data.completed_at || null,
                        firestore_id: docSnap.id,
                    } as Task & { firestore_id?: string });
                });
                onUpdate(tasks);
            },
            (error) => {
                console.warn('Firestore subscription error:', error);
            }
        );
    } catch (err) {
        console.warn('Could not establish Firestore listener:', err);
        return null;
    }
};

/**
 * Add a new task to Firestore.
 */
export const addCloudTask = async (
    userId: number,
    taskData: {
        title: string;
        description?: string;
        category: string;
        status: string;
        priority: string;
        deadline?: string;
    }
) => {
    if (!isFirebaseConfigured() || !db) return null;

    try {
        const docRef = await addDoc(collection(db, TASKS_COLLECTION), {
            ...taskData,
            user_id: userId,
            local_id: Date.now(),
            created_at: serverTimestamp(),
            updated_at: serverTimestamp(),
        });
        return docRef.id;
    } catch (error) {
        console.error('Error adding task to Firestore:', error);
        return null;
    }
};

/**
 * Update an existing task in Firestore by firestore_id or local_id.
 */
export const updateCloudTask = async (
    firestoreId: string,
    updates: Partial<Task>
) => {
    if (!isFirebaseConfigured() || !db) return false;

    try {
        const taskRef = doc(db, TASKS_COLLECTION, firestoreId);
        await updateDoc(taskRef, {
            ...updates,
            updated_at: serverTimestamp(),
        });
        return true;
    } catch (error) {
        console.error('Error updating task in Firestore:', error);
        return false;
    }
};

/**
 * Delete a task from Firestore.
 */
export const deleteCloudTask = async (firestoreId: string) => {
    if (!isFirebaseConfigured() || !db) return false;

    try {
        await deleteDoc(doc(db, TASKS_COLLECTION, firestoreId));
        return true;
    } catch (error) {
        console.error('Error deleting task from Firestore:', error);
        return false;
    }
};
