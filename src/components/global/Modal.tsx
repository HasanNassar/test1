import React, { ReactNode, useEffect } from 'react'
import styled, { StyledComponent } from 'styled-components'
import { Portal } from './Portal/Portal'

type ModalProps = {
    setModal: React.Dispatch<React.SetStateAction<boolean>>
    wrapperComponent?: StyledComponent<'div', any>
    children: ReactNode
}

export const Modal: React.FC<ModalProps> = ({ setModal, children, wrapperComponent }) => {
    const escapeHandler = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            setModal(false)
        }
    }

    useEffect(() => {
        document.addEventListener('keydown', escapeHandler)
        document.body.classList.add('overflow-hidden')
        document.documentElement.classList.add('remove-gutter')
        return () => {
            document.removeEventListener('keydown', escapeHandler)
            document.body.classList.remove('overflow-hidden')
            document.documentElement.classList.remove('remove-gutter')
        }
    })

    const Wrapper = wrapperComponent || ModalContainer

    return (
        <Portal>
            <Wrapper>{children}</Wrapper>
        </Portal>
    )
}

const ModalContainer = styled.div`
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 100;
    inset: 0;
    overflow-y: auto;
`
