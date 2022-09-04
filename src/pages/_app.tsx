import { GlobalStyle } from '@assets/styles/baseStyles'
import { RTL_Style } from '@assets/styles/rtlStyles'
import { pageview } from '@util/ga'
import { appWithTranslation } from 'next-i18next'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import 'swiper/css'
import 'swiper/css/bundle'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/scrollbar'
import nextI18NextConfig from '../../next-i18next.config.js'
import { ContextProvider } from '@contexts/appContext'
import Head from 'next/head'

function App({ Component, pageProps }: AppProps) {
    const { locale, events } = useRouter()

    useEffect(() => {
        events.on('routeChangeComplete', pageview)
        return () => {
            events.off('routeChangeComplete', pageview)
        }
    }, [events])

    useEffect(() => {
        const dir = locale == 'ar-dxb' ? 'rtl' : 'ltr'
        const lang = locale === 'ar-dxb' ? 'ar' : locale || 'en'
        document?.querySelector('html')?.setAttribute('dir', dir)
        document?.querySelector('html')?.setAttribute('lang', lang)
    }, [locale])

    return (
        <>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
                <title>Swapp</title>
            </Head>
            <GlobalStyle />
            <RTL_Style />
            <ContextProvider>
                <Component {...pageProps} />
            </ContextProvider>
            <div id="portal-root" />
        </>
    )
}

export default appWithTranslation(App, nextI18NextConfig)
