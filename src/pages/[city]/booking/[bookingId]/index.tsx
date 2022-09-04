import styled from 'styled-components'
import MainLayout from '@components/layout/MainLayout'
import { CarSwiper } from '@components/global/CarSwiper'
import { CalendarIcon } from '@components/global/icons/Calendar'
import { Poi } from '@components/global/icons/Poi'
import { useRef, useState } from 'react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { Trans, useTranslation } from 'next-i18next'
import { useQuery } from 'react-query'
import { bookingService } from '@service/booking'
import { useRouterQuery } from '@hooks/useRouterQuery'
import { addHours, format } from 'date-fns'
import { RentalDetailsResponse } from '@service/payment.types'
import { paymentService } from '@service/payment'
import { openFreshChat } from '@util/freshChat'
import { useAuth } from '@contexts/auth'
import { StatusType } from '@service/booking.types'
import { useClickOutside } from '@hooks/clickOutside'
import { Modal } from '@components/global/Modal'
import Router from 'next/router'
import { StatusCodes } from 'http-status-codes'
import { BookingCouponDetails } from '@components/modules/Booking/BookingCouponDetails'
import { BookingSection } from '@components/modules/Booking/BookingSection'
import { Phone } from '@components/global/icons/Phone'
import Link from 'next/link'
import { formatPrice } from '@util/config'

const Wrapper = styled.div<{ bgColor?: string }>`
    background: ${(props) => props.bgColor};
    background-size: 100% 100%;
    position: relative;
    overflow: hidden;
    padding: 0 var(--padding) 0 var(--padding);

    @media (min-width: 768px) {
        background-size: 100% 500px;
    }
`

const SectionWrapper = styled.div`
    background: white;
    padding: 0 var(--padding);
`

const SeparatorBig = styled.div`
    border-bottom: 0.5px solid rgba(0, 0, 0, 0.1);
    margin: 32px 0px;
`

const Headline = styled.h1`
    font-size: var(--size-24);
    font-weight: var(--weight-extraBold);
    color: black;

    margin: var(--padding) 0 var(--padding) 0;
`

const FeatureCardWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background: #ffffff;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.04), 0px 2px 20px rgba(0, 0, 0, 0.08);
    border-radius: 12px;
    margin-bottom: var(--padding);
`

const FeatureCard = styled.div`
    display: flex;
    align-items: flex-start;
    padding: var(--padding) var(--padding);
`
const FeatureTextWrapper = styled.div`
    padding: 0 var(--padding);
`

const Separator = styled.div`
    border-bottom: 0.5px solid rgba(0, 0, 0, 0.16);
`

const FeatureCardContent = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-start;
`

const FeatureHeading = styled.h4`
    font-size: var(--size-16);
    font-weight: var(--weight-extraBold);
    color: black;
    margin: 0;
`

const Text = styled.p`
    font-size: var(--size-14);
    font-weight: 500;
    color: #000000;
    margin: 4px 0 0 0;
`

const FlexContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    & > h1 {
        margin-top: 24px;
    }
`

const FlexColContainer = styled.div`
    display: flex;
    flex-direction: column;
    margin-bottom: 1rem;
`

const SubHeading = styled.h4`
    font-weight: bold;
    margin: 4px 0 0 0;
    font-size: 16px;
    color: #000000;
`

const SumHeading = styled.h1`
    font-weight: 800;
    font-size: 24px;
    text-align: right;
    color: #ff5a5a;
    margin: 0;
`

const TextGray = styled.p`
    font-size: var(--size-14);
    font-weight: var(--weight-regular);
    color: rgba(0, 0, 0, 0, 8);
    margin: 4px 0 0 0;
`

const FullListText = styled.p`
    font-weight: var(--weight-bold);
    font-size: 14px;
    margin: 0;
    color: #ff5a5a;
    margin-inline-end: 10px;
`
const SupportButton = styled.button`
    font-weight: bold;
    font-size: 16px;
    display: flex;
    align-items: center;
    text-align: center;
    color: #ff5a5a;
    margin: 1rem 0;
    padding: 8px 24px;
    border: 1px solid #ff5a5a;
    border-radius: 100px;
    background-color: white;
`

const CancelWrapper = styled.div`
    margin-top: 1rem;
    cursor: pointer;
`

const SeparatorMargin = styled.div`
    margin-top: 4rem;
`

const ModalContainer = styled.div`
    inset: 0;
    display: flex;
    text-align: center;
    justify-items: center;
    align-items: center;
    padding: 1rem;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 100;
    position: fixed;
    top: 0;
    max-width: calc(100vw - 2rem);
`

const ModalWrapper = styled.div`
    width: 100%;
    max-width: 360px;
    margin: 0 auto;
    background-color: white;
    border-radius: 16px;
`

const ModalHeader = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 24px 24px 0px 24px;
    align-items: center;
`
const Heading = styled.h1`
    margin: 0px;
    font-size: var(--size-24);
`
const ModalContent = styled.div`
    padding: 24px;
`
const ModalButtons = styled.div`
    display: flex;
    margin-top: 24px;
    justify-content: space-evenly;
    align-items: center;
`
const CancelModalButton = styled.button`
    display: flex;
    width: 145px;
    align-items: center;
    justify-content: center;
    text-align: center;
    font-weight: bold;
    color: #ff5a5a;
    margin: 1rem 0.5rem;
    padding: 8px 24px;
    border: 1px solid #ff5a5a;
    border-radius: 100px;
    background-color: white;
`
const ConfirmModalButton = styled.button`
    display: flex;
    width: 145px;
    align-items: center;
    justify-content: center;
    text-align: center;
    font-weight: bold;
    color: white;
    margin: 1rem 0.5rem;
    padding: 8px 24px;
    border: 1px solid #ff5a5a;
    border-radius: 100px;
    background-color: #ff5a5a;
`

const CancellationFeeAmount = styled.div`
    font-weight: bold;
    color: var(--primaryColor);
    font-size: var(--size-24);
`

const CancellationFeeLabel = styled.div`
    font-size: var(--size-14);
`

const PhoneNumberWrapper = styled.div`
    display: flex;
    align-items: center;
    margin-top: 20px;
    gap: 8px;

    a {
        color: var(--primaryColor);
        font-weight: 700;
    }

    ${Phone} {
        width: 15px;
        color: var(--primaryColor);
    }
`

export async function getServerSideProps({ locale }) {
    return {
        props: {
            ...(await serverSideTranslations(locale, ['common'])),
        },
    }
}

export default function PostBookingCardDetails() {
    const { t } = useTranslation()
    const query = useRouterQuery()
    const { user } = useAuth()
    const userId = user?.userId || ''
    const bookingId = query?.bookingId || ''
    const [cancellationProgress, setCancellationProgress] = useState(false)
    const [modal, setModal] = useState(false)
    const node = useRef(null)
    const [surchargeAmount, setSurchargeAmount] = useState(0)
    const [bookingCancellationFinishedMessage, setBookingCancellationFinishedMessage] = useState({
        message: null,
        isError: false,
    })

    useClickOutside(node, () => setModal(false))

    const { data } = useQuery(
        'customerBookingById',
        () => bookingService.getCustomerBookingById(parseInt(bookingId as string)),
        {
            enabled: !!bookingId,
        },
    )

    const listingId = data?.data?.listingId || 0
    const { data: carData } = useQuery(['car', listingId], () => bookingService.getListingById(Number(listingId)), {
        enabled: !!listingId,
    })

    const { data: rentalDetailsData } = useQuery(
        ['getRentalDetails', bookingId],
        () => paymentService.getRentalDetails(userId, +bookingId),
        {
            enabled: !!userId,
        },
    )

    const rentalDetails: RentalDetailsResponse | undefined = rentalDetailsData?.data
    const priceDetails = rentalDetails?.priceDetails
    const couponDetails = priceDetails?.couponDetails
    const currency = rentalDetails?.currency
    const rentalPeriodDays = rentalDetails?.rentalPeriodDays
    const deposit = priceDetails?.totalDeposit || 0

    const deliveryDate = new Date(data?.data?.handoverTime as string)
    const returnDate = new Date(data?.data?.handbackTime as string)

    const createRangeFromDate = (date) =>
        data?.data?.includeDelivery
            ? format(date, 'HH:mm') + ' - ' + format(addHours(date, 2), 'HH:mm')
            : format(date, 'HH:mm')

    const delivery = {
        date: data?.data?.handoverTime ? format(deliveryDate, 'EEE, MMM d') : '',
        time: data?.data?.handoverTime ? createRangeFromDate(deliveryDate) : '',
        addressLine1: data?.data?.handoverAddress.addressLine1,
        addressLine2: data?.data?.handoverAddress.addressLine2,
    }

    const returnInfo = {
        date: data?.data?.handbackTime ? format(returnDate, 'EEE, MMM d') : '',
        time: data?.data?.handbackTime ? createRangeFromDate(returnDate) : '',
        addressLine1: data?.data?.handbackAddress.addressLine1,
        addressLine2: data?.data?.handbackAddress.addressLine2,
    }

    const bookingStatus = data?.data?.status
    const roadsideAssistanceNumber = data?.data?.roadsideAssistanceNumber

    const car = carData?.data

    if (!car) {
        return null
    }

    const sortedCars = [...car.photos].sort((a, b) => a.position - b.position)

    const carSwiper1 = {
        make: car?.make,
        model: car?.model,
        dailyPrice: priceDetails?.dailyPrice,
        totalPrice: priceDetails?.totalPriceAfterDiscount,
        currency: currency,
        picture: sortedCars,
        status: bookingStatus,
    }

    const getCancellationSurchargeAmount = async () => {
        try {
            const { data } = await paymentService.getCancellationFee(userId, +bookingId)
            setModal(true)
            return data
        } catch (error: unknown) {
            setBookingCancellationFinishedMessage({
                message: t(
                    'errorWhileCancellingBooking',
                    'Unexpected error occurred while cancelling the booking, please try again!',
                ),
                isError: true,
            })
            setModal(true)
            return null
        }
    }

    const cancelBooking = async () => {
        const response = await getCancellationSurchargeAmount()
        const surchargeAmount = response?.surchargeAmount || 0
        setSurchargeAmount(surchargeAmount)
    }

    const confirmBookingCancellation = async () => {
        const showCancellationError = () =>
            setBookingCancellationFinishedMessage({
                message: t(
                    'errorWhileCancellingBooking',
                    'Unexpected error occurred while cancelling the booking, please try again!',
                ),
                isError: true,
            })
        try {
            setCancellationProgress(true)
            const doCancelBooking = await bookingService.updateBookingStatus(+bookingId, {
                status: StatusType.CANCELLED,
            })
            if (doCancelBooking && doCancelBooking.status === StatusCodes.OK) {
                setBookingCancellationFinishedMessage({
                    message: t('successfulBookingCancellation', 'Booking successfully cancelled!'),
                    isError: false,
                })
                setTimeout(() => Router.push('./'), 2000)
            } else {
                showCancellationError()
                setCancellationProgress(false)
            }
        } catch (err) {
            setCancellationProgress(false)
            showCancellationError()
        }
    }

    const closeModal = () => {
        setBookingCancellationFinishedMessage({ message: null, isError: false })
        setModal(false)
    }
    return (
        <MainLayout>
            <Wrapper bgColor="var(--light-grey)">
                <CarSwiper car={carSwiper1} totalPriceShown={false} showPriceDetails={false} badgeShown={true} />
            </Wrapper>

            <SectionWrapper>
                <Headline>{t('bookingConfirmationSummaryDelivery', 'Delivery')}</Headline>
                <FeatureCardWrapper>
                    <FeatureCard>
                        <FeatureCardContent>
                            <div>
                                <CalendarIcon />
                            </div>
                            <FeatureTextWrapper>
                                <FeatureHeading>{delivery.date}</FeatureHeading>
                                <Text>{delivery.time}</Text>
                            </FeatureTextWrapper>
                        </FeatureCardContent>
                    </FeatureCard>
                    <Separator />
                    <FeatureCard>
                        <FeatureCardContent>
                            <div>
                                <Poi />
                            </div>
                            <FeatureTextWrapper>
                                <FeatureHeading>{delivery.addressLine1}</FeatureHeading>
                                <Text>{delivery.addressLine2}</Text>
                            </FeatureTextWrapper>
                        </FeatureCardContent>
                    </FeatureCard>
                </FeatureCardWrapper>
                <Headline>{t('bookingConfirmationSummaryReturn', 'Return')}</Headline>
                <FeatureCardWrapper>
                    <FeatureCard>
                        <FeatureCardContent>
                            <div>
                                <CalendarIcon />
                            </div>
                            <FeatureTextWrapper>
                                <FeatureHeading>{returnInfo.date}</FeatureHeading>
                                <Text>{returnInfo.time}</Text>
                            </FeatureTextWrapper>
                        </FeatureCardContent>
                    </FeatureCard>
                    <Separator />
                    <FeatureCard>
                        <FeatureCardContent>
                            <div>
                                <Poi />
                            </div>
                            <FeatureTextWrapper>
                                <FeatureHeading>{returnInfo.addressLine1}</FeatureHeading>
                                <Text>{returnInfo.addressLine2}</Text>
                            </FeatureTextWrapper>
                        </FeatureCardContent>
                    </FeatureCard>
                </FeatureCardWrapper>
                {/* <a
                    href="https://joinswapp3039.zendesk.com/hc/en-us/sections/360005082258-Handover-Handback-Agreement"
                    target="_blank"
                >
                    <TextWrapperCenter>
                        <Sheet />
                        <FullListText>{t('bookingConfirmationHandoverGuide', 'Check out handover guide')}</FullListText>
                    </TextWrapperCenter>
                </a> */}
            </SectionWrapper>
            <SeparatorBig />
            <SectionWrapper>
                <Headline>{t('bookingConfirmationPaymentDetails', 'Payment details')}</Headline>
                <FlexColContainer>
                    <FlexContainer>
                        <Text>{t('bookingConfirmationReantalPeriod', 'Rental period')}</Text>
                        <SubHeading>
                            {currency} {priceDetails?.totalPrice && formatPrice(priceDetails?.totalPrice)}
                        </SubHeading>
                    </FlexContainer>
                    <TextGray>
                        {currency} {priceDetails?.dailyPrice && formatPrice(priceDetails?.dailyPrice)}{' '}
                        {t('bookingConfirmationDailyPrice', '/ day')}
                    </TextGray>
                </FlexColContainer>
                {deposit > 0 && (
                    <FlexColContainer>
                        <FlexContainer>
                            <Text>{t('depositAmount', 'Deposit amount')}</Text>
                            <SubHeading>
                                {currency} {formatPrice(deposit)}
                            </SubHeading>
                        </FlexContainer>
                        <TextGray />
                    </FlexColContainer>
                )}
                {rentalDetails?.includeExtraInsurance && (
                    <FlexColContainer>
                        <FlexContainer>
                            {rentalDetails?.includeExtraInsurance ? (
                                <Text>{t('bookingSummaryInsuranceType', 'Full insurance')}</Text>
                            ) : (
                                <Text>{t('bookingSummaryInsuranceComprehensive', 'Comprehensive')}</Text>
                            )}
                            <SubHeading>
                                {currency}{' '}
                                {priceDetails?.totalExtraInsuranceFee &&
                                    formatPrice(priceDetails?.totalExtraInsuranceFee)}
                            </SubHeading>
                        </FlexContainer>
                        <TextGray>
                            {currency} {priceDetails?.extraInsuranceFee} {t('bookingSummaryDailyPrice', '/ day')}
                        </TextGray>
                    </FlexColContainer>
                )}
                {rentalDetails?.includeDelivery && (
                    <FlexColContainer>
                        <FlexContainer>
                            <Text>{t('bookingSummaryDoorToDoor', 'Door-to-door delivery')}</Text>
                            <SubHeading>
                                {currency} {priceDetails?.deliveryFee && formatPrice(priceDetails?.deliveryFee)}
                            </SubHeading>
                        </FlexContainer>
                        <TextGray />
                    </FlexColContainer>
                )}
                {couponDetails &&
                    couponDetails.valid &&
                    (couponDetails.discountRate || couponDetails.discountAmount) && (
                        <BookingCouponDetails
                            couponDetails={couponDetails}
                            currency={currency}
                            listingDiscountAmount={priceDetails.discountAmount}
                        />
                    )}

                <FlexContainer>
                    <SubHeading>
                        <Trans i18nKey="bookingSummaryTotalDayNumber">Total for {{ rentalPeriodDays }} days</Trans>
                    </SubHeading>
                    <SumHeading>
                        {currency}{' '}
                        {rentalDetails?.priceDetails?.firstCharge &&
                            formatPrice(rentalDetails?.priceDetails?.firstCharge)}
                    </SumHeading>
                </FlexContainer>
            </SectionWrapper>

            <BookingSection
                title={t('bookingConfirmationSupport', 'Support')}
                description={t(
                    'bookingConfirmationSupportDescription',
                    'Any questions about subscription? We are at your service every day.',
                )}
            >
                <SupportButton onClick={() => openFreshChat()}>
                    {t('bookingConfirmationSupportButton', 'Go to Support')}
                </SupportButton>
            </BookingSection>

            <BookingSection
                show={!!roadsideAssistanceNumber}
                title={t('bookingRoadsideAssistanceTitle', 'Roadside Assistance')}
                description={t(
                    'bookingRoadsideAssistanceDescription',
                    'Car broke down? We are here to help you right now.',
                )}
            >
                <PhoneNumberWrapper>
                    <Phone />
                    <Link href={`tel:${roadsideAssistanceNumber}`}>{roadsideAssistanceNumber}</Link>
                </PhoneNumberWrapper>
            </BookingSection>

            <BookingSection
                show={
                    bookingStatus !== StatusType.CANCELLED &&
                    bookingStatus !== StatusType.COMPLETED &&
                    bookingStatus !== StatusType.ACTIVE
                }
                title={t('bookingConfirmationCancellationHeadline', 'Cancellation policy')}
                description={t(
                    'bookingConfirmationCancellationText',
                    'Changed your mind? You can cancel your subscription no later than x days prior to delivery date free of charge.',
                )}
            >
                <CancelWrapper onClick={() => cancelBooking()}>
                    <FullListText>{t('bookingConfirmationCancellation', 'Cancel booking')}</FullListText>
                </CancelWrapper>
            </BookingSection>

            <SeparatorMargin />

            {modal && (
                <Modal setModal={setModal} wrapperComponent={ModalContainer}>
                    <ModalWrapper ref={node}>
                        <ModalHeader>
                            <Heading>
                                {t(
                                    'bookingCancellationConfirmationTitle',
                                    'Are you sure you want to cancel your booking?',
                                )}
                            </Heading>
                        </ModalHeader>
                        <ModalContent>
                            {bookingCancellationFinishedMessage?.message ? (
                                <>
                                    <div>{bookingCancellationFinishedMessage.message}</div>
                                    <ModalButtons>
                                        {bookingCancellationFinishedMessage?.isError && (
                                            <CancelModalButton onClick={() => closeModal()}>
                                                {t('cancel', 'Cancel')}
                                            </CancelModalButton>
                                        )}
                                    </ModalButtons>
                                </>
                            ) : (
                                <>
                                    <CancellationFeeLabel>
                                        {t('bookingCancellationFee', 'Cancellation fee')}
                                    </CancellationFeeLabel>
                                    <CancellationFeeAmount>
                                        {surchargeAmount} {currency}
                                    </CancellationFeeAmount>
                                    <ModalButtons>
                                        <CancelModalButton onClick={() => closeModal()}>
                                            {t('no', 'No')}
                                        </CancelModalButton>
                                        <ConfirmModalButton
                                            disabled={cancellationProgress}
                                            onClick={() => confirmBookingCancellation()}
                                        >
                                            {t('yes', 'Yes')}
                                        </ConfirmModalButton>
                                    </ModalButtons>
                                </>
                            )}
                        </ModalContent>
                    </ModalWrapper>
                </Modal>
            )}
        </MainLayout>
    )
}
