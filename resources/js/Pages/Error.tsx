import { Head, Link } from '@inertiajs/react';
import { Home, ArrowLeft, ListTodo, FileQuestion, AlertTriangle, ShieldAlert } from 'lucide-react';
import ApplicationLogo from '@/Components/ApplicationLogo';

interface ErrorProps {
    status: number;
}

export default function ErrorPage({ status }: ErrorProps) {
    const title = {
        503: '503: Layanan Tidak Tersedia',
        500: '500: Kesalahan Server Interal',
        404: '404: Halaman Tidak Ditemukan',
        403: '403: Akses Ditolak',
    }[status] || `${status}: Terjadi Kesalahan`;

    const description = {
        503: 'Maaf, kami sedang melakukan pemeliharaan sistem. Silakan kembali beberapa saat lagi.',
        500: 'Waduh! Terjadi kendala teknis pada server kami. Tim kami sedang menanganinya.',
        404: 'Waduh! Halaman yang Anda cari tidak dapat ditemukan. Mungkin URL salah atau halaman telah dipindahkan.',
        403: 'Maaf, Anda tidak memiliki hak akses untuk membuka halaman ini.',
    }[status] || 'Terjadi kesalahan yang tidak terduga saat memuat halaman.';

    const getIcon = () => {
        switch (status) {
            case 404:
                return <FileQuestion className="w-16 h-16 text-indigo-500 animate-bounce" />;
            case 403:
                return <ShieldAlert className="w-16 h-16 text-rose-500" />;
            default:
                return <AlertTriangle className="w-16 h-16 text-amber-500" />;
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 flex flex-col justify-between p-6 sm:p-10 transition-colors">
            <Head title={title} />

            {/* Header / Brand */}
            <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
                <Link href="/" className="inline-block hover:opacity-90 transition">
                    <ApplicationLogo />
                </Link>
            </div>

            {/* Main Error Content Card */}
            <div className="max-w-2xl mx-auto w-full py-12 text-center my-auto">
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-8 sm:p-12 border border-gray-200/80 dark:border-gray-700/80 shadow-2xl space-y-6">
                    {/* Icon Badge */}
                    <div className="w-24 h-24 mx-auto rounded-3xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-100 dark:border-indigo-800/50 flex items-center justify-center shadow-inner">
                        {getIcon()}
                    </div>

                    {/* Status Pill */}
                    <div className="inline-block px-4 py-1.5 rounded-full text-xs font-black tracking-widest uppercase bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300">
                        Error Code {status}
                    </div>

                    {/* Headlines */}
                    <div className="space-y-2">
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">
                            {title}
                        </h1>
                        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 max-w-md mx-auto leading-relaxed">
                            {description}
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                        <button
                            type="button"
                            onClick={() => window.history.back()}
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm font-bold transition cursor-pointer"
                        >
                            <ArrowLeft size={18} />
                            <span>Kembali</span>
                        </button>

                        <Link
                            href={route('dashboard')}
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-lg shadow-indigo-600/30 transition cursor-pointer"
                        >
                            <Home size={18} />
                            <span>Dashboard Utama</span>
                        </Link>

                        <Link
                            href={route('tasks.index')}
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-slate-800 hover:bg-slate-900 dark:bg-gray-700 dark:hover:bg-gray-600 text-white text-sm font-bold shadow-md transition cursor-pointer"
                        >
                            <ListTodo size={18} />
                            <span>Kelola Tugas</span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Footer Footer text */}
            <div className="max-w-7xl mx-auto w-full text-center text-xs text-gray-400 dark:text-gray-500">
                &copy; {new Date().getFullYear()} Varsched. Seluruh hak cipta dilindungi.
            </div>
        </div>
    );
}
