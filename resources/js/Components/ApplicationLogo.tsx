import { CalendarCheck } from 'lucide-react';
import { HTMLAttributes } from 'react';

export default function ApplicationLogo({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={`inline-flex flex-row items-center gap-3.5 group cursor-pointer select-none ${className}`}
            {...props}
        >
            {/* Fan Cards Icon */}
            <div className="relative flex items-center justify-center w-11 h-11 shrink-0">
                {/* Fan Cards Background */}
                <div className="absolute w-8 h-10 bg-coral rounded-md -rotate-12 -translate-x-1.5 shadow-sm transition-transform duration-300 group-hover:-rotate-[20deg] group-hover:-translate-x-2.5"></div>
                <div className="absolute w-8 h-10 bg-sky-blue rounded-md rotate-12 translate-x-1.5 shadow-sm transition-transform duration-300 group-hover:rotate-[20deg] group-hover:translate-x-2.5"></div>
                <div className="absolute w-9 h-11 bg-primary rounded-md shadow-card z-10 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                    <CalendarCheck size={20} className="text-white" strokeWidth={2.5} />
                </div>

                {/* V Badge (Flip7 retro style) */}
                <div className="absolute -bottom-1 -right-1.5 bg-accent text-primary-dark font-black text-xs px-1.5 py-0.5 rounded-sm border-2 border-white dark:border-gray-800 z-20 shadow-accent-glow rotate-[6deg] -skew-x-[6deg] bounce-scale">
                    V
                </div>
            </div>

            {/* Text Ribbon - Directly beside the icon */}
            <div className="relative bg-cream border-[3px] border-primary-dark px-3 py-1 rounded-[4px] -skew-x-[6deg] shadow-sm flex items-center justify-center shrink-0">
                <span className="font-extrabold text-lg tracking-[3px] text-primary-dark skew-x-[6deg]">
                    VARSCHED
                </span>
                {/* Ribbon tail */}
                <div className="absolute -left-2 top-0.5 w-2 h-full bg-[#E5DDC9] border-[3px] border-r-0 border-primary-dark -z-10 rounded-l-[4px]"></div>
            </div>
        </div>
    );
}
