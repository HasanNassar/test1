import styled from 'styled-components'
import { A11y, Navigation, Scrollbar } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import { ChevronLeft } from '../../global/icons/ChevronLeft'
import { ChevronRight } from '../../global/icons/ChevronRight'
import { size, device } from '@util/responsive'
import { Headline1 } from '../../../util/typography'
import { trackEvent } from '../../../util/ga'

const SwiperContainer = styled.div`
    @media ${device.laptop} {
        width: 100%;
        max-width: ${size.container};
    }
`

const ChevronContainer = styled.div`
    display: none;
    @media ${device.laptop} {
        display: flex;
        color: white;
        height: 40px;
        width: 40px;
        margin: 2rem;
        align-items: center;
        justify-content: center;
        border-radius: 999px;
        background: var(--primaryColor);
    }
`

const SwiperC = styled.div`
    width: 100%;
    @media ${device.laptop} {
        /* max-width: ${size.container}; */
        display: flex;
        justify-content: center;
        align-items: center;
        /* padding: 3rem; */
    }
`
const HeadlineContainer = styled.div`
    padding: 2rem var(--padding) var(--padding);
    color: var(--white);
    @media ${device.laptop} {
        width: 100%;
        padding: 0;
        color: #484848;
        margin-top: 8rem;
        margin-bottom: 8rem;
        width: 100%;
        max-width: ${size.container};
        margin: auto;
    }
`

const HeadLine = styled.h1`
    font-weight: 800;
    font-size: 24px;
    margin: 0;
    @media ${device.laptop} {
        color: rgba(0, 0, 0, 0, 8);
        margin: 4rem 0 2rem 0;
        font-size: 32px;
    }
`
const SwiperMainW = styled.div`
    width: auto;
`

const ImageContainer = styled.div`
    max-width: ${size.container};
    width: 100%;

    border-radius: 12px;
    margin-bottom: 6rem;
    & > img {
        width: 100%;
        border-radius: 12px;
        object-fit: cover;
    }
`

const MarketingWrapperBig = styled.div`
    background: #ffe9e2;
    border-radius: 16px;
    display: flex;
    height: 160px;
    width: 366px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    font-weight: var(--weight-bold);
    font-size: var(--size-24);
    color: var(--primaryColor);
    @media ${device.laptop} {
        width: 612px;
        height: 280px;
    }
`

const MarketingWrapperSmall = styled.div`
    /* margin-top: var(--padding); */
    background: #ffe9e2;
    /* box-shadow: 0px 2px 20px rgba(0, 0, 0, 0.2); */
    border-radius: 16px;
    display: flex;
    height: 120px;
    width: 366px;
    /* padding: 44px 20px; */
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    font-weight: var(--weight-bold);
    font-size: var(--size-24);
    color: var(--primaryColor);
    @media ${device.laptop} {
        width: 1240px;
        height: 160px;
    }
`

export const HomepageSwiper = () => {
    return (
        <SwiperMainW>
            <HeadlineContainer>
                <HeadLine>Defined by marketing</HeadLine>
            </HeadlineContainer>
            <SwiperC>
                <ChevronContainer className="swiper-button-prev-unique">
                    <ChevronLeft />
                </ChevronContainer>
                <SwiperContainer>
                    <Swiper
                        onChange={() => {
                            trackEvent({
                                action: 'Big-card-swipe',
                                category: 'HomeDR',
                            })
                        }}
                        modules={[Navigation, Scrollbar, A11y]}
                        breakpoints={{
                            0: {
                                slidesPerView: 1.15,
                                spaceBetween: 16,
                                centeredSlides: true,
                            },
                            1024: {
                                slidesPerView: 2,
                                spaceBetween: 40,
                                centeredSlides: false,
                            },
                        }}
                        loop={false}
                        navigation={{
                            nextEl: '.swiper-button-next-unique',
                            prevEl: '.swiper-button-prev-unique',
                        }}
                    >
                        <SwiperSlide>
                            <MarketingWrapperBig>Defined by marketing</MarketingWrapperBig>
                        </SwiperSlide>
                        <SwiperSlide>
                            <MarketingWrapperBig>Defined by marketing</MarketingWrapperBig>
                        </SwiperSlide>
                        <SwiperSlide>
                            <MarketingWrapperBig>Defined by marketing</MarketingWrapperBig>
                        </SwiperSlide>
                        <SwiperSlide>
                            <MarketingWrapperBig>Defined by marketing</MarketingWrapperBig>
                        </SwiperSlide>
                        <SwiperSlide>
                            <MarketingWrapperBig>Defined by marketing</MarketingWrapperBig>
                        </SwiperSlide>
                    </Swiper>
                </SwiperContainer>

                <ChevronContainer className="swiper-button-next-unique">
                    <ChevronRight />
                </ChevronContainer>
            </SwiperC>

            <HeadlineContainer>
                <HeadLine>Defined by marketing</HeadLine>
            </HeadlineContainer>
            <SwiperC>
                <SwiperContainer>
                    <ImageContainer>
                        <Swiper
                            onTransitionEnd={() => {
                                trackEvent({
                                    action: 'Small-card-swipe',
                                    category: 'HomeDR',
                                })
                            }}
                            modules={[Navigation, Scrollbar, A11y]}
                            breakpoints={{
                                0: {
                                    slidesPerView: 1.15,
                                    spaceBetween: 16,
                                    centeredSlides: true,
                                },
                                1024: {
                                    slidesPerView: 1,
                                    spaceBetween: 20,
                                },
                            }}
                        >
                            <SwiperSlide>
                                <MarketingWrapperSmall>Defined by marketing</MarketingWrapperSmall>
                            </SwiperSlide>
                            <SwiperSlide>
                                <MarketingWrapperSmall>Defined by marketing</MarketingWrapperSmall>
                            </SwiperSlide>
                            <SwiperSlide>
                                <MarketingWrapperSmall>Defined by marketing</MarketingWrapperSmall>
                            </SwiperSlide>
                            <SwiperSlide>
                                <MarketingWrapperSmall>Defined by marketing</MarketingWrapperSmall>
                            </SwiperSlide>
                            <SwiperSlide>
                                <MarketingWrapperSmall>Defined by marketing</MarketingWrapperSmall>
                            </SwiperSlide>
                        </Swiper>
                    </ImageContainer>
                </SwiperContainer>
            </SwiperC>
        </SwiperMainW>
    )
}
