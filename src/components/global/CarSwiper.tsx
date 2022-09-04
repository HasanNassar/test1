import { getImageUrl } from '@util/images'
import styled from 'styled-components'
import SwiperCore, { Pagination } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import Image from 'next/image'
import { useMediaQuery } from '@hooks/mediaQuery'
import { device } from '@util/responsive'
import { trackEvent } from '@util/ga'
import { useTranslation } from 'next-i18next'
import { formatPrice } from '@util/config'

SwiperCore.use([Pagination])

export type CarSwiper = {
    make: string
    model: string
    dailyPrice: number
    totalPrice: number
    currency: string
    picture: []
}

export const CarSwiper: React.FC<{
    car: any
    totalPriceShown: boolean
    showPriceDetails: boolean
    badgeShown: boolean
}> = ({ car, totalPriceShown: isTotalShown, showPriceDetails: isShown, badgeShown: isBadgeShown }) => {
    const { t } = useTranslation()
    const mockPic = 'MockCar.png'
    const isDesktop = useMediaQuery(device.laptop)

    const imageParams = {
        width: isDesktop ? 1920 : 960,
        height: isDesktop ? 1080 : 540,
        aspectRatio: '16:9',
        fit: 'crop',
    }

    const bookingStatus = car.status
        ? car.status.toLowerCase().replace('_', ' ')
        : t('bookingStatusNotAvailable', 'No status available')

    return (
        <CarSwiperContainer>
            <CarHeadingContainer>
                <CarHeading total={isTotalShown}>
                    {car.make} {car.model}
                </CarHeading>
                {isTotalShown ? (
                    <TotalPrice>
                        {formatPrice(car.totalPrice)} {car.currency} {t('carCardTotal', ' total')}
                    </TotalPrice>
                ) : (
                    ''
                )}
                {isBadgeShown ? <Recommended status={bookingStatus}>{bookingStatus}</Recommended> : ''}
            </CarHeadingContainer>
            <SwiperContainer>
                <Swiper
                    pagination={true}
                    onSlideChange={() => {
                        trackEvent({
                            action: 'Image-swipe',
                            category: 'Car-detailsDR',
                            label: 'Car-details',
                        })
                    }}
                >
                    {car.picture.map((item) => {
                        return (
                            <SwiperSlide key={item.id}>
                                <Image
                                    src={mockPic}
                                    loader={() => getImageUrl(item.imageKey, imageParams)}
                                    width={imageParams.width}
                                    height={imageParams.height}
                                />
                            </SwiperSlide>
                        )
                    })}
                </Swiper>
            </SwiperContainer>
            {isShown ? (
                <TextContainer>
                    <CarPrice
                        className={'priceText'}
                        color={'var(--primaryColor)'}
                        fontWeigth={'var(--weight-extraBold)'}
                    >
                        <b data-cy="dailyPrice">{formatPrice(car.dailyPrice)}</b> {car.currency}{' '}
                        <span>{t('carCardPerDay', ' / day')}</span>
                    </CarPrice>
                    <SmallText>
                        <span data-cy="totalPrice">{formatPrice(car.totalPrice)}</span> {car.currency}{' '}
                        {t('carCardTotal', ' total')}
                    </SmallText>
                </TextContainer>
            ) : (
                ''
            )}
        </CarSwiperContainer>
    )
}

const Recommended = styled.div<{ status?: string }>`
    padding: 6px 12px;
    position: absolute;
    margin-top: 0.5rem;
    background: #cef0e1;
    border: 1px solid #09b46b;
    border-radius: 4px;
    font-style: normal;
    font-weight: bold;
    font-size: 12px;
    color: #09b46b;
    background: rgba(9, 180, 107, 0.2);
    mix-blend-mode: normal;
    opacity: 0.9;
    /* Green */

    border: 1px solid #09b46b;
    box-sizing: border-box;
    border-radius: 4px;
    ${(props) =>
        props.status === 'cancelled' &&
        `background: rgba(0, 0, 0, 0.1);
        border: 1px solid rgba(0, 0, 0, 0.2);
        color: rgba(0, 0, 0, 0.2);`}
    ${(props) =>
        props.status === 'succeeded' &&
        `background: rgba(18, 141, 255, 0.2);
        border: 1px solid rgba(18, 141, 255, 1);
        color: #128DFF;`}
`

const CarSwiperContainer = styled.div`
    margin-top: var(--padding);
    display: flex;
    flex-direction: column;
`
const SwiperContainer = styled.div`
    margin: 0 -24px;
`
const TextContainer = styled.div`
    margin: 0 -24px;
    padding: 12px var(--padding) 0;
`

const CarHeadingContainer = styled.div`
    z-index: 10;
`

const CarHeading = styled.h1<{ color?: string; fontWeigth?: string; total?: boolean }>`
    font-size: var(--size-24);
    color: ${(props) => props.color || ''};
    font-weight: ${(props) => props.fontWeigth || '800'};
    margin: 0;
    margin-bottom: ${(props) => (props.total ? '0' : '12px')};
`

const CarPrice = styled.h2<{ color?: string; fontWeigth?: string }>`
    font-size: var(--size-24);
    color: ${(props) => props.color || ''};
    font-weight: ${(props) => props.fontWeigth || '800'};
    margin: 0 0 4px 0;

    & > span {
        font-size: var(--size-14);
        font-weight: var(--weight-regular);
        margin-left: 3px;
    }
`

const SmallText = styled.p`
    font-size: var(--size-14);
    margin: 0;
`

const TotalPrice = styled.p`
    font-style: normal;
    font-weight: bold;
    font-size: 14px;
    color: #ff5a5a;
    margin: 4px 0 0 0;
`
