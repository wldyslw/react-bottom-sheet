/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: [
        './components/**/*.tsx',
        './pages/**/*.{md,mdx}',
        './theme.config.tsx',
    ],
    theme: {
        extend: {},
    },
    plugins: [],
};
