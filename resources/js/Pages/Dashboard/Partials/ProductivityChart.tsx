import { TrendDay } from '../types';
import { BarChart3 } from 'lucide-react';

interface ProductivityChartProps {
    trends: TrendDay[];
}

export default function ProductivityChart({ trends }: ProductivityChartProps) {
    return (
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md overflow-hidden shadow-sm sm:rounded-lg border border-gray-100 dark:border-gray-700 p-6 flex flex-col justify-between">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                        <BarChart3 size={20} className="text-indigo-600 dark:text-indigo-400" />
                        Productivity Trends
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        Tasks completed this week
                    </p>
                </div>
                <span className="text-xs font-semibold bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 px-3 py-1 rounded-full">
                    This Week
                </span>
            </div>

            <div className="h-48 flex items-end justify-between gap-3 pt-6 pb-2 border-b border-gray-100 dark:border-gray-700">
                {trends.map((item, index) => (
                    <div
                        key={index}
                        className="flex-1 flex flex-col items-center gap-2 h-full justify-end group relative"
                    >
                        {/* Hover Tooltip */}
                        <div className="absolute -top-10 scale-0 group-hover:scale-100 transition-all duration-200 bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 text-[11px] font-bold py-1 px-2.5 rounded-md shadow-lg pointer-events-none whitespace-nowrap z-20">
                            {item.count} {item.count === 1 ? 'task' : 'tasks'}
                        </div>

                        {/* Bar */}
                        <div
                            className={`w-full max-w-[36px] rounded-t-lg transition-all duration-500 cursor-pointer ${
                                item.count > 0
                                    ? 'bg-gradient-to-t from-indigo-600 to-indigo-400 group-hover:from-indigo-500 group-hover:to-indigo-300 shadow-sm'
                                    : 'bg-gray-100 dark:bg-gray-700/60'
                            }`}
                            style={{ height: `${item.height}%` }}
                        />

                        {/* Day label */}
                        <span
                            className={`text-xs transition-colors ${
                                item.count > 0
                                    ? 'font-bold text-gray-700 dark:text-gray-200'
                                    : 'text-gray-400 dark:text-gray-500'
                            }`}
                        >
                            {item.day}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

