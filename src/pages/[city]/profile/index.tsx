import styled from 'styled-components'
import MainLayout from '@components/layout/MainLayout'
import { MiniArrowRight } from '@components/global/icons/MiniArrowRight'
import { Person } from '@components/global/icons/Person'
import { Document } from '@components/global/icons/Document'
import { Billing } from '@components/global/icons/Billing'
import { CreditCard } from '@components/global/icons/CreditCard'
import { Button } from '@components/global/Button'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useQuery } from 'react-query'
import { identityService } from '../../../service/identity'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { trackEvent } from '@util/ga'
import { useAuth } from '@contexts/auth'
import { placeholderAvatarImage } from '@util/config'

const Wrapper = styled.div`
    padding: var(--padding);
`

const FlexContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
`
const FlexColContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`

const Avatar = styled.div`
    width: 112px;
    height: 112px;
`
const ImageContainer = styled.img`
    height: 100%;
    width: 100%;
    object-fit: cover;
    border-radius: 100%;
`
const SeparatorBig = styled.div`
    width: 100%;
    border-bottom: 0.5px solid rgba(0, 0, 0, 0.1);
    margin: 0 0 24px 0;
`
const Headline = styled.h1`
    font-size: var(--size-24);
    font-weight: var(--weight-extraBold);
    color: black;
    margin: 1rem 0 0 0;
`

const FullListText = styled.p`
    font-weight: var(--weight-bold);
    font-size: 14px;
    margin: 0;
    color: #ff5a5a;
`
const DropDownList = styled.div`
    display: flex;
    flex-direction: column;
    padding: 0 var(--padding);
`

const DropDownItemContainer = styled.a`
    padding: 0 0 var(--padding) 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
`

const DropDownMenuText = styled.p<{ isOpen?: boolean }>`
    font-weight: var(--weight-semiBold);
    font-size: var(--size-14);
    margin: 0px;
    color: ${(props) => (props.isOpen ? `var(--primaryColor)` : ``)};
`
const DropdownItem = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
`
const DropDownIconContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.5rem;
    margin-right: 1rem;
`

export async function getServerSideProps({ locale }) {
    return {
        props: {
            ...(await serverSideTranslations(locale, ['common'])),
        },
    }
}

export default function profile() {
    const { user } = useAuth()
    const isCareem = user?.careemId ? true : false

    const { t } = useTranslation()
    const { push } = useRouter()

    const { data, error, isLoading } = useQuery('user', identityService.getMe)

    if (error || isLoading) {
        return null
    }

    return (
        <MainLayout>
            <Wrapper>
                <FlexColContainer>
                    <FlexContainer>
                        <Avatar>
                            <ImageContainer src={`/rental/${placeholderAvatarImage}`} alt="" />
                        </Avatar>
                    </FlexContainer>
                    <Headline>
                        {data?.data?.firstName} {data?.data?.lastName}
                    </Headline>
                    {!isCareem && <FullListText>{data?.data?.email}</FullListText>}
                </FlexColContainer>
            </Wrapper>
            <SeparatorBig />
            <DropDownList>
                {!isCareem && (
                    <DropDownItemContainer
                        data-cy="profile-details-link"
                        onClick={() => {
                            push('./details')
                        }}
                    >
                        <DropdownItem>
                            <DropDownIconContainer>
                                <Person />
                            </DropDownIconContainer>
                            <DropDownMenuText>{t('profileMenuProfile', 'Profile')}</DropDownMenuText>
                        </DropdownItem>
                        <MiniArrowRight />
                    </DropDownItemContainer>
                )}

                <DropDownItemContainer
                    data-cy="profile-documents-link"
                    onClick={() => {
                        push('/dubai/profile/documents')
                    }}
                >
                    <DropdownItem>
                        <DropDownIconContainer>
                            <Document />
                        </DropDownIconContainer>
                        <DropDownMenuText>{t('profileMenuDocuments', 'Documents')}</DropDownMenuText>
                    </DropdownItem>
                    <MiniArrowRight />
                </DropDownItemContainer>

                {!isCareem && (
                    <DropDownItemContainer
                        data-cy="profile-billing-link"
                        onClick={() => {
                            push('./billing')
                        }}
                    >
                        <DropdownItem>
                            <DropDownIconContainer>
                                <Billing />
                            </DropDownIconContainer>
                            <DropDownMenuText>{t('profileMenuBilling', 'Billing')}</DropDownMenuText>
                        </DropdownItem>
                        <MiniArrowRight />
                    </DropDownItemContainer>
                )}

                {!isCareem && (
                    <DropDownItemContainer
                        data-cy="profile-payment-link"
                        onClick={() => {
                            push('./payment')
                        }}
                    >
                        <DropdownItem>
                            <DropDownIconContainer>
                                <CreditCard />
                            </DropDownIconContainer>
                            <DropDownMenuText>{t('profileMenuPayment', 'Payment')}</DropDownMenuText>
                        </DropdownItem>
                        <MiniArrowRight />
                    </DropDownItemContainer>
                )}
            </DropDownList>
            {!isCareem && <Button text={t('profileButtonText', 'Log out')} />}
        </MainLayout>
    )
}
