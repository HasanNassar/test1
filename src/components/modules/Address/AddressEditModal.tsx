import { RedChevronLeft } from '@components/global/icons/RedChevronLeft'
import { useTranslation } from 'next-i18next'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useQuery } from 'react-query'
import styled from 'styled-components'
import { paymentCacheKeys, paymentService } from '../../../service/payment'
import { Modal } from '../../global/Modal'
import { Map } from '@components/modules/Map/Map'
// import { AddressLabel } from '@components/global/AddressLabel'
import { Address, AddressType } from '@service/payment.types'
import { AddressModalType } from 'src/pages/[city]/cars/[listingsId]/summary'

const MapWrapper = styled.div`
    height: 160px;
    width: 100%;
`

const Wrapper = styled.div`
    padding: 24px;
    background: white;
    & > ul {
        list-style-type: none;
        margin: 0;
        padding: 0;
    }
    padding-bottom: 100px;
`

const Heading = styled.h1`
    font-size: var(--size-20);
    margin-bottom: 16px;
    color: rgba(0, 0, 0, 1);
`
const Description = styled.p`
    font-size: var(--size-16);
    color: rgba(0, 0, 0, 1);
    margin-bottom: var(--padding);
`

const InputListItem = styled.li`
    display: flex;
    flex-direction: column;
    width: 100%;
`

const InputListWrapper = styled.div`
    display: flex;
    margin-bottom: var(--padding);
`
const InputLabel = styled.label<{ htmlFor: string }>`
    font-weight: 600;
    font-size: 10px;
    line-height: 14px;
    text-transform: uppercase;
    color: rgba(0, 0, 0, 0.4);
    margin-bottom: 0.5rem;
`

const InputField = styled.input`
    height: 48px;
    background: rgba(0, 0, 0, 0.04);
    border-radius: 4px;
    border: none;
    padding: 0 1rem;
    font-weight: var(--weight-bold);
    font-size: 14px;
    color: 'rgba(0, 0, 0, 0.8)';
    :focus {
        outline: none;
    }
`

const IconWrapper = styled.div`
    position: absolute;
    margin: 12px 24px;
    top: 0;
    left: 0;
    z-index: 10;
`

const IconCarousel = styled.ul`
    display: flex;
    list-style-type: none;
    column-gap: 24px;
    padding: 0;
`

const ModalWrapper = styled.div`
    position: fixed;
    top: 0;
    z-index: 50;
    inset: 0;
    background: white;
    padding-bottom: 5rem;
`

const SaveButton = styled.button`
    background: #ff5a5a;
    border-radius: 100px;
    color: white;
    font-size: var(--size-16);
    font-weight: var(--weight-bold);
    border: none;
    padding: 1rem;
    width: 100%;
    margin-top: 1rem;
    margin-bottom: 24px;
`

type FormData = {
    building: string
    addressLine1: string
    addressLine2: string
    city: string
    region: string
    comments: string
}

export const AddressEditModal: React.FC<{
    newAddress: Address
    setModal: React.Dispatch<React.SetStateAction<string | undefined>>
}> = ({ setModal, newAddress }) => {
    const [isValidAddress, setIsValidAddress] = useState(false)
    const [address, setAddress] = useState('Havana Cafe - Abu Dhabi - United Arab Emirates')
    const [selectedLabel, setSelectedLabel] = useState('0')

    const { t } = useTranslation()

    // const deliveryAddAddressLabels = ['home', 'office', 'custom']

    const { USER_ADDRESS } = paymentCacheKeys
    const { data, isLoading, error } = useQuery([USER_ADDRESS, newAddress.id], () => paymentService.getAddress())

    const {
        register,
        setValue,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormData>()

    useEffect(() => {
        if (data?.data) {
            reset({
                building: data.data.building || '',
                addressLine1: data.data?.addressLine1 || '',
                addressLine2: data.data?.addressLine2 || '',
                region: data.data?.region || '',
                comments: data.data?.comments || '',
            })
        }
    }, [data])

    const onSubmit = () => {
        setModal(undefined)
    }
    if (isLoading || error) return null

    return (
        <>
            <Modal wrapperComponent={ModalWrapper} setModal={() => setModal(undefined)}>
                <IconWrapper onClick={() => setModal(undefined)}>
                    <RedChevronLeft />
                </IconWrapper>
                <MapWrapper>
                    <Map
                        type={AddressModalType.deliveryRefine}
                        withAutoComplete={false}
                        height="160px"
                        draggable={false}
                    />
                </MapWrapper>

                <Wrapper>
                    {newAddress.type === AddressType.DELIVERY ? (
                        <>
                            <Heading>{t('deliveryAddAddressHeader', 'Delivery address')}</Heading>
                            <Description>
                                {t(
                                    'deliveryAddAddressDescription',
                                    'You can refine the delivery address by editing the fields below',
                                )}
                            </Description>
                        </>
                    ) : (
                        <>
                            <Heading>{t('returnAddAddressHeader', 'Return address')}</Heading>
                            <Description>
                                {t(
                                    'returnAddAddressDescription',
                                    'You can refine the return address by editing the fields below',
                                )}
                            </Description>
                        </>
                    )}

                    <form onSubmit={onSubmit}>
                        <InputListWrapper>
                            <InputListItem key="0">
                                <InputLabel htmlFor="0">{t('deliveryAddAddressBuilding', 'building/villa')}</InputLabel>
                                <InputField {...register('building')} />
                            </InputListItem>
                        </InputListWrapper>
                        <InputListWrapper>
                            <InputListItem key="1">
                                <InputLabel htmlFor="1">{t('deliveryAddAddressStreet', 'street')}</InputLabel>
                                <InputField {...register('addressLine1')} />
                            </InputListItem>
                        </InputListWrapper>
                        <InputListWrapper>
                            <InputListItem key="2">
                                <InputLabel htmlFor="2">
                                    {t('deliveryAddAddressHouseNumber', 'house number')}
                                </InputLabel>
                                <InputField {...register('addressLine2')} />
                            </InputListItem>
                        </InputListWrapper>
                        <InputListWrapper>
                            <InputListItem key="3">
                                <InputLabel htmlFor="3">{t('deliveryAddAddressArea', 'area')}</InputLabel>
                                <InputField {...register('region')} />
                            </InputListItem>
                        </InputListWrapper>
                        <InputListWrapper>
                            <InputListItem key="4">
                                <InputLabel htmlFor="4">{t('deliveryAddAddressDirections', 'directions')}</InputLabel>
                                <InputField {...register('comments')} placeholder="Instructions to delivery stuff" />
                            </InputListItem>
                        </InputListWrapper>

                        {/* <Heading>{t('deliveryAddAddressLabel', 'Address label')}</Heading>
                         <IconCarousel>
                            {deliveryAddAddressLabels.map((item) => (
                                <li key={item} onClick={() => setSelectedLabel(item)}>
                                    <AddressLabel isActive={selectedLabel == item} label={item} />
                                </li>
                            ))}
                        </IconCarousel> */}

                        {newAddress.type === AddressType.DELIVERY ? (
                            <SaveButton type="submit">
                                {t('deliveryAddAddressSave', 'Save delivery address')}
                            </SaveButton>
                        ) : (
                            <SaveButton type="submit">{t('returnAddAddressSave', 'Save return address')}</SaveButton>
                        )}
                    </form>
                </Wrapper>
            </Modal>
        </>
    )
}
