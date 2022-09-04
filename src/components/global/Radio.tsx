import styled from 'styled-components'
import React, { ReactNode } from 'react'

export const Radio: React.FC<{
    children: ReactNode[]
    onChange?: any
    value?: number | string
    name: string
    cypressData?: string
}> = ({ children, onChange, value, name, cypressData }) => {
    return (
        <CheckBoxLabel>
            <label data-cy={cypressData}>
                <input type="radio" name={name} value={value} onChange={onChange} />
                <LabelText>{children}</LabelText>
            </label>
        </CheckBoxLabel>
    )
}

const LabelText = styled.span`
    font-weight: 600;
    font-size: 14px;
`
const CheckBoxLabel = styled.div`
    display: flex;
    input[type='radio'] {
        position: absolute;
        opacity: 0;
        z-index: -1;
    }

    input[type='radio'] + span {
        cursor: pointer;
    }

    input[type='radio'] + span:before {
        content: '';
        border: 1px solid rgba(0, 0, 0, 0.2);
        box-sizing: border-box;
        border-radius: 2px;
        display: inline-block;
        width: 16px;
        height: 16px;
        padding: 4px;
        margin-inline-end: 1rem;
        vertical-align: -4px;
    }

    input[type='radio']:checked + span:before {
        background-repeat: no-repeat;
        background-position: center;
        border: none;
        border-radius: 2px;
        background-image: url("data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M14 0H2C0.9 0 0 0.9 0 2V14C0 15.1 0.9 16 2 16H14C15.1 16 16 15.1 16 14V2C16 0.9 15.1 0 14 0ZM6.47 12L3 8.5L4.4 7.09L6.47 9.17L11.6 4L13 5.41L6.47 12Z' fill='%23FF5A5A'/%3E%3C/svg%3E%0A");
    }

    input[type='radio']:focus + span:before,
    input[type='radio']:not(:disabled) + span:hover:before {
        outline-color: transparent;
        outline-width: 2px;
        outline-style: dotted;
    }

    input[type='radio']:disabled + span {
        cursor: default;
        color: black;
        opacity: 0.5;
    }
`
