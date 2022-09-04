import styled from 'styled-components'
import MainLayout from '@components/layout/MainLayout'
import { AddressCard } from '@components/AddressCard'
import { useState } from 'react'
import { MiniArrowDown } from '@components/global/icons/MiniArrowDown'
import { Plus } from '@components/global/icons/Plus'
import { Toggle } from '@components/Toggle'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { Button } from '@components/global/Button'
import { useTranslation } from 'next-i18next'
import { AddressEditModal } from '@components/modules/Address/AddressEditModal'
import { Address, AddressType } from '@service/payment.types'

const Wrapper = styled.div`
    padding: var(--padding);
`

const Heading = styled.h1`
    font-size: var(--size-20);
    margin: 0;
    color: rgba(0, 0, 0, 1);
`
const Description = styled.p`
    font-size: var(--size-16);
    color: rgba(0, 0, 0, 1);
    margin-bottom: var(--padding);
`
const Separator = styled.div`
    border: 0.5px solid rgba(0, 0, 0, 0.1);
    margin: 32px -24px;
`
const AddressList = styled.ul`
    list-style-type: none;
    padding: 0;
`

const FullListText = styled.p`
    font-weight: var(--weight-bold);
    font-size: 14px;
    margin: 0;
    color: #ff5a5a;
    margin-inline-end: 10px;
`
const TextWrapper = styled.div`
    display: flex;
    align-items: center;
    margin-top: 24px;
    & > svg {
        margin-inline-end: 10px;
    }
`

const ToggleWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`

const deliveryAddress = [{ id: '0', type: 'home', building: 'Milleneum Tower', street: 'Sheikh Zayed Rd Dubai' }]

const deliveryAddresses = [
    { id: '0', building: 'Milleneum Tower', street: 'Sheikh Zayed Rd Dubai' },
    { id: '1', building: 'Jumeriah Business Centre', street: 'Jumeriah Lakes Tower Dubai' },
    { id: '2', building: 'Jumeriah Business Centre', street: 'Jumeriah Lakes Tower Dubai' },
]

export async function getServerSideProps({ locale }) {
    return {
        props: {
            ...(await serverSideTranslations(locale, ['common'])),
        },
    }
}

export default function address() {
    const [selectedAddress, setSelectedAddress] = useState('0')
    const [isFullAddressList, setIsFullAddressList] = useState(false)
    const [checked, setChecked] = useState(true)
    const [newAddress, setNewAddress] = useState<Address | undefined>(undefined)
    const { t } = useTranslation()

    return (
        <MainLayout>
            <Wrapper>
                <Heading>{t('deliveryAddressHeading', 'Delivery address')}</Heading>
                <Description>
                    {t('deliveryAddressDescription', ' Our rental service includes door-to-door delivery.')}
                </Description>
                <AddressList>
                    {isFullAddressList
                        ? deliveryAddresses.map((item) => (
                              <li key={item.id} onClick={() => setSelectedAddress(item.id)}>
                                  <AddressCard
                                      isSelected={selectedAddress === item.id}
                                      address={deliveryAddresses[item.id]}
                                      setAddress={() => setNewAddress({ id: item.id, type: AddressType.DELIVERY })}
                                  />
                              </li>
                          ))
                        : deliveryAddress.map((item) => (
                              <li key={item.id} onClick={() => setSelectedAddress(item.id)}>
                                  <AddressCard
                                      isSelected={selectedAddress === item.id}
                                      address={deliveryAddresses[item.id]}
                                      setAddress={() => setNewAddress({ id: item.id, type: AddressType.DELIVERY })}
                                  />
                              </li>
                          ))}
                </AddressList>
                {isFullAddressList ? (
                    <TextWrapper onClick={() => setNewAddress({ id: '2', type: AddressType.DELIVERY })}>
                        <Plus />
                        <FullListText>
                            {t('deliveryAddressAddNewDeliveryAddress', 'Add new delivery address')}
                        </FullListText>
                    </TextWrapper>
                ) : null}
                <TextWrapper onClick={() => setIsFullAddressList(!isFullAddressList)}>
                    <FullListText>
                        {isFullAddressList
                            ? `${t('deliveryAddressListHide', 'Hide full address list')}`
                            : `${t('deliveryAddressListShow', 'Show full address list')}`}
                    </FullListText>
                    <MiniArrowDown isOpen={isFullAddressList} color="#FF5A5A" />
                </TextWrapper>
                <Separator />
                <Heading>{t('deliveryAddressHeadingReturn', 'Return address')}</Heading>
                <ToggleWrapper>
                    <Description>
                        {t('deliveryAddressHeadingReturnDescription', 'Same as delivery address')}
                    </Description>
                    <div>
                        <Toggle checked={checked} setChecked={setChecked} />
                    </div>
                </ToggleWrapper>
                {checked ? (
                    ''
                ) : (
                    <AddressList>
                        {deliveryAddresses.map((item) => (
                            <li key={item.id} onClick={() => setSelectedAddress(item.id)}>
                                <AddressCard
                                    isSelected={selectedAddress === item.id}
                                    address={deliveryAddresses[item.id]}
                                    setAddress={() => setNewAddress({ id: item.id, type: AddressType.DELIVERY })}
                                />
                            </li>
                        ))}
                    </AddressList>
                )}

                <TextWrapper
                    onClick={() => {
                        setNewAddress({ id: '1', type: AddressType.RETURN })
                    }}
                >
                    <Plus />
                    <FullListText>{t('deliveryAddressAddNewReturnAddress', 'Add new return address')}</FullListText>
                </TextWrapper>
                {newAddress && <AddressEditModal newAddress={newAddress} setModal={() => setNewAddress(undefined)} />}
                <Button text={t('deliveryAddressContinueButton', 'Continue')} />
            </Wrapper>
        </MainLayout>
    )
}
