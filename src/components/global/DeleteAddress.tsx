import { useTranslation } from 'next-i18next'
import styled from 'styled-components'
import { Modal } from './Modal'

const DeleteCardWrapper = styled.div`
    background: white;
    display: flex;
    flex-direction: column;
    margin: 20rem 24px;
    border-radius: 16px;
    padding: 24px;
    top: 0;
`

const Headline = styled.h1`
    font-weight: 800;
    font-size: 24px;
    color: #000000;
    margin: 0 0 1rem 0;
`

const Text = styled.h1`
    font-weight: 500;
    font-size: 14px;
    color: #000000;
    margin: 0 0 3rem 0;
`

const ButtonWrapper = styled.div`
    display: flex;

    align-items: center;
    column-gap: 24px;
`

const CancelButton = styled.div`
    font-weight: bold;
    font-size: 16px;
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
    color: #ff5a5a;
    border: 1px solid #ff5a5a;
    padding: 8px 24px;
    border-radius: 100px;
    max-width: 100px;
    max-height: 48px;
`

const DeleteButton = styled.button`
    display: flex;
    flex: 1;
    justify-content: center;
    align-items: center;
    background: #ff5a5a;
    border-radius: 100px;
    color: white;
    font-size: var(--size-16);
    font-weight: var(--weight-bold);
    border: none;
    padding: 8px 24px;
    width: 100px;
`

export const DeleteAddress = ({ setModal }: { setModal: any }) => {
    const { t } = useTranslation()
    return (
        <Modal setModal={() => setModal(false)}>
            <DeleteCardWrapper>
                <Headline>{t('deleteAddressTitle', 'Delete address?')}</Headline>
                <Text>{t('deleteAddressText', 'Are you sure you want to delete it from your address list?')}</Text>
                <ButtonWrapper>
                    <CancelButton onClick={() => setModal(false)}>{t('cancel', 'Cancel')}</CancelButton>
                    <DeleteButton onClick={() => setModal(false)}>
                        {t('deleteAddressYesButton', 'Yes, delete')}
                    </DeleteButton>
                </ButtonWrapper>
            </DeleteCardWrapper>
        </Modal>
    )
}
