/* eslint-disable @typescript-eslint/no-var-requires */
const nextra = require('nextra');

const withNextra = nextra({
    theme: 'nextra-theme-docs',
    themeConfig: './theme.config.tsx',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
    basePath: process.env.DOCS_BASE_PATH,
    output: 'export',
    images: {
        unoptimized: true,
    },
};

module.exports = withNextra(nextConfig);
