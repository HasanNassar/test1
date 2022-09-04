import styled from 'styled-components'
import MainLayout from '@components/layout/MainLayout'
import { BookedCheckMark } from '@components/global/icons/BookedCheckMark'
import { SmsBooking } from '@components/global/icons/SmsBooking'
import { DriversLicense } from '@components/global/icons/DriversLicense'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { Button } from '@components/global/Button'
import { useTranslation } from 'next-i18next'
import { useQuery } from 'react-query'
import { identityService } from 'src/service/identity'
import { useEffect, useState } from 'react'
import { paymentService } from 'src/service/payment'
import { InvoiceStatus } from 'src/service/payment.types'
import { useRouterQuery } from '@hooks/useRouterQuery'
import { bookingService } from 'src/service/booking'
import { useRouter } from 'next/router'
import { StatusType, UpdateStatus } from 'src/service/booking.types'
import { ErrorToastMessage } from '@components/modules/Summary/ErrorToastMessage'
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
    background: white;
    padding: 0 var(--padding);
`
export const BadgeWrapper = styled.div<{ direction?: string }>`
    display: flex;
    flex-direction: ${({ direction = 'row' }) => direction};
    align-items: center;
    background: red;
    padding: var(--padding) 1.5rem;
    justify-content: center;
    background: rgba(9, 180, 107, 0.2);
    border-radius: 16px;
    margin: 1rem 0 0 0;
    flex: 1;
`
export const BadgeTitle = styled.h1<{ align?: string }>`
    color: rgba(9, 180, 107, 1);
    font-weight: 800;
    font-size: 24px;
    color: #09b46b;
    margin: 0px 16px;
    text-align: ${({ align = 'left' }) => align};
`

const SeparatorBig = styled.div`
    border: 0.5px solid rgba(0, 0, 0, 0.1);
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
const FeatureText = styled.p`
    font-size: var(--size-14);
    font-weight: var(--weight-regular);
    color: rgba(0, 0, 0, 0.8);
    margin: 0;
    & span {
        color: #ff5a5a;
    }
`

const Separator = styled.div`
    border-bottom: 0.5px solid rgba(0, 0, 0, 0.16);
`

const Padding = styled.div`
    padding-bottom: 80px;
`

export async function getServerSideProps({ locale }) {
    return {
        props: {
            ...(await serverSideTranslations(locale, ['common'])),
        },
    }
}

export default function postbooking() {
    const { t } = useTranslation()
    const [isPolling, setIsPolling] = useState(true)
    const [isSuccess, setIsSuccess] = useState(false)
    //MOCK LOADER
    const [show, setShow] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const query = useRouterQuery()
    const router = useRouter()

    const { data: userData, error: userError, isLoading: userLoading } = useQuery('user', identityService.getMe)

    const customerId = userData?.data?.userId
    const bookingId = query?.bookingId
    const paymentRefId = query?.paymentRefId
    const {
        data: paymentData,
        error: paymentError,
        isLoading: paymentLoading,
    } = useQuery(
        'careemPaymentStatus',
        () => paymentService.getCareemPayment(customerId as string, paymentRefId as string),
        {
            refetchInterval: 2000,
            enabled: !!customerId && !isSuccess,
        },
    )

    useEffect(() => {
        if (paymentData?.data?.invoiceStatus === InvoiceStatus.SUCCEEDED) {
            try {
                //Finalize the booking by calling booking-service:
                const finalizeBooking = async (bookingId) => {
                    const updateStatus: UpdateStatus = { status: StatusType.PENDING_APPROVAL }
                    await bookingService.updateBookingStatus(bookingId, updateStatus)
                }
                finalizeBooking(bookingId)

                const getCustomerBookingById = async (bookingId) => {
                    await bookingService.getCustomerBookingById(bookingId)
                }

                getCustomerBookingById(bookingId)
                setIsSuccess(true)
                setShow(true)
            } catch (e: unknown) {
                logToBackend(
                    `[postbooking/finalizeBooking] error: ${
                        e instanceof Error ? e.message : 'Error during finalize booking'
                    }, bookingId: ${bookingId}`,
                    LogTypes.error,
                )
            }
        }
        if (paymentData?.data?.invoiceStatus === InvoiceStatus.PENDING) {
            // console.log(paymentData?.data)
        }
        if (paymentData?.data?.invoiceStatus === InvoiceStatus.FAILED) {
            // console.log(paymentData?.data.invoiceStatus)
            // console.log('polling stopped: failed')
            setErrorMessage('Something went wrong. Please try again!')

            logToBackend(`[postbooking] error: paymentData: ${JSON.stringify(paymentData?.data)}`, LogTypes.error)
        }
    }, [paymentData?.data])

    return (
        <MainLayout>
            {!show ? (
                errorMessage ? (
                    <ErrorToastMessage text={errorMessage} setIsActive={() => setErrorMessage('')} />
                ) : (
                    <>
                        <div className="loader">{t('loading', 'Loading')}</div>
                    </>
                )
            ) : (
                <>
                    <Wrapper bgColor="var(--light-grey)">
                        {/* <CarSwiper
                            car={carSwiper1}
                            totalPriceShown={false}
                            showPriceDetails={false}
                            badgeShown={false}
                        /> */}
                    </Wrapper>
                    <ContentWrapper>
                        <BadgeWrapper>
                            <BookedCheckMark />
                            <BadgeTitle>{t('bookingConfirmationTitle', 'Your car is booked!')}</BadgeTitle>
                        </BadgeWrapper>
                    </ContentWrapper>
                    <SeparatorBig />
                    <ContentWrapper>
                        <Headline>{t('bookingConfirmationHeadline', 'What happens next?')}</Headline>

                        <FeatureCardWrapper>
                            <FeatureCard>
                                <div>
                                    <SmsBooking />
                                </div>
                                <FeatureTextWrapper>
                                    <FeatureText>
                                        {t(
                                            'bookingConfirmationSms',
                                            'You’ll receive a reminder via SMS before your upcoming rental.',
                                        )}
                                    </FeatureText>
                                </FeatureTextWrapper>
                            </FeatureCard>
                            <Separator />
                            <FeatureCard>
                                <div>
                                    <DriversLicense />
                                </div>
                                <FeatureTextWrapper>
                                    <FeatureText>
                                        {t(
                                            'bookingConfirmationDrivingLicenseIntro',
                                            'Make sure you have your driving licence and ID with you for the handover',
                                        )}
                                        {/* <a
                                            href="https://joinswapp3039.zendesk.com/hc/en-us/sections/360005082258-Handover-Handback-Agreement"
                                            target="_blank"
                                        >
                                            <span>
                                                {t('bookingConfirmationHandoverGuideLinkText', 'Handover Guide')}
                                            </span>
                                        </a> */}
                                    </FeatureText>
                                </FeatureTextWrapper>
                            </FeatureCard>
                        </FeatureCardWrapper>
                        <Button
                            text={t('bookingConfirmationButtonText', 'Check your booking')}
                            onClick={() => window.location.replace(`../`)}
                        />
                        <Padding />
                    </ContentWrapper>
                </>
            )}
        </MainLayout>
    )
}
