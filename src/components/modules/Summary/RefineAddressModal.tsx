import { Button } from '@components/global/Button'
import { RedChevronLeft } from '@components/global/icons/RedChevronLeft'
import styled from 'styled-components'
import { Map } from '@components/modules/Map/Map'
import { useTranslation } from 'next-i18next'
import { Modal } from '@components/global/Modal'
import { AddressModalType } from 'src/pages/[city]/cars/[listingsId]/summary'
import { AddressActionKind, AddressType, useSearch } from '@contexts/search'
import { useForm } from 'react-hook-form'
import { useMobileDetect } from '@hooks/detectDevice'
import { useMap } from '@contexts/map'

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
    overflow: auto;
    height: calc(100vh - 200px);
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

const InputField = styled.input<{ error?: any }>`
    height: 48px;
    background: rgba(0, 0, 0, 0.04);
    border-radius: 4px;
    border: none;
    padding: 0 1rem;
    font-weight: var(--weight-bold);
    font-size: 14px;
    color: 'rgba(0, 0, 0, 0.8)';
    ${({ error }) => (error ? 'border: 1px solid red;' : '')}
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

const ModalWrapper = styled.div`
    position: fixed;
    z-index: 50;
    inset: 0;
    background: white;
    padding-bottom: 5rem;
    top: 0;
`

type FormData = {
    addressLine1: string
    addressLine2: string
    city: string
    country: string
    region: string
    zipCode: string
}

export const RefineAddressModal: React.FC<{
    setModal: React.Dispatch<React.SetStateAction<AddressModalType>>
    modalType: AddressModalType
}> = ({ modalType, setModal }) => {
    const { address, addressDispatch } = useSearch()
    const { t } = useTranslation()
    const detectMobile = useMobileDetect()
    const { map } = useMap()

    const temporaryType =
        modalType === AddressModalType.deliveryRefine
            ? AddressType.TEMPORARY_HANDOVER_ADDRESS
            : AddressType.TEMPORARY_HANDBACK_ADDRESS

    const type =
        modalType === AddressModalType.deliveryRefine ? AddressType.HANDOVER_ADDRESS : AddressType.HANDBACK_ADDRESS

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        defaultValues: {
            ...address[temporaryType],
        },
    })

    const onSubmit = (data) => {
        addressDispatch({
            type: AddressActionKind.REPLACE,
            value: {
                ...data,
                latitude: map.coordinates.lat,
                longitude: map.coordinates.lng,
            },
            name: type,
        })
        if (type === AddressType.HANDOVER_ADDRESS && !address.handbackAddress) {
            addressDispatch({ type: AddressActionKind.COPY })
        }

        if (type === AddressType.HANDBACK_ADDRESS && !address.handoverAddress) {
            addressDispatch({ type: AddressActionKind.COPY, reverse: true })
        }

        setModal(AddressModalType.none)
    }
    return (
        <>
            <Modal wrapperComponent={ModalWrapper} setModal={() => setModal(AddressModalType.none)}>
                {modalType === AddressModalType.deliveryRefine ? (
                    <IconWrapper onClick={() => setModal(AddressModalType.delivery)}>
                        <RedChevronLeft />
                    </IconWrapper>
                ) : (
                    <IconWrapper onClick={() => setModal(AddressModalType.return)}>
                        <RedChevronLeft />
                    </IconWrapper>
                )}

                <MapWrapper>
                    <Map
                        type={modalType}
                        withAutoComplete={false}
                        height="160px"
                        draggable={false}
                        mapPosition={map.coordinates}
                    />
                </MapWrapper>

                <Wrapper>
                    {modalType === AddressModalType.deliveryRefine ? (
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
                            <Heading>{t('deliveryAddReturnAddressHeader', 'Return address')}</Heading>
                            <Description>
                                {t(
                                    'deliveryAddDeliveryAddressDescription',
                                    'You can refine the return address by editing the fields below',
                                )}
                            </Description>
                        </>
                    )}
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        style={{
                            marginBottom:
                                detectMobile.isMobile() && detectMobile.isIos() ? 'var(--modalButtonFix)' : '0',
                        }}
                    >
                        <InputListWrapper>
                            <InputListItem key="0">
                                <InputLabel htmlFor="0">{t('deliveryAddAddressLine1', 'Address')}</InputLabel>
                                <InputField
                                    {...register('addressLine1', { required: true })}
                                    error={errors.addressLine1}
                                />
                            </InputListItem>
                        </InputListWrapper>
                        <InputListWrapper>
                            <InputListItem key="1">
                                <InputLabel htmlFor="0">
                                    {t('deliveryAddAddressLine2', 'Additional directions')}
                                </InputLabel>
                                <InputField
                                    {...register('addressLine2', { required: false })}
                                    error={errors.addressLine2}
                                />
                            </InputListItem>
                        </InputListWrapper>
                        <InputListWrapper>
                            <InputListItem key="2">
                                <InputLabel htmlFor="2">{t('deliveryAddAddressCity', 'City')}</InputLabel>
                                <InputField {...register('city', { required: true })} error={errors.city} />
                            </InputListItem>
                        </InputListWrapper>
                        <InputListWrapper>
                            <InputListItem key="3">
                                <InputLabel htmlFor="3">{t('deliveryAddAddressCountry', 'Country')}</InputLabel>
                                <InputField {...register('country', { required: true })} error={errors.country} />
                            </InputListItem>
                        </InputListWrapper>

                        {modalType === AddressModalType.deliveryRefine ? (
                            <Button
                                text={t('deliveryAddAddressSave', 'Save delivery address')}
                                mobileFix={detectMobile.isMobile()}
                            />
                        ) : (
                            <Button
                                text={t('returnAddAddressSave', 'Save return address')}
                                mobileFix={detectMobile.isMobile()}
                            />
                        )}
                    </form>
                </Wrapper>
            </Modal>
        </>
    )
}
