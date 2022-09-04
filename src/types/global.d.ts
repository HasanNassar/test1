export {}

declare global {
    interface Window {
        fcWidget: {
            on(event: string, callback: () => void)
            init: (initProps: FreshChatInitProps) => void
            open: () => void
            isLoaded: () => boolean
            user: {
                setProperties: ({ product: string }) => void
            }
        }
    }
}
