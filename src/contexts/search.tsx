import { addDays, addMinutes, format, parse } from 'date-fns'
import { useState, createContext, useContext, Dispatch, SetStateAction, useEffect, useReducer, ReactNode } from 'react'
import { CitySettingsResponse } from '@service/configuration.types'
import { useConfig } from './config'
import { defaultCityCode, nextDayDeliveryLimits } from '@util/config'
import { useRouter } from 'next/router'

type SearchContextTypes = {
    minRentalPeriod: number

    // Date part
    fromDate: Date | null
    toDate: Date | null
    setFromDate: Dispatch<SetStateAction<Date | null>>
    setToDate: Dispatch<SetStateAction<Date | null>>

    // Time part
    fromTime: Date | null
    toTime: Date | null
    setFromTime: Dispatch<SetStateAction<Date | null>>
    setToTime: Dispatch<SetStateAction<Date | null>>

    page: number
    setPage: Dispatch<SetStateAction<number>>
    pageSize: number
    setPageSize: Dispatch<SetStateAction<number>>

    cityCode: string
    setCityCode: Dispatch<SetStateAction<string>>

    timeOptions: Date[]

    datePickerOverlay: boolean
    setDatepickerOverlay: Dispatch<SetStateAction<boolean>>

    address: AddressState
    addressDispatch: Dispatch<AddressAction>

    polygon: any

    redirectUrl: string | undefined
    setRedirectUrl: Dispatch<SetStateAction<string | undefined>>

    citySettings: CitySettingsResponse | undefined
}

export type Address = {
    addressLine1: string
    addressLine2: string
    city: string
    region: string
    zipCode: string
    country: string
    latitude: string
    longitude: string
}

export const SearchContext = createContext<SearchContextTypes | null>(null)

export const SearchProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { query } = useRouter()
    const { from, to } = query
    const now = new Date()
    const { citySettings } = useConfig()
    const [minRentalPeriod, setMinRentalPeriod] = useState(1)

    const defaultFromDate = from && new Date(from as string)
    const defaultToDate = to && new Date(to as string)

    // Date part
    const [fromDate, setFromDate] = useState<Date | null>(defaultFromDate || addDays(now, 1))
    const [toDate, setToDate] = useState<Date | null>(defaultToDate || addDays(now, 2))

    const [polygon, setPolygon] = useState<any>(null)
    // Time part
    const [fromTime, setFromTime] = useState<Date | null>(null)
    const [toTime, setToTime] = useState<Date | null>(null)
    const [timeOptions, setTimeOptions] = useState<Date[]>([])

    const [page, setPage] = useState(0)
    const [pageSize, setPageSize] = useState(10)
    const [cityCode, setCityCode] = useState(citySettings?.cityCode || defaultCityCode)

    const [datePickerOverlay, setDatepickerOverlay] = useState<boolean>(false)
    const [redirectUrl, setRedirectUrl] = useState<string | undefined>()

    const currentDate = now.getDate()
    const currentHours = now.getHours()
    const selectedFromDate = fromDate?.getDate()

    useEffect(() => {
        const getCitySettings = async () => {
            if (citySettings) {
                const defaultFromTime = from && format(new Date(from as string), 'HH:mm:ss')
                const defaultToTime = to && format(new Date(to as string), 'HH:mm:ss')

                setMinRentalPeriod(citySettings?.minRentalPeriod ?? 1)
                // Default from and to time
                setFromTime(
                    parse(
                        currentDate + 1 === selectedFromDate
                            ? currentHours <= nextDayDeliveryLimits.todayCurrentHoursLimit
                                ? defaultFromTime || citySettings?.businessHours.MONDAY.start
                                : '12:00:00'
                            : (defaultFromTime || citySettings?.businessHours.MONDAY.start) ?? '',
                        'HH:mm:ss',
                        now,
                    ),
                )
                setToTime(parse((defaultToTime || citySettings?.businessHours.MONDAY.start) ?? '', 'HH:mm:ss', now))
                // Creating time options - we take here the monday business hours
                setPolygon(citySettings?.businessZone)
                if (citySettings?.businessHours.MONDAY.start && citySettings?.businessHours.MONDAY.end) {
                    const a: Date[] = []
                    for (
                        let d = parse(citySettings?.businessHours.MONDAY.start, 'HH:mm:ss', now);
                        d <= parse(citySettings?.businessHours.MONDAY.end, 'HH:mm:ss', now);
                        d = addMinutes(d, 30)
                    ) {
                        a.push(new Date(d))
                    }
                    setTimeOptions(a)
                }
            }
        }
        getCitySettings()
    }, [citySettings])

    const [address, addressDispatch] = useReducer(addressReducer, {
        handoverAddress: null,
        handbackAddress: null,
    })

    return (
        <SearchContext.Provider
            value={{
                minRentalPeriod,
                fromDate,
                toDate,
                setFromDate,
                setToDate,
                fromTime,
                toTime,
                setFromTime,
                setToTime,
                page,
                setPage,
                pageSize,
                setPageSize,
                cityCode,
                setCityCode,
                timeOptions,
                datePickerOverlay,
                setDatepickerOverlay,
                address,
                addressDispatch,
                polygon,
                redirectUrl,
                setRedirectUrl,
                citySettings,
            }}
        >
            {children}
        </SearchContext.Provider>
    )
}

export const useSearch = (): SearchContextTypes => useContext(SearchContext) as SearchContextTypes

export enum AddressType {
    HANDOVER_ADDRESS = 'handoverAddress',
    HANDBACK_ADDRESS = 'handbackAddress',
    TEMPORARY_HANDOVER_ADDRESS = 'handoverAddressTemporary',
    TEMPORARY_HANDBACK_ADDRESS = 'handbackAddressTemporary',
}

type AddressState = {
    handoverAddress?: Address | null
    handbackAddress?: Address | null
    handoverAddressTemporary?: Address | null
    handbackAddressTemporary?: Address | null
}

export enum AddressActionKind {
    INPUT = 'input',
    RESET = 'reset',
    COPY = 'copy',
    REPLACE = 'replace',
}

export type AddressAction =
    | {
          type: AddressActionKind.COPY
          reverse?: boolean
      }
    | {
          type: AddressActionKind.RESET
      }
    | {
          type: AddressActionKind.REPLACE
          value: any
          name: keyof AddressState | AddressType.HANDOVER_ADDRESS | AddressType.HANDBACK_ADDRESS
      }

const addressReducer = (state: AddressState, action: AddressAction): AddressState => {
    if (action.type === AddressActionKind.COPY) {
        if (action.reverse) return { ...state, handoverAddress: state.handbackAddress }
        return { ...state, handbackAddress: state.handoverAddress }
    }
    if (action.type === AddressActionKind.RESET) {
        return { handoverAddress: null, handbackAddress: null }
    }

    if (action.type === AddressActionKind.REPLACE) {
        return { ...state, [action?.name]: action.value }
    }

    return state
}
