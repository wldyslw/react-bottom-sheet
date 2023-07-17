module.exports = {
    plugins: [require('prettier-plugin-tailwindcss')],
    trailingComma: 'es5',
    tabWidth: 4,
    semi: true,
    singleQuote: true,
    overrides: [
        {
            files: '*.yml',
            options: {
                tabWidth: 2,
            },
        },
    ],
};
