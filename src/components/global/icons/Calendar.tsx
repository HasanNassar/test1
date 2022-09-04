import styled from 'styled-components'

const CalendarSvg = styled.svg<{ color?: string }>`
    color: ${(props) => props.color};
`

export const CalendarIcon: React.FC<{ color?: string; doubleDots?: boolean }> = ({ color, doubleDots = false }) => {
    return (
        <CalendarSvg
            width="18"
            height="20"
            viewBox="0 0 18 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            color={color ? color : 'rgba(0, 0, 0, 0.8)'}
        >
            <path
                d="M16 2H15V1C15 0.45 14.55 0 14 0C13.45 0 13 0.45 13 1V2H5V1C5 0.45 4.55 0 4 0C3.45 0 3 0.45 3 1V2H2C0.89 2 0.00999999 2.9 0.00999999 4L0 18C0 19.1 0.89 20 2 20H16C17.1 20 18 19.1 18 18V4C18 2.9 17.1 2 16 2ZM15 18H3C2.45 18 2 17.55 2 17V7H16V17C16 17.55 15.55 18 15 18ZM5 9H7C7.55 9 8 9.45 8 10V12C8 12.55 7.55 13 7 13H5C4.45 13 4 12.55 4 12V10C4 9.45 4.45 9 5 9Z"
                fill="currentColor"
            />
            {doubleDots && (
                <path
                    d="M11,9h2c0.6,0,1,0.4,1,1v2c0,0.6-0.4,1-1,1h-2c-0.6,0-1-0.4-1-1v-2C10,9.4,10.4,9,11,9z"
                    fill="currentColor"
                />
            )}
        </CalendarSvg>
    )
}
