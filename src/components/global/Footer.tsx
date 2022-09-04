import { trackEvent } from '@util/ga'
import { useTranslation } from 'next-i18next'
import Link from 'next/link'
import { useState } from 'react'
import { useQuery } from 'react-query'
import { identityService } from 'src/service/identity'
import styled from 'styled-components'
import { useMediaQuery } from '../../hooks/mediaQuery'
import { device } from '../../util/responsive'
import { ArrowDown } from './icons/ArrowDown'
import { Poi } from './icons/Poi'
import { Telephone } from './icons/Telephone'
import LangSwitcher from './LangSwitcher'
import { useBusinessDocs } from '@hooks/useBusinessDocs'
import { SimpleModal } from './SimpleModal'

const StyledFooter = styled.footer`
    width: 100%;
    background: var(--white);
    @media (min-width: 1240px) {
        margin-bottom: 40px;
    }
`

const MobileView = styled.div`
    padding: var(--padding);
    @media (min-width: 1240px) {
        display: none;
    }
`

const DesktopView = styled.div`
    display: none;

    @media (min-width: 1240px) {
        display: flex;
        flex-direction: column;
        margin: 0 100px;
    }
`

const Details = styled.div`
    width: 100%;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    padding-bottom: 2px;
    font-size: var(--size-14);
    font-weight: var(--weight-semibold);
`

const Summary = styled.div`
    display: flex;
    justify-content: space-between;
    cursor: pointer;
    padding-bottom: 4px;
    & > span {
        font-weight: var(--weight-bold);
        font-size: var(--size-14);
    }
`

const LinkList = styled.div`
    display: flex;
    flex-flow: column nowrap;
    align-items: flex-start;
    justify-content: flex-start;
    gap: 0px;
    span {
        font-weight: var(--weight-bold);
        font-size: var(--size-14);
    }
    a {
        padding-bottom: 8px;
    }
`

const StyledLink = styled.span`
    :hover {
        color: var(--primaryColor);
        cursor: pointer;
    }
`

const SocialIcons = styled.div`
    display: flex;
    margin-top: 25px;
    @media (min-width: 1240px) {
        margin-top: 0px;
    }
    * {
        margin: 0px 28px 0px 0px;
        cursor: pointer;
    }

    justify-content: center;
`

const ContactDetails = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    & > span {
        margin: 0px 10px;
    }
    & > p {
        font-size: var(--size-14);
    }
`

const PhoneDetails = styled.div`
    & > svg {
        margin: 0px 10px 0px 0px;
    }
    & > p {
        font-weight: bold;
        font-size: var(--size-14);
    }
    color: var(--primaryColor);
    display: flex;
    justify-content: center;
    align-items: center;
`
const ContactWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    & > p {
        margin-top: 5px;
        font-size: var(--size-12);
        font-weight: var(--weight-semiBold);
    }
`

//Desktop view
const LinkWrapper = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    font-size: var(--size-14);
    font-weight: var(--weight-bold);
    align-items: center;
`
export const IconAndLink = styled.div`
    display: flex;
    align-items: center;
    cursor: pointer;
    & > p {
        margin-inline-start: 10px;
    }
`

const DesktopContactWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    & > p {
        font-size: var(--size-12);
        font-weight: var(--weight-semiBold);
    }
`

const Separator = styled.div`
    border-style: solid;
    border-bottom: 1px;
    border-width: 0.01em;
    color: rgba(0, 0, 0, 0.1);
    margin: 12px 0px;
`

export const DropDownMenu = styled.div`
    margin-top: 3rem;
    background-color: white;
    top: 0;
    border-radius: var(--borderRadius);
    position: absolute;
    padding: 16px;
    box-shadow: var(--boxShadow);
`

const Text = styled.p`
    font-weight: 600;
    font-size: 12px;
    color: rgba(0, 0, 0, 0.8);
`

const CareemText = styled.p`
    font-weight: bold;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.8);
    margin: 0;
`

const CareemContainer = styled.div`
    /* position: absolute; */
    /* bottom: 0; */
    width: 100%;
`

const Careem = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--padding) var(--padding) 40px var(--padding);
`

export type contentStructure = {
    mainTitle: string
    introText: string
    tabs?: Array<{
        title: string
        content: string
    }>
}

const CareemFooter = () => {
    const { t } = useTranslation()
    const [openModal, setOpenModal] = useState(false)
    const [modalContent, setModalContent] = useState<contentStructure | null>(null)
    const businessDocs = useBusinessDocs()

    const TermsContentDummy = {
        mainTitle: t('footer.termsAndCondTitle', 'Terms & Conditions'),
        introText:
            'The Platform was developed and published by Swapp Technologies Ltd., a limited liability company incorporated under Irish law, with registered address at 15 Main Street, Raheny, Dublin 5 (Ireland) (hereinafter "Swapp").',
        tabs: [
            {
                title: '1. Introduction',
                content:
                    '1.1 Swapp Technologies Ltd. is a limited liability company incorporated under Irish law, with registered address at 15 Main Street, Raheny, Dublin 5 (Ireland) (hereinafter "Swapp").',
            },
            {
                title: '2. Access to the Platform',
                content:
                    '2.1 Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
            },
            {
                title: '3. Introduction',
                content:
                    '3.1 Swapp Technologies Ltd. is a limited liability company incorporated under Irish law, with registered address at 15 Main Street, Raheny, Dublin 5 (Ireland) (hereinafter "Swapp").',
            },
            {
                title: '4. Lorem',
                content:
                    '4.1 Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
            },
        ],
    }

    const openTermsModal = (modalContent: string, event: any) => {
        event.preventDefault()
        setOpenModal(true)
        // implement fetch or whatever for the real content
        if (modalContent === 'terms') {
            setModalContent(businessDocs.termsAndCondition)
        }
        if (modalContent === 'privacy') {
            setModalContent(businessDocs.privacyPolicy)
        }
        if (modalContent === 'legal') {
            setModalContent(businessDocs.legalNotice)
        }
    }

    return (
        <>
            <CareemContainer>
                <Careem>
                    <a
                        style={{ textDecoration: 'none', color: 'rgba(0, 0, 0, 0.8)' }}
                        target="_blank"
                        onClick={(e) => {
                            openTermsModal('terms', e)
                            trackEvent({
                                action: 'Terms',
                                category: 'FooterDR',
                            })
                        }}
                    >
                        <CareemText>{t('footer.termsOfUseLink', 'Terms of use')}</CareemText>
                    </a>
                    <a
                        style={{ textDecoration: 'none', color: 'rgba(0, 0, 0, 0.8)' }}
                        target="_blank"
                        onClick={(e) => {
                            openTermsModal('privacy', e)
                            trackEvent({
                                action: 'Privacy',
                                category: 'FooterDR',
                            })
                        }}
                    >
                        <CareemText>{t('footer.privacyPolicyLink', 'Privacy Policy')}</CareemText>
                    </a>
                    <a
                        style={{ textDecoration: 'none', color: 'rgba(0, 0, 0, 0.8)', zIndex: 1 }}
                        target="_blank"
                        onClick={(e) => {
                            openTermsModal('legal', e)
                            trackEvent({
                                action: 'Legal',
                                category: 'FooterDR',
                            })
                        }}
                    >
                        <CareemText>{t('footer.legalNoticeLink', 'Legal notice')}</CareemText>
                    </a>
                </Careem>
            </CareemContainer>
            {openModal && <SimpleModal setModal={setOpenModal} content={modalContent} />}
        </>
    )
}

export const Footer = () => {
    const isDesktop = useMediaQuery(device.laptop)

    const { data, error, isLoading } = useQuery('user', identityService.getMe)
    if (error || isLoading) {
        return null
    }

    const user = data?.data
    user?.careemId

    return user?.careemId ? !isDesktop ? <CareemFooter /> : <NormalFooter /> : <NormalFooter />
}

const NormalFooter = () => {
    const [isClicked, setIsclicked] = useState(false)
    const [isCitySelector, setIsCitySelector] = useState(false)
    const { t } = useTranslation()
    const onClick = () => {
        setIsclicked(!isClicked)
    }

    return (
        <StyledFooter>
            <DesktopView>
                <LinkWrapper>
                    <div style={{ position: 'relative' }}>
                        <IconAndLink
                            onClick={() => {
                                setIsCitySelector(!isCitySelector)
                            }}
                        >
                            <Poi />
                            <p>{t('budapest', 'Budapest')}</p>
                        </IconAndLink>
                        {isCitySelector ? (
                            <DropDownMenu>
                                <div>{t('headerCityDubai', 'Dubai')}</div>
                            </DropDownMenu>
                        ) : null}
                    </div>
                    <div style={{ position: 'relative' }}>
                        <LangSwitcher />
                    </div>
                    <a
                        href="mailto: suppliers.dubai@joinswapp.com"
                        style={{ textDecoration: 'none', color: 'rgba(0, 0, 0, 0.8)' }}
                        target="_blank"
                    >
                        <StyledLink>{t('footer.becomePartner', 'Become a partner')}</StyledLink>
                    </a>
                    <a
                        href="https://joinswapp.com/dubai/en-us/legal_notice"
                        style={{ textDecoration: 'none', color: 'rgba(0, 0, 0, 0.8)' }}
                        target="_blank"
                    >
                        <StyledLink>{t('footer.legalNoticeTitle', 'Legal notice')}</StyledLink>
                    </a>
                    <a
                        href="https://joinswapp.com/dubai/en-us/privacy_policy"
                        style={{ textDecoration: 'none', color: 'rgba(0, 0, 0, 0.8)' }}
                        target="_blank"
                    >
                        <StyledLink>{t('footer.privacyPolicyLink', 'Privacy Policy')}</StyledLink>
                    </a>
                    <a
                        href="https://joinswapp.com/dubai/en-us/cookie_policy"
                        style={{ textDecoration: 'none', color: 'rgba(0, 0, 0, 0.8)' }}
                        target="_blank"
                    >
                        <StyledLink>{t('footer.cookiePolicyLink', 'Cookie Policy')}</StyledLink>
                    </a>
                    <a
                        href="https://joinswapp.com/dubai/en-us/terms_and_conditions"
                        style={{ textDecoration: 'none', color: 'rgba(0, 0, 0, 0.8)' }}
                        target="_blank"
                    >
                        <Link passHref={true} href="/">
                            <StyledLink>{t('footer.termsOfUseLink', 'Terms of use')}</StyledLink>
                        </Link>
                    </a>
                </LinkWrapper>
                <Separator />
                <DesktopContactWrapper>
                    <SocialIcons>
                        <a style={{ margin: 0 }} href="https://www.facebook.com/joinswappuae/">
                            <img src="/rental/facebook.svg" alt="" />
                        </a>
                        <a
                            style={{ margin: 0 }}
                            href="https://www.youtube.com/channel/UCLENYvdfpWR83kp2drj-zSg/featured"
                        >
                            <img src="/rental/youtube.svg" alt="" />
                        </a>
                        <a style={{ margin: 0 }} href="https://www.instagram.com/swapp_uae/">
                            <img src="/rental/instagram.svg" alt="" />
                        </a>
                        <a style={{ margin: 0 }} href="https://www.facebook.com/joinswappuae/">
                            <img src="/rental/whatsapp.svg" alt="" />
                        </a>
                    </SocialIcons>
                    <ContactDetails>
                        <PhoneDetails>
                            <Telephone />
                            <p>{t('footer.callCenterPhone', '+971 800 032 0947')}</p>
                        </PhoneDetails>
                        <span>|</span>

                        <p>{t('footer.callCenterAvailability', 'Deliveries and call center: From 9 am to 7 pm')}</p>
                    </ContactDetails>
                    <Text>© {t('footer.allRightsReserved', 'Swapp 2022 - All rights reserved')}</Text>
                </DesktopContactWrapper>
            </DesktopView>
            <MobileView>
                <Details>
                    <Summary onClick={onClick}>
                        <span>{t('footer.usefulLinks', 'Useful links')}</span>
                        <ArrowDown isOpen={isClicked} />
                    </Summary>
                    {isClicked ? (
                        <LinkList>
                            <a
                                href="mailto: suppliers.dubai@joinswapp.com"
                                style={{ textDecoration: 'none', color: 'rgba(0, 0, 0, 0.8)' }}
                                target="_blank"
                            >
                                <StyledLink>{t('footer.becomePartner', 'Become a partner')}</StyledLink>
                            </a>
                            <a
                                href="https://joinswapp.com/dubai/en-us/legal_notice"
                                style={{ textDecoration: 'none', color: 'rgba(0, 0, 0, 0.8)' }}
                                target="_blank"
                            >
                                <StyledLink>{t('footer.legalNoticeTitle', 'Legal notice')}</StyledLink>
                            </a>
                            <a
                                href="https://joinswapp.com/dubai/en-us/privacy_policy"
                                style={{ textDecoration: 'none', color: 'rgba(0, 0, 0, 0.8)' }}
                                target="_blank"
                            >
                                <StyledLink>{t('footer.privacyPolicyLink', 'Privacy Policy')}</StyledLink>
                            </a>
                            <a
                                href="https://joinswapp.com/dubai/en-us/cookie_policy"
                                style={{ textDecoration: 'none', color: 'rgba(0, 0, 0, 0.8)' }}
                                target="_blank"
                            >
                                <StyledLink>{t('footer.cookiePolicyLink', 'Cookie Policy')}</StyledLink>
                            </a>
                            <a
                                href="https://joinswapp.com/dubai/en-us/terms_and_conditions"
                                style={{ textDecoration: 'none', color: 'rgba(0, 0, 0, 0.8)' }}
                                target="_blank"
                            >
                                <StyledLink>{t('footer.termsOfUseLink', 'Terms of use')}</StyledLink>
                            </a>
                        </LinkList>
                    ) : (
                        ''
                    )}
                </Details>
                <SocialIcons>
                    <a style={{ margin: 0 }} href="https://www.facebook.com/joinswappuae/">
                        <img src="/rental/facebook.svg" alt="" />
                    </a>
                    <a style={{ margin: 0 }} href="https://www.youtube.com/channel/UCLENYvdfpWR83kp2drj-zSg/featured">
                        <img src="/rental/youtube.svg" alt="" />
                    </a>
                    <a style={{ margin: 0 }} href="https://www.instagram.com/swapp_uae/">
                        <img src="/rental/instagram.svg" alt="" />
                    </a>
                    <a style={{ margin: 0 }} href="https://www.facebook.com/joinswappuae/">
                        <img src="/rental/whatsapp.svg" alt="" />
                    </a>
                </SocialIcons>
                <ContactWrapper>
                    <ContactDetails>
                        <PhoneDetails>
                            <Telephone />
                            <p>{t('footer.callCenterPhone', '+971 800 032 0947')}</p>
                        </PhoneDetails>
                        <span>|</span>
                        <p>{t('footer.callCenterAvailability', 'Deliveries and call center: From 9 am to 7 pm')}</p>
                    </ContactDetails>
                    <Text>© {t('footer.allRightsReserved', 'Swapp 2022 - All rights reserved')}</Text>
                </ContactWrapper>
            </MobileView>
        </StyledFooter>
    )
}
