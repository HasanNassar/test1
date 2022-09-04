import { useTranslation } from 'next-i18next'
import React, { useReducer, useState } from 'react'
import { useRanger } from 'react-ranger'
import styled from 'styled-components'
import { Headline2, HyperLink } from '@util/typography'
import { Checkbox } from '@global/Checkbox'
import { Cross } from '@global/icons/Cross'
import { Modal } from '@global/Modal'
import { useRouter } from 'next/router'
import { trackEvent } from '@util/ga'
import { CarType, ListingQuery } from '@service/booking.types'
import { add } from 'date-fns'
import { ParsedUrlQuery } from 'querystring'
import { useRouterQuery } from '@hooks/useRouterQuery'
import { throttle } from 'lodash'
import { CitySettingsResponse, Currency } from '@service/configuration.types'
import { useConfig } from '@contexts/config'
import { defaultCityCode } from '@util/config'

const filterReducer = (state, action) => {
    if (action.type === 'input') {
        return {
            ...state,
            [action.name]: {
                ...state[action.name],
                value: action.value,
                checked: action.checked,
            },
        }
    }
    if (action.type === 'reset') {
        return {
            ...state,
            ...action.object,
        }
    }
}

export const getParamsFromQuery = (
    query: ParsedUrlQuery,
    citySettings?: CitySettingsResponse | undefined,
): ListingQuery => {
    const cityCode = defaultCityCode
    const handoverTime = (query.from || new Date().toISOString()) as string
    const handbackTime = (query.to || add(new Date(), { days: 4 }).toISOString()) as string
    const page = Number((query.page as string) || 1)
    const pageSize = Number((query.pageSize as string) || 10)
    const minSeats = Number((query.minSeats as string) || 2)
    const maxSeats = Number((query.maxSeats as string) || 10)
    const minDailyPrice = Number((query.minPrice as string) || citySettings?.minSearchPrice || 1)
    const maxDailyPrice = Number((query.maxPrice as string) || citySettings?.maxSearchPrice || 3000)

    let carType: CarType[] = []
    if (query.carType && typeof query.carType !== 'string') {
        carType = query.carType.map((cT) => cT.toUpperCase()) as CarType[]
    } else if (query.carType && typeof query.carType === 'string') {
        carType = [query.carType.toUpperCase()] as CarType[]
    }

    return {
        page,
        pageSize,
        cityCode,
        handoverTime,
        handbackTime,
        minSeats,
        maxSeats,
        carType,
        minDailyPrice,
        maxDailyPrice,
    }
}

export const FilterModal: React.FC<{
    setModal: React.Dispatch<React.SetStateAction<boolean>>
}> = ({ setModal: setModal }) => {
    const { citySettings } = useConfig()
    const { t } = useTranslation()
    const query = useRouterQuery()

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

    const listingsParams: ListingQuery = {
        page,
        pageSize,
        cityCode,
        handbackTime,
        handoverTime,
        carType,
        minDailyPrice,
        maxDailyPrice,
        minSeats,
        maxSeats,
    }

    const { push } = useRouter()

    const [rangerValues, setRangerValues] = useState([
        listingsParams.minDailyPrice as number,
        listingsParams.maxDailyPrice as number,
    ])

    const [seatsRangerValues, setSeatsRangerValues] = useState([
        listingsParams.minSeats as number,
        listingsParams.maxSeats as number,
    ])

    const [carTypeFilter, carTypeDispatch] = useReducer(filterReducer, {
        coupe: { i18n: t('carFilterTypeCoupe', 'Coupe'), value: listingsParams?.carType?.includes(CarType.COUPE) },
        convertible: {
            i18n: t('carFilterTypeConvertible', 'Convertible'),
            value: listingsParams?.carType?.includes(CarType.CONVERTIBLE),
        },
        crossover: {
            i18n: t('carFilterTypeCrossover', 'Crossover'),
            value: listingsParams?.carType?.includes(CarType.CROSSOVER),
        },
        mpv: { i18n: t('carFilterTypeMPV', 'MPV'), value: listingsParams?.carType?.includes(CarType.MPV) },
        hatchback: {
            i18n: t('carFilterTypeHatchback', 'Hatchback'),
            value: listingsParams?.carType?.includes(CarType.HATCHBACK),
        },
        sedan: { i18n: t('carFilterTypeSedan', 'Sedan'), value: listingsParams?.carType?.includes(CarType.SEDAN) },
        station_wagon: {
            i18n: t('carFilterTypeStationWagon', 'Station wagon'),
            value: listingsParams?.carType?.includes(CarType.STATION_WAGON),
        },
        suv: { i18n: t('carFilterTypeSUV', 'SUV'), value: listingsParams?.carType?.includes(CarType.SUV) },
    })

    const stepSize = 200

    const { getTrackProps, segments, handles } = useRanger({
        min: citySettings?.minSearchPrice || 0,
        max: citySettings?.maxSearchPrice || 3200,
        values: rangerValues,
        stepSize: stepSize,
        onChange: throttle(setRangerValues, 1000),
    })

    const {
        getTrackProps: seatsGetTrackProps,
        segments: seatsSegments,
        handles: seatsHandles,
    } = useRanger({
        min: 2,
        max: 10,
        values: seatsRangerValues,
        stepSize: 1,
        onChange: throttle(setSeatsRangerValues, 1000),
    })

    const submitFilterToGA = (filterParams) => {
        const { carSize, carType, minPrice, maxPrice } = filterParams
        // price
        if (minPrice && maxPrice) {
            trackEvent({
                action: 'Filters-price',
                category: 'BrowseDR',
                value: `${minPrice}-${maxPrice}`,
            })
        }
        // type
        if (carType) {
            trackEvent({
                action: 'Filters-type',
                category: 'BrowseDR',
                value: `${carType.toString()}`,
            })
        }
        // size
        if (carSize) {
            trackEvent({
                action: 'Filters-size',
                category: 'BrowseDR',
                value: `${carSize.toString()}`,
            })
        }
    }

    const handleApplyFilters = () => {
        const filteredCarTypeFilter = Object.keys(carTypeFilter).filter((key) => carTypeFilter[key].value === true)
        const filteredQuery: any = {
            ...query,
            carType: filteredCarTypeFilter.length > 0 ? filteredCarTypeFilter : null,
            minSeats: seatsRangerValues[0],
            maxSeats: seatsRangerValues[1],
            minPrice: rangerValues[0] === 0 ? 1 : rangerValues[0],
            maxPrice: rangerValues[1],
        }
        const { city: _, ...filteredQueryWithoutCity } = filteredQuery
        // const queryString = qs.stringify(filteredQueryWithoutCity, {
        //     arrayFormat: 'none',
        //     skipNull: true,
        //     encode: false,
        // })

        submitFilterToGA(filteredQueryWithoutCity)
        push({ query: filteredQuery })
        setModal(false)
    }

    return (
        <Modal wrapperComponent={ModalWrapper} setModal={setModal}>
            <ModalHeader>
                <HyperLink>{t('filterModal.header', 'Filters')}</HyperLink>
                <CloseModal onClick={() => setModal(false)}>
                    <Cross />
                </CloseModal>
            </ModalHeader>
            <ModalBody>
                <FilterHeadline2>{t('carFilterPriceFilterHeadline', 'Daily Price')}</FilterHeadline2>
                <RangeSelector>
                    <Track {...getTrackProps()}>
                        {segments.map(({ getSegmentProps }, i) => (
                            <Segment {...getSegmentProps()} index={i} />
                        ))}
                        {handles.map(({ value, active, getHandleProps }) => {
                            const shownValue = value === 0 ? 1 : value
                            const currency = citySettings?.currency || Currency.AED
                            const handleValues = { ...getHandleProps() }
                            const minChanged = handleValues['aria-valuemin'] + stepSize < rangerValues[0] ? true : false
                            const maxChanged = handleValues['aria-valuemax'] - stepSize > rangerValues[1] ? true : false
                            return (
                                <React.Fragment key={handleValues.key}>
                                    <HandleNumberFix first={handleValues.key === 0}>
                                        {`${value} ${currency}`}
                                    </HandleNumberFix>
                                    <span>-</span>
                                    <button
                                        {...getHandleProps({
                                            style: {
                                                appearance: 'none',
                                                border: 'none',
                                                background: 'transparent',
                                                outline: 'none',
                                            },
                                        })}
                                        data-cy={`${value === rangerValues[1] ? 'first' : 'last'}-price-handle`}
                                    >
                                        <Handle active={active} />
                                    </button>
                                </React.Fragment>
                            )
                        })}
                    </Track>
                </RangeSelector>
                <TypeSelector>
                    <FilterHeadline2>{t('carFilterTypeHeadline', 'Car Type')}</FilterHeadline2>
                    {Object.entries(carTypeFilter).map(([key, value]: any) => {
                        return (
                            <Checkbox
                                cypressData={`filter-cartype-${key}`}
                                key={key}
                                value={value.value}
                                onChange={(e) => {
                                    carTypeDispatch({ type: 'input', name: key, value: e.target.checked })
                                }}
                            >
                                {value.i18n}
                            </Checkbox>
                        )
                    })}
                </TypeSelector>
                <TypeSelector>
                    <FilterHeadline2>{t('carFilterSizeHeadline', 'Size (person)')}</FilterHeadline2>
                    <RangeSelector marginTop="1rem">
                        <Track {...seatsGetTrackProps()}>
                            {seatsSegments.map(({ getSegmentProps }, i) => (
                                <Segment {...getSegmentProps()} index={i} />
                            ))}
                            {seatsHandles.map(({ value, active, getHandleProps }) => {
                                const shownValue = value === 0 ? 1 : value
                                const text = 'p'
                                const handleValues = { ...getHandleProps() }
                                const minChanged =
                                    handleValues['aria-valuemin'] + stepSize < seatsRangerValues[0] ? true : false
                                const maxChanged =
                                    handleValues['aria-valuemax'] - stepSize > seatsRangerValues[1] ? true : false
                                return (
                                    <React.Fragment key={handleValues.key}>
                                        <HandleNumberFix first={handleValues.key === 0}>
                                            {`${value} ${text}`}
                                        </HandleNumberFix>
                                        <button
                                            {...getHandleProps({
                                                style: {
                                                    appearance: 'none',
                                                    border: 'none',
                                                    background: 'transparent',
                                                    outline: 'none',
                                                },
                                            })}
                                            data-cy={`${
                                                value === seatsRangerValues[0] ? 'first' : 'last'
                                            }-price-handle`}
                                        >
                                            <Handle active={active} />
                                        </button>
                                    </React.Fragment>
                                )
                            })}
                        </Track>
                    </RangeSelector>
                </TypeSelector>
            </ModalBody>
            <ApplyButtonContainer>
                <ApplyButton data-cy="apply-filter-button" onClick={handleApplyFilters}>
                    {t('carFiltersApplyFilter', 'Apply filters')}
                </ApplyButton>
            </ApplyButtonContainer>
        </Modal>
    )
}

const FilterHeadline2 = styled(Headline2)`
    margin: 0;
`

const RangeSelector = styled.div<{ marginTop?: string }>`
    margin-top: ${({ marginTop = '3.5rem' }) => marginTop};
`
const ModalBody = styled.div`
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: start;
    padding: 1.5rem;
    overflow-x: auto;
    max-height: calc(100vh - 200px);
`
const ModalWrapper = styled.div`
    z-index: 50;
    inset: 0;
    background: white;
    padding-bottom: 5rem;
`

const ModalHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 1.5rem;
    border-bottom: 0.5px solid rgba(0, 0, 0, 0.1);
    position: fixed;
    top: 0;
    z-index: 50;
    background: white;
    width: calc(100% - 3rem);
`
const CloseModal = styled.div`
    display: flex;
    align-items: center;
`

export const Track = styled('div')`
    display: inline-block;
    height: 16px;
    width: 90%;
    margin: 0 5%;
`

export const TickLabel = styled('div')`
    position: absolute;
    font-size: 5rem;
    color: rgba(0, 0, 0, 0.5);
    top: 100%;
    transform: translate(-50%, 1.2rem);
    white-space: nowrap;
`

export const Segment = styled('div')`
    box-shadow: inset 0px 2px 5px rgba(0, 0, 0, 0.05);
    border-radius: 40px;
    background-color: #ff5a5a;
    background: ${(props: any) => (props.index === 0 ? '#f2f2f2' : props.index === 1 ? '#ff5a5a' : '#f2f2f2')};
    height: 100%;
`

const HandleNumberFix = styled.div<{ first: boolean }>`
    white-space: nowrap;
    display: flex;
    font-weight: 700;
    position: absolute;
    top: -2rem;
    color: #ff5a5a;
    margin: 0;
    ${({ first }) => first && `left: 0;`};
    ${({ first }) => !first && `right: 0;`};
`
const HandleNumber = styled.div<{ last: boolean; isFirstMoved: boolean; isLastMoved: boolean; dragged: boolean }>`
    ${(props) => (props.last && !props.dragged ? `right: 0;` : `left:0;`)};
    white-space: nowrap;
    display: flex;
    font-weight: 700;
    position: absolute;
    top: -2rem;
    color: #ff5a5a;
    margin: 0;
    ${(props) => !props.last && !props.dragged && props.isFirstMoved && `left: -2rem;`};
    ${(props) => props.last && !props.dragged && props.isLastMoved && `right: -2rem;`};
    ${(props) => props.dragged && `left: 0; right: 0;`};
`

export const Handle = styled('div')<{ active: boolean }>`
    background-color: #f1f5f7;
    border: none;
    border-radius: 50%;
    box-shadow: 0px 4px 4px rgba(171, 62, 62, 0.3), 0px 5px 14px rgba(255, 90, 90, 0.2), 0px 2px 3px rgba(0, 0, 0, 0.15);
    cursor: pointer;
    height: 20px;
    width: 20px;
    pointer-events: all;
    position: relative;
`

const ApplyButton = styled.div`
    background: #ff5a5a;
    font-weight: bold;
    font-size: 16px;
    line-height: 22px;
    text-align: center;
    color: #ffffff;
    width: 100%;
    padding: 1rem 0;
    border-radius: 100px;
`

const ApplyButtonContainer = styled.div`
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    width: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
`

const TypeSelector = styled.div`
    margin-top: 2rem;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
`
