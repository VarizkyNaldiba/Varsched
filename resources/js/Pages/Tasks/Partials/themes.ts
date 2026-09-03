export interface CategoryTheme {
    bg: string;
    border: string;
    iconBg: string;
    iconText: string;
    badgeBg: string;
    progress: string;
}

export const CATEGORY_THEMES: CategoryTheme[] = [
    // 1. Flip7 Primary Teal
    {
        bg: 'bg-teal-50/80 dark:bg-teal-950/40',
        border: 'border-teal-200/80 dark:border-teal-700/50',
        iconBg: 'bg-teal-100 dark:bg-teal-900/60',
        iconText: 'text-primary dark:text-primary-light',
        badgeBg: 'bg-teal-100/70 text-primary-dark dark:bg-teal-900/50 dark:text-primary-light',
        progress: 'bg-primary',
    },
    // 2. Flip7 Accent Gold
    {
        bg: 'bg-amber-50/80 dark:bg-amber-950/40',
        border: 'border-amber-200/80 dark:border-amber-700/50',
        iconBg: 'bg-amber-100 dark:bg-amber-900/60',
        iconText: 'text-accent-dark dark:text-accent-light',
        badgeBg: 'bg-amber-100/70 text-amber-800 dark:bg-amber-900/50 dark:text-accent-light',
        progress: 'bg-accent-dark',
    },
    // 3. Flip7 Coral
    {
        bg: 'bg-rose-50/80 dark:bg-rose-950/40',
        border: 'border-rose-200/80 dark:border-rose-700/50',
        iconBg: 'bg-rose-100 dark:bg-rose-900/60',
        iconText: 'text-coral dark:text-coral-light',
        badgeBg: 'bg-rose-100/70 text-coral-dark dark:bg-rose-900/50 dark:text-coral-light',
        progress: 'bg-coral',
    },
    // 4. Flip7 Sky Blue
    {
        bg: 'bg-sky-50/80 dark:bg-sky-950/40',
        border: 'border-sky-200/80 dark:border-sky-700/50',
        iconBg: 'bg-sky-100 dark:bg-sky-900/60',
        iconText: 'text-sky-600 dark:text-sky-400',
        badgeBg: 'bg-sky-100/70 text-sky-800 dark:bg-sky-900/50 dark:text-sky-300',
        progress: 'bg-sky-500',
    },
    // 5. Flip7 Success Emerald
    {
        bg: 'bg-emerald-50/80 dark:bg-emerald-950/40',
        border: 'border-emerald-200/80 dark:border-emerald-700/50',
        iconBg: 'bg-emerald-100 dark:bg-emerald-900/60',
        iconText: 'text-emerald-600 dark:text-emerald-400',
        badgeBg: 'bg-emerald-100/70 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300',
        progress: 'bg-emerald-500',
    },
];
