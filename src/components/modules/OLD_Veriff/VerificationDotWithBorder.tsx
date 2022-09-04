import styled from 'styled-components'

const Dot = styled.div<{ color?: string; textColor?: string }>`
    height: 40px;
    width: 40px;
    background-color: ${(props) => (props.color ? props.color : '#E1E1E1')};
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${(props) => props.textColor};
`
const DotBorder = styled.div<{ color: string }>`
    width: 56px;
    height: 56px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid ${(props) => props.color};
    box-sizing: border-box;
    margin-bottom: 0.5rem;
`

export const VerificationDotWithBorder = ({ color, number }: { color: string; number: string }) => {
    return (
        <DotBorder color={color}>
            <Dot color={color} textColor={'white'}>
                {number}
            </Dot>
        </DotBorder>
    )
}
