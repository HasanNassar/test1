import { Trans, useTranslation } from 'next-i18next'
import { useState } from 'react'
import { Plus } from '@components/global/icons/Plus'
import { Cancel } from '@components/global/icons/Cancel'

import {
    ContentWrapper,
    FlexContainer,
    Headline,
    FlexColContainer,
    Text,
    SubHeading,
    TextGray,
    TextWrapper,
    FullListText,
} from 'src/pages/[city]/cars/[listingsId]/summary'
import styled from 'styled-components'
import { WarningSign } from '@components/global/icons/WarningSign'
import { BookingCouponDetails } from '../Booking/BookingCouponDetails'
import { formatPrice } from '@util/config'

const DiscountInput = styled.input<{ hasError?: boolean }>`
    height: 48px;
    margin: 0;
    background: rgba(0, 0, 0, 0.04);
    border-radius: 4px;
    border: ${(props) => (props.hasError ? '1px solid var(--primaryColor)' : 'none')};
    padding-left: 16px;
    font-weight: bold;
    font-size: 14px;
    color: ${(props) => (props.hasError ? 'var(--primaryColor)' : 'rgba(0, 0, 0, 0.8)')};
    :focus {
        outline: none;
    }
    ::placeholder {
        color: rgba(0, 0, 0, 0.4);
    }
`

const ApplyButton = styled.button`
    background: #ff5a5a;
    border-radius: 100px;
    color: white;
    font-size: var(--size-16);
    font-weight: var(--weight-bold);
    border: none;
    padding: 12px 37.5px;
    height: 48px;
`

const DiscountWrapper = styled.form`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 24px 0 0 0;
`

const DiscountError = styled.div`
    color: var(--primaryColor);
    font-size: var(--size-12);
    margin-top: 0.5rem;
`

const InputWrapper = styled.div`
    position: relative;
`
const IconWrapper = styled.div`
    position: absolute;
    top: 0;
    right: 0;
    margin: 12px 1rem 0 0;
`
const SumHeading = styled.h1`
    font-weight: 800;
    font-size: 24px;
    text-align: right;
    color: #ff5a5a;
    margin: 0;
`

export const PriceBreakdown: React.FC<{
    pricingDetails?: any
    transmitDiscountCode?: any
    codeIsValid: boolean
    removeCode: any
    insuranceDetails: any
    deliveryDetails: any
    depositAmount: number
}> = ({
    pricingDetails,
    transmitDiscountCode,
    codeIsValid,
    removeCode,
    insuranceDetails,
    deliveryDetails,
    depositAmount,
}) => {
    const {
        extraInsuranceFee = 0,
        totalExtraInsuranceFee = 0,
        includeExtraInsurance = false,
        insurances,
    } = insuranceDetails

    const { deliveryFee = 0, includeDoorToDoorDelivery = true } = deliveryDetails

    const [addDiscount, setAddDiscount] = useState(false)
    const [wasChecked, setWasChecked] = useState(false)
    const [discountCode, setDiscountCode] = useState('')

    const enterDiscountCode = (entry: string) => {
        setDiscountCode(entry)
        setWasChecked(true)
    }

    const openDiscount = async () => {
        setAddDiscount(true)
        transmitDiscountCode('')
    }

    const setDiscount = (e) => {
        e.preventDefault()
        transmitDiscountCode(discountCode)
    }

    const removeDiscount = (e) => {
        e.preventDefault()
        transmitDiscountCode('')
        enterDiscountCode('')
    }

    const removeCodeTrigger = () => {
        removeCode()
        enterDiscountCode('')
    }

    const { t } = useTranslation()

    const { rentalPeriodDays, currency } = pricingDetails
    // Why is this array? could be better destructured???
    const listings = pricingDetails?.listings?.[0]
    let dailyPrice, totalPrice, firstCharge, vatPercentage, couponDetails, discountAmount
    if (listings) {
        dailyPrice = listings.dailyPrice
        totalPrice = listings.totalPrice
        firstCharge = listings.firstCharge
        // vatPercentage??? shouldn't it be Insurance?
        vatPercentage = listings.vatPercentage
        discountAmount = listings.discountAmount
        couponDetails = listings.couponDetails
    }

    return (
        <ContentWrapper>
            <Headline>{t('bookingSummaryPriceHeading', 'Price breakdown')}</Headline>
            <FlexColContainer>
                <FlexContainer>
                    <Text>{t('bookingSummaryRentalPeriod', 'Rental period')}</Text>
                    <SubHeading>
                        {currency} {formatPrice(totalPrice)}
                    </SubHeading>
                </FlexContainer>
                <TextGray>
                    {currency} {formatPrice(dailyPrice)} {t('bookingSummaryDailyPrice', '/ day')}
                </TextGray>
            </FlexColContainer>
            {depositAmount > 0 && (
                <FlexColContainer>
                    <FlexContainer>
                        <Text>{t('depositAmount', 'Deposit amount')}</Text>
                        <SubHeading>
                            {currency} {formatPrice(depositAmount)}
                        </SubHeading>
                    </FlexContainer>
                    <TextGray />
                </FlexColContainer>
            )}
            {insurances !== null && includeExtraInsurance && (
                <FlexColContainer>
                    <FlexContainer>
                        {includeExtraInsurance ? <Text>{insurances[1].type}</Text> : <Text>{insurances[0].type}</Text>}
                        <SubHeading>
                            {currency} {formatPrice(totalExtraInsuranceFee)}
                        </SubHeading>
                    </FlexContainer>
                    <TextGray>
                        {currency} {formatPrice(extraInsuranceFee)} {t('bookingSummaryDailyPrice', '/ day')}
                    </TextGray>
                </FlexColContainer>
            )}
            {includeDoorToDoorDelivery && (
                <FlexColContainer>
                    <FlexContainer>
                        {includeDoorToDoorDelivery && (
                            <Text>{t('bookingSummaryDoorToDoor', 'Door-to-door delivery')}</Text>
                        )}
                        <SubHeading>
                            {currency} {formatPrice(deliveryFee)}
                        </SubHeading>
                    </FlexContainer>
                    <TextGray />
                </FlexColContainer>
            )}
            {couponDetails && couponDetails.valid && (couponDetails.discountRate || couponDetails.discountAmount) && (
                <BookingCouponDetails
                    couponDetails={couponDetails}
                    currency={currency}
                    listingDiscountAmount={discountAmount}
                />
            )}
            {addDiscount ? (
                <>
                    <DiscountWrapper>
                        <InputWrapper>
                            <DiscountInput
                                type="text"
                                placeholder={t('bookingSummaryAddDiscountPlaceholder', 'Discount code')}
                                onChange={(e) => enterDiscountCode(e.target.value)}
                                value={discountCode}
                                hasError={wasChecked && !codeIsValid && !couponDetails.discountRate}
                            />
                            {discountCode ? (
                                <IconWrapper onClick={(e) => removeDiscount(e)}>
                                    {wasChecked && !codeIsValid && !couponDetails.discountRate ? (
                                        <WarningSign />
                                    ) : (
                                        <Cancel />
                                    )}
                                </IconWrapper>
                            ) : (
                                ''
                            )}
                        </InputWrapper>
                        <ApplyButton type="submit" onClick={(e) => setDiscount(e)}>
                            {t('bookingSummaryAddDiscountApplyButton', 'Apply')}
                        </ApplyButton>
                    </DiscountWrapper>
                    {wasChecked && !codeIsValid && (!couponDetails.discountRate || !couponDetails.discountAmount) && (
                        <DiscountError>{t('bookingSummaryError', 'This code is not valid.')}</DiscountError>
                    )}
                </>
            ) : (
                <TextWrapper onClick={() => openDiscount()}>
                    <Plus />
                    <FullListText>{t('bookingSummaryAddDiscount', 'Add discount code')}</FullListText>
                </TextWrapper>
            )}
            <FlexContainer>
                <SubHeading>
                    <Trans i18nKey="bookingSummaryTotalDayNumber">Total for {{ rentalPeriodDays }} days</Trans>
                </SubHeading>
                <SumHeading>
                    {currency} {formatPrice(firstCharge)}
                </SumHeading>
            </FlexContainer>
        </ContentWrapper>
    )
}
