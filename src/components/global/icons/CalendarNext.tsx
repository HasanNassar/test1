import styled from 'styled-components'
const Arrow = styled.svg<{ isPrevious?: boolean }>`
    transform: ${(props) => (props.isPrevious ? `rotate(180deg)` : ``)};
`

export const CalendarNext = ({ isPrevious }: { isPrevious?: boolean }) => (
    <Arrow
        width="15"
        height="11"
        viewBox="0 0 15 11"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        isPrevious={isPrevious}
    >
        <path
            d="M1 6H14M14 6L10 10M14 6L10.5 1.5"
            stroke="#FF5A5A"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="bevel"
        />
    </Arrow>
)
