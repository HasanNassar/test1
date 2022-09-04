import styled from 'styled-components'
const MiniArrowDownSvg = styled.svg<{ isOpen: boolean; color: string }>`
    transform: ${(props) => (props.isOpen ? `rotate(180deg)` : ``)};
    color: ${(props) =>
        props.isOpen
            ? `var(--primaryColor)`
            : `rgba(0, 0, 0, 0.4)
           
`};
    color: ${(props) => props.color || ''};
    transition: transform 0.3s ease 0s;
`

export const MiniArrowDown = ({ isOpen = false, color }: { isOpen?: boolean; color: string }) => (
    <MiniArrowDownSvg
        width="14"
        height="8"
        viewBox="0 0 14 8"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        isOpen={isOpen}
        color={color}
    >
        <path
            d="M0.993535 0.91996C0.666868 1.24663 0.666868 1.77329 0.993535 2.09996L6.53354 7.63996C6.79354 7.89996 7.21354 7.89996 7.47354 7.63996L13.0135 2.09996C13.3402 1.77329 13.3402 1.24663 13.0135 0.91996C12.6869 0.593293 12.1602 0.593293 11.8335 0.91996L7.0002 5.74663L2.16687 0.913295C1.84687 0.593295 1.31353 0.593294 0.993535 0.91996Z"
            fill="currentColor"
        />
    </MiniArrowDownSvg>
)
