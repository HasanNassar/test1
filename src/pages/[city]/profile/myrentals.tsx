import styled from 'styled-components'
import MainLayout from '@components/layout/MainLayout'
import { useState } from 'react'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useRouter } from 'next/router'
import { bookingService } from '@service/booking'
import { useQuery } from 'react-query'
import { MyRentalCard } from '@components/modules/Profile/MyRentalCard'
import { BookingStatus } from '@util/enums'

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

const SubHeading = styled.h4<{ active?: boolean }>`
    font-weight: bold;
    margin: 0;
    font-size: 16px;
    color: ${(props) => (props.active ? ' #ff5a5a' : 'rgba(0, 0, 0, 0.8)')};
`

const SeparatorBig = styled.div`
    width: 100%;
    border-bottom: 0.5px solid rgba(0, 0, 0, 0.1);
`

const Container = styled.div`
    display: flex;
    align-items: center;
    column-gap: 40px;
    padding: 0 24px;
    border-bottom: 0.5px solid rgba(0, 0, 0, 0.1);
    margin-bottom: 1px;
`
const SubHeadingWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin: 24px 0 -2px 0;
`

const MiniSeparator = styled.div<{ borderShown: boolean }>`
    ${(props) => (props.borderShown ? 'margin-top: 20px;' : 'margin-top: 24px;')}
    ${(props) => (props.borderShown ? 'border-bottom: 4px solid #ff5a5a; border-radius: 100px' : '')}
`

export async function getServerSideProps({ locale }) {
    return {
        props: {
            ...(await serverSideTranslations(locale, ['common'])),
        },
    }
}

enum BookingTab {
    active = 'ACTIVE',
    upcoming = 'UPCOMING',
    past = 'PAST',
}
export default function myrental() {
    const { query, replace } = useRouter()
    const statusParam = (query.status as string)?.toLowerCase()

    const [active, setActive] = useState(BookingTab[statusParam] || BookingTab.active)
    const { t } = useTranslation()

    const setTab = (tab: BookingTab) => {
        setActive(tab)
        replace(
            {
                query: {
                    ...query,
                    status: tab.toLowerCase(),
                },
            },
            undefined,
            {
                shallow: true,
            },
        )
    }

    const checkRentalStatus = (rental: any) => {
        const now = new Date()
        const endDate = new Date(rental.handbackTime)
        const startDate = new Date(rental.handoverTime)

        if (
            (rental.status === BookingStatus.approved && startDate <= now) ||
            (rental.status === BookingStatus.active && endDate > now)
        ) {
            return BookingTab.active
        }
        if (
            rental.status === BookingStatus.pending_approval ||
            (rental.status === BookingStatus.approved && startDate > now)
        ) {
            return BookingTab.upcoming
        }
        if (
            rental.status === BookingStatus.completed ||
            rental.status === BookingStatus.cancelled ||
            (rental.status === BookingStatus.active && endDate <= now)
        ) {
            return BookingTab.past
        }
        return false
    }

    const { data, isLoading, isError } = useQuery('myrentals', async () => {
        return await bookingService.getBookings()
    })

    const rentals = data?.data

    if (!rentals) {
        return null
    }

    return (
        <MainLayout>
            <Wrapper>
                <Header>
                    <SubHeading>{t('profileMyRentalsHeading', 'My rentals')}</SubHeading>
                </Header>
            </Wrapper>
            <SeparatorBig />
            <Container>
                <SubHeadingWrapper onClick={() => setTab(BookingTab.active)}>
                    <SubHeading active={active === BookingTab.active}>
                        {t('profileMyRentalsActive', 'Active')}
                    </SubHeading>
                    <MiniSeparator borderShown={active === BookingTab.active} />
                </SubHeadingWrapper>
                <SubHeadingWrapper onClick={() => setTab(BookingTab.upcoming)}>
                    <SubHeading active={active === BookingTab.upcoming}>
                        {t('profileMyRentalsUpcoming', 'Upcoming')}
                    </SubHeading>
                    <MiniSeparator borderShown={active === BookingTab.upcoming} />
                </SubHeadingWrapper>
                <SubHeadingWrapper onClick={() => setTab(BookingTab.past)}>
                    <SubHeading active={active === BookingTab.past}>{t('profileMyRentalsPast', 'Past')}</SubHeading>
                    <MiniSeparator borderShown={active === BookingTab.past} />
                </SubHeadingWrapper>
            </Container>
            <Wrapper>
                {rentals
                    ? rentals.map((rental) => {
                          if (checkRentalStatus(rental) === active) {
                              return <MyRentalCard key={rental?.bookingId} rental={rental} />
                          } else {
                              return null
                          }
                      })
                    : () => <div>{t('profileMyRentalsNoRentals', 'No rentals')}</div>}
            </Wrapper>
        </MainLayout>
    )
}
