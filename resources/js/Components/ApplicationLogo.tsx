import { CalendarCheck } from 'lucide-react';
import { SVGAttributes } from 'react';

export default function ApplicationLogo(props: SVGAttributes<SVGElement>) {
    return (
        <div className="flex items-center gap-4 group cursor-pointer" {...props}>
            <div className="relative flex items-center justify-center w-14 h-14">
                {/* Fan Cards Background */}
                <div className="absolute w-10 h-12 bg-coral rounded-md -rotate-12 -translate-x-2 shadow-sm transition-transform duration-300 group-hover:-rotate-[20deg] group-hover:-translate-x-3"></div>
                <div className="absolute w-10 h-12 bg-sky-blue rounded-md rotate-12 translate-x-2 shadow-sm transition-transform duration-300 group-hover:rotate-[20deg] group-hover:translate-x-3"></div>
                <div className="absolute w-12 h-14 bg-primary rounded-md shadow-card z-10 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                    <CalendarCheck size={26} className="text-white" strokeWidth={2.5} />
                </div>
                
                {/* V Badge (Flip7 style) */}
                <div className="absolute -bottom-2 -right-2 bg-accent text-primary-dark font-black text-sm px-2 py-0.5 rounded-sm border-2 border-white z-20 shadow-accent-glow rotate-[6deg] -skew-x-[6deg] bounce-scale">
                    V
                </div>
            </div>
            
            {/* Text Ribbon Style */}
            <div className="hidden sm:flex relative bg-cream border-[3px] border-primary-dark px-3 py-1 rounded-[4px] -skew-x-[6deg] shadow-sm items-center justify-center">
                <span className="font-extrabold text-xl tracking-[4px] text-primary-dark skew-x-[6deg]">
                    VARSCHED
                </span>
                {/* Ribbon tails */}
                <div className="absolute -left-2 top-1 w-2 h-full bg-[#E5DDC9] border-[3px] border-r-0 border-primary-dark -z-10 rounded-l-[4px]"></div>
            </div>
        </div>
    );
}
