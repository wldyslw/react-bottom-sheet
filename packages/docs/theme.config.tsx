import { DocsThemeConfig, useConfig } from 'nextra-theme-docs';

const config: DocsThemeConfig = {
    useNextSeoProps() {
        const { frontMatter, title, logoLink } = useConfig();

        const description =
            frontMatter.description ??
            'React component for iOS- and Android-like bottom sheet';

        return {
            titleTemplate: '%s – React Bottom Sheet',
            description,
            openGraph: {
                url: logoLink as string,
                title: title ?? '@wldyslw/react-bottom-sheet',
                description,
                images: [
                    {
                        url: `${process.env.NEXT_PUBLIC_DOCS_BASE_PATH}/screenshot.png`,
                        width: 1024,
                        height: 512,
                        alt: "Screenshot of sheet's example usage",
                        type: 'image/png',
                    },
                ],
            },
            twitter: {
                cardType: 'summary_large_image',
                site: '@wldyslw',
            },
        };
    },
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
        <span className="inline-img font-mono text-xs font-semibold md:text-base">
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
        text: (
            <span>
                <a
                    className="nx-text-primary-600 underline"
                    href="https://github.com/wldyslw/react-bottom-sheet"
                    target="_blank"
                >
                    @wldyslw/react-bottom-sheet
                </a>
                <span className="mx-3 opacity-50">|</span>
                Built with{' '}
                <a
                    className="nx-text-primary-600 underline"
                    href="https://nextra.site/"
                    target="_blank"
                >
                    Nextra
                </a>{' '}
                <span className="mx-3 opacity-50">|</span> MIT License
            </span>
        ),
    },
};

export default config;
