import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.tsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                primary: {
                    DEFAULT: '#2BA8A2',
                    light: '#3CC4BD',
                    dark: '#1E8C86',
                    bg: '#E8F6F5',
                },
                accent: {
                    DEFAULT: '#FFD23F',
                    light: '#FFE47A',
                    dark: '#E6B800',
                },
                coral: {
                    DEFAULT: '#EF6C4A',
                    light: '#FF8A6A',
                    dark: '#D45233',
                },
                cream: '#FFF8E7',
                'sky-blue': '#5DADE2',
                surface: {
                    base: '#EFF8F7',
                    card: '#FFFFFF',
                },
                success: '#27AE60',
                error: '#E74C3C',
            },
            boxShadow: {
                'sm': '0 2px 8px rgba(0, 0, 0, 0.08)',
                'md': '0 4px 16px rgba(0, 0, 0, 0.12)',
                'lg': '0 8px 32px rgba(0, 0, 0, 0.16)',
                'card': '0 4px 20px rgba(43, 168, 162, 0.10)',
                'coral-glow': '0 4px 20px rgba(239, 108, 74, 0.35)',
                'teal-glow': '0 4px 20px rgba(43, 168, 162, 0.30)',
                'accent-glow': '0 4px 20px rgba(255, 210, 63, 0.40)',
                'sky-glow': '0 4px 16px rgba(93, 173, 226, 0.30)',
            },
            borderRadius: {
                'sm': '8px',
                'md': '16px',
                'lg': '24px',
                'xl': '32px',
                'round': '999px',
            },
        },
    },

    plugins: [forms],
};
