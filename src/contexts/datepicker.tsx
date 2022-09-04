import { FirstDayOfWeek, MonthType, START_DATE, useDatepicker } from '@datepicker-react/hooks'
import { trackEvent } from '@util/ga'
import { add, addDays, eachMonthOfInterval, format } from 'date-fns'
import { useRouter } from 'next/router'
import { createContext, FC, ReactNode, useContext, useState } from 'react'
import { useSearch } from './search'

type DatePickerContextType = {
    focusedDate: Date | null
    isDateFocused: (date: Date) => boolean
    isDateSelected: (date: Date) => boolean
    isDateHovered: (date: Date) => boolean
    isDateBlocked: (date: Date) => boolean
    isFirstOrLastSelectedDate: (date: Date) => boolean
    onDateFocus: (date: Date) => void
    onDateHover: (date: Date) => void
    onDateSelect: (date: Date) => void
    setModal: any
    activeMonths: MonthType[]
    firstDayOfWeek: FirstDayOfWeek
    handleDateSelection: () => void
    startDate: Date | null
    endDate: Date | null
    focusedInput: 'startDate' | 'endDate' | null
    goToNextMonths: () => void
    goToPreviousMonths: () => void
}

const DatePickerContext = createContext<DatePickerContextType>({} as DatePickerContextType)

export const DatePickerProvider: FC<{ setModal: any; children: ReactNode }> = ({ children, setModal }) => {
    const { fromDate, toDate, setFromDate, setToDate, minRentalPeriod } = useSearch()
    const router = useRouter()
    const routeBaseObject = router.asPath.split('?')
    const routeBasePath = routeBaseObject && routeBaseObject[0].slice(1, -1).split('/')
    // Base/Home route
    let baseGALabel = 'Home'
    let baseGACategory = 'HomeDR'
    // cars main route
    if (routeBasePath.length === 2 && routeBasePath[1] === 'cars') {
        baseGALabel = 'Browse'
        baseGACategory = 'BrowseDR'
    }
    // cars listingID route
    if (routeBasePath.length === 3 && routeBasePath[1] === 'cars') {
        baseGALabel = 'Car-details'
        baseGACategory = 'Car-detailsDR'
    }

    const handleDateChange = (data): void => {
        const { startDate, endDate, focusedInput } = data
        sendToGtagStart(data)
        if (!focusedInput) {
            /*
            if (differenceInCalendarDays(endDate, startDate) <= minRentalPeriod) {
                return
            }
            */
            setEndDate(endDate)
            setStartDate(startDate)
            setFocusedInput(START_DATE)
        } else {
            setStartDate(startDate)
            setEndDate(null)
            setFocusedInput(focusedInput)
        }
    }

    const handleDateSelection = () => {
        setFromDate(startDate)
        setToDate(endDate)
        setModal(false)
        sendToGtagEnd()
    }

    const sendToGtagStart = (data) => {
        if (focusedInput === START_DATE && data.startDate) {
            trackEvent({
                action: 'From-date-start',
                category: baseGACategory,
                label: baseGALabel,
                value: format(data.startDate, 'MMM dd'),
            })
        } else if (data.endDate) {
            trackEvent({
                action: 'End-date-start',
                category: baseGACategory,
                label: baseGALabel,
                value: format(data.endDate, 'MMM dd'),
            })
        }
    }

    const sendToGtagEnd = () => {
        if (startDate) {
            trackEvent({
                action: 'From-date-finish',
                category: baseGACategory,
                label: baseGALabel,
                value: format(startDate, 'MMM dd'),
            })
        }
        if (endDate) {
            trackEvent({
                action: 'End-date-finish',
                category: baseGACategory,
                label: baseGALabel,
                value: format(endDate, 'MMM dd'),
            })
        }
    }

    const [startDate, setStartDate] = useState<Date | null>(fromDate)
    const [endDate, setEndDate] = useState<Date | null>(toDate)
    const [focusedInput, setFocusedInput] = useState<'startDate' | 'endDate' | null>(START_DATE)

    const {
        firstDayOfWeek,
        // activeMonths,
        isDateSelected,
        isDateHovered,
        isFirstOrLastSelectedDate,
        isDateBlocked,
        isDateFocused,
        focusedDate,
        onDateHover,
        onDateSelect,
        onDateFocus,
        goToNextMonths,
        goToPreviousMonths,
    } = useDatepicker({
        startDate,
        endDate,
        focusedInput,
        onDatesChange: handleDateChange,
        numberOfMonths: 7,
        changeActiveMonthOnSelect: false,
        maxBookingDate: add(new Date(), { days: 180 }),
        minBookingDate: add(new Date(), { days: 1 }),
        firstDayOfWeek: 0,
        minBookingDays: minRentalPeriod,
    })

    const now = new Date()
    const activeMonths = eachMonthOfInterval({
        start: now,
        end: addDays(now, 180),
    }).map((date) => ({ date, month: date.getMonth(), year: date.getFullYear() }))

    return (
        <DatePickerContext.Provider
            value={{
                firstDayOfWeek,
                activeMonths,
                isDateSelected,
                isDateHovered,
                isFirstOrLastSelectedDate,
                isDateBlocked,
                isDateFocused,
                focusedDate,
                onDateHover,
                onDateSelect,
                onDateFocus,
                handleDateSelection,
                setModal,
                startDate,
                endDate,
                focusedInput,
                goToNextMonths,
                goToPreviousMonths,
            }}
        >
            {children}
        </DatePickerContext.Provider>
    )
}

export const useDatePicker = (): DatePickerContextType => useContext(DatePickerContext)
