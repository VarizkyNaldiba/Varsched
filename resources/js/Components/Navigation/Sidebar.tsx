import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link, usePage, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import {
    LayoutDashboard,
    ListTodo,
    Calendar,
    Timer,
    Sun,
    Moon,
    LogOut,
    User,
    Menu,
    X,
    Cloud,
    Database,
    Mail,
    Send,
    CheckCircle2,
    ShieldCheck,
    Users,
    ArrowLeftRight,
    History,
} from 'lucide-react';
import { isFirebaseConfigured } from '@/Services/firebase';

export default function Sidebar() {
    const user = usePage().props.auth.user;
    const [mobileOpen, setMobileOpen] = useState(false);
    const [sendingEmail, setSendingEmail] = useState(false);
    const [emailSuccess, setEmailSuccess] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(
        typeof document !== 'undefined'
            ? document.documentElement.classList.contains('dark')
            : false
    );
    const isFirebaseActive = isFirebaseConfigured();

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
            localStorage.theme = 'dark';
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.theme = 'light';
        }
    }, [isDarkMode]);

    const toggleTheme = () => setIsDarkMode(!isDarkMode);

    const handleSendReminder = () => {
        setSendingEmail(true);
        setEmailSuccess(false);
        router.post(
            route('notifications.send-reminder'),
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    setSendingEmail(false);
                    setEmailSuccess(true);
                    setTimeout(() => setEmailSuccess(false), 3500);
                },
                onError: () => {
                    setSendingEmail(false);
                },
            }
        );
    };

    const navItems = [
        {
            name: 'Dashboard',
            href: route('dashboard'),
            active: route().current('dashboard'),
            icon: LayoutDashboard,
        },
        {
            name: 'Tasks',
            href: route('tasks.index'),
            active: route().current('tasks.*'),
            icon: ListTodo,
        },
        {
            name: 'Calendar',
            href: route('calendar'),
            active: route().current('calendar'),
            icon: Calendar,
        },
        {
            name: 'Pomodoro Timer',
            href: route('pomodoro'),
            active: route().current('pomodoro'),
            icon: Timer,
        },
    ];

    const isAdmin = user.role === 'admin';

    const adminNavItems = [
        {
            name: 'Dashboard Admin',
            href: route('admin.dashboard'),
            active: route().current('admin.dashboard'),
            icon: ShieldCheck,
        },
        {
            name: 'Kelola Akun',
            href: route('admin.users.index'),
            active: route().current('admin.users.*'),
            icon: Users,
        },
        {
            name: 'Migrasi Data',
            href: route('admin.migrations.index'),
            active: route().current('admin.migrations.*'),
            icon: ArrowLeftRight,
        },
        {
            name: 'Log Aktivitas',
            href: route('admin.activity.index'),
            active: route().current('admin.activity.*'),
            icon: History,
        },
    ];

    const sidebarContent = (
        <div className="flex flex-col h-full justify-between p-5 overflow-y-auto">
            {/* Top: Logo & Navigation */}
            <div className="space-y-6">
                {/* Brand Header */}
                <div className="flex items-center justify-between px-2 pt-2">
                    <Link href="/" className="inline-block">
                        <ApplicationLogo />
                    </Link>
                    <button
                        onClick={() => setMobileOpen(false)}
                        className="lg:hidden p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                        aria-label="Close sidebar"
                    >
                        <X size={22} />
                    </button>
                </div>

                {/* Nav Links */}
                <nav className="space-y-1.5 pt-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => setMobileOpen(false)}
                                className={`flex items-center gap-3.5 px-4 py-3 rounded-[18px] text-sm font-extrabold transition-all duration-200 ${
                                    item.active
                                        ? 'bg-primary text-white shadow-teal-glow translate-x-1'
                                        : 'text-gray-600 dark:text-gray-300 hover:bg-primary-bg dark:hover:bg-primary-dark/20 hover:text-primary hover:translate-x-1'
                                }`}
                            >
                                <Icon size={20} strokeWidth={item.active ? 2.5 : 2} />
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}

                    {/* Admin Panel Section */}
                    {isAdmin && (
                        <div className="pt-3 border-t border-dashed border-coral/30 mt-2">
                            <div className="px-3 pb-1.5 text-[11px] font-black uppercase tracking-wider text-coral dark:text-coral-light flex items-center gap-1.5">
                                <ShieldCheck size={14} />
                                <span>Admin Panel</span>
                            </div>
                            <div className="space-y-1">
                                {adminNavItems.map((item) => {
                                    const Icon = item.icon;
                                    return (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            onClick={() => setMobileOpen(false)}
                                            className={`flex items-center gap-3.5 px-4 py-2.5 rounded-[18px] text-xs font-extrabold transition-all duration-200 ${
                                                item.active
                                                    ? 'bg-coral text-white shadow-coral-glow translate-x-1'
                                                    : 'text-gray-600 dark:text-gray-300 hover:bg-coral-light/20 hover:text-coral-dark dark:hover:text-coral-light hover:translate-x-1'
                                            }`}
                                        >
                                            <Icon size={18} strokeWidth={item.active ? 2.5 : 2} />
                                            <span>{item.name}</span>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </nav>
            </div>

            {/* Bottom: Email Notification, Theme Toggle & User Profile */}
            <div className="space-y-3 pt-4 border-t-[2px] border-dashed border-primary/20 dark:border-gray-700">
                {/* Email Notification Card */}
                <div className="p-3 rounded-2xl bg-primary-bg/70 dark:bg-primary-dark/20 border border-primary/20 space-y-2">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="p-1 rounded-lg bg-primary text-white">
                                <Mail size={12} strokeWidth={2.5} />
                            </span>
                            <span className="text-[11px] font-black text-primary-dark dark:text-primary-light uppercase tracking-wider">
                                Notifikasi Email
                            </span>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                            Terhubung
                        </span>
                    </div>

                    <p className="text-[11px] text-gray-600 dark:text-gray-300 truncate font-medium">
                        Ke: <span className="font-bold text-gray-800 dark:text-gray-100">{user.email}</span>
                    </p>

                    <button
                        onClick={handleSendReminder}
                        disabled={sendingEmail}
                        className={`w-full flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-xl text-xs font-bold transition shadow-sm cursor-pointer disabled:opacity-60 ${
                            emailSuccess
                                ? 'bg-emerald-600 text-white'
                                : 'bg-primary hover:bg-primary-dark text-white'
                        }`}
                    >
                        {sendingEmail ? (
                            <span>Mengirim...</span>
                        ) : emailSuccess ? (
                            <>
                                <CheckCircle2 size={13} />
                                <span>Terkirim ke Email!</span>
                            </>
                        ) : (
                            <>
                                <Send size={11} />
                                <span>Kirim Pengingat Tugas</span>
                            </>
                        )}
                    </button>
                </div>

                {/* Theme Switcher Button */}
                <button
                    onClick={toggleTheme}
                    className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-surface-base dark:bg-gray-900/60 hover:bg-primary-bg dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-bold transition cursor-pointer border border-primary/10 dark:border-gray-700"
                >
                    <span className="flex items-center gap-2">
                        {isDarkMode ? <Moon size={16} className="text-accent" /> : <Sun size={16} className="text-coral" />}
                        <span>{isDarkMode ? 'Dark Mode' : 'Light Mode'}</span>
                    </span>
                    <span className="text-[11px] font-semibold text-primary">Switch</span>
                </button>

                {/* User Info & Actions */}
                <div className="p-3 rounded-2xl bg-cream/70 dark:bg-gray-900/50 border border-primary/20 dark:border-gray-700 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-10 h-10 rounded-xl bg-primary text-white font-extrabold flex items-center justify-center text-base shadow-sm shrink-0">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                                <p className="text-sm font-extrabold text-gray-900 dark:text-gray-100 truncate">
                                    {user.name}
                                </p>
                                {isAdmin && (
                                    <span className="text-[9px] font-black px-1.5 py-0.5 bg-coral text-white rounded-md tracking-wider">
                                        ADMIN
                                    </span>
                                )}
                            </div>
                            <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400 truncate">
                                {user.email}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                        <Link
                            href={route('profile.edit')}
                            title="Profile Settings"
                            className="p-2 rounded-lg text-gray-500 hover:text-primary hover:bg-white dark:hover:bg-gray-800 transition cursor-pointer"
                        >
                            <User size={17} />
                        </Link>
                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            title="Log Out"
                            className="p-2 rounded-lg text-gray-500 hover:text-coral hover:bg-white dark:hover:bg-gray-800 transition cursor-pointer"
                        >
                            <LogOut size={17} />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <>
            {/* Desktop Fixed Sidebar */}
            <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:flex lg:w-64 lg:flex-col bg-white dark:bg-gray-800 border-r-[3px] border-dashed border-primary/20 dark:border-gray-700 z-30 shadow-card">
                {sidebarContent}
            </aside>

            {/* Mobile Top Navigation Bar */}
            <header className="lg:hidden sticky top-0 z-40 flex items-center justify-between px-4 py-3 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border-b-[3px] border-dashed border-primary/20 dark:border-gray-700 shadow-sm">
                <Link href="/" className="shrink-0">
                    <ApplicationLogo />
                </Link>

                <div className="flex items-center gap-2">
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-xl text-gray-500 hover:text-primary dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                        aria-label="Toggle theme"
                    >
                        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                    </button>

                    <button
                        onClick={() => setMobileOpen(true)}
                        className="p-2.5 rounded-xl bg-primary-bg dark:bg-gray-700 text-primary-dark dark:text-primary-light hover:bg-primary hover:text-white transition shadow-sm cursor-pointer"
                        aria-label="Open sidebar"
                    >
                        <Menu size={22} strokeWidth={2.5} />
                    </button>
                </div>
            </header>

            {/* Mobile Sidebar Overlay Drawer */}
            {mobileOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-primary-dark/30 backdrop-blur-sm transition-opacity"
                        onClick={() => setMobileOpen(false)}
                    />

                    {/* Drawer Content */}
                    <div className="fixed inset-y-0 left-0 w-72 max-w-[85vw] bg-white dark:bg-gray-800 shadow-2xl z-50 border-r-[3px] border-dashed border-primary/20 animate-slide-in-right">
                        {sidebarContent}
                    </div>
                </div>
            )}
        </>
    );
}
