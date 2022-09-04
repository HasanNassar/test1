import { ClickedEllipse } from '@components/global/icons/ClickedEllipse'
import { Ellipse } from '@components/global/icons/Ellipse'
import { useTranslation } from 'next-i18next'
import {
    ContentWrapper,
    Headline,
    Recommended,
    SelectionCard,
    SelectionHeadLine,
    SelectedPrice,
    Description,
    EllipseWrapper,
} from 'src/pages/[city]/cars/[listingsId]/summary'
import styled from 'styled-components'

const AddressTitle = styled.p`
    margin: 0;
    font-size: 12px;
    font-weight: 700;
`
const AddressBody = styled.p`
    margin: 0;
    font-size: 13px;
`
const AddressSection = styled.div`
    font-weight: 500;
    text-align: start;
    font-size: 14px;
    margin-bottom: 5px;
    & > a {
        color: var(--primaryColor);
    }
`

export const DoorToDoorDelivery = ({ includeDoorToDoorDelivery, deliveries, selfPickUpAddress, toggleDelivery }) => {
    const { t } = useTranslation()
    return (
        <ContentWrapper>
            <Headline>{t('bookingSummaryHeadlineDelivery', 'Door-to-door')}</Headline>
            <SelectionCard isActive={!includeDoorToDoorDelivery} onClick={() => toggleDelivery(false)}>
                {deliveries[0].recommended ? (
                    <Recommended>{t('bookingSummaryInsuranceRecommended', 'recommended')}</Recommended>
                ) : (
                    ''
                )}
                <div>
                    <SelectionHeadLine>
                        <h1>{deliveries[0].type}</h1>
                        {/*<InfoOutline />*/}
                    </SelectionHeadLine>
                    <SelectedPrice>{deliveries[0].price}</SelectedPrice>
                    <AddressSection>
                        <AddressTitle>{t('bookingSummaryAddressTitle', 'Here you can receive the car:')}</AddressTitle>
                        <AddressBody>{selfPickUpAddress}</AddressBody>
                    </AddressSection>
                    <Description>{t('bookingSummaryDeliverySelfPickUpInfo', deliveries[0].info)}</Description>
                </div>
                <EllipseWrapper>{!includeDoorToDoorDelivery ? <ClickedEllipse /> : <Ellipse />}</EllipseWrapper>
            </SelectionCard>
            <SelectionCard isActive={includeDoorToDoorDelivery} onClick={() => toggleDelivery(true)}>
                {deliveries[1].recommended ? (
                    <Recommended>{t('bookingSummaryInsuranceRecommended', 'recommended')}</Recommended>
                ) : (
                    ''
                )}
                <div>
                    <SelectionHeadLine>
                        <h1>{deliveries[1].type}</h1>
                        {/*<InfoOutline />*/}
                    </SelectionHeadLine>
                    <SelectedPrice>{deliveries[1].price}</SelectedPrice>
                    <Description>{t('bookingSummaryDeliveryDoorToDoorInfo', deliveries[1].info)}</Description>
                </div>
                <EllipseWrapper>{includeDoorToDoorDelivery ? <ClickedEllipse /> : <Ellipse />}</EllipseWrapper>
            </SelectionCard>
        </ContentWrapper>
    )
}
