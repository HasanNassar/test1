import { CarCard } from '@components/global/CarCard'
import { Dots } from '@components/global/Dots'
import MainLayout from '@components/layout/MainLayout'
import { Filter } from '@components/modules/Car/Filter'
import { getParamsFromQuery } from '@components/modules/Car/FilterModal'
import { DateTimeSelectorOverlay } from '@components/modules/Search/DateTimeSelectorOverlay'
import { useSearch } from '@contexts/search'
import { CalendarIcon } from '@global/icons/Calendar'
import { Pencil } from '@global/icons/Pencil'
import { useRouterQuery } from '@hooks/useRouterQuery'
import { bookingService } from '@service/booking'
import { ListingQuery, ListingsResponse, ListingsResponseData } from '@service/booking.types'
import { trackEvent } from '@util/ga'
import { debounce } from 'lodash'
import { format, formatISO } from 'date-fns'
import type { NextPage } from 'next'
import { GetServerSideProps } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { ParsedUrlQuery } from 'querystring'
import { useCallback, useRef, useEffect, useState } from 'react'
import styled from 'styled-components'
import { pricingService } from '@service/payment'
import { defaultCityCode } from '@util/config'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useRouter } from 'next/router'
import { configurationService } from '@service/configuration'
import { BarSpinner } from '@components/global/icons/SpinnerBar'
import { CitySettingsResponse } from '@service/configuration.types'
import { ar } from 'date-fns/locale'
import { useConfig } from '@contexts/config'

const defaultPaginationInfo = { currentPage: 1, pageSize: 10, totalElements: 0, totalPages: 0 }

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { locale } = context
    const response = await configurationService.getCitySettings(defaultCityCode)

    const {
        page,
        pageSize,
        cityCode,
        handbackTime,
        handoverTime,
        minSeats,
        maxSeats,
        carType,
        minDailyPrice,
        maxDailyPrice,
    } = getParamsFromQuery(context.query, response.data)

    const listingsParams: ListingQuery = {
        page,
        pageSize: defaultPaginationInfo.pageSize,
        cityCode,
        handbackTime,
        handoverTime,
        carType,
        minDailyPrice,
        maxDailyPrice,
        minSeats,
        maxSeats,
    }

    let cars: ListingsResponse | undefined

    try {
        const { data } = await bookingService.getListings(listingsParams)
        if (data) cars = { ...data }
    } catch (e: any) {
        cars = { data: [], paginationInfo: defaultPaginationInfo }
    }

    return {
        props: {
            cars,
            citySettings: response.data,
            ...(await serverSideTranslations(locale ?? 'en-dxb', ['common'])),
        },
    }
}

const Cars: NextPage<{ cars: ListingsResponse; citySettings: CitySettingsResponse }> = ({ cars, citySettings }) => {
    const { lang } = useConfig()
    const query = useRouterQuery()
    const { push } = useRouter()
    const { t } = useTranslation()
    const {
        page,
        pageSize,
        cityCode,
        handbackTime,
        handoverTime,
        minSeats,
        maxSeats,
        carType,
        minDailyPrice,
        maxDailyPrice,
    } = getParamsFromQuery(query as ParsedUrlQuery, citySettings)

    const { setDatepickerOverlay, fromDate, fromTime, toDate, toTime } = useSearch()
    const listingsParams: ListingQuery = {
        page,
        pageSize: defaultPaginationInfo.pageSize,
        cityCode,
        handbackTime,
        handoverTime,
        carType,
        minDailyPrice,
        maxDailyPrice,
        minSeats,
        maxSeats,
    }
    const [isScrolled, setScrolled] = useState(false)
    const [carData, setCarData] = useState<ListingsResponseData[] | []>(cars.data)
    const [hasMore, setHasMore] = useState(true)
    const [paginationInfo, setPaginationInfo] = useState(cars.paginationInfo)

    const fetchListings = async (resetValues = false, pagenumber: number) => {
        try {
            const { data } = await bookingService.getListings({
                ...listingsParams,
                page: resetValues ? 1 : pagenumber,
            })
            setCarData(resetValues ? data?.data || [] : [...carData, ...(data?.data || [])])
            setPaginationInfo({
                ...(data?.paginationInfo ? data?.paginationInfo : defaultPaginationInfo),
            })
        } catch (error) {
            if (resetValues) setCarData([])
            setPaginationInfo(defaultPaginationInfo)
        }
    }

    const increaseCurrentPage = () => {
        if (carData.length < paginationInfo.totalElements) {
            fetchListings(false, paginationInfo.currentPage + 1)
        }
    }

    const checkScroll = () => {
        if (window.scrollY === 0) {
            setScrolled(false)
        } else {
            setScrolled(true)
        }
    }
    const debouncedCheckScroll = debounce(checkScroll, 10)

    useEffect(() => {
        window.addEventListener('scroll', debouncedCheckScroll)
        return () => {
            window.removeEventListener('scroll', debouncedCheckScroll)
        }
    }, [debouncedCheckScroll])

    useEffect(() => {
        trackEvent({
            action: 'Pageload',
            category: 'BrowseDR',
            label: 'Browse',
        })
    }, [])

    const myRef = useRef()

    const openFilter = () => {
        const currentRef: any = myRef.current
        currentRef.openFromParent()
    }

    const getISODate = (fromDate: Date | null, fromTime: Date | null) => {
        const newDate = formatISO(fromDate as Date, { representation: 'date' })
        const newTime = fromTime && formatISO(fromTime as Date, { representation: 'time' })
        const newDateTime = fromTime && new Date(`${newDate}T${newTime}`)?.toISOString()

        return newDateTime
    }

    const [dailyPrices, setDailyPrices] = useState<any>([])

    const getDailyPrices = useCallback(async () => {
        const activeCarList = carData.map((obj) => {
            return obj.id
        })

        const handoverDateTime = getISODate(fromDate, fromTime)
        const handbackDateTime = getISODate(toDate, toTime)

        const postData: any = {
            externalListingIds: activeCarList,
            cityCode: citySettings?.cityCode || defaultCityCode,
            handoverTime: handoverDateTime ? handoverDateTime : fromDate,
            handbackTime: handbackDateTime ? handbackDateTime : toDate,
        }

        const newPrice = await pricingService.postPriceCalculation(postData)
        setDailyPrices(newPrice.data)
    }, [fromDate, toDate, carData, fromTime, toTime])

    useEffect(() => {
        getDailyPrices()
    }, [fromDate, toDate, carData, fromTime, toTime])

    useEffect(() => {
        if (fromDate && toDate && fromTime && toTime) {
            const [route] = router.asPath.split('?')

            const handoverDateTime = getISODate(fromDate, fromTime)
            const handbackDateTime = getISODate(toDate, toTime)

            push(`${route}?from=${handoverDateTime}&to=${handbackDateTime}`, undefined, { shallow: true })
        }
    }, [fromDate, toDate, fromTime, toTime])

    const router = useRouter()

    useEffect(() => {
        if (Object.keys(router.query).length > 0) {
            fetchListings(true, 1)
        }
    }, [router.query])

    useEffect(() => {
        setHasMore(carData.length < paginationInfo.totalElements)
    }, [carData, paginationInfo])

    const findPricing = (carId: string | number) => {
        const car = dailyPrices?.listings?.find((obj) => obj.externalListingId === carId)
        if (car) {
            return car
        }
        return null
    }

    return (
        <MainLayout>
            <TimeWrapper scrolled={isScrolled}>
                <TimeContainer>
                    <CalendarIcon />
                    <div>
                        {lang === 'ar' ? (
                            <DateText className={'dateTimeSelectorSpan'}>
                                {format(fromDate || new Date(), 'EEE، d MMM', { locale: ar })}
                            </DateText>
                        ) : (
                            <DateText>{format(fromDate || new Date(), 'EEE, MMM d')}</DateText>
                        )}
                        <TimeText>{fromTime ? format(fromTime, 'HH:mm') : '00:00'}</TimeText>
                    </div>
                    <p>-</p>
                    <div>
                        {lang === 'ar' ? (
                            <DateText className={'dateTimeSelectorSpan'}>
                                {format(toDate || new Date(), 'EEE، d MMM', { locale: ar })}
                            </DateText>
                        ) : (
                            <DateText>{format(toDate || new Date(), 'EEE, MMM d')}</DateText>
                        )}
                        <TimeText>{toTime ? format(toTime, 'HH:mm') : '00:00'}</TimeText>
                    </div>
                </TimeContainer>
                <div
                    data-cy="openTimeModal"
                    onClick={() => {
                        setDatepickerOverlay(true)
                        trackEvent({
                            action: 'Datetime-open',
                            category: 'BrowseDR',
                            label: 'Browse',
                        })
                    }}
                >
                    <Pencil color="#ff5a5a" />
                </div>
            </TimeWrapper>
            <DateTimeSelectorOverlay />
            <InfiniteScroll
                dataLength={carData.length}
                next={increaseCurrentPage}
                hasMore={hasMore}
                loader={
                    <SpinnerWrapper>
                        <BarSpinner />
                    </SpinnerWrapper>
                }
            >
                <Wrapper scrolled={isScrolled}>
                    <Dots />
                    {carData.length ? (
                        carData.map((car) => (
                            <div key={car.id}>
                                <div
                                    onClick={() => {
                                        trackEvent({
                                            action: 'Car-card-click',
                                            category: 'BrowseDR',
                                        })
                                    }}
                                >
                                    <CarCard key={car.id} car={car} pricingInfos={findPricing(car.id)} />
                                </div>
                                {/* <MarketingWrapper>Defined by marketing</MarketingWrapper> */}
                            </div>
                        ))
                    ) : (
                        <NoResults>
                            <NoResultsImage>
                                <img src="/rental/svg/no-cars-found.svg" alt="" />
                            </NoResultsImage>
                            <NoResultsTitle>{t('carFiltersNotFoundTitle', 'No cars found')}</NoResultsTitle>
                            <NoResultsText>
                                {t('carFiltersNotFoundText', 'Try changing your filters or adjusting your dates')}
                            </NoResultsText>
                            <RefineButton onClick={() => openFilter()}>
                                {t('carFiltersRefineFilter', 'Refine search')}
                            </RefineButton>
                        </NoResults>
                    )}
                </Wrapper>
            </InfiniteScroll>
            <Filter ref={myRef} />
        </MainLayout>
    )
}

type scrolledSelector = {
    scrolled: boolean
}

const SpinnerWrapper = styled.div`
    display: flex;
    justify-content: center;
    background: transparent;
    bottom: 10px;
    z-index: 100;
    width: 100%;
    padding: 10px 0;
`

const TimeWrapper = styled.div<scrolledSelector>`
    background: white;
    box-shadow: 0px 2px 20px 0px rgba(0, 0, 0, 0.08);
    display: flex;
    padding: 8px var(--padding);
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    border-radius: ${(props) => (props.scrolled ? '0' : '16px')};
    position: ${(props) => (props.scrolled ? 'sticky' : 'absolute')};
    z-index: 15;
    top: ${(props) => (props.scrolled ? '65px' : 'auto')};
    margin: ${(props) => (props.scrolled ? 'auto' : 'var(--padding)')};
    width: fill-available;
`
const Wrapper = styled.div<scrolledSelector>`
    background: linear-gradient(38.76deg, #ff5a5a 45.15%, rgba(255, 169, 120, 0.8) 101.71%), white;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    position: relative;
    overflow: hidden;
    padding: ${(props) => (props.scrolled ? 'var(--padding)' : '96px var(--padding)')};
`
const DateText = styled.p`
    font-weight: var(--weight-bold);
    font-size: 14px;
    margin: 0;
    white-space: nowrap;
`

const TimeText = styled.p`
    font-size: 14px;
    margin: 0;
`

const TimeContainer = styled.div`
    display: flex;
    align-items: center;
    column-gap: 1rem;
`

const MarketingWrapper = styled.div`
    margin-top: var(--padding);
    background: #ffe9e2;
    box-shadow: 0px 2px 20px rgba(0, 0, 0, 0.2);
    border-radius: 16px;
    display: flex;
    padding: 44px 20px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    font-weight: var(--weight-bold);
    font-size: var(--size-24);
    color: var(--primaryColor);
    position: relative;
    z-index: 10;
`
const NoResults = styled.div`
    padding: var(--padding);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: white;
    height: calc(100vh - 310px);
`

const NoResultsImage = styled.div`
    height: 16rem;
    width: 8rem;
`

const NoResultsTitle = styled.h2`
    margin: 1.5rem auto;
`

const NoResultsText = styled.div`
    text-align: center;
    max-width: 250px;
    margin: 0 auto 2rem;
    z-index: 10;
    line-height: 1.4rem;
`

const RefineButton = styled.button`
    background: white;
    color: var(--primaryColor);
    font-weight: bold;
    font-size: 16px;
    line-height: 22px;
    text-align: center;
    width: 100%;
    padding: 1rem 0;
    border-radius: 100px;
    border: none;
    z-index: 10;
`

export default Cars
