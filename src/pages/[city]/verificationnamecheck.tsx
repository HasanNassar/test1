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
    margin: 0 0 1rem 0;
`

const FullListText = styled.p`
    font-weight: 500;
    font-size: 16px;
    margin: 0;
    color: rgba(0, 0, 0, 0.8);
    margin: 0 0 var(--padding) 0;
`

const InputListWrapper = styled.div`
    display: flex;
    margin-bottom: var(--padding);
    justify-content: space-between;
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

const InputListItem = styled.li`
    display: flex;
    flex-direction: column;
    width: 100%;
    position: relative;
`
const IconWrapper = styled.div`
    position: absolute;
    top: 0;
    right: 0;
    margin: 34px 1rem 0 0;
`
export async function getServerSideProps({ locale }) {
    return {
        props: {
            ...(await serverSideTranslations(locale, ['common'])),
        },
    }
}

export default function verificationnamecheck() {
    const [name, setName] = useState('User name')

    const { t } = useTranslation()
    return (
        <MainLayout>
            <Wrapper>
                <Headline>{t('verificationNameCheck.title', 'Is this your full name?')}</Headline>
                <FullListText>{t('verificationNameCheck.text', 'If no, please correct it.')}</FullListText>

                <InputListWrapper>
                    <InputListItem key="billingName">
                        <InputLabel htmlFor="billingName">
                            {t('verificationNameCheckBillingName', 'BILLING NAME')}
                        </InputLabel>
                        <InputField
                            type="text"
                            id="firstName"
                            name="fname"
                            value={name}
                            editable={true}
                            onChange={(event) => setName(event.target.value)}
                        />
                        {name ? (
                            <IconWrapper onClick={() => setName('')}>
                                <Cancel />
                            </IconWrapper>
                        ) : (
                            ''
                        )}
                    </InputListItem>
                </InputListWrapper>
            </Wrapper>

            <Button text={t('verificationNameCheckButtonText', 'Done')} />
        </MainLayout>
    )
}
