/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/**/*.{html,js,ts,jsx,tsx,astro}', // adjust to your project structure
    ],
    theme: {
        extend: {
            keyframes: {
                'marquee-left': {
                    '0%': { transform: 'translateX(0%)' },
                    '100%': { transform: 'translateX(-200%)' },
                },
            },
            animation: {
                'marquee-left': 'marquee-left 60s linear infinite',
            },
        },
    },
    plugins: [
        require('tailwind-scrollbar-hide'), // optional
    ],
};
