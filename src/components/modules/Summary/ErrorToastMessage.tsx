import styled from 'styled-components'
import { Cross } from '@global/icons/Cross'
import { ErrorCircle } from '@components/global/icons/ErrorCircle'
const Wrapper = styled.div<{ inline }>`
    position: ${(props) => (props.inline ? 'relative' : 'absolute')};
    top: 10;
    left: 0;
    display: flex;
    width: 100%;
    z-index: 100;
`
const Container = styled.div<{ color; inline }>`
    background-color: ${(props) => props.color};
    width: 100%;
    max-width: ${(props) => (props.inline ? 'none' : '350px')};
    justify-content: ${(props) => (props.inline ? 'space-between' : 'normal')};
    display: flex;
    margin: 1rem;
    padding: 1rem;
    column-gap: 1rem;
    align-items: center;
    border-radius: 8px;
`

const Text = styled.p`
    font-style: normal;
    font-weight: bold;
    font-size: 12px;
    color: #ffffff;
    margin: 0;
`
const IconWrapper = styled.div`
    color: white;
`

export const ErrorToastMessage = ({
    text,
    setIsActive,
    isInline = false,
}: {
    text: string
    setIsActive: any
    isInline?: boolean
}) => {
    return (
        <Wrapper inline={isInline}>
            <Container color="#FF5A5A" inline={isInline}>
                <ErrorCircle />
                <div>
                    <Text>{text}</Text>
                </div>
                <div onClick={() => setIsActive(false)}>
                    <IconWrapper>
                        <Cross />
                    </IconWrapper>
                </div>
            </Container>
        </Wrapper>
    )
}
