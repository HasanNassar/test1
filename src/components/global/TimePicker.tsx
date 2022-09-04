import styled from 'styled-components'
import { CalendarIcon } from '@global/icons/Calendar'
import { Pencil } from '@global/icons/Pencil'
import { useSearch } from '../../contexts/search'
import { format } from 'date-fns'
import { FC } from 'react'
import { trackEvent } from '@util/ga'
import { useConfig } from '@contexts/config'
import { ar } from 'date-fns/locale'

const TimePickerWrapper = styled.div<{ scrolled?: boolean }>`
    background: white;
    box-shadow: 0px 2px 20px 0px rgba(0, 0, 0, 0.08);
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

export const TimePicker: FC<{ isScrolled?: boolean }> = ({ isScrolled }) => {
    const { lang } = useConfig()
    const { setDatepickerOverlay, fromDate, fromTime, toDate, toTime } = useSearch()

    return (
        <TimePickerWrapper scrolled={isScrolled}>
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
                    <TimeText>{fromTime ? format(fromTime, 'HH:mm') : '0:00'}</TimeText>
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
                    <TimeText>{toTime ? format(toTime, 'HH:mm') : '0:00'}</TimeText>
                </div>
            </TimeContainer>
            <div
                onClick={() => {
                    setDatepickerOverlay(true)
                    trackEvent({
                        action: 'Datetime-open',
                        category: 'Car-detailsDR',
                        label: 'Car-details',
                    })
                }}
                data-cy="select-dates"
            >
                <Pencil color="#FF5A5A" />
            </div>
        </TimePickerWrapper>
    )
}
