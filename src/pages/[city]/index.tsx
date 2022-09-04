import { Dots } from '@components/global/Dots'
import { Footer } from '@components/global/Footer'
import MainLayout from '@components/layout/MainLayout'
import { HomepageSwiper } from '@components/modules/SwiperSection/HomepageSwiper'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useEffect } from 'react'
import styled from 'styled-components'
import { DateTimePicker } from '../../components/modules/DatetimeSelector/DateTimeSelectorWrapper'
import { trackEvent } from '../../util/ga'

export async function getServerSideProps({ locale }) {
    return {
        props: {
            ...(await serverSideTranslations(locale, ['common'])),
        },
    }
}

export default function Home() {
    const { t } = useTranslation()
    useEffect(() => {
        trackEvent({
            category: 'HomeDR',
            action: 'Pageload',
            label: 'Home',
        })
    }, [])

    return (
        <MainLayout>
            <Wrapper>
                <Dots />
                <TitleWrapper>
                    <Title
                        dangerouslySetInnerHTML={{
                            __html: t('home.mainTitle', 'Find the best rental deals in <span>Dubai</span>'),
                        }}
                    />
                </TitleWrapper>
                <DateTimePicker />
                {/* <HomepageSwiper /> */}
                <Footer />
            </Wrapper>
        </MainLayout>
    )
}

const TitleWrapper = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
`

const Title = styled.div`
    width: 840px;
    color: white;
    font-weight: 800;
    margin: 0;

    // Mobile view
    padding: 2rem 24px;
    font-size: var(--size-38);
    text-align: left;
    // Desktop
    @media (min-width: 768px) {
        text-align: center;
        padding-top: 5.5rem;
        font-size: var(--size-72);
    }
    span {
        color: black;
    }
    z-index: 10;
`

const Wrapper = styled.div`
    background: linear-gradient(38.76deg, #ff5a5a 45.15%, rgba(255, 169, 120, 0.8) 101.71%), white;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    overflow: hidden;
    z-index: 10;
    height: 100vh;
    @media (min-width: 768px) {
        background-size: 100% 500px;
    }
`
