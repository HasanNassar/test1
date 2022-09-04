import { CurrentDocument, VerificationCard } from '../../components/modules/Verification/VerificationCard'
import styled from 'styled-components'
import MainLayout from '@components/layout/MainLayout'
import { Button } from '@components/global/Button'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useCallback, useEffect, useRef, useState } from 'react'
import { VerificationToastMessage } from '@components/modules/Verification/VerificationToastMessage'
import { VerificationDots } from '@components/modules/Verification/VerificationDots'
import { Side, UploadedDocument, VerificationUploadStatus } from '@components/modules/Verification/VerificationUtils'
import { VeriffState } from '@components/modules/Verification/VerificationUtils'
import { DocumentState } from '@components/modules/Verification/VerificationUtils'
import { useRouter } from 'next/router'
import { identityService } from 'src/service/identity'
import { StatusCodes } from 'http-status-codes'
import { VerificationResponse } from '@service/identity.types'

const Wrapper = styled.div`
    padding: var(--padding);
    background: #ffffff;
    background-size: 100% 100%;
    position: relative;
    overflow-y: scroll;
    padding-bottom: 4rem;
`

const Headline = styled.h1`
    font-size: var(--size-24);
    font-weight: var(--weight-extraBold);
    color: black;
    margin: 0 0 0.5rem 0;
`

const FullListText = styled.p`
    font-weight: 500;
    font-size: 16px;
    margin: 0;
    color: rgba(0, 0, 0, 0.8);
    margin: 0 0 1rem 0;
`

export async function getServerSideProps({ locale }) {
    return {
        props: {
            ...(await serverSideTranslations(locale, ['common'])),
        },
    }
}

export default function verification() {
    const { t } = useTranslation()
    const router = useRouter()
    const [isReady, setIsReady] = useState(true)
    const [state, setState] = useState(VeriffState.awaitingSubmission)
    const [isActive, setIsActive] = useState(true)
    const [currentDocument, setCurrentDocument] = useState(DocumentState.identity)
    const [isVerificationDone, setIsVerificationDone] = useState(false)
    const [uploadDocumentType, setUploadDocumentType] = useState<UploadedDocument>()
    const [side, setSide] = useState<Side>(Side.front)
    const [internationalDriverSide, setInternationalDriverSide] = useState<Side>(Side.front)
    const [verificationStatus, setVerificationStatus] = useState<VerificationResponse>()
    const [errorMsg, setErrorMsg] = useState<string>()

    const getUploadedDocument = async () => {
        try {
            const response = await identityService.getVerificationStatus()
            setVerificationStatus(response.data)
        } catch {
            setState(VeriffState.awaitingSubmission)
            setErrorMsg(t('verificationProcessError', 'Something went wrong during operation. Please try again'))
        }
    }

    const afterUpload = (resp, document: CurrentDocument) => {
        if (resp.data) {
            if (resp.status === StatusCodes.CREATED && resp.data.status === VerificationUploadStatus.submitted) {
                getUploadedDocument()
            }
        }
    }

    const findDocuments = (arr, docType, docSide) => {
        return arr.find(({ status, type, side }) => {
            return status !== 'DECLINED' && type === docType && side === docSide
        })
    }

    const documentStatus = useCallback(
        (type: UploadedDocument, isTwoSide = true) => {
            console.log('checkingDocument: ', verificationStatus?.uploadedDocuments)
            const front = findDocuments(verificationStatus?.uploadedDocuments, type, Side.front)
            if (front && !isTwoSide) return { ready: true, missingSide: null }

            const back = findDocuments(verificationStatus?.uploadedDocuments, type, Side.back)
            if (back && front && isTwoSide) return { ready: true, missingSide: null }

            if (front) {
                return { ready: false, missingSide: Side.back }
            }

            return { ready: false, missingSide: Side.front }
        },
        [verificationStatus],
    )

    const checkAllDocumentStatus = () => {
        //Identity
        const identiyCheck = documentStatus(UploadedDocument.id)
        if (identiyCheck.ready) {
            setCurrentDocument(DocumentState.driversLicense)
            setUploadDocumentType(UploadedDocument.driversLicense)
        } else {
            if (identiyCheck.missingSide === Side.back) setSide(Side.back)
            setUploadDocumentType(UploadedDocument.id)
            return setCurrentDocument(DocumentState.identity)
        }

        //Drivers License and International Drivers License
        const driversLicenseCheck = documentStatus(UploadedDocument.driversLicense)
        const internationalDriversLicenseCheck = documentStatus(UploadedDocument.internationalDriversLicense)
        if (driversLicenseCheck.ready || internationalDriversLicenseCheck.ready) {
            setCurrentDocument(DocumentState.passport)
            setUploadDocumentType(UploadedDocument.passport)
            setSide(Side.front)
        } else {
            driversLicenseCheck.missingSide === Side.back ? setSide(Side.back) : setSide(Side.front)
            internationalDriversLicenseCheck.missingSide === Side.back
                ? setInternationalDriverSide(Side.back)
                : setInternationalDriverSide(Side.front)

            return setCurrentDocument(DocumentState.driversLicense)
        }

        //Passport
        const passportCheck = documentStatus(UploadedDocument.passport, false)
        if (passportCheck.ready) {
            setCurrentDocument(DocumentState.visa)
            setUploadDocumentType(UploadedDocument.visa)
        } else {
            setUploadDocumentType(UploadedDocument.passport)
            return setCurrentDocument(DocumentState.passport)
        }
        //Visa
        const visaCheck = documentStatus(UploadedDocument.visa, false)
        if (visaCheck.ready) {
            setIsVerificationDone(true)
            setState(VeriffState.approved)
        } else {
            setUploadDocumentType(UploadedDocument.visa)
            return setCurrentDocument(DocumentState.visa)
        }
    }

    useEffect(() => {
        getUploadedDocument()
    }, [])

    useEffect(() => {
        if (verificationStatus?.uploadedDocuments) {
            checkAllDocumentStatus()
        }
    }, [verificationStatus])

    if (!verificationStatus) {
        return null
    }

    return isReady ? (
        <MainLayout>
            <Wrapper>
                {isActive ? <VerificationToastMessage state={state} setIsActive={setIsActive} text={errorMsg} /> : null}
                <Headline>{t('verificationProcessText', 'idVerification processentity')}</Headline>
                <FullListText>
                    {t('verificationProcessWarning', 'Please complete the 4 steps below to continue')}
                </FullListText>
                <VerificationDots currentDocument={currentDocument} state={state} />
                {currentDocument === DocumentState.driversLicense ? (
                    <>
                        <VerificationCard
                            currentDocument={{
                                state: DocumentState.driversLicense,
                                type: UploadedDocument.driversLicense,
                                side: side,
                            }}
                            state={state}
                            side={side}
                            callback={afterUpload}
                            delayInMillisec={2000}
                        />
                        <VerificationCard
                            currentDocument={{
                                state: DocumentState.internationalDriversLicense,
                                type: UploadedDocument.internationalDriversLicense,
                                side: internationalDriverSide,
                            }}
                            state={state}
                            side={internationalDriverSide}
                            callback={afterUpload}
                            delayInMillisec={2000}
                        />
                    </>
                ) : (
                    <VerificationCard
                        currentDocument={{
                            state: currentDocument,
                            type: uploadDocumentType || UploadedDocument.other,
                            side: side,
                        }}
                        state={state}
                        side={side}
                        hasOneSide={
                            currentDocument === DocumentState.passport || currentDocument === DocumentState.visa
                        }
                        callback={afterUpload}
                        delayInMillisec={2000}
                    />
                )}
                <Button
                    text={t('verificationNameCheckButtonText', 'Done')}
                    disabled={!isVerificationDone}
                    onClick={() => router.push('/dubai/verificationsuccess')}
                />
            </Wrapper>
        </MainLayout>
    ) : null
}
