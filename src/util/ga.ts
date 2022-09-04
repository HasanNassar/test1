import { config, isServer } from '@util/config'

export const pageview = (url: string) => {
    // TEMP FIX
    if (!window || typeof window?.gtag !== 'function' || isServer) return
    window.gtag('config', config.GA_TRACKING_ID, {
        page_path: url,
    })
}

export const trackEvent = ({ action, category, label, value }: gaEvents) => {
    // TEMP FIX
    if (!window || typeof window?.gtag !== 'function' || isServer) return
    window.gtag('event', action, {
        event_category: category,
        event_label: label || null,
        value: value || null,
    })
}

type gaEvents = {
    action: string
    category: string
    label?: string
    value?: string
}

declare global {
    interface Window {
        gtag: (...args: unknown[]) => void
        dataLayer: Record<string, unknown>
    }
}
