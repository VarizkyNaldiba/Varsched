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
                // Flip7 Core Brand Palette
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
                    'dark-base': '#0E201F',
                    'dark-card': '#162E2C',
                    'dark-elevated': '#1D3C39',
                    'dark-border': '#254E4A',
                },
                success: '#27AE60',
                error: '#E74C3C',

                // Flip7 Retro-Playful Midnight Teal Grays for Dark Mode
                gray: {
                    50: '#F5FAF9',
                    100: '#E7F4F3',
                    200: '#D0E9E7',
                    300: '#A6D5D1',
                    400: '#73B4B0',
                    500: '#4D948F',
                    600: '#34716D',
                    700: '#254E4A', // Flip7 dark borders & input seams
                    800: '#162E2C', // Flip7 dark card & panel background
                    850: '#122625',
                    900: '#0E201F', // Flip7 deep midnight teal page background
                    950: '#081413',
                },
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
