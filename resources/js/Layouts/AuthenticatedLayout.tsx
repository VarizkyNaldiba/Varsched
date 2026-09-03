import Navbar from '@/Components/Navigation/Navbar';
import { PropsWithChildren, ReactNode } from 'react';

export default function Authenticated({
    header,
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    return (
        <div className="min-h-screen bg-surface-base dark:bg-surface-dark-base text-gray-900 dark:text-cream transition-colors duration-300">
            <Navbar />

            {header && (
                <header className="bg-transparent">
                    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main>{children}</main>
        </div>
    );
}
