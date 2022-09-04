import { createGlobalStyle, css } from 'styled-components'
import { normalize } from 'styled-normalize'

const globalCss = css`
    ${normalize}

    @font-face {
        font-family: 'Manrope';
        src: url('/rental/Manrope-VariableFont_wght.ttf') format('truetype-variations');
        font-weight: 100 800;
        font-style: normal;
        font-display: swap;
        font-stretch: 0% 100%;
        font-optical-sizing: 0 100;
    }

    html,
    body {
        font-family: 'Manrope', Helvetica, sans-serif;
        color: #484848;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        line-height: inherit;
    }

    @supports (scrollbar-gutter: stable) {
        html {
            scrollbar-gutter: stable;
        }
    }

    // Safari focus fix
    @supports (-webkit-overflow-scrolling: touch) {
        input {
            font-size: 16px;
        }
    }

    a,
    button {
        cursor: pointer;
        text-decoration: none;
    }

    .overflow-hidden {
        overflow: hidden;
    }

    html.remove-gutter {
        scrollbar-gutter: auto;
    }

    input:disabled {
        color: var(--disabled);
    }

    .swiper {
        width: 100%;
        height: 100%;
    }

    .swiper-slide {
        text-align: center;
        font-size: 18px;
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .swiper-pagination.swiper-pagination-bullets {
        bottom: 0;
    }

    .swiper-pagination-bullet-active {
        background-color: #ff5a5a !important;
    }

    .swiper-slide img {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .loader,
    .loader:before,
    .loader:after {
        background: #ff5a5a;
        -webkit-animation: load1 1s infinite ease-in-out;
        animation: load1 1s infinite ease-in-out;
        width: 1em;
        height: 4em;
    }
    .loader {
        color: #ff5a5a;
        text-indent: -9999em;
        margin: 88px auto;
        position: relative;
        font-size: 11px;
        -webkit-transform: translateZ(0);
        -ms-transform: translateZ(0);
        transform: translateZ(0);
        -webkit-animation-delay: -0.16s;
        animation-delay: -0.16s;
    }
    .loader:before,
    .loader:after {
        position: absolute;
        top: 0;
        content: '';
    }
    .loader:before {
        left: -1.5em;
        -webkit-animation-delay: -0.32s;
        animation-delay: -0.32s;
    }
    .loader:after {
        left: 1.5em;
    }
    @-webkit-keyframes load1 {
        0%,
        80%,
        100% {
            box-shadow: 0 0;
            height: 4em;
        }
        40% {
            box-shadow: 0 -2em;
            height: 5em;
        }
    }
    @keyframes load1 {
        0%,
        80%,
        100% {
            box-shadow: 0 0;
            height: 4em;
        }
        40% {
            box-shadow: 0 -2em;
            height: 5em;
        }
    }

    html {
        min-height: 100%;
    }
    body,
    html,
    #app,
    #root {
        --padding: 24px;
        --boxShadowSize: 20px;
        --navHeight: 84px;
        --navMobileHeight: 66px;
        --modalButtonFix: 100px;
        --max-content-width: 1240px;
        --borderRadius: 12px;
        --boxShadow: 0px 2px var(--boxShadowSize) rgba(0, 0, 0, 0.08);
        margin: 0px;
        padding: 0px;
        --primaryColor: #ff5a5a;
        --primaryTextColor: black;
        --primaryTileColor: white;
        --primaryBackgroundColor: #f9f9f9;
        --white: #ffffff;
        --black: black;
        --purple: #70175c;
        --blue: #5fb3d2;
        --indigo: #31336b;
        --orange: #fa983a;
        --grey: #504e4d;
        --light-grey: #f3f3f3;
        --disabled: rgba(0, 0, 0, 0.4);
        --yellow: #ffd171;
        --gold: var(--yellow);
        --green: #1fb977;
        --bullish: #ff5a5a;
        font-style: normal;
        --weight-bold: 700;
        --weight-regular: 400;
        --weight-semiBold: 600;
        --weight-extraBold: 800;
        --fontWeight: var(--weight-regular);
        --size-72: 72px;
        --size-40: 40px;
        --size-38: 38px;
        --size-32: 32px;
        --size-24: 24px;
        --size-20: 20px;
        --size-16: 16px;
        --size-14: 14px;
        --size-12: 12px;
        --size-10: 10px;
        --fontSize: var(--size-16);
    }
    #portal-root.portal-open {
        z-index: 50;
        position: fixed;
        top: var(--navMobileHeight);
        bottom: 0;
        left: 0;
        right: 0;
        width: 100vw;
        height: calc(100vh - var(--navMobileHeight));
    }
    #portal-root.portal-open > div {
        width: 100%;
        min-height: calc(100vh - var(--navMobileHeight));
    }
    .m-end-5 {
        margin-right: .5rem;
    }
`

export const GlobalStyle = createGlobalStyle`${globalCss}`
