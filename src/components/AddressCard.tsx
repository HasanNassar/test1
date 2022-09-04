import styled from 'styled-components'
import { ClickedEllipse } from './global/icons/ClickedEllipse'
import { Ellipse } from './global/icons/Ellipse'
import { House } from './global/icons/House'
import { More } from './global/icons/More'
import { useRef, useState } from 'react'
import { Pencil } from './global/icons/Pencil'
import { Delete } from './global/icons/Delete'
import { DeleteAddress } from './global/DeleteAddress'
import { useTranslation } from 'next-i18next'
import { useClickOutside } from '@hooks/clickOutside'
import { Address, AddressType } from '@service/payment.types'

type AddressCard = {
    type: string
    building: string
    street: string
}
const AddressCardWrapper = styled.div<{ isSelected: boolean }>`
    display: flex;
    flex-direction: row;

    align-items: center;
    justify-content: space-between;
    padding: 16px 24px;
    margin-bottom: 16px;

    background: #ffffff;
    ${(props) => (props.isSelected ? `border: 1px solid #FF5A5A` : '')};
    box-sizing: border-box;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.04), 0px 2px 20px rgba(0, 0, 0, 0.08);
    border-radius: 16px;
`

const CardContent = styled.div`
    display: flex;
    align-items: center;
    column-gap: 24px;
`

const AddressInformation = styled.div`
    display: flex;
    align-items: center;
    column-gap: 24px;
`

const AddressVariant = styled.h4`
    margin: 0;
    font-size: var(--size-16);
    font-weight: var(--weight-bold);
    color: black;
`
const Building = styled.h5`
    margin: 8px 0 0 0;
    font-size: var(--size-14);
    font-weight: var(--weight-bold);
`
const Road = styled.p`
    margin: 4px 0 0 0;
    font-size: var(--size-14);
    font-weight: var(--weight-regular);
`

const DropDown = styled.div`
    position: absolute;
    width: 80px;

    margin-top: 2rem;
    background-color: white;
    top: 0;
    right: 0;
    box-shadow: var(--boxShadow);
    border-radius: var(--borderRadius);
    padding: 0 24px;
    z-index: 10;
`

const MenuItem = styled.div`
    display: flex;
    margin: 16px 0;
    align-items: center;
    column-gap: 20px;
`

const MenuText = styled.p`
    margin: 0;
    font-size: var(--size-14);
    font-weight: var(--weight-semiBold);
`

const Separator = styled.div`
    border-bottom: 0.5px solid rgba(0, 0, 0, 0.1);
    margin: 0 -24px;
`

export const AddressCard = ({
    address,
    isSelected,
    setAddress,
}: {
    address: AddressCard
    isSelected: boolean
    setAddress: React.Dispatch<React.SetStateAction<Address>>
}) => {
    const { t } = useTranslation()

    const [isDropDown, setIsDropDown] = useState(false)
    const [isDelete, setIsDelete] = useState(false)

    const dropDown = useRef(null)

    useClickOutside(dropDown, () => {
        setIsDropDown(false)
    })

    return (
        <AddressCardWrapper isSelected={isSelected}>
            <CardContent>
                {isSelected ? <ClickedEllipse /> : <Ellipse />}
                <AddressInformation>
                    <House color={'black'} />
                    <div>
                        <Building>{address.building}</Building>
                        <Road>{address.street}</Road>
                    </div>
                </AddressInformation>
            </CardContent>
            <div style={{ position: 'relative' }} onClick={() => setIsDropDown(!isDropDown)}>
                <More />
                {isDelete ? <DeleteAddress setModal={() => setIsDelete(false)} /> : null}
                {isDropDown ? (
                    <DropDown ref={dropDown}>
                        <MenuItem onClick={() => setAddress({ id: '0', type: AddressType.DELIVERY })}>
                            <Pencil color="rgba(0, 0, 0, 0,8)" />
                            <MenuText>{t('addressCardEdit', 'Edit')}</MenuText>
                        </MenuItem>
                        <Separator />
                        <MenuItem onClick={() => setIsDelete(true)}>
                            <Delete />
                            <MenuText>{t('addressCardDelete', 'Delete')}</MenuText>
                        </MenuItem>
                    </DropDown>
                ) : null}
            </div>
        </AddressCardWrapper>
    )
}
