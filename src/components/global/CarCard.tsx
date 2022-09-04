import styled from 'styled-components'
import { CarImage } from '@components/modules/Car/CarImage'
import { CarType, GearBoxType, TagDto } from '@service/booking.types'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useTranslation } from 'next-i18next'
import { formatPrice } from '@util/config'

export type CarCard = {
    id: string | number
    coverPhoto: string
    make: string
    model: string
    generation: string
    carType: CarType
    gearboxType: GearBoxType
    seats: number
    carFeatures: string[]
    tags: TagDto[]
    pricingDetails: any
    engineSize: string
}

export const CarCard: React.FC<{ car: CarCard; pricingInfos?: any }> = ({ car, pricingInfos }) => {
    const { t } = useTranslation()
    const { push } = useRouter()

    const [dailyPrices, setDailyPrices] = useState(car.pricingDetails)
    const { currency } = car.pricingDetails || pricingInfos.currency

    useEffect(() => {
        setDailyPrices(pricingInfos)
    }, [pricingInfos])

    if (!dailyPrices) {
        return null
    }

    return (
        <CarCardContainer data-cy="car-card" data-cy-id={car.id} onClick={() => push(`/dubai/cars/${car.id}`)}>
            <CarDataWrapper>
                <CarTitleWrapper>
                    <CarHeading color="rgba(0, 0, 0, 1)">
                        {car.make} {car.model}
                    </CarHeading>
                </CarTitleWrapper>
                <div>
                    <CarHeading
                        className={'priceText'}
                        color={'var(--primaryColor)'}
                        fontWeigth={'var(--weight-extraBold)'}
                    >
                        <b data-cy="dailyPrice">{formatPrice(dailyPrices.dailyPrice)}</b> {currency}
                        <span style={{ marginLeft: 5 }}>{t('carCardPerDay', ' / day')}</span>
                    </CarHeading>
                    <SmallText>
                        {currency} <span data-cy="totalPrice">{formatPrice(dailyPrices.totalPrice)}</span>
                        {t('carCardTotal', ' total')}
                    </SmallText>
                </div>
            </CarDataWrapper>
            <CarImgWrapper>
                <CarImage src={car.coverPhoto} />
                <CarTagWrapper className={'cardItem'}>
                    {car.tags.map((carTag) => (
                        <CarTag
                            style={{
                                backgroundColor: `#${carTag.backgroundHexCode}`,
                                color: carTag.isLabelDark ? '#000000' : '#ffffff',
                            }}
                        >
                            {t(carTag.i18nKey)}
                        </CarTag>
                    ))}
                </CarTagWrapper>
            </CarImgWrapper>
            <CarFeaturesBg>
                <CarFeaturesWrapper>
                    <CarProperty>{t(`carProperty.${car.gearboxType.toLowerCase()}`, '')}</CarProperty>
                    <CarProperty>{t(`carProperty.${car.carType.toLowerCase()}`, '')}</CarProperty>
                    <CarProperty>
                        {t('carDetailsFeatureBadgePassengerCount', '{{ passengerCount }} person', {
                            passengerCount: car.seats,
                        })}
                    </CarProperty>
                    {car.engineSize && <CarProperty>{car.engineSize}</CarProperty>}
                </CarFeaturesWrapper>
            </CarFeaturesBg>
        </CarCardContainer>
    )
}

const CarProperty = styled.div`
    white-space: nowrap;
    background: #f1f1f1;
    border-radius: 30px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    padding: 4px 8px;
    margin: 0 10px 0 0;
    font-weight: 500;
    font-size: 13px;
`

const CarTagWrapper = styled.div`
    display: inline-flex;
    gap: 5px;
    position: absolute;
    top: 80px;
    left: 5px;
    white-space: nowrap;
    flex-wrap: wrap;
`

const CarTag = styled.div`
    display: grid;
    opacity: 0.9;
    position: relative;
    font-size: 12px;
    white-space: nowrap;
    cursor: default;
    user-select: none;
    padding: 4px 6px;
    border-radius: 4px;
`

const CarCardContainer = styled.div`
    background: white;
    margin-top: var(--padding);
    box-shadow: 0px 2px 20px 0px rgba(0, 0, 0, 0.08);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 0 0 12px 0;
    border-radius: 16px;
    width: 100%;
    position: relative;
    z-index: 10;
`
const CarDataWrapper = styled.div`
    border-radius: 16px 16px 0 0;
    background: var(--light-grey);
    padding: 16px 20px 0;
    display: flex;
    justify-content: space-between;
`

const CarImgWrapper = styled.div`
    width: 100%;
    padding: 0px;
    margin: 0 0 -5px;
    overflow: hidden;
`

const CarTitleWrapper = styled.div`
    max-width: 50%;
`

const CarHeading = styled.h3<{ color?: string; fontWeigth?: string }>`
    font-size: var(--size-20);
    color: ${(props) => props.color || ''};
    font-weight: ${(props) => props.fontWeigth || ''};
    margin: 0 0 4px 0;

    & > span {
        font-size: var(--size-14);
        font-weight: var(--weight-regular);
    }
`

const SmallText = styled.p`
    text-align: right;
    font-size: var(--size-14);
    margin: 0;
`

const CarFeaturesBg = styled.div`
    background: linear-gradient(180deg, var(--light-grey) 20%, rgba(255, 255, 255, 0) 100%);
`
const CarFeaturesWrapper = styled.div`
    margin: 0 0 0 12px;
    padding: 1rem 0 0 0;
    display: flex;
    flex-wrap: wrap;
    row-gap: 0.5rem;
`
