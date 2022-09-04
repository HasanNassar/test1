import { useEffect, useState } from 'react'

export const useMediaQuery = (query: string): boolean => {
    const [doesMatch, onSetDoesMatch] = useState(false)

    useEffect(() => {
        const onUpdateMatch = ({ matches }) => {
            onSetDoesMatch(matches)
        }
        const matcher = window.matchMedia(query)

        matcher.addEventListener('change', onUpdateMatch)
        onUpdateMatch(matcher)

        return () => {
            matcher.removeEventListener('change', onUpdateMatch)
        }
    }, [query, onSetDoesMatch])

    return doesMatch
}
