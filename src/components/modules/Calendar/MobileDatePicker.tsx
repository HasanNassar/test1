import { CalendarIcon } from '@components/global/icons/Calendar'
import { useDatePicker } from '@contexts/datepicker'
import { MonthType } from '@datepicker-react/hooks'
import { format } from 'date-fns'
import { ar } from 'date-fns/locale'
import { useTranslation } from 'next-i18next'
import { createRef, useEffect } from 'react'
import styled from 'styled-components'
import { Cross } from '../../global/icons/Cross'
import { Modal } from '../../global/Modal'
import { Month } from './Month'
import { Weekdays } from './Weekdays'
import { useConfig } from '@contexts/config'

export const MobileDatePicker: React.FC = () => {
    const { t } = useTranslation()
    const { lang } = useConfig()
    const { setModal, activeMonths, firstDayOfWeek, endDate, startDate, handleDateSelection, focusedDate } =
        useDatePicker()

    const refs = activeMonths.reduce((acc, value: MonthType) => {
        acc[`${value.year}${value.month}`] = createRef()
        return acc
    }, {})

    useEffect(() => {
        setTimeout(() => {
            const year = focusedDate?.getFullYear()
            const month = focusedDate?.getMonth()
            if (year && month) refs[`${year}${month}`].current?.scrollIntoView()
        }, 10)
    }, [])

    return (
        <Modal setModal={setModal} wrapperComponent={ModalContainer}>
            <MobileView>
                <FlexLabel>
                    <Label>{t('datepicker.mobileLabel', 'Set start and end date')}</Label>
                    <PrevButton
                        onClick={() => {
                            setModal(false)
                        }}
                    >
                        <Cross />
                    </PrevButton>
                </FlexLabel>
                <Weekdays year={activeMonths[0].year} month={activeMonths[0].month} firstDayOfWeek={firstDayOfWeek} />
                <MonthWrapper>
                    {activeMonths.map((month) => (
                        <Month
                            key={`${month.year}-${month.month}`}
                            ref={refs[`${month.year}${month.month}`]}
                            year={month.year}
                            month={month.month}
                            firstDayOfWeek={firstDayOfWeek}
                            showWeekdays={false}
                            isCenterLabel={false}
                        />
                    ))}
                </MonthWrapper>
                <SelectDateWrapper>
                    <CalendarIconWrapper>
                        <div className={'m-end-5'}>
                            <CalendarIcon doubleDots={startDate && endDate ? true : false} />
                        </div>
                        {lang === 'ar' ? (
                            <SelectedDatesLabel>
                                {startDate ? format(startDate, 'ccc، dd MMM', { locale: ar }) + ' - ' : '? - '}
                                {endDate ? format(endDate, 'ccc، dd MMM', { locale: ar }) : '?'}
                            </SelectedDatesLabel>
                        ) : (
                            <SelectedDatesLabel>
                                {startDate ? format(startDate, 'ccc, MMM dd') + ' - ' : '? - '}
                                {endDate ? format(endDate, 'ccc, MMM dd') : '?'}
                            </SelectedDatesLabel>
                        )}
                    </CalendarIconWrapper>

                    <SelectDatesButton
                        disabled={!(startDate && endDate)}
                        onClick={() => {
                            handleDateSelection()
                        }}
                        data-cy="select"
                        isEnabled={!!startDate && !!endDate}
                    >
                        {t('datepicker.mobileSelectDates', 'Select these dates')}
                    </SelectDatesButton>
                </SelectDateWrapper>
            </MobileView>
        </Modal>
    )
}

const Label = styled.label`
    font-style: normal;
    font-weight: bold;
    font-size: 16px;

    color: rgba(0, 0, 0, 0.8);
`

const MobileView = styled.div`
    display: flex;
    flex-direction: column;
    background: white;
    overflow: hidden;
    width: 100%;
    height: calc(100vh - var(--navMobileHeight));
    @media (min-width: 1240px) {
        display: none;
    }
`

const FlexLabel = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 24px;
`

const MonthWrapper = styled.div`
    overflow: auto;
    display: flex;
    flex-direction: column;
    padding-top: 2rem;
    padding-bottom: 3rem;
    gap: 30px;
    margin-bottom: 140px;
`
const SelectDateWrapper = styled.div`
    background: white;
    position: fixed;
    bottom: 0;
    height: 92px;
    width: calc(100% - 48px);
    padding: 24px 24px;
    filter: drop-shadow(0px -2px 16px rgba(0, 0, 0, 0.08));
`

const CalendarIconWrapper = styled.div`
    display: flex;
    justify-content: center;
    gap: 5px;
`
const SelectedDatesLabel = styled.div`
    text-align: center;
    font-style: normal;
    font-weight: bold;
    font-size: 16px;
    line-height: 22px;
    /* identical to box height */

    color: #000000;
`
const SelectDatesButton = styled.button<{ isEnabled: boolean }>`
    height: 54px;
    width: 100%;
    margin-top: 16px;
    background: ${(props) => (props.isEnabled ? `#ff5a5a` : `rgba(0, 0, 0, 0.1)`)};
    border-radius: 100px;
    border: none;
    color: white;
    font-style: normal;
    font-weight: bold;
    font-size: 16px;
    line-height: 22px;
`

const PrevButton = styled.button`
    background: none;
    border: none;
    height: 15px;
`

const ModalContainer = styled.div`
    z-index: 19;
    bottom: 0;
    left: 0;
    right: 0;
`
