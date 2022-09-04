import { config } from './config'

export const initFreshChat = (isOpen = true) => {
    if (typeof window !== 'undefined' && window.fcWidget) {
        window.fcWidget.init({
            token: config.FCWIDGET_TOKEN,
            host: 'https://wchat.eu.freshchat.com',
            tags: ['dailyrental'],
            open: isOpen,
            config: {
                headerProperty: { direction: 'ltr' },
            },
        })

        window.fcWidget.on('widget:loaded', () => {
            window.fcWidget.user.setProperties({ product: 'dailyrental' })
        })
    }
}

export const openFreshChat = () => {
    if (typeof window !== 'undefined' && window?.fcWidget) {
        if (window.fcWidget?.isLoaded()) {
            window.fcWidget.open()
        } else {
            initFreshChat()
        }
    }
}
