import { DocsThemeConfig } from 'nextra-theme-docs';

const config: DocsThemeConfig = {
    head: () => {
        return (
            <>
                <link
                    rel="icon"
                    href={`${process.env.NEXT_PUBLIC_DOCS_BASE_PATH}/favicon.ico`}
                    sizes="any"
                />
                <link
                    rel="icon"
                    href={`${process.env.NEXT_PUBLIC_DOCS_BASE_PATH}/icon.svg`}
                    type="image/svg+xml"
                />
                <link
                    rel="apple-touch-icon"
                    href={`${process.env.NEXT_PUBLIC_DOCS_BASE_PATH}/apple-touch-icon.png`}
                />
                <link
                    rel="manifest"
                    href={`${process.env.NEXT_PUBLIC_DOCS_BASE_PATH}/site.webmanifest`}
                />
            </>
        );
    },
    logo: (
        <span className="inline-img font-mono">
            <img
                src={`${process.env.NEXT_PUBLIC_DOCS_BASE_PATH}/favicon-16x16.png`}
                alt="Project's logo represented by newspaper emoji"
            />
            <span className="ms-2">@wldyslw/react-bottom-sheet</span>
        </span>
    ),
    project: {
        link: 'https://github.com/wldyslw/react-bottom-sheet',
    },
    docsRepositoryBase:
        'https://github.com/wldyslw/react-bottom-sheet/tree/main/packages/docs',
    footer: {
        text: '@wldyslw/react-bottom-sheet | Built with Nextra',
    },
};

export default config;
