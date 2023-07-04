/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: [
        './node_modules/@wldyslw/react-bottom-sheet/lib/*.js',
        './components/**/*.tsx',
        './pages/**/*.{md,mdx}',
        './theme.config.tsx',
    ],
    theme: {
        extend: {},
    },
    plugins: [],
};
