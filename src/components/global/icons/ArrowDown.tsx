import styled from 'styled-components'

const ArrowDownSvg = styled.svg<{ isOpen: boolean }>`
    transform: ${(props) => (props.isOpen ? `rotate(180deg)` : ``)};
    transition: transform 0.3s ease 0s;
`

export const ArrowDown = ({ isOpen }: { isOpen: boolean }) => (
    <ArrowDownSvg
        isOpen={isOpen}
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M5.99353 8.92002C5.66687 9.24669 5.66687 9.77336 5.99353 10.1L11.5335 15.64C11.7935 15.9 12.2135 15.9 12.4735 15.64L18.0135 10.1C18.3402 9.77335 18.3402 9.24669 18.0135 8.92002C17.6869 8.59335 17.1602 8.59335 16.8335 8.92002L12.0002 13.7467L7.16687 8.91336C6.84687 8.59336 6.31353 8.59335 5.99353 8.92002Z"
            fill="currentColor"
        />
    </ArrowDownSvg>
)
