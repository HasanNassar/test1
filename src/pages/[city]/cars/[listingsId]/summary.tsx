import { CarSwiper } from '@components/global/CarSwiper'
import { Checkbox } from '@components/global/Checkbox'
import MainLayout from '@components/layout/MainLayout'
import { ErrorToastMessage } from '@components/modules/Summary/ErrorToastMessage'

import { BillingEditModal } from '@components/modules/Profile/BillingEditModal'
import { DateTimeSelectorOverlay } from '@components/modules/Search/DateTimeSelectorOverlay'
import { AddressModal } from '@components/modules/Summary/AddressModal'
import { BillingDetailsOverlay } from '@components/modules/Summary/BillingDetailsOverlay'
import { ColorPreferencesOverlay } from '@components/modules/Summary/ColorPreferencesOverlay'
import { PriceBreakdown } from '@components/modules/Summary/PriceBreakdown'
import { useSearch } from '@contexts/search'
import { useRouterQuery } from '@hooks/useRouterQuery'
import { identityService } from '@service/identity'
import { pricingService } from '@service/payment'
import { DailyPriceCalculation, SelectedDate, UserEditBillingAddress } from '@service/payment.types'
import { format } from 'date-fns'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { bookingService } from 'src/service/booking'
import { paymentService } from 'src/service/payment'
import styled from 'styled-components'
import { useAuth } from '@contexts/auth'
import { CreateBookingType } from '@service/booking.types'
import {
    config,
    defaultCityCode,
    doorToDoorDeliveryIsDefault,
    doorToDoorDeliverySelector,
    formatPrice,
} from '@util/config'
import { useConfig } from '@contexts/config'
import { useBusinessDocs } from '@hooks/useBusinessDocs'
import { SimpleModal } from '@components/global/SimpleModal'

import { DoorToDoorDelivery } from '@components/modules/Summary/DoorToDoorDelivery'
import { DeliveryAndReturn } from '@components/modules/Summary/DeliveryAndReturn'
import { Insurance } from '@components/modules/Summary/Insurance'
import { ColorPreference } from '@components/modules/Summary/ColorPreference'
import { logToBackend } from '@service/frontend'
import { LogTypes } from '@util/enums'

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

const ContentWrapper = styled.div`
    position: relative;
    background: white;
    padding: 0 var(--padding);
`

const Headline = styled.h1`
    font-size: var(--size-24);
    font-weight: var(--weight-extraBold);
    color: black;

    margin: var(--padding) 0 var(--padding) 0;
`

const Text = styled.p`
    font-size: var(--size-14);
    font-weight: 500;
    color: #000000;
    margin: 4px 0 0 0;
`
const TextGray = styled.p`
    font-size: var(--size-14);
    font-weight: var(--weight-regular);
    color: rgba(0, 0, 0, 0, 8);
    margin: 4px 0 0 0;
`
const ArrowWrapper = styled.div`
    display: flex;
    align-self: center;
`
const SeparatorBig = styled.div`
    width: 100%;
    border-bottom: 0.5px solid rgba(0, 0, 0, 0.1);
    margin: 32px 0px;
`

const ContinueBookingButton = styled.button`
    background: #ff5a5a;
    border-radius: 100px;
    color: white;
    font-size: var(--size-16);
    font-weight: var(--weight-bold);
    border: none;
    padding: 1rem;
    width: 100%;
`

const ButtonWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--padding);
`
const SelectionCard = styled.div<{ isActive: boolean }>`
    padding: 16px 24px;
    background: #ffffff;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.04), 0px 2px 20px rgba(0, 0, 0, 0.08);
    border-radius: 16px;
    border: ${(props) => (props.isActive ? '1px solid #ff5a5a' : 'none')};
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 22px;
    position: relative;
`

const SelectionHeadLine = styled.div`
    display: flex;
    align-items: center;

    & > h1 {
        font-weight: bold;
        font-size: 16px;
        margin: 0;
        margin-inline-end: 10px;
    }
`
const SelectedPrice = styled.p`
    font-weight: 600;
    font-size: 12px;
    color: #ff5a5a;
    margin: 10px 0 4px 0;
`
const Description = styled.p`
    font-weight: 500;
    text-align: start;
    font-size: 14px;
    margin: 0;
    & > a {
        color: var(--primaryColor);
    }
`

const Recommended = styled.div`
    position: absolute;
    padding: 6px 12px;
    right: 0;
    top: 0;
    background: #cef0e1;
    mix-blend-mode: normal;
    border: 1px solid #09b46b;
    box-sizing: border-box;
    border-radius: 4px;

    font-style: normal;
    font-weight: bold;
    font-size: 12px;
    color: #09b46b;
    margin: -1rem 1rem 0 0;
`

const FullListText = styled.p`
    font-weight: var(--weight-bold);
    font-size: 14px;
    margin: 0;
    color: #ff5a5a;
    margin-inline-end: 10px;
`

const TextWrapper = styled.div`
    display: flex;
    align-items: center;
    margin: 24px 0 0 0;
    & > svg {
        margin-inline-end: 5px;
    }
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

const CheckWrapper = styled.div`
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    margin-bottom: 1rem;
`

const EllipseWrapper = styled.div`
    margin-left: 28px;
`

const GradientTrans = styled.div`
    background: linear-gradient(180deg, var(--light-grey) 20%, rgba(255, 255, 255, 0) 100%);
    width: 100%;
    height: 24px;
`

// export styles
export {
    ArrowWrapper,
    ContentWrapper,
    FlexContainer,
    Headline,
    FlexColContainer,
    Text,
    SubHeading,
    TextGray,
    TextWrapper,
    FullListText,
    SelectionCard,
    SelectionHeadLine,
    SelectedPrice,
    Recommended,
    EllipseWrapper,
    Description,
}

export async function getServerSideProps({ locale }) {
    return {
        props: {
            ...(await serverSideTranslations(locale, ['common'])),
        },
    }
}

export enum Overlay {
    none = 'none',
    colorPreference = 'colorpreference',
    billingDetails = 'billingdetails',
}

export enum AddressModalType {
    delivery = 'delivery',
    return = 'return',
    deliveryRefine = 'deliveryrefine',
    returnRefine = 'returnrefine',
    none = 'none',
}

export default function Summary() {
    const { replace } = useRouter()
    const { user } = useAuth()
    const { citySettings } = useConfig()
    const query = useRouterQuery()
    const businessDocs = useBusinessDocs()
    const isCareem = user?.careemId ? true : false
    const [openModal, setOpenModal] = useState(false)
    const [includeExtraInsurance, setIncludeExtraInsurance] = useState(false)
    const [includeDoorToDoorDelivery, setIncludeDoorToDoorDelivery] = useState(true)
    const [selectedColor, setSelectedColor] = useState<number | null>(null)
    const [marketingMessageAccepted, setMarketingMessageAccepted] = useState(false)
    const [termsAccepted, setTermsMessageAccepted] = useState(false)
    const [billingEditData, setBillingEditData] = useState<any | undefined>(undefined)
    const [addressModal, setAddressModal] = useState<AddressModalType>(AddressModalType.none)
    const [newDailyPrice, setDailyPrice] = useState(0)
    const [newTotalPrice, setTotalPrice] = useState(0)
    const [pricingDetails, setPricingDetails] = useState<any | object>({})
    const [discountCode, setDiscountCode] = useState('')
    const [discountCodeValid, setDiscountCodeValid] = useState(true)
    const [extraInsuranceFee, setExtraInsuranceFee] = useState(null)
    const [deliveryFee, setDeliveryFee] = useState(0)
    const [totalExtraInsuranceFee, setTotalExtraInsuranceFee] = useState(0)
    const [bookingLoader, setBookingLoader] = useState(false)

    const [errorMessage, setErrorMessage] = useState('')

    const { address, fromDate, toDate, toTime, fromTime } = useSearch()

    const { t } = useTranslation()

    const { data, isLoading, isError } = useQuery(['car', query?.listingsId], async () => {
        return await bookingService.getListingById(Number(query?.listingsId))
    })

    const { data: userData, error: userError, isLoading: userIsLoading } = useQuery('user', identityService.getMe)

    const {
        data: pricingData,
        isLoading: isPricingLoading,
        isError: isPricingError,
    } = useQuery(['pricing', query?.listingsId], async () => {
        return await pricingService.getActivePriceCalculation(Number(query?.listingsId))
    })

    /* Billing Data load not needed
    const {
        data: billingData,
        isLoading: isBillingLoading,
        error: billingError,
    } = useQuery(
        paymentCacheKeys.USER_BILLING_ADDRESS,
        () => paymentService.getUserBillingAddress(userData?.data?.userId as string),
        {
            enabled: !!userData,
        },
    )
    */

    const [overlay, setOverlay] = useState<Overlay>(Overlay.none)

    const { setDatepickerOverlay } = useSearch()

    const { push } = useRouter()

    const car = data?.data

    const currency = car?.pricingDetails?.currency || pricingDetails?.currency || 'AED'
    const selfPickUpAddress = car?.location?.addressLine1 || null

    const sendBooking = async () => {
        if (!termsAccepted) {
            setErrorMessage('Booking failed. Please agree to the terms and conditions.')
            return
        }
        if (
            !fromDate ||
            !toDate ||
            !fromTime ||
            !toTime ||
            (includeDoorToDoorDelivery && !address.handoverAddress) ||
            (includeDoorToDoorDelivery && !address.handbackAddress)
        ) {
            setErrorMessage('Please fill all fields.')
            return
        }

        setBookingLoader(true)
        const infoForErrorLog = { postBody: {} }
        try {
            const billingParams = {
                billingName: `${userData?.data?.firstName || ''} ${userData?.data?.lastName || ''}`,
                city: 'Dubai',
                country: 'AE',
            } as UserEditBillingAddress

            await paymentService.putUserBillingAddress(userData?.data?.userId as string, billingParams)

            const bookingParams = {
                listingId: Number(query?.listingsId),
                preferredColorId: selectedColor,
                handoverTime: new Date(
                    fromDate.getFullYear(),
                    fromDate.getMonth(),
                    fromDate.getDate(),
                    fromTime.getHours() - new Date().getTimezoneOffset() / 60,
                    fromTime.getMinutes(),
                    0,
                ),
                handbackTime: new Date(
                    toDate.getFullYear(),
                    toDate.getMonth(),
                    toDate.getDate(),
                    toTime.getHours() - new Date().getTimezoneOffset() / 60,
                    toTime.getMinutes(),
                    0,
                ),
                handoverAddress: address?.handoverAddress || null,
                handbackAddress: address?.handbackAddress || null,
                includeExtraInsurance: includeExtraInsurance,
                includeDelivery: includeDoorToDoorDelivery,
                couponCode: discountCode,
                marketingMessagesAccepted: marketingMessageAccepted,
            } as CreateBookingType

            infoForErrorLog.postBody = bookingParams

            const res = await bookingService.createBooking(bookingParams)
            // Trigger careem payment modal
            const paymentRefId = res.data?.paymentRefId
            const amount = newTotalPrice
            const currency = car?.pricingDetails?.currency || pricingDetails?.currency
            const bookingId = res.data?.bookingId

            // Careem payment link setup
            const callbackUrl = `${window.location.origin}/rental/en-DXB/dubai/booking/${bookingId}/success/?paymentRefId=${paymentRefId}`
            const deeplink = `${config.CAREEM_PAY_APP_URI}?invoiceId=${paymentRefId}&amount=${amount}&currency=${currency}&callbackUrl=${callbackUrl}`

            setBookingLoader(false)
            replace(config.BYPASS_CAREEM_PAY === true ? callbackUrl : deeplink)
        } catch (e: unknown | any) {
            setBookingLoader(false)
            setErrorMessage(t('bookingProcessError', 'Something went wrong during booking process. Please try again!'))

            logToBackend(
                `[CreateBooking] ${
                    e instanceof Error ? `Error object message: ${e.message}` : 'Error during create booking'
                },Server error message: ${e.response?.data?.message || ''}, POST body: ${JSON.stringify(
                    infoForErrorLog.postBody,
                )}, UserID: ${userData?.data?.userId}`,
                LogTypes.error,
            )
        }
    }

    const { depositAmount = 0 } = pricingData?.data || 0

    const delivery = {
        date: fromDate ? format(fromDate, 'EEE, MMM d') : '',
        time: fromTime ? format(fromTime, 'HH:mm') : '',
    }

    const returnInfo = {
        date: toDate ? format(toDate, 'EEE, MMM d') : '',
        time: toTime ? format(toTime, 'HH:mm') : '',
    }

    const insurances =
        extraInsuranceFee !== null
            ? [
                  {
                      type: t('bookingSummaryInsuranceComprehensive', 'Comprehensive'),
                      price: `Included, ${currency} 0`,
                      info: 'If an accident is caused by your mistake, you are liable up to the amount of the excess.',
                      recommended: false,
                  },
                  {
                      type: t('bookingSummaryInsuranceType', 'Full insurance'),
                      price: `${currency} ${extraInsuranceFee} / day`,
                      info: 'You won’t have to pay any excess if you damage the car, as long as you have a valid police report. Under the age of 25 Excess may apply.',
                      recommended: true,
                  },
              ]
            : null

    const deliveries = [
        {
            type: t('bookingSummaryDeliverySelfPickUp', 'Self-pickup'),
            price: `Included, ${currency} 0`,
            info: ' ',
            recommended: false,
        },
        {
            type: t('bookingSummaryDeliveryDoorToDoor', 'Door-to-door'),
            price: `${currency} ${deliveryFee}`,
            info: ' ',
            recommended: true,
        },
    ]

    const handleLocationChange = () => {
        push('/dubai/address/selectdeliveryaddress')
    }

    const colors = data?.data?.colors

    useEffect(() => {
        if (selfPickUpAddress && doorToDoorDeliverySelector && !doorToDoorDeliveryIsDefault)
            setIncludeDoorToDoorDelivery(false)
    }, [selfPickUpAddress])

    if (!car || !colors) {
        return null
    }

    const sortedCars = [...car.photos].sort((a, b) => a.position - b.position)

    const carSwiper1 = {
        make: car?.make,
        model: car?.model,
        dailyPrice: newDailyPrice,
        totalPrice: newTotalPrice,
        currency: currency,
        picture: sortedCars,
    }

    const setMarketing = (isAccept: boolean) => {
        setMarketingMessageAccepted(isAccept)
        sendMarketingConsent(isAccept)
    }

    const sendMarketingConsent = async (isAccept) => {
        return await identityService.sendMarketingConsent(isAccept)
    }

    const getSelectedDate = async (timeRange: SelectedDate, code?: string, props?: any) => {
        const { from, to } = timeRange
        const listingId = query?.listingsId || 0

        const postData: DailyPriceCalculation = {
            externalListingIds: [+listingId],
            cityCode: citySettings?.cityCode || defaultCityCode,
            handoverTime: from,
            handbackTime: to,
            couponCode: code || discountCode,
            includeDelivery: doorToDoorDeliveryIsDefault
                ? includeDoorToDoorDelivery
                : !(selfPickUpAddress && doorToDoorDeliverySelector),
            ...props,
        }

        const newPrice = await pricingService.postPriceCalculation(postData)

        const newDailyPrice = newPrice?.data?.listings[0]?.dailyPrice
        const newTotalPrice = newPrice?.data?.listings[0]?.firstCharge
        const newExtraInsuranceFee = newPrice?.data?.listings[0]?.extraInsuranceFee
        const newDeliveryFee = newPrice?.data?.listings[0]?.deliveryFee
        const newTotalExtraInsuranceFee = newPrice?.data?.listings[0]?.totalExtraInsuranceFee
        setExtraInsuranceFee(newExtraInsuranceFee)
        setDeliveryFee(newDeliveryFee)
        setTotalExtraInsuranceFee(newTotalExtraInsuranceFee)
        setDailyPrice(newDailyPrice)
        setTotalPrice(newTotalPrice)
        setPricingDetails({
            cityCode: newPrice.data.cityCode,
            currency: newPrice.data.currency,
            handoverTime: newPrice.data.handoverTime,
            handbackTime: newPrice.data.handbackTime,
            rentalPeriodDays: newPrice.data.rentalPeriodDays,
            includeDelivery: newPrice.data.includeDelivery,
            listings: newPrice.data.listings || [
                {
                    dailyPrice: 0,
                    totalPrice: 0,
                    firstCharge: 0,
                    vatPercentage: 0,
                    discountAmount: 0,
                    couponDetails: '',
                },
            ],
        })
        if (code === '' || code === ' ') {
            setDiscountCodeValid(true)
            setDiscountCode('')
        } else {
            setDiscountCodeValid(newPrice.data.listings[0].couponDetails.valid)
        }
    }

    const toggleFullInsurance = (select: boolean) => {
        setIncludeExtraInsurance(select)
        const { handoverTime, handbackTime } = pricingDetails
        const getTime = { from: handoverTime, to: handbackTime }
        getSelectedDate(getTime, discountCode, {
            includeExtraInsurance: select,
            includeDelivery: includeDoorToDoorDelivery,
        })
    }

    const toggleDelivery = (select: boolean) => {
        setIncludeDoorToDoorDelivery(select)
        const { handoverTime, handbackTime } = pricingDetails
        const getTime = { from: handoverTime, to: handbackTime }
        getSelectedDate(getTime, discountCode, { includeExtraInsurance, includeDelivery: select })
    }

    const refreshSummary = (code?: string) => {
        const { handoverTime, handbackTime } = pricingDetails
        const getTime = { from: handoverTime, to: handbackTime }

        if (code) setDiscountCode(code)

        getSelectedDate(getTime, code, {
            includeDelivery: includeDoorToDoorDelivery,
            includeExtraInsurance,
        })
    }

    return (
        <MainLayout>
            {billingEditData && (
                <BillingEditModal billingId={billingEditData} setModal={() => setBillingEditData(undefined)} />
            )}
            {addressModal && <AddressModal setModal={setAddressModal} modalType={addressModal} />}
            <DateTimeSelectorOverlay selectedDate={getSelectedDate} />
            <BillingDetailsOverlay
                closeCb={() => setOverlay(Overlay.none)}
                isOpen={overlay === Overlay.billingDetails}
            />
            <ColorPreferencesOverlay
                selectedColor={selectedColor}
                setSelectedColor={setSelectedColor}
                colors={colors}
                closeCb={() => setOverlay(Overlay.none)}
                isOpen={overlay === Overlay.colorPreference}
            />
            <Wrapper bgColor="var(--light-grey)">
                <CarSwiper car={carSwiper1} totalPriceShown={true} showPriceDetails={false} badgeShown={false} />
            </Wrapper>
            <GradientTrans />
            {doorToDoorDeliverySelector && selfPickUpAddress && (
                <DoorToDoorDelivery
                    includeDoorToDoorDelivery={includeDoorToDoorDelivery}
                    deliveries={deliveries}
                    selfPickUpAddress={selfPickUpAddress}
                    toggleDelivery={toggleDelivery}
                />
            )}
            <DeliveryAndReturn
                includeDoorToDoorDelivery={includeDoorToDoorDelivery}
                delivery={delivery}
                fromTime={fromTime}
                toTime={toTime}
                address={address}
                selfPickUpAddress={selfPickUpAddress}
                returnInfo={returnInfo}
                setDatepickerOverlay={setDatepickerOverlay}
                setAddressModal={setAddressModal}
            />
            {insurances && (
                <>
                    <SeparatorBig />
                    <Insurance
                        includeExtraInsurance={includeExtraInsurance}
                        toggleFullInsurance={toggleFullInsurance}
                        insurances={insurances}
                    />
                </>
            )}
            <SeparatorBig />
            <ColorPreference selectedColor={selectedColor} colors={colors} setOverlay={setOverlay} />
            <SeparatorBig />
            <PriceBreakdown
                pricingDetails={pricingDetails}
                depositAmount={depositAmount}
                transmitDiscountCode={(code) => refreshSummary(code)}
                insuranceDetails={{ insurances, includeExtraInsurance, extraInsuranceFee, totalExtraInsuranceFee }}
                deliveryDetails={{ deliveryFee, includeDoorToDoorDelivery }}
                codeIsValid={discountCodeValid}
                removeCode={() => refreshSummary(' ')}
            />

            <SeparatorBig />
            {errorMessage ? (
                <ErrorToastMessage text={errorMessage} setIsActive={() => setErrorMessage('')} isInline={true} />
            ) : null}
            <ContentWrapper>
                <CheckWrapper>
                    <Description>
                        {t('bookingSummaryAgreeTerms', 'I agree to the')}{' '}
                        <a
                            href="#"
                            onClick={(e) => {
                                e.preventDefault()
                                setOpenModal(true)
                            }}
                            style={{ textDecoration: 'none' }}
                        >
                            <span>{t('bookingSummaryTermsAndContidions', 'terms and conditions')}</span>
                        </a>
                    </Description>
                    <Checkbox
                        onChange={() => {
                            setTermsMessageAccepted(!termsAccepted)
                        }}
                    >
                        {}
                    </Checkbox>
                </CheckWrapper>
            </ContentWrapper>
            <ButtonWrapper>
                <ContinueBookingButton disabled={bookingLoader} onClick={() => sendBooking()}>
                    {t('bookingSummaryContinueButton', 'Book car')} ({pricingDetails?.currency}{' '}
                    {formatPrice(newTotalPrice)})
                </ContinueBookingButton>
            </ButtonWrapper>

            {openModal && <SimpleModal setModal={setOpenModal} content={businessDocs.termsAndCondition} />}
        </MainLayout>
    )
}
