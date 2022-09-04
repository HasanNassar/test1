import React from 'react'
import styled from 'styled-components'
import { DateTimeSelector } from './DateTimeSelector'

const Wrapper = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
`

const WrapperInside = styled.div`
    background: white;
    max-width: 840px;
    width: 100%;
    border-radius: 16px;
    box-shadow: 0px 2px 20px rgba(0, 0, 0, 0.08);
    padding: 1.5rem;
    @media (min-width: 768px) {
        padding: 2.5rem;
    }

    margin: 0 1.5rem;
    z-index: 10;
`

export const DateTimePicker: React.FC = () => {
    return (
        <Wrapper>
            <WrapperInside>
                <DateTimeSelector />
            </WrapperInside>
        </Wrapper>
    )
}
