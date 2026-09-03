import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { Sparkles } from 'lucide-react';

export default function Welcome({
    auth,
    laravelVersion,
    phpVersion,
}: PageProps<{ laravelVersion: string; phpVersion: string }>) {
    return (
        <>
            <Head title="Welcome to Varsched" />
            <div className="min-h-screen bg-surface-base text-gray-900 flex flex-col justify-center items-center relative overflow-hidden">
                {/* Decorative background elements */}
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent/10 rounded-full blur-3xl"></div>
                
                <div className="relative z-10 w-full max-w-4xl px-6 flex flex-col items-center text-center space-y-12">
                    {/* Logo */}
                    <div className="scale-125 md:scale-150 mb-4 bounce-scale">
                        <ApplicationLogo className="w-auto h-auto" />
                    </div>

                    {/* Hero Text */}
                    <div className="space-y-6 max-w-2xl">
                        <h1 className="text-5xl md:text-7xl font-extrabold text-primary-dark tracking-tight leading-tight">
                            The playful way to <br className="hidden md:block" />
                            <span className="relative inline-block">
                                <span className="relative z-10 text-accent underline decoration-[6px] decoration-accent-dark/30 underline-offset-8">manage your time</span>
                                <Sparkles className="absolute -top-6 -right-8 text-accent animate-pulse" size={32} />
                            </span>
                        </h1>
                        <p className="text-xl text-primary/80 font-medium max-w-xl mx-auto">
                            Varsched makes scheduling and task management feel less like a chore and more like a game. 
                        </p>
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-5 w-full max-w-md mx-auto">
                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="w-full h-[72px] inline-flex justify-center items-center bg-gradient-to-b from-primary-light to-primary border-b-[6px] border-primary-dark rounded-full font-extrabold text-xl text-white tracking-wide hover:brightness-110 active:border-b-0 active:translate-y-1.5 transition-all shadow-teal-glow bounce-scale"
                            >
                                Enter Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className="flex-1 h-[64px] inline-flex justify-center items-center bg-white border-[4px] border-primary rounded-full font-extrabold text-lg text-primary-dark tracking-wide hover:bg-primary-bg active:scale-95 transition-all shadow-sm bounce-scale"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="flex-1 h-[64px] inline-flex justify-center items-center bg-gradient-to-b from-accent-light to-accent border-b-[4px] border-accent-dark rounded-full font-extrabold text-lg text-primary-dark tracking-wide hover:brightness-110 active:border-b-0 active:translate-y-1 transition-all shadow-accent-glow bounce-scale relative overflow-hidden"
                                >
                                    {/* Gloss overlay */}
                                    <div className="absolute top-0 inset-x-0 h-1/2 bg-white/30 rounded-t-full pointer-events-none"></div>
                                    Register Free
                                </Link>
                            </>
                        )}
                    </div>
                </div>

                <footer className="absolute bottom-6 text-center text-sm font-bold text-primary/40">
                    Varsched © {new Date().getFullYear()} • Built with Laravel {laravelVersion}
                </footer>
            </div>
        </>
    );
}
