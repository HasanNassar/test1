import { Cross } from '@global/icons/Cross'
import { Modal } from '@global/Modal'
import styled from 'styled-components'
import React from 'react'
import { FooterModalTab } from './FooterModalTab'

export const SimpleModal: React.FC<{
    setModal: React.Dispatch<React.SetStateAction<boolean>>
    content: any
}> = ({ setModal: setModal, content }) => {
    return (
        <Modal wrapperComponent={ModalWrapper} setModal={setModal}>
            <ModalHeader>
                <ModalTitle>{content.mainTitle}</ModalTitle>
                <CloseModal onClick={() => setModal(false)}>
                    <Cross />
                </CloseModal>
            </ModalHeader>
            <ModalBody>
                <div>{content.introText}</div>
                {content.tabs && content.tabs.map((tab, index) => <FooterModalTab key={index} tabContent={tab} />)}
                {content.html && <div dangerouslySetInnerHTML={{ __html: content.html }} />}
            </ModalBody>
        </Modal>
    )
}

const ModalBody = styled.div`
    display: block;
    padding: 0.5rem 1.5rem 1rem;
    max-height: calc(100vh - 100px);
    font-size: var(--size-14);
    overflow-x: auto;
    line-height: 1.4rem;
`
const ModalWrapper = styled.div`
    z-index: 50;
    inset: 0;
    background: white;
    padding-bottom: 5rem;
`

const ModalHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 1.5rem;
    position: fixed;
    top: 0;
    z-index: 50;
    background: white;
    width: calc(100% - 3rem);
`
const CloseModal = styled.div`
    display: flex;
    align-items: center;
`

const ModalTitle = styled.h2`
    font-size: var(--size-24);
    font-weight: var(--weight-bold);
    line-height: 1;
    margin: 1.3rem 0;
`
