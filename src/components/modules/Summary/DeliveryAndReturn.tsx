import { CalendarIcon } from '@components/global/icons/Calendar'
import { Pencil } from '@components/global/icons/Pencil'
import { Poi } from '@components/global/icons/Poi'
import { useTranslation } from 'next-i18next'
import { addHours, format } from 'date-fns'
import {
    ContentWrapper,
    Headline,
    ArrowWrapper,
    Text,
    AddressModalType,
} from 'src/pages/[city]/cars/[listingsId]/summary'
import styled from 'styled-components'

const FeatureCardWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background: #ffffff;

    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.04), 0px 2px 20px rgba(0, 0, 0, 0.08);
    border-radius: 16px;
    margin-bottom: 2rem;
`

const FeatureCard = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--padding) var(--padding);
`

const FeatureCardContent = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-start;
`

const FeatureTextWrapper = styled.div`
    padding: 0 var(--padding);
`
const FeatureHeading = styled.h4`
    font-size: var(--size-16);
    font-weight: var(--weight-extraBold);
    color: black;
    margin: 0;
`
const Separator = styled.div`
    width: 100%;
    border-bottom: 0.5px solid rgba(0, 0, 0, 0.1);
`

export const DeliveryAndReturn = ({
    includeDoorToDoorDelivery,
    delivery,
    fromTime,
    toTime,
    address,
    selfPickUpAddress,
    returnInfo,
    setDatepickerOverlay,
    setAddressModal,
}) => {
    const { t } = useTranslation()
    return (
        <ContentWrapper>
            <Headline>{t('bookingSummaryHeadline', 'Delivery')}</Headline>
            <FeatureCardWrapper>
                <FeatureCard>
                    <FeatureCardContent>
                        <CalendarIcon />
                        <FeatureTextWrapper>
                            <FeatureHeading>{delivery.date}</FeatureHeading>
                            {includeDoorToDoorDelivery && fromTime ? (
                                <Text>{`${delivery?.time} - ${format(addHours(fromTime as Date, 2), 'HH:mm')}`}</Text>
                            ) : (
                                <Text>{delivery?.time}</Text>
                            )}
                        </FeatureTextWrapper>
                    </FeatureCardContent>
                    <ArrowWrapper onClick={() => setDatepickerOverlay(true)}>
                        <Pencil color="#ff5a5a" />
                    </ArrowWrapper>
                </FeatureCard>
                <Separator />
                <FeatureCard>
                    <FeatureCardContent>
                        <Poi />
                        <FeatureTextWrapper>
                            {includeDoorToDoorDelivery ? (
                                <>
                                    <FeatureHeading>
                                        {address.handoverAddress?.addressLine1 ||
                                            t('bookingSummaryNoAddress1', 'Please select address')}
                                    </FeatureHeading>
                                    <Text>
                                        {address.handoverAddress?.addressLine2 ||
                                            (address.handoverAddress?.addressLine1
                                                ? '-'
                                                : t('bookingSummaryNoAddress2', 'No address selected'))}
                                    </Text>
                                </>
                            ) : (
                                <>
                                    <FeatureHeading>{selfPickUpAddress}</FeatureHeading>
                                    <Text>Dubai</Text>
                                </>
                            )}
                        </FeatureTextWrapper>
                    </FeatureCardContent>
                    {includeDoorToDoorDelivery && (
                        <ArrowWrapper onClick={() => setAddressModal(AddressModalType.delivery)}>
                            <Pencil color="#ff5a5a" />
                        </ArrowWrapper>
                    )}
                </FeatureCard>
            </FeatureCardWrapper>
            <Headline>{t('bookingSummaryHeadlineReturn', 'Return')}</Headline>
            <FeatureCardWrapper>
                <FeatureCard>
                    <FeatureCardContent>
                        <CalendarIcon />
                        <FeatureTextWrapper>
                            <FeatureHeading>{returnInfo.date}</FeatureHeading>
                            {includeDoorToDoorDelivery && toTime ? (
                                <Text>{`${returnInfo?.time} - ${format(addHours(toTime as Date, 2), 'HH:mm')}`}</Text>
                            ) : (
                                <Text>{returnInfo?.time}</Text>
                            )}
                        </FeatureTextWrapper>
                    </FeatureCardContent>
                    <ArrowWrapper onClick={() => setDatepickerOverlay(true)}>
                        <Pencil color="#ff5a5a" />
                    </ArrowWrapper>
                </FeatureCard>
                <Separator />
                <FeatureCard>
                    <FeatureCardContent>
                        <Poi />
                        <FeatureTextWrapper>
                            {includeDoorToDoorDelivery ? (
                                <>
                                    <FeatureHeading>
                                        {address.handbackAddress?.addressLine1 ||
                                            t('bookingSummaryNoAddress1', 'Please select address')}
                                    </FeatureHeading>
                                    <Text>
                                        {address.handbackAddress?.addressLine2 ||
                                            (address.handbackAddress?.addressLine1
                                                ? '-'
                                                : t('bookingSummaryNoAddress2', 'No address selected'))}
                                    </Text>
                                </>
                            ) : (
                                <>
                                    <FeatureHeading>{selfPickUpAddress}</FeatureHeading>
                                    <Text>Dubai</Text>
                                </>
                            )}
                        </FeatureTextWrapper>
                    </FeatureCardContent>
                    {includeDoorToDoorDelivery && (
                        <ArrowWrapper onClick={() => setAddressModal(AddressModalType.return)}>
                            <Pencil color="#ff5a5a" />
                        </ArrowWrapper>
                    )}
                </FeatureCard>
            </FeatureCardWrapper>
        </ContentWrapper>
    )
}
