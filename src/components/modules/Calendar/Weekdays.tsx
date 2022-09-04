import { useMonth } from '@datepicker-react/hooks'
import styled from 'styled-components'

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
    /* Black60 */
    color: rgba(0, 0, 0, 0.6);
`

export const Weekdays = ({ year, month, firstDayOfWeek }) => {
    const { weekdayLabels } = useMonth({
        year,
        month,
        firstDayOfWeek,
    })

    return (
        <Flex>
            {weekdayLabels.map((dayLabel) => (
                <div key={dayLabel}>{dayLabel.charAt(0)}</div>
            ))}
        </Flex>
    )
}
