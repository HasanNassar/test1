import { Pencil } from '@components/global/icons/Pencil'
import { identityService } from '@service/identity'
import { paymentCacheKeys, paymentService } from '@service/payment'
import { useTranslation } from 'next-i18next'
import { FC, useEffect, useRef, useState } from 'react'
import { useQuery } from 'react-query'
import styled from 'styled-components'
import { Cross } from '../../global/icons/Cross'
import { Poi2 } from '../../global/icons/Poi2'
import { Toggle } from '../../Toggle'
import { BillingEditModal } from '../Profile/BillingEditModal'

export const BillingDetailsOverlay: FC<{ isOpen: boolean; closeCb: () => void }> = ({ isOpen, closeCb }) => {
    return isOpen ? <BillingDetails closeCb={closeCb} /> : null
}

const BillingDetails: FC<{ closeCb: () => void }> = ({ closeCb }) => {
    const { t } = useTranslation()
    const clickOutsideRef = useRef(null)

    useEffect(() => {
        document.body.classList.add('overflow-hidden')
        document.documentElement.classList.add('remove-gutter')
        return () => {
            document.body.classList.remove('overflow-hidden')
            document.documentElement.classList.remove('remove-gutter')
        }
    })
    const [billingEditData, setBillingEditData] = useState<any | undefined>(undefined)
    const { data: userData, error: userError, isLoading: userIsLoading } = useQuery('user', identityService.getMe)

    const {
        data: billingData,
        isLoading: isBillingLoading,
        error: billingError,
    } = useQuery(
        paymentCacheKeys.USER_BILLING_ADDRESS,
        () => paymentService.getUserBillingAddress(userData?.data?.userId as string),
        {
            enabled: userData !== undefined,
        },
    )

    return (
        <>
            <T />
            <BillingDetailsWrapper ref={clickOutsideRef}>
                <HeadlineContainer>
                    <Headline>{t('profileIndividualTitle', 'Billing Details')}</Headline>
                    <div onClick={closeCb}>
                        <Cross />
                    </div>
                </HeadlineContainer>
                <Container>
                    <InputListWrapper>
                        {billingError || isBillingLoading || billingData?.data === undefined ? null : (
                            <InputListItem key="0">
                                <InputLabel htmlFor="0">{t('profileIndividualBillingName', 'Billing name')}</InputLabel>
                                <InputField
                                    type="text"
                                    id="0"
                                    name="fname"
                                    value={billingData?.data?.billingName}
                                    editable={false}
                                    onChange={() => null}
                                />
                            </InputListItem>
                        )}
                    </InputListWrapper>
                    <SubHeading>{t('profileIndividualBillingAddressHeadline', 'Billing address')}</SubHeading>
                    <FeatureCardContent>
                        <Poi2 />
                        {billingError || isBillingLoading || billingData?.data === undefined ? null : (
                            <FeatureTextWrapper>
                                <FeatureHeading>{billingData.data.addressLine2}</FeatureHeading>
                                <Text>{billingData.data.addressLine1}</Text>
                            </FeatureTextWrapper>
                        )}

                        <ArrowWrapper onClick={() => setBillingEditData(userData?.data?.userId)}>
                            <Pencil color="#ff5a5a" />
                        </ArrowWrapper>
                    </FeatureCardContent>
                    <SaveButton onClick={closeCb}>{t('profileIndividualBillingButtonSave', 'Save')}</SaveButton>
                </Container>
            </BillingDetailsWrapper>
            {billingEditData && (
                <BillingEditModal billingId={billingEditData} setModal={() => setBillingEditData(undefined)} />
            )}
        </>
    )
}

const ArrowWrapper = styled.div`
    display: flex;
    align-self: center;
`
const Headline = styled.h2`
    font-weight: 800;
    font-size: 24px;
    margin: 0;

    color: #000000;
`
const SaveButton = styled.button<{ isDisabled?: boolean }>`
    background: ${(props) => (props.isDisabled ? '#E5E5E5' : '#ff5a5a')};
    border-radius: 100px;
    color: ${(props) => (props.isDisabled ? 'rgba(0, 0, 0, 0.2)' : 'white')};
    font-size: var(--size-16);
    font-weight: var(--weight-bold);
    border: none;
    padding: 1rem;
    width: 100%;
`

const Text = styled.p`
    font-weight: 600;
    font-size: 12px;
    color: rgba(0, 0, 0, 0.8);
`

const FeatureHeading = styled.h4`
    font-size: var(--size-16);
    font-weight: var(--weight-extraBold);
    color: black;
    line-height: 1.2;
    margin: 0;
`

const FeatureTextWrapper = styled.div`
    padding: 0 var(--padding);
    flex: 1;
`

const FeatureCardContent = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin-bottom: 2rem;
`

const InputLabel = styled.label<{ htmlFor: string }>`
    font-weight: 600;
    font-size: 10px;
    line-height: 14px;
    text-transform: uppercase;
    color: rgba(0, 0, 0, 0.4);
    margin-bottom: 0.5rem;
`

const InputField = styled.input<{ id: string; editable: boolean }>`
    height: 48px;
    background: rgba(0, 0, 0, 0.04);
    border-radius: 4px;
    border: none;
    padding: 0 1rem;
    font-weight: var(--weight-bold);
    font-size: 14px;
    color: ${(props) => (props.editable ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.4)')};
    :focus {
        outline: none;
    }
`

const SubHeading = styled.h4`
    font-weight: 800;
    font-size: 16px;
    color: rgba(0, 0, 0, 1);
`

const ToggleWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    line-height: 0;
`

const Description = styled.p`
    font-size: var(--size-16);
    color: rgba(0, 0, 0, 1);
    margin-bottom: var(--padding);
`

const T = styled.div`
    left: 0px;
    position: fixed;
    width: 100vw;
    height: 100vh;
    display: block;
    opacity: 1;
    z-index: 10;
    background: rgba(0, 0, 0, 0.4);
`

const InputListItem = styled.li`
    display: flex;
    flex-direction: column;
    width: 100%;
`

const InputListWrapper = styled.div`
    display: flex;
    margin-bottom: var(--padding);
`

const BillingDetailsWrapper = styled.div`
    position: fixed;
    width: 100%;
    bottom: 0;
    z-index: 15;

    background: var(--white);
    box-shadow: 0px 2px 20px rgba(0, 0, 0, 0.08);
    border-radius: 16px 16px 0 0;
`

const HeadlineContainer = styled.div`
    display: flex;
    padding: 1.5rem 1.5rem;
    align-items: center;
    justify-content: space-between;
`

const Container = styled.div`
    padding: 0 1.5rem 1.5rem;
`
