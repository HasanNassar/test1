import { DatePickerProvider } from '@contexts/datepicker'
import { endOfDay, nextSunday, startOfDay } from 'date-fns'
import { useEffect, useState } from 'react'
import { useSearch } from '../../../contexts/search'
import { useMediaQuery } from '../../../hooks/mediaQuery'
import { device } from '../../../util/responsive'
import { MobileDatePicker } from './MobileDatePicker'

export const Datepicker: React.FC<{
    setTimeModal: React.Dispatch<React.SetStateAction<boolean>>
}> = ({ setTimeModal: setModal }) => {
    const isDesktop = useMediaQuery(device.laptop)
    const [isReady, setIsReady] = useState<boolean>(false)

    useEffect(() => {
        setIsReady(true)
    }, [])

    return isReady ? (
        <DatePickerProvider setModal={setModal}>{isDesktop ? null : <MobileDatePicker />}</DatePickerProvider>
    ) : null
}

export default Datepicker
