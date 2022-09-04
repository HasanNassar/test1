import styled from 'styled-components'
import { useTranslation } from 'next-i18next'
import { CarFeature, CarType, EngineSize, GearBoxType } from '@service/booking.types'
import { ImageHandler } from './ImageHandler'

const FeatureBadgeContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    height: 84px;
    background: white;
    border-radius: 16px;
    filter: drop-shadow(0px 4px 6px rgba(0, 0, 0, 0.04));
`

const FeatureText = styled.p`
    font-size: var(--size-14);
    font-weight: var(--weight-regular);
    color: rgba(0, 0, 0, 0.8);
    margin: 4px 0 0 0;
    padding: 0 4px;
    white-space: nowrap;
    min-width: 86px;
    max-width: 258px;
    overflow: hidden;
    text-overflow: ellipsis;
`

const imageBasePath = '/rental/svg'
const defaultImage = `${imageBasePath}/car.svg`
const imageSize = {
    height: '24',
    width: '25',
}

export const FeatureBadge = ({ badge }: { badge: number | string | CarFeature | EngineSize }) => {
    const { t } = useTranslation()

    if (Object.values(GearBoxType).includes(badge as GearBoxType)) {
        return (
            <FeatureBadgeContainer>
                <div>
                    <ImageHandler
                        imageUrl={`${imageBasePath}/${(badge as string).toLowerCase()}.svg`}
                        fallbackImageUrl={defaultImage}
                        width={imageSize.width}
                        height={imageSize.height}
                    />
                </div>
                <FeatureText>{t(`carProperty.${(badge as string).toLowerCase()}`, '')}</FeatureText>
            </FeatureBadgeContainer>
        )
    }

    if (Object.values(CarType).includes(badge as CarType))
        return (
            <FeatureBadgeContainer>
                <div>
                    <ImageHandler
                        imageUrl={`${imageBasePath}/${(badge as string).toLowerCase()}.svg`}
                        fallbackImageUrl={`${imageBasePath}/car.svg`}
                        width={imageSize.width}
                        height={imageSize.height}
                    />
                </div>
                <FeatureText>{t(`carProperty.${(badge as string).toLowerCase()}`, '')}</FeatureText>
            </FeatureBadgeContainer>
        )
    if (badge === 'parkingSensors')
        return (
            <FeatureBadgeContainer>
                <div>
                    <ImageHandler
                        imageUrl={`${imageBasePath}/parkingSensors.svg`}
                        fallbackImageUrl={defaultImage}
                        width={imageSize.width}
                        height={imageSize.height}
                    />
                </div>
                <FeatureText>{t('carDetailsFeatureBadgeParkingSensors', 'parking sensors')}</FeatureText>
            </FeatureBadgeContainer>
        )
    if (badge > 0 && badge < 10)
        return (
            <FeatureBadgeContainer>
                <div>
                    <ImageHandler
                        imageUrl={`${imageBasePath}/seats.svg`}
                        fallbackImageUrl={defaultImage}
                        width={imageSize.width}
                        height={imageSize.height}
                    />
                </div>
                <FeatureText>
                    {t('carDetailsFeatureBadgePassengerCount', '{{ passengerCount }} person', {
                        passengerCount: badge,
                    })}
                </FeatureText>
            </FeatureBadgeContainer>
        )
    if ((badge as CarFeature)?.i18nKey) {
        const featureName = (badge as CarFeature)?.i18nKey.split('.').pop()
        return (
            <FeatureBadgeContainer>
                <div>
                    <ImageHandler
                        imageUrl={`${imageBasePath}/${featureName}.svg`}
                        fallbackImageUrl={defaultImage}
                        width={imageSize.width}
                        height={imageSize.height}
                    />
                </div>
                <FeatureText>{t((badge as CarFeature).i18nKey, (badge as CarFeature).i18nKey)}</FeatureText>
            </FeatureBadgeContainer>
        )
    }

    if ((badge as EngineSize)?.value)
        return (
            <FeatureBadgeContainer>
                <div>
                    <ImageHandler
                        imageUrl={`${imageBasePath}/engineSize.svg`}
                        fallbackImageUrl={defaultImage}
                        width={imageSize.width}
                        height={imageSize.height}
                    />
                </div>
                <FeatureText>{(badge as EngineSize).value}</FeatureText>
            </FeatureBadgeContainer>
        )

    return null
}
