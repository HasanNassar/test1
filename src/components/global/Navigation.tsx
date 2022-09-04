import { size } from '@util/responsive'
import { useTranslation } from 'next-i18next'
import { useState } from 'react'
import styled from 'styled-components'
import { Car } from './icons/Car'
import { HamburgerMenu } from './icons/HamburgerMenu'
import { LanguageGlobe } from './icons/LanguageGlobe'
import { Login } from './icons/Login'
import { MiniArrowRight } from './icons/MiniArrowRight'
import { Poi } from './icons/Poi'
import { Search } from './icons/Search'
import { Support } from './icons/Support'
import MainLogo from './Logo'
import LangSwitcher from './LangSwitcher'
import { Cross } from './icons/Cross'
import Link from 'next/link'
import { identityService } from 'src/service/identity'
import { useQuery } from 'react-query'
import { useAuth } from '@contexts/auth'
import { trackEvent } from '@util/ga'
import { MiniArrowLeft } from './icons/MiniArrowLeft'
import { useRouter } from 'next/router'
import { openFreshChat } from '@util/freshChat'
import { config, placeholderAvatarImage } from '@util/config'
enum RentalType {
    car = 'carRental',
    subscription = 'subscription',
}
export const Navigation: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [carRental, setCarRental] = useState(RentalType.car)
    const { t } = useTranslation('common')
    const { user } = useAuth()
    const { query, asPath, back, push } = useRouter()
    const queriedCity = query.city as string

    const backHandler = () => {
        back()
    }

    const { data, error, isLoading } = useQuery('user', identityService.getMe, {
        enabled: !!user,
    })

    if (!!user && (error || isLoading)) {
        return null
    }

    const userData = data?.data

    return (
        <NavContainer className={'navbarTop'}>
            <NavHeader>
                <BackButton>
                    {asPath === `/${queriedCity}/` ? null : (
                        <a className={'iconSvgArrow'} onClick={backHandler}>
                            <MiniArrowLeft />
                        </a>
                    )}
                </BackButton>
                <StyledNav>
                    <Link href={'/'}>
                        <a style={{ height: '24px', marginTop: '3px' }}>
                            <MainLogo />
                        </a>
                    </Link>
                </StyledNav>
                <DesktopNav />
                <MenuCont>
                    {isMenuOpen ? (
                        <NavIconContainer>
                            <div onClick={() => setIsMenuOpen(!isMenuOpen)}>
                                <Cross />
                            </div>
                        </NavIconContainer>
                    ) : (
                        <div data-cy="hamburger-menu-open" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                            <HamburgerMenu />
                        </div>
                    )}
                </MenuCont>
            </NavHeader>

            {isMenuOpen ? (
                <>
                    <MobileDropDown data-cy="hamburger-opened">
                        {userData ? (
                            <>
                                <Link href={'/dubai/profile'} passHref>
                                    <LoginSection
                                        onClick={() => {
                                            trackEvent({
                                                action: 'Profile',
                                                category: 'MenuDR',
                                            })
                                        }}
                                    >
                                        <FlexContainer>
                                            <Avatar>
                                                <ImageContainer src={`/rental/${placeholderAvatarImage}`} alt="" />
                                            </Avatar>
                                            <LoginTextContainer>
                                                <Headline>
                                                    {userData.firstName} {userData.lastName}
                                                </Headline>
                                                {userData?.careemId ? null : (
                                                    <FullListText>{userData.email}</FullListText>
                                                )}
                                            </LoginTextContainer>
                                        </FlexContainer>
                                        <FlexContainer className={'iconSvgArrow'}>
                                            <MiniArrowRight />
                                        </FlexContainer>
                                    </LoginSection>
                                </Link>
                                <Separator />
                            </>
                        ) : null}
                        <DropDownList>
                            {!userData && (
                                <Link href={`/dubai/login`} passHref>
                                    <DropDownItemContainer className={'arrowIcon'}>
                                        <DropdownItem>
                                            <DropDownIconContainer className={'iconMenu'}>
                                                <Login />
                                            </DropDownIconContainer>
                                            <DropDownMenuText>
                                                {t('menuitem.loginOrSignUp', 'Login or Sign up')}
                                            </DropDownMenuText>
                                        </DropdownItem>
                                        <div className={'iconSvgArrow'}>
                                            <MiniArrowRight />
                                        </div>
                                    </DropDownItemContainer>
                                </Link>
                            )}
                            <Link href={`/dubai/cars`} passHref>
                                <DropDownItemContainer
                                    className={'arrowIcon'}
                                    onClick={() => {
                                        trackEvent({
                                            action: 'Browse',
                                            category: 'MenuDR',
                                        })
                                    }}
                                >
                                    <DropdownItem>
                                        <DropDownIconContainer className={'iconMenu'}>
                                            <Search />
                                        </DropDownIconContainer>
                                        <DropDownMenuText>{t('menuitem.browse', 'See cars')}</DropDownMenuText>
                                    </DropdownItem>
                                    <div className={'iconSvgArrow'}>
                                        <MiniArrowRight />
                                    </div>
                                </DropDownItemContainer>
                            </Link>
                            <>
                                {userData &&
                                    (carRental === RentalType.car ? (
                                        <Link href={`/dubai/profile/myrentals`} passHref>
                                            <DropDownItemContainer className={'arrowIcon'}>
                                                <DropdownItem
                                                    onClick={() => {
                                                        trackEvent({
                                                            action: 'My-rentals',
                                                            category: 'MenuDR',
                                                        })
                                                    }}
                                                >
                                                    <DropDownIconContainer className={'iconMenu'}>
                                                        <Car />
                                                    </DropDownIconContainer>
                                                    <DropDownMenuText>
                                                        {t('menuitem.myRentals', 'My rentals')}
                                                    </DropDownMenuText>
                                                </DropdownItem>
                                                <div className={'iconSvgArrow'}>
                                                    <MiniArrowRight />
                                                </div>
                                            </DropDownItemContainer>
                                        </Link>
                                    ) : (
                                        <a href="https://www.joinswapp.com" style={{ textDecoration: 'none' }}>
                                            <DropDownItemContainer className={'arrowIcon'}>
                                                <DropdownItem>
                                                    <DropDownIconContainer className={'iconMenu'}>
                                                        <Car />
                                                    </DropDownIconContainer>
                                                    <DropDownMenuText>
                                                        {t('menuitem.mySubscriptions', 'My subscriptions')}
                                                    </DropDownMenuText>
                                                </DropdownItem>
                                                <div className={'iconSvgArrow'}>
                                                    <MiniArrowRight />
                                                </div>
                                            </DropDownItemContainer>
                                        </a>
                                    ))}
                            </>
                            <a style={{ textDecoration: 'none' }}>
                                <DropDownItemContainer
                                    className={'arrowIcon'}
                                    onClick={() => {
                                        openFreshChat()
                                        trackEvent({
                                            action: 'Support',
                                            category: 'MenuDR',
                                        })
                                    }}
                                >
                                    <DropdownItem>
                                        <DropDownIconContainer className={'iconMenu'}>
                                            <Support />
                                        </DropDownIconContainer>
                                        <DropDownMenuText>{t('menuitem.support', 'Support')}</DropDownMenuText>
                                    </DropdownItem>
                                    <div className={'iconSvgArrow'}>
                                        <MiniArrowRight />
                                    </div>
                                </DropDownItemContainer>
                            </a>
                            {userData?.careemId ? null : (
                                <>
                                    <Link href={`/`} passHref>
                                        <DropDownItemContainer className={'arrowIcon'}>
                                            <DropdownItem>
                                                <DropDownIconContainer className={'iconMenu'}>
                                                    <Poi />
                                                </DropDownIconContainer>
                                                <DropDownMenuText>{t('budapest', 'Budapest')}</DropDownMenuText>
                                            </DropdownItem>
                                            <div className={'iconSvgArrow'}>
                                                <MiniArrowRight />
                                            </div>
                                        </DropDownItemContainer>
                                    </Link>
                                    <Link href={`/`} passHref>
                                        <DropDownItemContainer className={'arrowIcon'}>
                                            <DropdownItem>
                                                <DropDownIconContainer className={'iconMenu'}>
                                                    <LanguageGlobe />
                                                </DropDownIconContainer>
                                                <DropDownMenuText>{t('english', 'English')}</DropDownMenuText>
                                            </DropdownItem>
                                            <div className={'iconSvgArrow'}>
                                                <MiniArrowRight />
                                            </div>
                                        </DropDownItemContainer>
                                    </Link>
                                </>
                            )}
                            <Link href={config.PRODUCT_SELECTOR_LINK} passHref>
                                <DropDownItemContainer className={'arrowIcon'}>
                                    <DropdownItem>
                                        <DropDownIconContainer className={'iconMenu'}>
                                            <MiniArrowLeft />
                                        </DropDownIconContainer>
                                        <DropDownMenuText>
                                            {t('menuItem.productSelector', 'Back to product selector')}
                                        </DropDownMenuText>
                                    </DropdownItem>
                                </DropDownItemContainer>
                            </Link>
                        </DropDownList>
                        {userData?.careemId ? null : (
                            <>
                                <Separator />
                                <Container>
                                    <GrayContainer>
                                        <TextHolder
                                            onClick={() => setCarRental(RentalType.subscription)}
                                            isActive={carRental === RentalType.subscription}
                                        >
                                            {t('subscription', 'Subscription')}
                                        </TextHolder>
                                        <TextHolder
                                            onClick={() => setCarRental(RentalType.car)}
                                            isActive={carRental === RentalType.car}
                                        >
                                            {t('carRental', 'Car rental')}
                                        </TextHolder>
                                    </GrayContainer>
                                </Container>
                            </>
                        )}
                    </MobileDropDown>
                    <T />
                </>
            ) : null}
        </NavContainer>
    )
}

const ListLink = styled.li`
    cursor: pointer;
`

const T = styled.div`
    left: 0px;
    position: fixed;
    top: var(--navHeight);
    width: 100vw;
    height: 100vh;
    display: block;
    opacity: 1;
    z-index: 10;
    background: rgba(0, 0, 0, 0.4);
`

const DesktopNav = () => {
    const { t } = useTranslation()
    const { data, error, isLoading } = useQuery('user', identityService.getMe)
    if (error || isLoading) {
        return null
    }

    const user = data?.data

    return (
        <DNav>
            <LeftSide>
                <Link href={'/dubai/cars'} passHref>
                    <ListLink>{t('desktopMenuItem.browse', 'Browse')}</ListLink>
                </Link>
                {user ? (
                    <Link href={'/dubai/profile/myrentals'} passHref>
                        <ListLink>{t('desktopMenuItem.rentals', 'Rentals')}</ListLink>
                    </Link>
                ) : null}
                <a style={{ textDecoration: 'none', color: 'rgba(0, 0, 0, 0.8)' }} onClick={() => openFreshChat()}>
                    <ListLink>{t('desktopMenuItem.help', 'Help')}</ListLink>
                </a>
            </LeftSide>
            <RightSide>
                <Link href={'/dubai/profile'} passHref className={'hasan'}>
                    <ListLink>
                        {t('desktopMenuItem.hello', {
                            firstName: user?.firstName,
                            defaultValue: 'Hello, {{firstName}}!',
                        })}
                    </ListLink>
                </Link>
                <Link href={'/dubai/cars'} passHref>
                    <ListLink>
                        <IconAndLink>
                            <Car />
                            <p>{t('desktopMenuItem.car_rental', 'Car rental')}</p>
                        </IconAndLink>
                    </ListLink>
                </Link>
                <li>
                    <IconAndLink>
                        <Poi />
                        <p>{t('budapest', 'Budapest')}</p>
                    </IconAndLink>
                </li>
                <li>
                    <LangSwitcher />
                </li>
            </RightSide>
        </DNav>
    )
}

const GrayContainer = styled.div`
    background: rgba(118, 118, 128, 0.12);
    display: flex;
    flex: 1;
    justify-content: space-between;
    border-radius: 6.93px;
    padding: 2px;
`

const TextHolder = styled.div<{ isActive: boolean }>`
    width: 180px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6.93px;
    padding: 6px 0;
    font-weight: 600;
    font-size: 15px;
    background: ${(props) => (props.isActive ? 'white' : '')};
    box-shadow: ${(props) =>
        props.isActive ? '0px 3px 8px rgba(0, 0, 0, 0.12), 0px 3px 1px rgba(0, 0, 0, 0.04)' : ''};
`
const Headline = styled.h1`
    font-size: var(--size-24);
    font-weight: var(--weight-extraBold);
    color: black;
    margin: 0;
`

const FullListText = styled.p`
    font-weight: var(--weight-bold);
    font-size: 14px;
    margin: 0;
    margin-top: 4px;
    color: #ff5a5a;
`

const LoginSection = styled.a`
    padding: 24px;
    display: flex;
    justify-content: space-between;
`

const FlexContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
`

const Container = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
`
const Avatar = styled.div`
    width: 56px;
    height: 56px;
`
const ImageContainer = styled.img`
    height: 100%;
    width: 100%;
    object-fit: cover;
    border-radius: 100%;
`
const LoginTextContainer = styled.div`
    display: flex;
    flex-direction: column;
    margin-inline-start: 24px;
    margin-inline-end: 24px;
`
const Separator = styled.div`
    border-bottom: 0.5px solid rgba(0, 0, 0, 0.1);
    padding: 24px -24px;
`

const DNav = styled.div`
    display: none;
    @media (min-width: ${size.laptop}) {
        display: flex;
        flex: 1;
        align-items: center;
        li {
            list-style: none;
            font-weight: bold;
            margin-inline-start: 2rem;
        }
    }
`

const LeftSide = styled.div`
    display: flex;
    flex: 1;
    list-style: none;
`

const RightSide = styled.div`
    display: flex;
    align-items: center;
    list-style: none;
    & > li {
        position: relative;
    }
`

const NavContainer = styled.div`
    width: 100%;
    box-shadow: 0px 2px 20px rgba(0, 0, 0, 0.08);
    display: flex;
    z-index: 20;
    position: fixed;
    background: var(--white);
    height: 66px;

    @media (min-width: ${size.laptop}) {
        height: 84px;
    }
`

const NavIconContainer = styled.div`
    display: flex;
    column-gap: 24px;
`

const BackButton = styled.div`
    min-width: 56px;
`

const MenuCont = styled.div`
    display: none;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    min-width: 56px;
    @media (min-width: ${size.laptop}) {
        display: none;
    }
`

const StyledNav = styled.nav`
    display: flex;
    align-items: center;
`

const NavHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: auto;
    padding: 0 var(--padding);
    width: ${size.container};
`

const LogoLabel = styled.div`
    margin-inline-start: 0.5rem;
    color: white;
    display: flex;
    font-size: var(--size-10);
    border-radius: 100px;
    padding: 0 0.5rem 0.1rem;
    background: var(--primaryColor);
    height: 15px;
    line-height: 1rem;
    min-width: 45px;
`

const MobileDropDown = styled.div`
    z-index: 50;
    top: var(--navMobileHeight);
    position: absolute;
    background: white;
    width: 100%;
    border-radius: 0px 0px 16px 16px;
`
const DropDownList = styled.div`
    display: flex;
    flex-direction: column;
    padding: var(--padding) var(--padding) 6px;
`

const DropDownItemContainer = styled.div`
    padding: 0 0 var(--padding) 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
`

const DropDownMenuText = styled.p<{ isOpen?: boolean }>`
    font-weight: var(--weight-semiBold);
    font-size: var(--size-14);
    margin: 0px;
    color: ${(props) => (props.isOpen ? `var(--primaryColor)` : 'rgba(0, 0, 0, 0.8)')};
`
const DropdownItem = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
`
const DropDownIconContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.5rem;
    margin-right: 1rem;
`
const IconAndLink = styled.div`
    display: flex;
    align-items: center;
    cursor: pointer;
    & > p {
        margin-inline-start: 10px;
    }
`
