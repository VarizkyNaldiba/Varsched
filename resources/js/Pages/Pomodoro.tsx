import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Play, Pause, RotateCcw, Music, Volume2 } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Pomodoro() {
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isActive, setIsActive] = useState(false);
    const [mode, setMode] = useState<'focus' | 'break'>('focus');
    const [soundEnabled, setSoundEnabled] = useState(false);

    useEffect(() => {
        let interval: ReturnType<typeof setInterval> | null = null;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(timeLeft => timeLeft - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            if (interval) clearInterval(interval);
            setIsActive(false);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isActive, timeLeft]);

    const toggleTimer = () => setIsActive(!isActive);
    
    const resetTimer = () => {
        setIsActive(false);
        setTimeLeft(mode === 'focus' ? 25 * 60 : 5 * 60);
    };

    const switchMode = (newMode: 'focus' | 'break') => {
        setMode(newMode);
        setIsActive(false);
        setTimeLeft(newMode === 'focus' ? 25 * 60 : 5 * 60);
    };

    const toggleSound = () => setSoundEnabled(!soundEnabled);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const progress = ((mode === 'focus' ? 25 * 60 : 5 * 60) - timeLeft) / (mode === 'focus' ? 25 * 60 : 5 * 60) * 100;

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Pomodoro Focus</h2>}
        >
            <Head title="Pomodoro" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 flex justify-center">
                    <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md overflow-hidden shadow-sm sm:rounded-lg border border-gray-100 dark:border-gray-700 w-full max-w-lg p-8 flex flex-col items-center gap-8">
                        
                        <div className="flex bg-gray-100 dark:bg-gray-900 rounded-lg p-1">
                            <button 
                                className={`px-6 py-2 rounded-md font-medium transition ${mode === 'focus' ? 'bg-white dark:bg-gray-700 shadow text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
                                onClick={() => switchMode('focus')}
                            >
                                Focus Session (25m)
                            </button>
                            <button 
                                className={`px-6 py-2 rounded-md font-medium transition ${mode === 'break' ? 'bg-white dark:bg-gray-700 shadow text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
                                onClick={() => switchMode('break')}
                            >
                                Short Break (5m)
                            </button>
                        </div>

                        <div className="relative w-64 h-64 flex items-center justify-center">
                            <svg className="absolute top-0 left-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                                <circle className="fill-none stroke-gray-200 dark:stroke-gray-700" strokeWidth="4" cx="50" cy="50" r="45"></circle>
                                <circle 
                                    className="fill-none stroke-indigo-500 dark:stroke-indigo-400 transition-all duration-1000 ease-linear" 
                                    strokeWidth="6" 
                                    strokeLinecap="round" 
                                    strokeDasharray="283" 
                                    style={{ strokeDashoffset: 283 - (283 * progress) / 100 }}
                                    cx="50" cy="50" r="45" 
                                ></circle>
                            </svg>
                            <div className="text-6xl font-bold font-mono text-gray-900 dark:text-gray-100 z-10">
                                {formatTime(timeLeft)}
                            </div>
                        </div>

                        <div className="flex items-center gap-6">
                            <button className="w-14 h-14 rounded-full flex items-center justify-center bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition" onClick={resetTimer}>
                                <RotateCcw size={24} />
                            </button>
                            <button className="w-20 h-20 rounded-full flex items-center justify-center bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900/50 hover:bg-indigo-700 hover:scale-105 transition" onClick={toggleTimer}>
                                {isActive ? <Pause size={32} /> : <Play size={32} className="ml-2" />}
                            </button>
                            <button className={`w-14 h-14 rounded-full flex items-center justify-center border transition ${soundEnabled ? 'border-indigo-500 text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20' : 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`} onClick={toggleSound}>
                                {soundEnabled ? <Volume2 size={24} /> : <Music size={24} />}
                            </button>
                        </div>
                        
                        {soundEnabled && (
                            <div className="bg-indigo-50 dark:bg-indigo-900/30 px-6 py-3 rounded-lg text-indigo-700 dark:text-indigo-300 text-sm font-medium animate-pulse">
                                🎵 Playing Rain & Cafe Ambience
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
