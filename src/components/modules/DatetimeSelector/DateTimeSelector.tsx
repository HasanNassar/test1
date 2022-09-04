import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { CalendarIcon } from '@global/icons/Calendar'
import { ClockIcon } from '@global/icons/Clock'
import Datepicker from '../Calendar/Datepicker'
import { TimeSelector } from '@global/TimeSelectorModal'
import Link from 'next/link'
import { useSearch } from '@contexts/search'
import { format } from 'date-fns'
import { useTranslation } from 'next-i18next'
import { nextDayDeliveryLimits } from '@util/config'
import { useConfig } from '@contexts/config'
import { ar } from 'date-fns/locale'

export enum TimeselectorTypes {
    from = 'from',
    to = 'to',
}

export const DateTimeSelector: React.FC = () => {
    const { lang } = useConfig()
    const { t } = useTranslation()
    const [calendarModal, setCalendarModal] = useState(false)
    const [specTime, setSpecTime] = useState<TimeselectorTypes | null>(null)
    const { fromDate, toDate, toTime, fromTime, setFromTime } = useSearch()

    const now = new Date()
    const fromDateDay = fromDate?.getDate()
    const currentDate = now.getDate()
    const currentHours = now.getHours()
    const selectedFromDate = fromDate?.getDate()

    useEffect(() => {
        if (currentDate + 1 === selectedFromDate) {
            const date = new Date(selectedFromDate)
            date.setHours(
                currentHours <= nextDayDeliveryLimits.todayCurrentHoursLimit
                    ? nextDayDeliveryLimits.nextDayBusinessHoursStart
                    : nextDayDeliveryLimits.nextDayNoonHours,
            )
            setFromTime(date)
        }
    }, [fromDateDay])

    const handleCalendarModalClick = () => {
        if (calendarModal === false) setCalendarModal(true)
        else return
    }

    const createFromDate = () => {
        return fromDate && fromTime
            ? new Date(
                  fromDate.getFullYear(),
                  fromDate.getMonth(),
                  fromDate.getDate(),
                  fromTime.getHours(),
                  fromTime.getMinutes(),
                  0,
              )
            : new Date()
    }
    const createToDate = () => {
        return toDate && toTime
            ? new Date(
                  toDate.getFullYear(),
                  toDate.getMonth(),
                  toDate.getDate(),
                  toTime.getHours(),
                  toTime.getMinutes(),
                  0,
              )
            : new Date()
    }

    return (
        <Wrapper>
            <Flex>
                <div>
                    <InputWithLabelAndIcon>
                        <Label>{t('dateTimeSelector.from', 'from')}</Label>

                        <InputButton data-cy="fromDate" onClick={handleCalendarModalClick}>
                            {lang === 'ar' ? (
                                <span style={{ whiteSpace: 'nowrap' }} className={'dateTimeSelectorSpan'}>
                                    {fromDate ? format(fromDate, 'EEE، d MMM', { locale: ar }) : ''}
                                </span>
                            ) : (
                                <span style={{ whiteSpace: 'nowrap' }}>
                                    {fromDate ? format(fromDate, 'EEE, MMM d') : ''}
                                </span>
                            )}
                            <span>
                                <CalendarIcon color={'var(--primaryColor)'} />
                            </span>
                        </InputButton>
                    </InputWithLabelAndIcon>
                    <InputWithLabelAndIcon>
                        <InputButton
                            data-cy="fromTime"
                            fontWeight={400}
                            onClick={() => {
                                setSpecTime(TimeselectorTypes.from)
                            }}
                        >
                            <span style={{ whiteSpace: 'nowrap' }}>{fromTime ? format(fromTime, 'HH:mm') : ''}</span>
                            <span>
                                <ClockIcon />
                            </span>
                        </InputButton>
                    </InputWithLabelAndIcon>
                </div>
                <div>
                    <InputWithLabelAndIcon>
                        <Label>{t('dateTimeSelector.until', 'until')}</Label>
                        <InputButton data-cy="toDate" onClick={handleCalendarModalClick}>
                            {lang === 'ar' ? (
                                <span style={{ whiteSpace: 'nowrap' }} className={'dateTimeSelectorSpan'}>
                                    {toDate ? format(toDate, 'EEE، d MMM', { locale: ar }) : ''}
                                </span>
                            ) : (
                                <span style={{ whiteSpace: 'nowrap' }}>
                                    {toDate ? format(toDate, 'EEE, MMM d') : ''}
                                </span>
                            )}
                            <span>
                                <CalendarIcon color={'var(--primaryColor)'} />
                            </span>
                        </InputButton>
                    </InputWithLabelAndIcon>
                    <InputWithLabelAndIcon>
                        <InputButton
                            data-cy="toTime"
                            fontWeight={400}
                            onClick={() => {
                                setSpecTime(TimeselectorTypes.to)
                            }}
                        >
                            <span style={{ whiteSpace: 'nowrap' }}>{toTime ? format(toTime, 'HH:mm') : ''}</span>
                            <span>
                                <ClockIcon />
                            </span>
                        </InputButton>
                    </InputWithLabelAndIcon>
                </div>
            </Flex>
            <Flex>
                <Link
                    href={{
                        pathname: '/dubai/cars',
                        query: {
                            from: createFromDate().toISOString(),
                            to: createToDate().toISOString(),
                        },
                    }}
                    passHref={true}
                >
                    <Button data-cy="seecars">{t('homePageBrowserButtonText', "Let's see the cars")}</Button>
                </Link>
            </Flex>
            {calendarModal && <Datepicker setTimeModal={setCalendarModal} />}
            {specTime && <TimeSelector specTime={specTime} setTimeModal={() => setSpecTime(null)} />}
        </Wrapper>
    )
}

const Wrapper = styled.div`
    position: relative;
`

const Flex = styled.div`
    display: flex;
    justify-content: center;
    gap: 1rem;

    div {
        flex: 1;
    }
`

const InputWithLabelAndIcon = styled.div`
    width: 100%;
    margin-bottom: 1rem;
    min-width: 120px;
    position: relative;
    display: flex;
    flex-wrap: wrap;
`

const Label = styled.label`
    width: 100%;
    text-transform: uppercase;
    font-weight: 600;
    font-size: 10px;
    color: rgba(0, 0, 0, 0.6);
    line-height: 14px;
    padding-bottom: 8px;
`

const Button = styled.button`
    margin-top: 1.5rem;
    background: #ff5a5a;
    border-radius: 100px;
    border: none;
    width: 100%;
    max-width: 318px;
    height: 56px;
    color: white;
    font-weight: 800;
    font-size: 16px;
`

const InputButton = styled.button<{ fontWeight?: number }>`
    color: var(--primaryTextColor);
    width: 100%;
    height: 48px;
    padding: 0 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: var(--primaryBackgroundColor);

    border: 1px solid transparent;
    border-radius: 4px;

    font-weight: ${(props) => props.fontWeight};
    font-size: 16px;

    svg {
        flex: 1;
    }

    &:focus {
        border: 1px solid red;
        color: #ff5a5a;
    }
`
InputButton.defaultProps = {
    fontWeight: 700,
}
