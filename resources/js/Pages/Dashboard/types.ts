import { Task } from '@/types/task';

export interface HabitDay {
    date: string;
    dayName: string;
    done: boolean;
}

export interface Habit {
    id: number;
    name: string;
    days: HabitDay[];
}

export interface TrendDay {
    day: string;
    date: string;
    count: number;
    height: number;
}

export interface DashboardStats {
    completedTasks: number;
    pendingTasks: number;
    streak: number;
}

export interface DashboardProps {
    stats?: DashboardStats;
    productivityTrends?: TrendDay[];
    habits?: Habit[];
    upcomingTasks?: Task[];
}


