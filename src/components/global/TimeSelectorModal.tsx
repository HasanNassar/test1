import { trackEvent } from '@util/ga'
import { format } from 'date-fns'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { useSearch } from '@contexts/search'
import { useClickOutside } from '@hooks/clickOutside'
import { useMediaQuery } from '@hooks/mediaQuery'
import { device } from '@util/responsive'
import { ClickedEllipse } from './icons/ClickedEllipse'
import { Cross } from './icons/Cross'
import { Ellipse } from './icons/Ellipse'
import { Modal } from './Modal'
import { nextDayDeliveryLimits } from '@util/config'

export const TimeSelector: React.FC<{
    specTime: 'from' | 'to'
    setTimeModal: React.Dispatch<React.SetStateAction<boolean>>
}> = ({ setTimeModal: setModal, specTime }) => {
    const [isReady, setIsReady] = useState<boolean | null>(null)

    const isDesktop = useMediaQuery(device.laptop)

    const { timeOptions, fromTime, toTime, fromDate } = useSearch()

    const now = new Date()
    const currentDate = now.getDate()
    const currentHours = now.getHours()
    const selectedFromDate = fromDate?.getDate()

    const deliveryTimes = timeOptions.map((d, idx) => {
        const isDeliveryTimeHidden = (() => {
            const hours = d.getHours()
            if (specTime === 'from' && currentDate + 1 === selectedFromDate) {
                return currentHours <= nextDayDeliveryLimits.todayCurrentHoursLimit
                    ? hours < nextDayDeliveryLimits.nextDayBusinessHoursStart
                    : hours < nextDayDeliveryLimits.nextDayNoonHours
            }
            return false
        })()
        return { key: idx, time: format(d, 'HH:mm'), date: d, hidden: isDeliveryTimeHidden }
    })
    const defaultSelectedIndex = deliveryTimes.findIndex(
        (x) =>
            format(x.date, 'HH:mm') ==
            format(specTime === 'from' ? fromTime ?? new Date() : toTime ?? new Date(), 'HH:mm'),
    )

    useEffect(() => {
        setIsReady(true)
    }, [])

    return isReady ? (
        isDesktop ? (
            <DesktopTimeSelectorModal
                specTime={specTime}
                defaultSelectedIndex={defaultSelectedIndex}
                setTimeModal={setModal}
                deliveryTimes={deliveryTimes}
            />
        ) : (
            <MobileTimeSelectorModal
                specTime={specTime}
                defaultSelectedIndex={defaultSelectedIndex}
                setTimeModal={setModal}
                deliveryTimes={deliveryTimes}
            />
        )
    ) : null
}

export const DesktopTimeSelectorModal: React.FC<{
    specTime: 'from' | 'to'
    setTimeModal: React.Dispatch<React.SetStateAction<boolean>>
    deliveryTimes: Times[]
    defaultSelectedIndex: number
}> = ({ setTimeModal: setModal, specTime, deliveryTimes, defaultSelectedIndex }) => {
    const { setFromTime, setToTime } = useSearch()
    const [selectedTime, setSelectedTime] = useState(defaultSelectedIndex)

    useEffect(() => {
        specTime === 'from'
            ? setFromTime(deliveryTimes[selectedTime].date)
            : setToTime(deliveryTimes[selectedTime].date)
    }, [selectedTime])

    const node = useRef(null)
    useClickOutside(node, () => setModal(false))

    return (
        <Wrapper specTime={specTime} ref={node}>
            <ModalHeader>
                <Heading>{specTime === 'from' ? 'Delivery Time' : 'Return time'}</Heading>
                <CloseModal data-cy="closeTimeSelector" onClick={() => setModal(false)}>
                    <Cross />
                </CloseModal>
            </ModalHeader>
            <TimeList>
                {deliveryTimes.map(
                    (item) =>
                        !item.hidden && (
                            <li data-cy={item.time} key={item.key} onClick={() => setSelectedTime(item.key)}>
                                <TimeContainer isSelected={selectedTime == item.key}>
                                    <TimeVal isSelected={selectedTime == item.key}>{item.time}</TimeVal>
                                    {selectedTime == item.key ? <ClickedEllipse /> : <Ellipse />}
                                </TimeContainer>
                                <Separator />
                            </li>
                        ),
                )}
            </TimeList>
        </Wrapper>
    )
}

const Wrapper = styled.div<{ specTime: 'from' | 'to' }>`
    display: none;

    @media ${device.laptop} {
        ${(props) => (props.specTime === 'to' ? `right: 0;` : 'left: 0;')};
        position: absolute;
        z-index: 50;
        display: flex;
        flex-direction: column;
        bottom: -360px;
        background: white;
        border-radius: 16px;
        width: 50%;
        height: 400px;
        overflow-y: hidden;
        padding: 24px;
        filter: drop-shadow(0px 2px 20px rgba(0, 0, 0, 0.08));
    }
`

export const MobileTimeSelectorModal: React.FC<{
    specTime: 'from' | 'to'
    setTimeModal: React.Dispatch<React.SetStateAction<boolean>>
    deliveryTimes: Times[]
    defaultSelectedIndex: number
}> = ({ setTimeModal: setModal, specTime, deliveryTimes, defaultSelectedIndex }) => {
    const { t } = useTranslation()
    const [selectedTime, setSelectedTime] = useState(defaultSelectedIndex)
    const { setFromTime, setToTime } = useSearch()

    // route selector logic --> modularize for use in Desktop also??
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

    /* This doesn't make sense, since the selection closes the modal
    const sendToGtagEnd = () => {
        if (startDate) {
            trackEvent({
                action: 'Delivery-time-finish',
                category: baseGACategory,
                label: baseGALabel,
                value: format(startDate, 'MMM dd'),
            })
        }
        if (endDate) {
            trackEvent({
                action: 'Return-time-finish',
                category: baseGACategory,
                label: baseGALabel,
                value: format(endDate, 'MMM dd'),
            })
        }
    }
    */

    const node = useRef(null)
    useClickOutside(node, () => setModal(false))

    const selectTime = (time) => {
        setSelectedTime(time)
        if (specTime === 'from') {
            trackEvent({
                action: 'Delivery-time-start',
                category: baseGACategory,
                label: baseGALabel,
                value: format(deliveryTimes[time].date, 'HH:mm'),
            })
            setFromTime(deliveryTimes[time].date)
        } else {
            trackEvent({
                action: 'Return-time-start',
                category: baseGACategory,
                label: baseGALabel,
                value: format(deliveryTimes[time].date, 'HH:mm'),
            })
            setToTime(deliveryTimes[time].date)
        }
        setModal(false)
    }

    const compareTimes = (selected, key) => {
        if (selected - 1 == key || selected == key) {
            return false
        }
        return true
    }

    return (
        <Modal setModal={setModal} wrapperComponent={ModalContainer}>
            <ModalWrapper ref={node}>
                <ModalHeader>
                    <Heading>
                        {specTime === 'from'
                            ? t('timeSelectionModal.deliveryTime', 'Delivery Time')
                            : t('timeSelectionModal.returnTime', 'Return time')}
                    </Heading>

                    <CloseModal data-cy="closeTimeSelector" onClick={() => setModal(false)}>
                        <Cross />
                    </CloseModal>
                </ModalHeader>
                <TimeList>
                    {deliveryTimes.map(
                        (item) =>
                            !item.hidden && (
                                <li
                                    data-cy={item.time.replace(':', '')}
                                    key={item.key}
                                    onClick={() => selectTime(item.key)}
                                >
                                    <TimeContainer isSelected={selectedTime == item.key}>
                                        <TimeVal isSelected={selectedTime == item.key}>{item.time}</TimeVal>
                                        {selectedTime == item.key ? <ClickedEllipse /> : <Ellipse />}
                                    </TimeContainer>
                                    {compareTimes(selectedTime, item.key) && <Separator />}
                                </li>
                            ),
                    )}
                </TimeList>
            </ModalWrapper>
        </Modal>
    )
}

const ModalContainer = styled.div`
    inset: 0;
    display: flex;
    justify-items: center;
    align-items: center;
    padding: 1rem;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 100;
    position: fixed;
    top: 0;
    max-width: calc(100vw - 2rem);
`

const ModalWrapper = styled.div`
    width: 100%;
    height: 75vh;
    background-color: white;
    border-radius: 16px;
    overflow-y: scroll;
    min-height: 70vh;
`

const ModalHeader = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 24px 24px 0px 24px;
    align-items: center;
`
const CloseModal = styled.div`
    display: flex;
    align-items: center;
`
const Heading = styled.h1`
    margin: 0px;
    font-size: var(--size-24);
`

const TimeList = styled.ul`
    list-style-type: none;
    padding: 0px;
`
const TimeContainer = styled.div<{ isSelected: boolean }>`
    font-size: var(--size-16);
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24px 24px;
    ${(props) => (props.isSelected ? `background: rgba(255, 90, 90, 0.1)` : ``)}
`

const TimeVal = styled.p<{ isSelected: boolean }>`
    margin: 0px;
    ${(props) => (props.isSelected ? `color: var(--primaryColor); font-weight: var(--weight-bold)` : ``)};
`

const Separator = styled.div`
    border-style: solid;
    border-bottom: 1px;
    border-width: 0.01em;
    color: rgba(0, 0, 0, 0.1);
    margin: 0 24px;
`

type Times = {
    key: number
    time: string
    date: Date
    hidden: boolean
}
