import { useEffect } from 'react'

export const useClickOutside = (ref: React.RefObject<HTMLElement>, handler: any): void => {
    useEffect(() => {
        const listener = (event) => {
            if (!ref.current || ref.current.contains(event.target as Node)) {
                return
            }
            handler(event, false)
        }
        document.addEventListener('mousedown', listener)
        document.addEventListener('touchstart', listener)
        return () => {
            document.removeEventListener('mousedown', listener)
            document.removeEventListener('touchstart', listener)
        }
    }, [ref, handler])
}
