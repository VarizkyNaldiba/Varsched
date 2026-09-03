export interface CategoryTheme {
    bg: string;
    border: string;
    iconBg: string;
    iconText: string;
    badgeBg: string;
    progress: string;
}

export const CATEGORY_THEMES: CategoryTheme[] = [
    {
        bg: 'bg-indigo-50 dark:bg-indigo-950/30',
        border: 'border-indigo-200 dark:border-indigo-800/40',
        iconBg: 'bg-indigo-100 dark:bg-indigo-900/50',
        iconText: 'text-indigo-600 dark:text-indigo-400',
        badgeBg: 'bg-indigo-100/70 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300',
        progress: 'bg-indigo-500',
    },
    {
        bg: 'bg-emerald-50 dark:bg-emerald-950/30',
        border: 'border-emerald-200 dark:border-emerald-800/40',
        iconBg: 'bg-emerald-100 dark:bg-emerald-900/50',
        iconText: 'text-emerald-600 dark:text-emerald-400',
        badgeBg: 'bg-emerald-100/70 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
        progress: 'bg-emerald-500',
    },
    {
        bg: 'bg-amber-50 dark:bg-amber-950/30',
        border: 'border-amber-200 dark:border-amber-800/40',
        iconBg: 'bg-amber-100 dark:bg-amber-900/50',
        iconText: 'text-amber-600 dark:text-amber-400',
        badgeBg: 'bg-amber-100/70 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
        progress: 'bg-amber-500',
    },
    {
        bg: 'bg-rose-50 dark:bg-rose-950/30',
        border: 'border-rose-200 dark:border-rose-800/40',
        iconBg: 'bg-rose-100 dark:bg-rose-900/50',
        iconText: 'text-rose-600 dark:text-rose-400',
        badgeBg: 'bg-rose-100/70 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
        progress: 'bg-rose-500',
    },
    {
        bg: 'bg-purple-50 dark:bg-purple-950/30',
        border: 'border-purple-200 dark:border-purple-800/40',
        iconBg: 'bg-purple-100 dark:bg-purple-900/50',
        iconText: 'text-purple-600 dark:text-purple-400',
        badgeBg: 'bg-purple-100/70 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
        progress: 'bg-purple-500',
    },
];

