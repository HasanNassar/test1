import styled from 'styled-components'
import MainLayout from '@components/layout/MainLayout'
import { MiniArrowLeft } from '@components/global/icons/MiniArrowLeft'
import { Pencil } from '@components/global/icons/Pencil'
import { Person } from '@components/global/icons/Person'
import { Work } from '@components/global/icons/Work'
import { Button } from '@components/global/Button'
import { ThreeDots } from '@components/global/icons/ThreeDots'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { BillingEditModal } from '../../../components/modules/Profile/BillingEditModal'
import { useQuery } from 'react-query'
import { paymentService, paymentCacheKeys } from '../../../service/payment'
import { identityService } from '@service/identity'
import { Plus } from '@components/global/icons/Plus'

const Wrapper = styled.div`
    padding: var(--padding);
`

const Header = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    & > div {
        position: absolute;
        top: 0;
        left: 0;
    }
`
const SubHeading = styled.h4`
    font-weight: bold;
    margin: 0;
    font-size: 16px;
    color: rgba(0, 0, 0, 0.8);
`

const SeparatorBig = styled.div`
    width: 100%;
    border-bottom: 0.5px solid rgba(0, 0, 0, 0.1);
`
const Headline = styled.h1`
    font-size: var(--size-24);
    font-weight: var(--weight-extraBold);
    color: black;
    margin-bottom: 24px;
`

const BillingCardWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background: #ffffff;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.04), 0px 2px 20px rgba(0, 0, 0, 0.08);
    margin-bottom: 2rem;
    border-radius: 16px;
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

const TextWrapper = styled.div`
    display: flex;
    align-items: center;
    margin: 24px 0 0 0;
    & > svg {
        margin-inline-end: 5px;
    }
`

const FullListText = styled.p`
    font-weight: var(--weight-bold);
    font-size: 14px;
    margin: 0;
    color: #ff5a5a;
    margin-inline-end: 10px;
`

export async function getServerSideProps({ locale }) {
    return {
        props: {
            ...(await serverSideTranslations(locale, ['common'])),
        },
    }
}

export default function billingprofile() {
    const { t } = useTranslation()
    const { push } = useRouter()
    const { data: userData, error: userError, isLoading: userIsLoading } = useQuery('user', identityService.getMe)

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

    const [billingEditData, setBillingEditData] = useState<any | undefined>(undefined)

    return (
        <MainLayout>
            <Wrapper>
                <Header>
                    <SubHeading>{t('profileMenuBilling', 'Billing')}</SubHeading>
                </Header>
            </Wrapper>
            <SeparatorBig />
            <Wrapper>
                {billingError || isBillingLoading || billingData?.data === undefined ? (
                    <>
                        <TextWrapper onClick={() => setBillingEditData(userData?.data?.userId)}>
                            <Plus />
                            <FullListText>{t('bookingSummaryAddBillingAddress', 'Add billing address')}</FullListText>
                        </TextWrapper>
                    </>
                ) : (
                    <BillingCardWrapper>
                        <FeatureCard>
                            <FeatureCardContent>
                                <div>
                                    <Person />
                                </div>
                                <FeatureTextWrapper>
                                    <FeatureHeading>{billingData.data.billingName}</FeatureHeading>
                                    <Text>{billingData.data.addressLine1}</Text>
                                    <TextGray>{billingData.data.addressLine2}</TextGray>
                                </FeatureTextWrapper>
                            </FeatureCardContent>
                            <ArrowWrapper onClick={() => setBillingEditData(userData?.data?.userId)}>
                                <Pencil color="#ff5a5a" />
                            </ArrowWrapper>
                        </FeatureCard>
                    </BillingCardWrapper>
                )}
            </Wrapper>
            {billingEditData && (
                <BillingEditModal billingId={billingEditData} setModal={() => setBillingEditData(undefined)} />
            )}
        </MainLayout>
    )
}
