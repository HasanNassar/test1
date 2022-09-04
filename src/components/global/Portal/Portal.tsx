import React, { ReactNode, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

export const Portal: React.FC<{ isOpen?: boolean; children: ReactNode }> = ({ children }) => {
    const [mounted, setMounted] = useState(false)
    const node = document.getElementById('portal-root')

    useEffect(() => {
        setMounted(true)
        node && node.classList.add('portal-open')

        return () => {
            setMounted(false)
            node && node.classList.remove('portal-open')
        }
    }, [])

    if (!mounted) {
        node && node.classList.remove('portal-open')
        return null
    }

    return node ? createPortal(children, node) : null
}
