import styled from 'styled-components'
import MainLayout from '@components/layout/MainLayout'
import { Button } from '@components/global/Button'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useState } from 'react'
import { Cancel } from '@components/global/icons/Cancel'

const Wrapper = styled.div`
    padding: var(--padding);
`

const Headline = styled.h1`
    font-size: var(--size-24);
    font-weight: var(--weight-extraBold);
    color: black;
    margin: 0 0 1.5rem 0;
`

const InputListWrapper = styled.div`
    display: flex;
    flex-direction: column;
    margin-bottom: var(--padding);
`

const InputLabel = styled.label<{ htmlFor: string }>`
    font-weight: bold;
    font-size: 16px;
    color: rgba(0, 0, 0, 0.8);
    margin: 0 1rem;
`

const Separator = styled.div`
    border-bottom: 0.5px solid rgba(0, 0, 0, 0.1);
    margin: 1.5rem -1.5rem;
`

export async function getServerSideProps({ locale }) {
    return {
        props: {
            ...(await serverSideTranslations(locale, ['common'])),
        },
    }
}

export default function verificationlicensenumber() {
    const [name, setName] = useState('User name')

    const { t } = useTranslation()
    return (
        <MainLayout>
            <Wrapper>
                <Headline>{t('verificationLicenceNumber.title', "Do you have a UAE drivers's license?")}</Headline>
                <InputListWrapper>
                    <div>
                        <input type="radio" id="yes" name="license" value="HTML" />
                        <InputLabel htmlFor="yes">{t('yes', 'Yes')}</InputLabel>
                    </div>
                    <Separator />
                    <div>
                        <input type="radio" id="no" name="license" value="CSS" />
                        <InputLabel htmlFor="no">{t('no', 'No')}</InputLabel>
                    </div>
                </InputListWrapper>
            </Wrapper>

            <Button text={t('verificationLicenseNumber', 'Next')} />
        </MainLayout>
    )
}
