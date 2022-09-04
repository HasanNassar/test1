import styled from 'styled-components'

const PoiSvg = styled.svg<{ isOpen?: boolean }>`
    color: ${(props) =>
        props.isOpen
            ? `var(--primaryColor)`
            : `rgba(0, 0, 0, 0.8)
`};
`

export const Poi2 = ({ isOpen }: { isOpen?: boolean }) => (
    <PoiSvg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12 10.5C13.6569 10.5 15 9.15685 15 7.5C15 5.84315 13.6569 4.5 12 4.5C10.3431 4.5 9 5.84315 9 7.5C9 9.15685 10.3431 10.5 12 10.5Z"
            stroke="black"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12 0.75C15.7279 0.75 18.75 3.77208 18.75 7.5C18.75 10.751 13.618 18.027 12.304 19.837C12.233 19.9338 12.1201 19.991 12 19.991C11.8799 19.991 11.767 19.9338 11.696 19.837C10.382 18.027 5.25 10.751 5.25 7.5C5.25 3.77208 8.27208 0.75 12 0.75Z"
            stroke="black"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M17.979 17.7839C20.711 18.3249 22.5 19.2279 22.5 20.2499C22.5 21.9069 17.8 23.2499 12 23.2499C6.2 23.2499 1.5 21.9069 1.5 20.2499C1.5 19.2299 3.281 18.3289 6 17.7869"
            stroke="black"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </PoiSvg>
)
