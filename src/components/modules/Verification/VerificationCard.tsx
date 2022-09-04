import React, { useRef, useState } from 'react'
import { VerificationBadge } from '@components/modules/Verification/VerificationBadge'
import { Verified } from '@components/global/icons/Verified'
import { ButtonOutlined } from '@components/global/ButtonOutlined'
import styled from 'styled-components'
import {
    DocumentState,
    Side,
    stateMetaData,
    UploadedDocument,
    VeriffState,
    VerificationUploadStatus,
} from '@components/modules/Verification/VerificationUtils'
import { useTranslation } from 'next-i18next'
import { identityService } from '@service/identity'
import { VerificationUploadResponse } from '@service/identity.types'
import { AxiosResponse } from 'axios'

const CardWrapper = styled.div`
    display: flex;
    flex-direction: column;
    background: #ffffff;
    box-shadow: 0px 2px 110px rgba(0, 0, 0, 0.08);
    border-radius: 16px;
    height: 383px;
    box-sizing: border-box;
    width: 100%;
    padding: 1rem;
    white-space: normal;
    text-align: center;
    justify-content: space-between;
    margin-bottom: 15px;
`

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`

const CardHeadline = styled.h1`
    font-style: normal;
    font-weight: 800;
    font-size: 20px;
    text-align: center;
    color: #000000;
    margin: 0;
    margin-bottom: 1rem;
`

const IconContainer = styled.div`
    margin-top: 3rem;
    margin-bottom: 2rem;
`

const InputWrapper = styled.div`
    height: 0px;
    overflow: hidden;
`
const Text = styled.p`
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    color: rgba(0, 0, 0, 0, 8);
    margin: 0;
    margin-bottom: 2rem;
`

export type CurrentDocument = { state: DocumentState; type: UploadedDocument; side: Side }

export const VerificationCard = ({
    currentDocument,
    state,
    callback = (resp) => null,
    side,
    hasOneSide = false,
    delayInMillisec = 0,
}: {
    currentDocument: CurrentDocument
    state: VeriffState
    callback: (resp: Partial<AxiosResponse<VerificationUploadResponse, any>>, currentDocument: CurrentDocument) => void
    side: Side
    hasOneSide?: boolean
    delayInMillisec?: number
}) => {
    const { t } = useTranslation()
    const uploadController = useRef<HTMLInputElement>(null)
    const [loading, setLoading] = useState(false)
    const [veriffState, setVeriffState] = useState(state)
    const maxSizeInMB = 10

    const checkFileSize = (filesize: number) => +(filesize / 1024 / 1024).toFixed(2) > maxSizeInMB || filesize === 0

    const handleFileUpload = async (fileChangeEvent: React.ChangeEvent<HTMLInputElement>) => {
        try {
            const file = fileChangeEvent.target.files?.[0] || null

            if (!file || !fileChangeEvent.target.files || !currentDocument) throw new Error()

            setLoading(true)

            if (!file) {
                throw new Error()
            }

            if (checkFileSize(file.size)) {
                throw new Error()
            }

            const formData = new FormData()
            formData.append('file', file)

            const resp = await identityService.uploadDocument(currentDocument.type, currentDocument.side, formData)

            if (resp.data) {
                if (resp.status === 201 && resp.data.status === VerificationUploadStatus.submitted) {
                    setVeriffState(VeriffState.submitted)
                }
            }

            setTimeout(() => {
                callback && callback(resp, currentDocument)
                setLoading(false)
            }, delayInMillisec)
        } catch (err: any) {
            setLoading(false)
        }

        // Cleaning
        fileChangeEvent.target.value = ''
    }

    return (
        <CardWrapper>
            <VerificationBadge state={veriffState} />
            <Container>
                <IconContainer>
                    <Verified />
                </IconContainer>
                <CardHeadline>
                    {t(
                        stateMetaData[currentDocument.state]?.headerText.key,
                        stateMetaData[currentDocument.state]?.headerText.default,
                    )}
                </CardHeadline>
                <Text>
                    {t('verificationCardText', 'You will need your government issued identification for this process.')}
                </Text>
                <InputWrapper>
                    <input
                        type="file"
                        id="photo"
                        name="photo"
                        accept="image/png, image/jpg"
                        ref={uploadController}
                        onChange={handleFileUpload}
                    />
                </InputWrapper>
                {hasOneSide ? (
                    <ButtonOutlined
                        text={t(
                            stateMetaData[currentDocument.state]?.headerText.key,
                            stateMetaData[currentDocument.state]?.headerText.default,
                        )}
                        onClick={() => uploadController.current?.click()}
                        loading={loading}
                        disabled={loading}
                    />
                ) : (
                    <ButtonOutlined
                        loading={loading}
                        disabled={loading}
                        text={`upload ${side} side`}
                        onClick={() => uploadController.current?.click()}
                    />
                )}
            </Container>
        </CardWrapper>
    )
}
