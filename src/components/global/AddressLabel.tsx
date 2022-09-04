import styled from 'styled-components'
import { House } from './icons/House'
import { Office } from './icons/Office'
import { CustomAddress } from './icons/CustomAddress'
import { useTranslation } from 'next-i18next'

const IconWrapper = styled.div<{ isActive: boolean; label: string }>`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: ${(props) => (props.isActive ? '#ff5a5a' : 'rgba(0, 0, 0, 0,8)')};
    font-weight: 600;
    font-size: 12px;
`

const IconHolder = styled.div<{ color: string }>`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: ${(props) => props.color};
    box-shadow: 0px 2px 20px rgba(0, 0, 0, 0.08);
    border-radius: 50px;
    padding: 12px;
`

export const AddressLabel = ({ isActive, label }: { isActive: boolean; label: string }) => {
    const { t } = useTranslation()

    let holderColor = ''
    let iconColor = ''
    if (isActive == true) {
        holderColor = '#ff5a5a'
        iconColor = 'white'
    } else {
        holderColor = 'white'
        iconColor = '#ff5a5a'
    }
    return (
        <IconWrapper isActive={isActive} label={label}>
            <IconHolder color={holderColor}>
                <House color={iconColor} />
            </IconHolder>
        </IconWrapper>
    )
}
