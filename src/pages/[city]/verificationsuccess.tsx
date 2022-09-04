import styled from 'styled-components'
import MainLayout from '@components/layout/MainLayout'
import { Button } from '@components/global/Button'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useRouter } from 'next/router'
import { useSearch } from '@contexts/search'
import { ContentWrapper } from './cars/[listingsId]/summary'
import { BadgeWrapper, BadgeTitle } from './booking/[bookingId]/success'
import { BookedCheckMark } from '@components/global/icons/BookedCheckMark'

const Wrapper = styled.div`
    padding: var(--padding);
`

const Headline = styled.h1`
    font-size: var(--size-24);
    font-weight: var(--weight-extraBold);
    color: black;
    margin: 0 0 1rem 0;
`

const FlexContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`

const Text = styled.p`
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    text-align: center;
    color: rgba(0, 0, 0, 0.8);
`

const IconWrapper = styled.div<{ width?: string; height?: string }>`
    > svg {
        width: ${({ width = 'auto' }) => width};
        height: ${({ height = 'auto' }) => height};
    }
`

export async function getServerSideProps({ locale }) {
    return {
        props: {
            ...(await serverSideTranslations(locale, ['common'])),
        },
    }
}

export default function verificationsuccess() {
    const { t } = useTranslation()
    const { redirectUrl } = useSearch()
    const router = useRouter()
    return (
        <MainLayout>
            <Wrapper>
                <Headline>{t('verificationSuccess.title', 'Verification process')}</Headline>
                <FlexContainer>
                    <ContentWrapper>
                        <BadgeWrapper direction="column">
                            <IconWrapper width="45px" height="45px">
                                <BookedCheckMark />
                            </IconWrapper>
                            <BadgeTitle align="center">
                                {t('verificationConfirmationTitle', 'Congrats, you’re done!')}
                            </BadgeTitle>
                        </BadgeWrapper>
                    </ContentWrapper>
                    <Text>
                        {t(
                            'verificationConfirmationText',
                            'You can change all your documents in your Profile section.',
                        )}
                    </Text>
                </FlexContainer>
            </Wrapper>

            <Button text={t('verificationSuccessButton', 'Done')} onClick={() => router.push(redirectUrl || '/')} />
        </MainLayout>
    )
}
