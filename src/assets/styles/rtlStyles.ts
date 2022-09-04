import { createGlobalStyle, css } from 'styled-components'

const rtlCss = css`

    @font-face {
        font-family: "ReadexPro-Medium";
        src: url('/rental/ReadexPro-Medium.ttf') format('truetype-variations');
    }
    @font-face {
        font-family: "ReadexPro-Light";
        src: url('/rental/ReadexPro-Light.ttf') format('truetype-variations');
    }
    @font-face {
        font-family: "ReadexPro-bold";
        src: url('/rental/ReadexPro-bold.ttf') format('truetype-variations');
    }

    [dir = "rtl"] .hasan {
        background-color: #f00 !important;
    }

    [dir = "rtl"] * {
        font-family: ReadexPro-Medium;
    }

    [dir = "rtl"] .selectedDayFirst {
        background: linear-gradient(-90deg,
        rgba(255, 255, 255, 0) 0%,
        rgba(62, 62, 94, 0) 50%,
        rgba(255, 90, 90, 0.1) 50%,
        rgba(255, 90, 90, 0.1) 100%);
    }

    [dir = "rtl"] .selectedDayLast {
        background: linear-gradient(90deg,
        rgba(255, 255, 255, 0) 0%,
        rgba(62, 62, 94, 0) 50%,
        rgba(255, 90, 90, 0.1) 50%,
        rgba(255, 90, 90, 0.1) 100%);
    }

    [dir = "rtl"] .selectedDayFirst.selectedDayLast {
        background: unset;
    }

    [dir = 'rtl'] .datepickerTitle {
        justify-content: right;
        padding-right: 24px;
        padding-left: 0;
    }

    [dir = 'rtl'] .iconMenu {
        margin-right: 0rem;
        margin-left: 1rem;
    }

    //[dir = 'rtl'] .arrowIcon .iconSvgArrow {
    //    transform: rotate(180deg);
    //}
    //
    //[dir = 'rtl'] .navbarTop .iconSvgArrow {
    //    transform: rotate(180deg);
    //}

    [dir = 'rtl'] .iconSvgArrow {
        transform: rotate(180deg);
    }

    [dir = 'rtl'] .m-end-5 {
        margin-left: .5rem;
    }

    [dir = 'rtl'] .cardItem {
        left: unset;
        right: 5px;
    }

    [dir = 'rtl'] .priceText {
        unicode-bidi: plaintext;
        display: flex;
        flex-direction: initial;
        align-items: center;
    }

    [dir = 'rtl'] .priceText b {
        margin-left: 4px;
    }

    [dir = 'rtl'] .carCard {
        padding: 0 0 0 24px;
    }

    [dir = 'rtl'] .dateTimeSelectorSpan {
        font-weight: 400;
    }

    @media (max-width: 450px) {
        [dir = 'rtl'] .dateTimeSelectorSpan {
            font-size: 10px;
        }
    }
`

export const RTL_Style = createGlobalStyle`${rtlCss}`
