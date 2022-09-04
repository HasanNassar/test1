import React, { ReactNode } from 'react'
import styled from 'styled-components'

export const BookingSection = ({
    children,
    title,
    description,
    show = true,
    separator = true,
}: {
    children: ReactNode
    title: string
    description: string
    show?: boolean
    separator?: boolean
}) => {
    if (!show) return null

    return (
        <>
            <Separator />
            <SectionWrapper>
                <SectionHeadline>{title}</SectionHeadline>
                <SectionDescription>{description}</SectionDescription>
                {children}
            </SectionWrapper>
        </>
    )
}

const Separator = styled.div`
    border-bottom: 0.5px solid rgba(0, 0, 0, 0.1);
    margin: 32px 0px;
`

const SectionWrapper = styled.div`
    background: white;
    padding: 0 var(--padding);
`

const SectionHeadline = styled.h1`
    font-size: var(--size-24);
    font-weight: var(--weight-extraBold);
    color: black;

    margin: var(--padding) 0 var(--padding) 0;
`
const SectionDescription = styled.p`
    font-weight: 500;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.8);
    margin: 0;
`
