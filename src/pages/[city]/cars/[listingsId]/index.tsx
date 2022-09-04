import styled from 'styled-components'
import MainLayout from '@components/layout/MainLayout'
import { CarSwiper } from '@components/global/CarSwiper'
import { TimePicker } from '@components/global/TimePicker'
import { CarWithStar } from '@components/global/icons/CarwithStar'
import { PoiRed } from '@components/global/icons/PoiRed'
import { Shield } from '@components/global/icons/Shield'
import { Insurance } from '@components/global/icons/Insurance'
import { Distance } from '@components/global/icons/Distance'
import { CustomerService } from '@components/global/icons/CustomerService'
import { FeatureBadge } from '@components/global/FeatureBadge'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { Button } from '@components/global/Button'
import { useTranslation } from 'next-i18next'
import { bookingService } from 'src/service/booking'
import { useQuery } from 'react-query'
import { useRouterQuery } from '@hooks/useRouterQuery'
import { useRouter } from 'next/router'
import { DateTimeSelectorOverlay } from '../../../../components/modules/Search/DateTimeSelectorOverlay'
import { debounce } from 'lodash'
import { useEffect, useState } from 'react'
import { trackEvent } from '@util/ga'
import { DailyPriceCalculation, SelectedDate } from '@service/payment.types'
import { pricingService } from '@service/payment'
import { identityService } from '@service/identity'
import { useSearch } from '@contexts/search'
import { Side, UploadedDocument } from '@components/modules/Verification/VerificationUtils'
import { defaultCityCode } from '@util/config'
import { useConfig } from '@contexts/config'

const Wrapper = styled.div<{ bgColor?: string; scrolled?: boolean }>`
    background: ${(props) => props.bgColor};
    background-size: 100% 100%;
    position: relative;
    overflow: hidden;
    padding: ${(props) => (props.scrolled ? 'var(--padding)' : '96px var(--padding)')};
    padding-bottom: 0;

    @media (min-width: 768px) {
        background-size: 100% 500px;
    }
`

const FeaturesWrapper = styled.div`
    background: var(--light-grey);
    padding: var(--padding);
    padding-bottom: 100px;
`
const Headline = styled.h2`
    font-size: var(--size-24);
    font-weight: var(--weight-extraBold);
    color: black;
    margin: 0;
    margin-bottom: var(--padding);
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
    flex: 1;
`
const FeatureHeading = styled.h4`
    font-size: var(--size-16);
    font-weight: var(--weight-extraBold);
    color: black;
    margin: 0;
`

const FeatureText = styled.p`
    font-size: var(--size-14);
    font-weight: var(--weight-regular);
    color: rgba(0, 0, 0, 0.8);
    margin: 4px 0 0 0;
`
const IconWrapper = styled.div`
    display: flex;
    align-self: center;
`

const ArrowWrapper = styled.div`
    display: flex;
    align-self: center;
`
const Separator = styled.div`
    width: 100%;
    border-bottom: 0.5px solid rgba(0, 0, 0, 0.16);
`

const SeparatorShort = styled.div`
    width: 100%;
    border-bottom: 0.5px solid rgba(0, 0, 0, 0.16);
`

const FeatureBadgeWrapper = styled.div`
    display: flex;
    background: var(--light-grey);
    padding: var(--padding);
    overflow-x: scroll;
    column-gap: 8px;
    &::-webkit-scrollbar {
        display: none;
    }
`

export async function getServerSideProps({ locale, query }) {
    const { listingsId } = query
    const { data: listing } = await bookingService.getListingById(listingsId)
    return {
        props: { listing, ...(await serverSideTranslations(locale, ['common'])) },
    }
}

export default function Cardetails({ listing }) {
    const { citySettings } = useConfig()
    const { t } = useTranslation()
    const query = useRouterQuery()
    const { setRedirectUrl } = useSearch()

    const [isScrolled, setScrolled] = useState(false)

    const checkScroll = () => {
        if (window.scrollY === 0) {
            setScrolled(false)
        } else {
            setScrolled(true)
        }
    }
    const debouncedCheckScroll = debounce(checkScroll, 10)

    useEffect(() => {
        window.addEventListener('scroll', debouncedCheckScroll)
        return () => {
            window.removeEventListener('scroll', debouncedCheckScroll)
        }
    }, [debouncedCheckScroll])

    const [pricingDetails, setPricingDetails] = useState<any>(null)
    const [newDailyPrice, setDailyPrice] = useState<any>(null)
    const [isUserVerified, setIsUserVerified] = useState(false)

    const {
        data: userData,
        error,
        isLoading: userLoading,
    } = useQuery('verificationStatus', identityService.getVerificationStatus)
    const documentsArray = userData?.data?.uploadedDocuments
    const findingDocs = (arr, docType, docSide) => {
        return arr.find(({ status, type, side }) => {
            return status !== 'DECLINED' && type === docType && side === docSide
        })
    }

    useEffect(() => {
        if (documentsArray) {
            //Identity
            const identityFront = findingDocs(documentsArray, UploadedDocument.id, Side.front)
            const identityBack = findingDocs(documentsArray, UploadedDocument.id, Side.back)
            //Drivers License
            const driversLicenseFront = findingDocs(documentsArray, UploadedDocument.driversLicense, Side.front)
            const driversLicenseBack = findingDocs(documentsArray, UploadedDocument.driversLicense, Side.back)
            const internationalDriversLicenseBack = findingDocs(
                documentsArray,
                UploadedDocument.internationalDriversLicense,
                Side.back,
            )
            const internationalDriversLicenseFront = findingDocs(
                documentsArray,
                UploadedDocument.internationalDriversLicense,
                Side.front,
            )
            //Passport
            const passportFront = findingDocs(documentsArray, UploadedDocument.passport, Side.front)
            //Visa
            const visaFront = findingDocs(documentsArray, UploadedDocument.visa, Side.front)

            if (
                identityFront &&
                identityBack &&
                ((driversLicenseFront && driversLicenseBack) ||
                    (internationalDriversLicenseBack && internationalDriversLicenseFront)) &&
                passportFront &&
                visaFront
            ) {
                setIsUserVerified(true)
            } else {
                setIsUserVerified(false)
            }
        }
    }, [documentsArray, isUserVerified])

    useEffect(() => {
        trackEvent({
            action: 'Pageload',
            category: 'Car-detailsDR',
            label: 'Car-details',
        })
        setDailyPrice(car?.pricingDetails || null)
    }, [])

    const { data, isLoading, isError } = useQuery(
        ['car', listing.id],
        async () => {
            return await bookingService.getListingById(Number(query?.listingsId))
        },
        { initialData: listing.data },
    )
    const router = useRouter()

    const car = data?.data
    const currency = car?.pricingDetails?.currency || pricingDetails?.currency

    if (!car) {
        return null
    }

    const sortedCars = [...car.photos].sort((a, b) => a.position - b.position)

    const carSwiper1 = {
        make: car?.make,
        model: car?.model,
        dailyPrice: newDailyPrice?.dailyPrice,
        totalPrice: newDailyPrice?.totalPriceAfterDiscount,
        currency,
        picture: sortedCars,
    }

    const badges: string | number[] = [
        car.gearboxType,
        car.seats,
        car.carType,
        { value: car.engineSize },
        ...car.carFeatures,
    ]

    const getSelectedDate = async (timeRange: SelectedDate) => {
        const { from, to } = timeRange

        const postData: DailyPriceCalculation = {
            externalListingIds: [+listing.id],
            cityCode: citySettings?.cityCode || defaultCityCode,
            handoverTime: from,
            handbackTime: to,
        }
        const newPrice = await pricingService.postPriceCalculation(postData)

        setPricingDetails(newPrice?.data)
        // why Array, how to choose which listing?
        const newDailyPrice = newPrice?.data?.listings[0]
        setDailyPrice(newDailyPrice)
    }

    return (
        <MainLayout>
            <DateTimeSelectorOverlay selectedDate={getSelectedDate} />
            <>
                <TimePicker isScrolled={isScrolled} />
                <Wrapper bgColor="var(--light-grey)" scrolled={isScrolled}>
                    <CarSwiper car={carSwiper1} totalPriceShown={false} showPriceDetails={true} badgeShown={false} />
                </Wrapper>
                <FeatureBadgeWrapper>
                    {badges.map((badge, i) => (
                        <FeatureBadge badge={badge} key={i} />
                    ))}
                </FeatureBadgeWrapper>
                <FeaturesWrapper>
                    <Headline>{t('carDetailsHeader', "What's included")}</Headline>
                    <FeatureCardWrapper>
                        <FeatureCard>
                            <div>
                                <CarWithStar />
                            </div>
                            <FeatureTextWrapper>
                                <FeatureHeading>
                                    {t('carDetailsFeatureModel', 'Get the exact car model you selected')}
                                </FeatureHeading>
                                <FeatureText>
                                    {t(
                                        'carDetailsFeatureModelText',
                                        `Forget ‘similar cars’! We even try to match your color preference!`,
                                    )}
                                </FeatureText>
                            </FeatureTextWrapper>
                        </FeatureCard>
                        <Separator />
                        <FeatureCard>
                            <div>
                                <PoiRed />
                            </div>
                            <FeatureTextWrapper>
                                <FeatureHeading>
                                    {t('carDetailsFeatureDoorToDoor', 'Door-to-door delivery')}
                                </FeatureHeading>
                                <FeatureText>
                                    {t(
                                        'carDetailsFeatureDoorToDoorText',
                                        'An easy and convenient way of getting your car for {{ deliveryFee }} {{ currency }}.',
                                        {
                                            deliveryFee: citySettings?.deliveryFee || 0,
                                            currency: citySettings?.currency || 'AED',
                                        },
                                    )}
                                </FeatureText>
                            </FeatureTextWrapper>
                        </FeatureCard>
                        <Separator />
                        <FeatureCard>
                            <div>
                                <Shield />
                            </div>
                            <FeatureTextWrapper>
                                <FeatureHeading>
                                    {t('carDetailsFeatureCancellation', 'Free cancellation')}
                                </FeatureHeading>
                                <FeatureText>
                                    {t(
                                        'carDetailsFeatureCancellationText',
                                        'Lock in this price today, cancel free of charge up to 24 hours before trip start.',
                                    )}
                                </FeatureText>
                            </FeatureTextWrapper>
                        </FeatureCard>
                    </FeatureCardWrapper>
                    <FeatureCard>
                        <IconWrapper>
                            <Insurance />
                        </IconWrapper>
                        <FeatureTextWrapper>
                            <FeatureHeading>{t('carDetailsFeatureInsurance', 'Insurance included')}</FeatureHeading>
                            <FeatureText>
                                {t('carDetailsFeatureInsuranceText', 'We keep you and your car safe')}
                            </FeatureText>
                        </FeatureTextWrapper>
                    </FeatureCard>
                    <SeparatorShort />

                    <FeatureCard>
                        <IconWrapper>
                            <Distance />
                        </IconWrapper>
                        <FeatureTextWrapper>
                            {newDailyPrice?.surchargeExtraKmsPerUnit > 0 ? (
                                <>
                                    <FeatureHeading>
                                        {t('carDetailsFeatureDistance', '{{ kmIncluded }} km distance included', {
                                            kmIncluded: newDailyPrice?.allowedKmsPerDay || 0,
                                        })}
                                    </FeatureHeading>
                                    <FeatureText>
                                        {t(
                                            'carDetailsFeatureDistanceText',
                                            '{{ currency }} {{ kmCharge }} charge for each additional kilometer',
                                            {
                                                currency,
                                                kmCharge: newDailyPrice?.surchargeExtraKmsPerUnit || 0,
                                            },
                                        )}
                                    </FeatureText>
                                </>
                            ) : (
                                <>
                                    <FeatureHeading>
                                        {t('carDetailsFeatureUnlimitedDistance', 'Unlimited km included')}
                                    </FeatureHeading>
                                    <FeatureText>
                                        {t(
                                            'carDetailsFeatureUnlimitedDistanceText',
                                            "Don't worry for extra km charges",
                                        )}
                                    </FeatureText>
                                </>
                            )}
                        </FeatureTextWrapper>
                    </FeatureCard>
                    <SeparatorShort />

                    <FeatureCard>
                        <IconWrapper>
                            <CustomerService />
                        </IconWrapper>

                        <FeatureTextWrapper>
                            <FeatureHeading>{t('carDetailsFeatureAssistance', 'Roadside assistance')}</FeatureHeading>
                            <FeatureText>{t('carDetailsFeatureAssistanceText', '24/7 availability')}</FeatureText>
                        </FeatureTextWrapper>
                    </FeatureCard>
                    <SeparatorShort />
                    <FeatureCard>
                        <IconWrapper>
                            <CustomerService />
                        </IconWrapper>
                        <FeatureTextWrapper>
                            <FeatureHeading>
                                {t('carDetailsFeatureCustomerService', 'SWAPP cumoster service')}
                            </FeatureHeading>
                            <FeatureText>
                                {t('carDetailsFeatureCustomerServiceText', 'On working days, from 9 to 9')}
                            </FeatureText>
                        </FeatureTextWrapper>
                    </FeatureCard>
                    <Button
                        buttonType="button"
                        onClick={() => {
                            trackEvent({
                                action: 'Countinue-to-booking',
                                category: 'Car-detailsDR',
                            })
                            if (isUserVerified) {
                                return router.push(`${router.asPath}summary`)
                            }
                            setRedirectUrl(`${router.asPath}summary`)
                            return router.push(`/dubai/verification`)
                        }}
                        text={
                            isUserVerified
                                ? t('carDetailsContinueButton', 'Continue to booking')
                                : t('carDetailsContinueVerificationButton', 'Continue to verification')
                        }
                    />
                </FeaturesWrapper>
            </>
        </MainLayout>
    )
}
