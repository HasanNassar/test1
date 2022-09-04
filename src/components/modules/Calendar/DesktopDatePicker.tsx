import { useDatePicker } from '@contexts/datepicker'
import { OnDatesChangeProps, START_DATE, useDatepicker } from '@datepicker-react/hooks'
import { add } from 'date-fns'
import { useTranslation } from 'next-i18next'
import { Dispatch, SetStateAction, useRef } from 'react'
import styled from 'styled-components'
import { useClickOutside } from '../../../hooks/clickOutside'
import { device } from '../../../util/responsive'
import { CalendarNext } from '../../global/icons/CalendarNext'
import { Month } from './Month'

export const DestopDatepicker: React.FC = () => {
    const { t } = useTranslation()
    const {
        setModal,
        activeMonths,
        firstDayOfWeek,
        goToNextMonths,
        goToPreviousMonths,
        endDate,
        startDate,
        handleDateSelection,
    } = useDatePicker()

    const pickerRef = useRef(null)
    useClickOutside(pickerRef, () => {
        setModal(false)
    })

    return (
        <DesktopView ref={pickerRef}>
            <Label>{t('datepicker.label', 'Set trip start and end date')}</Label>

            <Flex>
                <PrevButton onClick={goToPreviousMonths}>
                    <CalendarNext isPrevious={true} />
                </PrevButton>
                <NextButton onClick={goToNextMonths}>
                    <CalendarNext />
                </NextButton>

                {activeMonths.map((month) => (
                    <Month
                        key={`${month.year}-${month.month}`}
                        year={month.year}
                        month={month.month}
                        firstDayOfWeek={firstDayOfWeek}
                        showWeekdays={true}
                        isCenterLabel={true}
                    />
                ))}
            </Flex>
        </DesktopView>
    )
}

const PrevButton = styled.button`
    background: none;
    border: none;
    position: absolute;
    top: 6px;
    left: 10px;
`
const NextButton = styled.button`
    background: none;
    border: none;
    position: absolute;
    top: 6px;
    right: 10px;
`
const Flex = styled.div`
    display: flex;
    position: relative;
    flex-direction: row;
    gap: 30px;
`

const DesktopView = styled.div`
    display: none;

    @media ${device.laptop} {
        position: absolute;
        z-index: 50;
        display: flex;
        flex-direction: column;
        bottom: -310px;
        background: white;
        border-radius: 16px;
        width: 792px;
        padding: 24px;
        filter: drop-shadow(0px 2px 20px rgba(0, 0, 0, 0.08));
    }
`

const Label = styled.label`
    font-style: normal;
    font-weight: bold;
    font-size: 16px;
    margin-bottom: 2rem;
    color: rgba(0, 0, 0, 0.8);
`
