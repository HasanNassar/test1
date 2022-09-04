import { useDatePicker } from '@contexts/datepicker'
import { useDay } from '@datepicker-react/hooks'
import { differenceInCalendarDays } from 'date-fns'
import { useRef } from 'react'
import styled from 'styled-components'

const Background = styled.div<{
    isSelected: boolean
    isSelectedStartOrEnd: boolean
    isFirstSelected: boolean
    isLastSelected: boolean
    hasLastSelected: boolean
    sameDaySelected: boolean
}>`
    /* border-radius: ${(props) => (props.isFirstSelected ? `24px` : props.isLastSelected ? `0 24px 24px 0` : `0`)} */
    ${(props) =>
        props.isFirstSelected && props.hasLastSelected && !props.sameDaySelected
            ? `background: linear-gradient(
        90deg,
        rgba(255, 255, 255, 0) 0%,
        rgba(62, 62, 94, 0) 50%,
        rgba(255, 90, 90, 0.1) 50%,
        rgba(255, 90, 90, 0.1) 100%
    );`
            : props.isLastSelected && !props.sameDaySelected
            ? `background: linear-gradient(
        -90deg,
        rgba(255, 255, 255, 0) 0%,
        rgba(62, 62, 94, 0) 50%,
        rgba(255, 90, 90, 0.1) 50%,
        rgba(255, 90, 90, 0.1) 100%
    );`
            : props.hasLastSelected && (props.isSelected || props.isSelectedStartOrEnd) && !props.sameDaySelected
            ? `background: rgba(255, 90, 90, 0.1);`
            : `background: none;`}

    display: flex;
    justify-content: center;
`
const Button = styled.button<{ isSelectedStartOrEnd: boolean; isDisabledDate: boolean; sameDaySelected: boolean }>`
    border: none;
    background: ${(props) => (props.isSelectedStartOrEnd ? `#ff5a5a` : `none`)};
    border-radius: ${(props) => (props.isSelectedStartOrEnd ? `24px` : `none`)};
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    font-weight: bold;
    font-size: 14px;

    /* Black */
    color: ${(props) => (props.isSelectedStartOrEnd ? `white` : props.isDisabledDate ? `lightgrey` : `#000000`)};
    border: ${(props) => (props.sameDaySelected ? `2px solid white` : `none`)};
    box-shadow: ${(props) => (props.sameDaySelected ? `0px 0px 0px 1px #ff5a5a` : `none`)};
`

function Day({ dayLabel, date, isFirstSelected, isLastSelected, sameDaySelected, hasLastSelected, dataCy }) {
    const dayRef = useRef(null)
    const {
        startDate,
        focusedDate,
        isDateFocused,
        isDateSelected,
        isDateHovered,
        isDateBlocked,
        isFirstOrLastSelectedDate,
        onDateSelect,
        onDateFocus,
        onDateHover,
    } = useDatePicker()

    const { isSelected, isSelectedStartOrEnd, onClick, onKeyDown, onMouseEnter, tabIndex, disabledDate } = useDay({
        date,
        focusedDate,
        isDateFocused,
        isDateSelected,
        isDateHovered,
        isDateBlocked,
        isFirstOrLastSelectedDate,
        onDateFocus,
        onDateSelect,
        onDateHover,
        dayRef,
    })

    if (!dayLabel) {
        return <div />
    }

    return (
        <Background
            className={`${isFirstSelected && hasLastSelected && !sameDaySelected ? 'selectedDayFirst ' : ''} ${
                isLastSelected && !sameDaySelected ? 'selectedDayLast ' : ''
            }`}
            isSelected={isSelected}
            isSelectedStartOrEnd={isSelectedStartOrEnd}
            isFirstSelected={isFirstSelected}
            isLastSelected={isLastSelected}
            hasLastSelected={hasLastSelected}
            sameDaySelected={isFirstSelected && isLastSelected}
        >
            <Button
                onClick={onClick}
                onKeyDown={onKeyDown}
                onMouseEnter={onMouseEnter}
                tabIndex={tabIndex}
                ref={dayRef}
                isSelectedStartOrEnd={isSelectedStartOrEnd}
                isDisabledDate={disabledDate}
                data-cy={dataCy}
                sameDaySelected={isFirstSelected && isLastSelected}
            >
                {dayLabel}
            </Button>
        </Background>
    )
}

export default Day
