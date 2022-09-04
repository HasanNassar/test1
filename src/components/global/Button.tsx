import styled from 'styled-components'

type ButtonProps = {
    text: string
    disabled?: boolean
    mobileFix?: boolean
    onClick?: () => any
    buttonType?: 'button' | 'submit' | 'reset'
}

export const Button: React.FC<ButtonProps> = ({
    text,
    mobileFix = false,
    disabled = false,
    onClick = () => null,
    buttonType = 'submit',
}) => {
    return (
        <ButtonWrapper mobileFix={mobileFix}>
            <ContinueBookingButton type={buttonType} disabled={disabled} isDisabled={disabled} onClick={onClick}>
                {text}
            </ContinueBookingButton>
        </ButtonWrapper>
    )
}

const ContinueBookingButton = styled.button<{ isDisabled?: boolean }>`
    background: ${(props) => (props.isDisabled ? '#E5E5E5' : '#ff5a5a')};
    border-radius: 100px;
    color: ${(props) => (props.isDisabled ? 'rgba(0, 0, 0, 0.2)' : 'white')};
    font-size: var(--size-16);
    font-weight: var(--weight-bold);
    border: none;
    padding: 1rem;
    width: 100%;
`

const ButtonWrapper = styled.div<{ mobileFix?: boolean }>`
    position: fixed;
    display: flex;
    align-items: center;
    justify-content: center;
    width: auto;
    z-index: 10;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 10px 10px;
    ${(props) => props.mobileFix && 'position: relative; padding: 20px 0; margin-bottom: 1rem;'}
`
