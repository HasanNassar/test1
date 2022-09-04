import { config } from '@util/config'
import Document, { DocumentContext, Head, Html, Main, NextScript } from 'next/document'
import { ServerStyleSheet } from 'styled-components'
import { DocumentInitialProps } from 'next/dist/shared/lib/utils'
import { ReactElement } from 'react'

type NewDocumentInitialProps = DocumentInitialProps & {
    locale?: string
}

export default class MyDocument extends Document {
    static async getInitialProps(ctx: DocumentContext): Promise<NewDocumentInitialProps> {
        const sheet = new ServerStyleSheet()
        const originalRenderPage = ctx.renderPage

        try {
            ctx.renderPage = () =>
                originalRenderPage({
                    enhanceApp: (App) => (props) => sheet.collectStyles(<App {...props} />),
                })

            const initialProps = await Document.getInitialProps(ctx)
            return {
                ...initialProps,
                styles: [
                    <>
                        {initialProps.styles}
                        {sheet.getStyleElement()}
                    </>,
                ] as ReactElement[],
                locale: ctx?.locale,
            }
        } finally {
            sheet.seal()
        }
    }
    render() {
        return (
            <Html>
                <Head>
                    <script async src="https://wchat.freshchat.com/js/widget.js" />

                    <script
                        async
                        id="gtag"
                        src={`https://www.googletagmanager.com/gtag/js?id=${config.GA_TRACKING_ID}`}
                    />
                    <script
                        async
                        id="gtag"
                        dangerouslySetInnerHTML={{
                            __html: `
                                window.dataLayer = window.dataLayer || [];
                                function gtag(){dataLayer.push(arguments);}
                                gtag('js', new Date());
                                gtag('config', '${config.GA_TRACKING_ID}', {
                                page_path: window.location.pathname,
                                });
                            `,
                        }}
                    />
                    <link
                        rel="preload"
                        href="/rental/Manrope-VariableFont_wght.ttf"
                        as="font"
                        type="font/ttf"
                        crossOrigin="anonymous"
                    />
                    <link rel="shortcut icon" href="/rental/favicon.ico" />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }
}
