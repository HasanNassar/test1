import { FirstDayOfWeek, useMonth } from '@datepicker-react/hooks'
import Day from './Day'
import styled from 'styled-components'
import { isSameDay } from 'date-fns'
import { useDatePicker } from '@contexts/datepicker'
import { forwardRef, Ref } from 'react'

const Wrapper = styled.div`
    flex-grow: 1;
`
const Flex = styled.div`
    display: flex;

    justify-content: space-between;
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 19px;
    text-align: center;
    padding: 24px 24px 12px 24px;

    border-bottom: 0.5px solid rgba(0, 0, 0, 0.1);
    color: rgba(0, 0, 0, 0.6);
`

const Label = styled.div<{ isCenter: boolean }>`
    display: flex;
    justify-content: ${(props) => (props.isCenter ? `center` : `left`)};
    padding-left: ${(props) => (props.isCenter ? `0` : `24px`)};
    font-style: normal;
    gap: 5px;
    font-size: 24px;
    color: #000000;
    margin-bottom: 0.5rem;
`

const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    row-gap: 20px;
`

export const Month = forwardRef<
    HTMLDivElement,
    {
        year: number
        month: number
        firstDayOfWeek: FirstDayOfWeek | undefined
        showWeekdays: boolean
        isCenterLabel: boolean
    }
>(({ year, month, firstDayOfWeek, showWeekdays, isCenterLabel }, ref) => {
    const { startDate, endDate } = useDatePicker()

    const { days, weekdayLabels, monthLabel } = useMonth({
        year,
        month,
        firstDayOfWeek,
    })

    return (
        <Wrapper ref={ref}>
            <Label className={'datepickerTitle'} isCenter={isCenterLabel}>
                <strong>{monthLabel.split(' ')[0]}</strong>
                {monthLabel.split(' ')[1]}
            </Label>

            {showWeekdays && (
                <Flex>
                    {weekdayLabels.map((dayLabel) => (
                        <div key={dayLabel}>{dayLabel.charAt(0)}</div>
                    ))}
                </Flex>
            )}
            <Grid>
                {days.map((day, index) => {
                    if (typeof day === 'object') {
                        return (
                            <Day
                                date={day.date}
                                key={day.date.toString()}
                                dayLabel={day.dayLabel.replace(/(^|-)0+/g, '$1')}
                                isFirstSelected={isSameDay(day.date, startDate as Date)}
                                isLastSelected={isSameDay(day.date, endDate as Date)}
                                hasLastSelected={!!endDate}
                                dataCy={monthLabel.split(' ')[0] + day.dayLabel}
                                sameDaySelected={undefined}
                            />
                        )
                    }

                    return <div key={index} />
                })}
            </Grid>
        </Wrapper>
    )
})
