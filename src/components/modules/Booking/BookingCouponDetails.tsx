import { useTranslation } from 'next-i18next'
import { FlexColContainer, FlexContainer, SubHeading, Text, TextGray } from 'src/pages/[city]/cars/[listingsId]/summary'

export const BookingCouponDetails = ({ couponDetails, currency, listingDiscountAmount }) => {
    const { t } = useTranslation()
    return (
        <FlexColContainer>
            <FlexContainer>
                <Text>{t('bookingConfirmationDiscount', 'Discount')}</Text>
                <SubHeading>
                    &ndash; {currency} {listingDiscountAmount}
                </SubHeading>
            </FlexContainer>
            {couponDetails.discountRate && !couponDetails.discountAmount && (
                <TextGray>{couponDetails.discountRate * 100}%</TextGray>
            )}
        </FlexColContainer>
    )
}
