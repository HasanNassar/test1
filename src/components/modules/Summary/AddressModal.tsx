import { AddressModalType } from 'src/pages/[city]/cars/[listingsId]/summary'
import MapProvider from '../../../contexts/map'
import { RefineAddressModal } from './RefineAddressModal'
import { SelectAddressModal } from './SelectAddressModal'

export const AddressModal: React.FC<{
    setModal: React.Dispatch<React.SetStateAction<AddressModalType>>
    modalType: AddressModalType
}> = ({ modalType, setModal }) => {
    return (
        <MapProvider address="">
            {modalType === AddressModalType.delivery || modalType === AddressModalType.return ? (
                <SelectAddressModal setModal={setModal} modalType={modalType} />
            ) : modalType === AddressModalType.deliveryRefine || modalType === AddressModalType.returnRefine ? (
                <RefineAddressModal setModal={setModal} modalType={modalType} />
            ) : null}
        </MapProvider>
    )
}
