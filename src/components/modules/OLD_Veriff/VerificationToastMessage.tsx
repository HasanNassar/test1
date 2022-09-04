import styled from 'styled-components'
import { Cross } from '@global/icons/Cross'
import { VeriffState, stateColor } from '@components/modules/OLD_Veriff/VerificationUtils'
const Wrapper = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    width: 100%;
`
const Container = styled.div<{ color }>`
    background-color: ${(props) => props.color};
    width: 100%;
    max-width: 350px;
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

export const VerificationToastMessage = ({ state, setIsActive }: { state: VeriffState; setIsActive: any }) => {
    return (
        <Wrapper>
            <Container color={stateColor[state].color}>
                {stateColor[state].icon}
                <div>
                    <Text>{stateColor[state].alertText}</Text>
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
