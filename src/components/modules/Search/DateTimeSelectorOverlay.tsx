import { SelectedDate } from '@service/payment.types'
import { format, setHours, setMinutes } from 'date-fns'
import { useTranslation } from 'next-i18next'
import { FC, useEffect, useState } from 'react'
import styled from 'styled-components'
import { useSearch } from '../../../contexts/search'
import { Headline2, Headline3, HyperLink } from '../../../util/typography'
import { CalendarIcon } from '../../global/icons/Calendar'
import { ClockIcon } from '../../global/icons/Clock'
import { Cross } from '../../global/icons/Cross'
import { TimeSelector } from '../../global/TimeSelectorModal'
import Datepicker from '../Calendar/Datepicker'
import { TimeselectorTypes } from '../DatetimeSelector/DateTimeSelector'
import { useConfig } from '@contexts/config'
import { ar } from 'date-fns/locale'

export const DateTimeSelectorOverlay: FC<{ isOpen?: boolean; selectedDate?: any }> = ({ isOpen, selectedDate }) => {
    const { lang } = useConfig()
    const { t } = useTranslation()
    const { datePickerOverlay, setDatepickerOverlay } = useSearch()
    const [calendarModal, setCalendarModal] = useState(false)
    const [specTime, setSpecTime] = useState<TimeselectorTypes | null>(null)
    const { fromDate, toDate, toTime, fromTime } = useSearch()

    const handleCalendarModalClick = () => {
        if (calendarModal === false) setCalendarModal(true)
        else return
    }

    const createFromDate = () => {
        return fromDate && fromTime
            ? setMinutes(setHours(fromDate, fromTime.getHours()), fromTime.getMinutes())
            : new Date()
    }
    const createToDate = () => {
        return toDate && toTime ? setMinutes(setHours(toDate, toTime.getHours()), toTime.getMinutes()) : new Date()
    }

    const collectDate = () => {
        const dateData: SelectedDate = {
            from: createFromDate(),
            to: createToDate(),
        }
        selectedDate(dateData)
    }

    useEffect(() => {
        if (selectedDate) {
            collectDate()
        }
    }, [fromDate, toDate, toTime, fromTime])

    return datePickerOverlay ? (
        <SelectorWrapper>
            <HeadlineContainer>
                <HyperLink>{t('dateTimeSelectorOverlay.label', 'Edit time')}</HyperLink>
                <div onClick={() => setDatepickerOverlay(false)} data-cy="close-time-selector">
                    <Cross />
                </div>
            </HeadlineContainer>
            <Flex>
                <div>
                    <InputWithLabelAndIcon>
                        <Label>{t('dateTimeSelector.from', 'from')}</Label>

                        <InputButton data-cy="fromDate" onClick={handleCalendarModalClick}>
                            {lang === 'ar' ? (
                                <p className={'dateTimeSelectorSpan'} style={{ whiteSpace: 'nowrap' }}>
                                    {format(fromDate || new Date(), 'EEE، d MMM', { locale: ar })}
                                </p>
                            ) : (
                                <p style={{ whiteSpace: 'nowrap' }}>{format(fromDate || new Date(), 'EEE, MMM d')}</p>
                            )}
                            <span>
                                <CalendarIcon color={'var(--primaryColor)'} />
                            </span>
                        </InputButton>
                    </InputWithLabelAndIcon>
                    <InputWithLabelAndIcon>
                        <InputButton
                            data-cy="fromTime"
                            onClick={() => {
                                setSpecTime(TimeselectorTypes.from)
                            }}
                            fontWeight={400}
                        >
                            <p style={{ whiteSpace: 'nowrap' }}>{fromTime ? format(fromTime, 'HH:mm') : ''}</p>
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
                                <p className={'dateTimeSelectorSpan'} style={{ whiteSpace: 'nowrap' }}>
                                    {format(toDate || new Date(), 'EEE، d MMM', { locale: ar })}
                                </p>
                            ) : (
                                <p style={{ whiteSpace: 'nowrap' }}>{format(toDate || new Date(), 'EEE, MMM d')}</p>
                            )}
                            <span>
                                <CalendarIcon color={'var(--primaryColor)'} />
                            </span>
                        </InputButton>
                    </InputWithLabelAndIcon>
                    <InputWithLabelAndIcon>
                        <InputButton
                            data-cy="toTime"
                            onClick={() => {
                                setSpecTime(TimeselectorTypes.to)
                            }}
                            fontWeight={400}
                        >
                            <p style={{ whiteSpace: 'nowrap' }}>{toTime ? format(toTime, 'HH:mm') : ''}</p>
                            <span>
                                <ClockIcon />
                            </span>
                        </InputButton>
                    </InputWithLabelAndIcon>
                </div>
            </Flex>
            {calendarModal && <Datepicker setTimeModal={setCalendarModal} />}
            {specTime && <TimeSelector specTime={specTime} setTimeModal={() => setSpecTime(null)} />}
        </SelectorWrapper>
    ) : null
}

const HeadlineContainer = styled.div`
    display: flex;
    padding: 0.5rem 2rem;
    align-items: center;
    justify-content: space-between;
`

const SelectorWrapper = styled.div`
    margin-top: var(--navMobileHeight);
    position: fixed;
    width: 100%;
    top: 0;
    z-index: 16;
    background: var(--white);
    box-shadow: 0px 2px 20px rgba(0, 0, 0, 0.08);
    border-radius: 0px 0px 16px 16px;
    padding-bottom: 12px;
`

const Flex = styled.div`
    display: flex;
    justify-content: center;
    gap: 1rem;
    padding: 0 2rem;

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
    width: 100%;
    display: flex;
    padding: 0 1rem;
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
