import styled from 'styled-components'
import MainLayout from '@components/layout/MainLayout'
import { useEffect, useState } from 'react'
import CountrySelect from '@components/global/CountrySelector'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useQuery } from 'react-query'
import { identityService } from '../../../service/identity'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/router'
import { useAuth } from '@contexts/auth'
import { placeholderAvatarImage } from '@util/config'

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

const InputListItem = styled.li`
    display: flex;
    flex-direction: column;
    width: 100%;
`

const CountryInputItem = styled.li`
    display: flex;
    flex-direction: column;
    max-width: 120px;
`
const PhoneInputItem = styled.li`
    display: flex;
    flex-direction: column;
    width: 100%;
    margin-inline-start: 1rem;
`

const InputListWrapper = styled.div`
    display: flex;
    margin-bottom: var(--padding);
    justify-content: space-between;
    align-items: flex-end;
`
const InputLabel = styled.label<{ htmlFor: string }>`
    font-weight: 600;
    font-size: 10px;
    line-height: 14px;
    text-transform: uppercase;
    color: rgba(0, 0, 0, 0.4);
    margin-bottom: 0.5rem;
`

const InputField = styled.input<{ editable?: boolean }>`
    height: 48px;
    background: rgba(0, 0, 0, 0.04);
    border-radius: 4px;
    border: none;
    padding: 0 1rem;
    font-weight: var(--weight-bold);
    font-size: 14px;
    :focus {
        outline: none;
    }
`
const Description = styled.p`
    font-weight: 500;
    font-size: 14px;
    margin: 0;
`
const Container = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 2rem;
    margin-bottom: 2rem;
`

const SaveButton = styled.button`
    background: #ff5a5a;
    border-radius: 100px;
    color: white;
    font-size: var(--size-16);
    font-weight: var(--weight-bold);
    border: none;
    padding: 1rem;
    width: 100%;
    margin-bottom: var(--padding);
`

const CancelButton = styled.p`
    font-weight: var(--weight-bold);
    margin: 0;
    color: #ff5a5a;
`

export async function getServerSideProps({ locale }) {
    return {
        props: {
            ...(await serverSideTranslations(locale, ['common'])),
        },
    }
}
type FormData = {
    firstName: string
    lastName: string
    email: string
    phoneNumber: string
    phonePrefix: any
    marketingNotification: boolean
}

export default function profileedit() {
    const { user } = useAuth()
    const isCareem = user?.careemId ? true : false

    const [marketingMessageAccepted, setMarketingMessageAccepted] = useState(false)

    const { t } = useTranslation()
    const { push, back } = useRouter()

    if (isCareem) {
        push('../../profile')
    }

    const { data, error, isLoading } = useQuery('user', identityService.getMe)
    const {
        register,
        reset,
        setValue,
        handleSubmit,
        getValues,
        formState: { errors },
    } = useForm<FormData>()

    const onSubmit = handleSubmit(async (data) => {
        await identityService.saveUserProfileData(data)
    })

    useEffect(() => {
        if (data?.data) {
            reset({
                firstName: data?.data?.firstName || '',
                lastName: data?.data?.lastName || '',
                email: data?.data?.email || '',
                phoneNumber: data.data.phoneNumber || '',
                phonePrefix: (data.data as any).phoneNumberPrefix || '36',
                marketingNotification: marketingMessageAccepted,
            })
        }
    }, [data])
    const phoneNumberPrefix = register('phonePrefix')

    if (error || isLoading) {
        return null
    }

    const setMarketing = (isAccept: boolean) => {
        setMarketingMessageAccepted(isAccept)
        sendMarketingConsent(isAccept)
    }

    const sendMarketingConsent = async (isAccept) => {
        return await identityService.sendMarketingConsent(isAccept)
    }

    return (
        <MainLayout>
            <form onSubmit={onSubmit}>
                <Wrapper>
                    <Header>
                        <SubHeading>{t('profileMenuProfile', 'Profile')}</SubHeading>
                    </Header>
                </Wrapper>
                <SeparatorBig />
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
                        <FullListText>{data?.data?.email}</FullListText>
                    </FlexColContainer>
                </Wrapper>
                <SeparatorBig />
                <Wrapper>
                    <InputListWrapper>
                        <InputListItem key="firstName">
                            <InputLabel htmlFor="firstName">{t('profileEditFirstName', 'First name')}</InputLabel>
                            <InputField {...register('firstName')} disabled={isCareem} />
                        </InputListItem>
                    </InputListWrapper>
                    <InputListWrapper>
                        <InputListItem key="lastName">
                            <InputLabel htmlFor="lastName">{t('profileEditLastName', 'Last name')}</InputLabel>
                            <InputField {...register('lastName')} editable={true} disabled={isCareem} />
                        </InputListItem>
                    </InputListWrapper>
                    <InputListWrapper>
                        <InputListItem key="email">
                            <InputLabel htmlFor="email">{t('profileEditEmail', 'Email')}</InputLabel>
                            <InputField {...register('email')} disabled={true} />
                        </InputListItem>
                    </InputListWrapper>
                    <InputListWrapper>
                        <CountryInputItem>
                            <InputLabel htmlFor="country">{t('profileEditCountry', 'Country')}</InputLabel>
                            {/* @TODO DO CITYCODE too  */}
                            <CountrySelect
                                disabled={isCareem}
                                inputRef={phoneNumberPrefix}
                                option={({ cca2, flag, name, code }) => (
                                    <option value={code} key={cca2}>
                                        {`${flag}${'\xa0\xa0\xa0'}+ ${code}`}
                                    </option>
                                )}
                            />
                        </CountryInputItem>
                        <PhoneInputItem>
                            <InputLabel htmlFor="phone">{t('profileEditPhoneNumber', 'Phone number')}</InputLabel>
                            <InputField {...register('phoneNumber')} editable={true} disabled={isCareem} />
                        </PhoneInputItem>
                    </InputListWrapper>
                    {!isCareem ? (
                        <FlexColContainer>
                            <SaveButton type="submit">{t('profileEditSaveButton', 'Save changes')}</SaveButton>
                            <CancelButton onClick={() => back()}>{t('profileEditCancel', 'Cancel')}</CancelButton>
                        </FlexColContainer>
                    ) : null}
                </Wrapper>
            </form>
        </MainLayout>
    )
}
