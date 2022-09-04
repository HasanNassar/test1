import styled from 'styled-components'
import { VeriffState, stateColor } from '@components/modules/Verification/VerificationUtils'

const Badge = styled.div<{ color: string; background: string }>`
    background: ${(props) => props.background};
    color: ${(props) => props.color};
    font-weight: bold;
    font-size: 12px;
    border-radius: 4px;
    padding: 6px 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    align-self: end;
`
export const VerificationBadge = ({ state }: { state: VeriffState }) => {
    return (
        <>
            <Badge color={stateColor[state].color} background={stateColor[state].background}>
                {stateColor[state].text}
            </Badge>
        </>
    )
}
