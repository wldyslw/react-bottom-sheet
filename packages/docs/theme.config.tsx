import React from 'react';
import { DocsThemeConfig } from 'nextra-theme-docs';

const config: DocsThemeConfig = {
    head: () => {
        return <link rel="manifest" href="/manifest.webmanifest" />;
    },
    logo: (
        <span className="inline-img font-mono">
            <img
                src="/favicon-16x16.png"
                alt="Project's logo represented by newspaper emoji"
            />
            <span className="ms-2">@wldyslw/react-bottom-sheet</span>
        </span>
    ),
    project: {
        link: 'https://github.com/wldyslw/react-bottom-sheet',
    },
    docsRepositoryBase: 'https://github.com/wldyslw/react-bottom-sheet',
    footer: {
        text: '@wldyslw/react-bottom-sheet | Built with Nextra',
    },
};

export default config;
