import { Button } from '@components/global/Button'
import { Cross } from '@components/global/icons/Cross'
import { Modal } from '@components/global/Modal'
import { useMap } from '@contexts/map'
import { useTranslation } from 'next-i18next'
import { AddressModalType } from 'src/pages/[city]/cars/[listingsId]/summary'
import styled from 'styled-components'
import { Map } from '../Map/Map'

const MainWrapper = styled.div`
    overflow: hidden;
`
const Wrapper = styled.div`
    padding: var(--padding);
    padding-bottom: 0;
    background: white;
    & > ul {
        list-style-type: none;
        margin: 0;
        padding: 0;
    }
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

const IconWrapper = styled.div`
    position: absolute;
    margin: 36px 30px;
    top: 0;
    right: 0;
`

const ModalWrapper = styled.div`
    position: fixed;
    z-index: 50;
    inset: 0;
    background: white;
    padding-bottom: 5rem;
    top: 0;
`

export const SelectAddressModal: React.FC<{
    setModal: React.Dispatch<React.SetStateAction<AddressModalType>>
    modalType: AddressModalType
}> = ({ modalType, setModal }) => {
    const { t } = useTranslation()
    const { map } = useMap()
    const confirmAddressClicked = () => {
        if (modalType === AddressModalType.delivery) {
            setModal(AddressModalType.deliveryRefine)
        } else {
            setModal(AddressModalType.returnRefine)
        }
    }

    return (
        <Modal wrapperComponent={ModalWrapper} setModal={() => setModal(AddressModalType.none)}>
            <MainWrapper>
                <IconWrapper onClick={() => setModal(AddressModalType.none)}>
                    <Cross />
                </IconWrapper>

                <Wrapper>
                    {modalType === AddressModalType.delivery ? (
                        <>
                            <Heading>{t('selectAddressModal.header', 'Delivery address')}</Heading>
                            <Description>
                                {t('selectAddressModal.description', 'Where can we deliver your car?')}
                            </Description>
                        </>
                    ) : (
                        <>
                            <Heading>{t('selectAddressModal.returnAddress', 'Return address')}</Heading>
                            <Description>
                                {t('selectAddressModal.returnAddressDesc', 'Where will you return your car?')}
                            </Description>
                        </>
                    )}
                </Wrapper>

                <Map height="calc(100vh - 190px)" type={modalType} mapPosition={map.coordinates} />

                <Button text="Confirm address" disabled={!map.isValid} onClick={confirmAddressClicked} />
            </MainWrapper>
        </Modal>
    )
}
