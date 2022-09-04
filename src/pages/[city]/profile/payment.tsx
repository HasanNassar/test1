import { MiniArrowLeft } from '@components/global/icons/MiniArrowLeft'
import MainLayout from '@components/layout/MainLayout'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useRouter } from 'next/router'
import styled from 'styled-components'

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
    return (
        <MainLayout>
            <Wrapper>
                <Header>
                    <SubHeading>{t('profileMenuPayments', 'Payments')}</SubHeading>
                </Header>
            </Wrapper>
            <SeparatorBig />
            <Wrapper />
        </MainLayout>
    )
}
