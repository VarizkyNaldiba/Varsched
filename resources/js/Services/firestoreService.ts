import { db, isFirebaseConfigured } from './firebase';
import { Task } from '@/types/task';
import { User } from '@/types';
import {
    collection,
    query,
    where,
    onSnapshot,
    addDoc,
    setDoc,
    updateDoc,
    deleteDoc,
    doc,
    getDocs,
    serverTimestamp,
} from 'firebase/firestore';

const TASKS_COLLECTION = 'tasks';
const USERS_COLLECTION = 'users';

/**
 * Sync authenticated user profile to Firebase Firestore 'users' collection.
 */
export const syncUserToFirestore = async (user: User) => {
    if (!isFirebaseConfigured() || !db || !user?.id) return false;

    try {
        const userRef = doc(db, USERS_COLLECTION, String(user.id));
        await setDoc(
            userRef,
            {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role || 'user',
                updated_at: serverTimestamp(),
            },
            { merge: true }
        );
        return true;
    } catch (error) {
        console.warn('Error syncing user to Firestore:', error);
        return false;
    }
};

/**
 * Subscribe to all users list in Firestore (Admin real-time management).
 */
export const subscribeUserList = (
    onUpdate: (users: User[]) => void
): (() => void) | null => {
    if (!isFirebaseConfigured() || !db) return null;

    try {
        const q = query(collection(db, USERS_COLLECTION));
        return onSnapshot(
            q,
            (snapshot) => {
                const usersList: User[] = [];
                snapshot.forEach((docSnap) => {
                    const data = docSnap.data();
                    usersList.push({
                        id: data.id || Number(docSnap.id.replace(/\D/g, '')) || Date.now(),
                        name: data.name || 'User',
                        email: data.email || '',
                        role: data.role || 'user',
                        created_at: data.created_at || null,
                    } as User);
                });
                onUpdate(usersList);
            },
            (error) => {
                console.warn('Error subscribing to users list:', error);
            }
        );
    } catch (err) {
        console.warn('Could not establish users list listener:', err);
        return null;
    }
};

/**
 * Delete a user from Firestore and cascade delete all associated user tasks.
 */
export const deleteCloudUser = async (userId: number) => {
    if (!isFirebaseConfigured() || !db) return false;
    const firestore = db;

    try {
        // 1. Delete user document from 'users' collection
        await deleteDoc(doc(firestore, USERS_COLLECTION, String(userId)));

        // 2. Cascade delete all tasks belonging to this user_id in 'tasks' collection
        const tasksQuery = query(
            collection(firestore, TASKS_COLLECTION),
            where('user_id', '==', userId)
        );
        const taskSnapshots = await getDocs(tasksQuery);
        const deletePromises = taskSnapshots.docs.map((docSnap) =>
            deleteDoc(doc(firestore, TASKS_COLLECTION, docSnap.id))
        );
        await Promise.all(deletePromises);

        return true;
    } catch (error) {
        console.error('Error deleting cloud user and associated tasks:', error);
        return false;
    }
};

/**
 * Subscribe to realtime tasks from Firestore for a specific user.
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
                        start_time: data.start_time || null,
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
        start_time?: string;
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
 * Update an existing task in Firestore by firestore_id.
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
