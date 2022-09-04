import styled from 'styled-components'
import { BackgroundDots1 } from './icons/BackgroundDots1'
import { BackgroundDots2 } from './icons/BackgroundDots2'
import { BackgroundDotsDesktop } from './icons/BackgroundDotsDesktop'

export const Dots = () => {
    return (
        <>
            <MobileView>
                <DotsWrapper>
                    <BackgroundDots1 />
                </DotsWrapper>
                <DotsWrapperMiddle>
                    <BackgroundDots2 />
                </DotsWrapperMiddle>
                <DotsWrapperLower>
                    <BackgroundDots2 />
                </DotsWrapperLower>
            </MobileView>
            <DesktopView>
                <Wrapper>
                    <BackgroundDotsDesktop />
                </Wrapper>
            </DesktopView>
        </>
    )
}

const DotsWrapper = styled.div`
    position: absolute;
    top: 0;
    right: 0;
    margin-right: -40px;
    z-index: 1;
`

const DotsWrapperMiddle = styled.div`
    position: absolute;
    top: 0;
    margin-top: 270px;
    right: 0;
    z-index: 1;
`

const DotsWrapperLower = styled.div`
    position: absolute;
    top: 0;
    margin-top: 650px;
    right: 0;
    z-index: 1;
`

const MobileView = styled.div`
    @media (min-width: 1240px) {
        display: none;
    }
`

const DesktopView = styled.div`
    display: none;
    @media (min-width: 1240px) {
        display: flex;
        flex-direction: column;
        margin: 0 100px;
    }
`

const Wrapper = styled.div`
    position: absolute;
    top: 0;
    right: 0;
    margin-top: -50px;
    margin-right: -30px;
`
