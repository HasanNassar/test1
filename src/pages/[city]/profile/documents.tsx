import MainLayout from '@components/layout/MainLayout'
import { Side, UploadedDocument, VerificationUploadStatus } from '@components/modules/Verification/VerificationUtils'
import { DocumentState, VeriffState } from '@components/modules/Verification/VerificationUtils'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { identityService } from '@service/identity'
import { VerificationCard } from '@components/modules/Verification/VerificationCard'
import { useQuery, useQueryClient } from 'react-query'
import { VerificationToastMessage } from '@components/modules/Verification/VerificationToastMessage'
import { VerificationResponse } from '@service/identity.types'
import { AxiosResponse } from 'axios'
import { useRouter } from 'next/router'

const Wrapper = styled.div`
    padding: var(--padding);
`

const Header = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    & > div {
        position: absolute;
        top: 0;
        left: 0;
    }
`
const SubHeadingBig = styled.h4`
    font-weight: bold;
    margin: 0;
    font-size: 16px;
    color: rgba(0, 0, 0, 0.8);
`

const SeparatorBig = styled.div`
    width: 100%;
    border-bottom: 0.5px solid rgba(0, 0, 0, 0.1);
`

const MenuContainer = styled.div`
    display: flex;
    align-items: center;
    column-gap: 40px;
    padding: 0 24px;
    border-bottom: 0.5px solid rgba(0, 0, 0, 0.1);
    margin-bottom: 1px;
    white-space: nowrap;
    overflow-x: scroll;
    &::-webkit-scrollbar {
        display: none;
    }
`

const SubHeadingWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin: 24px 0 -2px 0;
`

const MiniSeparator = styled.div<{ borderShown: boolean }>`
    ${(props) => (props.borderShown ? 'margin-top: 20px;' : 'margin-top: 24px;')}
    ${(props) => (props.borderShown ? 'border-bottom: 4px solid #ff5a5a; border-radius: 100px' : '')}
`

const SubHeading = styled.h4<{ currentDocument?: boolean }>`
    font-weight: bold;
    margin: 0;
    font-size: 16px;
    color: ${(props) => (props.currentDocument ? ' #ff5a5a' : 'rgba(0, 0, 0, 0.8)')};
    &::first-letter {
        text-transform: uppercase;
    }
`

const Container = styled.div`
    position: sticky;
    z-index: 15;
    top: 60px;
    left: 0;
`

const RealtiveContainer = styled.div`
    position: relative;
`

export async function getServerSideProps({ locale }) {
    return {
        props: {
            ...(await serverSideTranslations(locale, ['common'])),
        },
    }
}

export default function billingprofile() {
    const { t } = useTranslation()
    const { query, push } = useRouter()
    const queryClient = useQueryClient()
    const queryTab = query.tab as string
    const [state, setState] = useState(VeriffState.awaitingSubmission)
    const [currentDocument, setCurrentDocument] = useState(queryTab || DocumentState.identity)
    const [isActive, setIsActive] = useState(false)

    const documentsArray = [
        { state: DocumentState.identity, type: UploadedDocument.id, side: Side.front },
        { state: DocumentState.identity, type: UploadedDocument.id, side: Side.back },
        { state: DocumentState.driversLicense, type: UploadedDocument.driversLicense, side: Side.front },
        { state: DocumentState.driversLicense, type: UploadedDocument.driversLicense, side: Side.back },
        {
            state: DocumentState.internationalDriversLicense,
            type: UploadedDocument.internationalDriversLicense,
            side: Side.front,
        },
        {
            state: DocumentState.internationalDriversLicense,
            type: UploadedDocument.internationalDriversLicense,
            side: Side.back,
        },
        { state: DocumentState.passport, type: UploadedDocument.passport, side: Side.front },
        { state: DocumentState.visa, type: UploadedDocument.visa, side: Side.front },
    ]

    const { data, error, isLoading, refetch } = useQuery('verificationStatus', identityService.getVerificationStatus)

    const afterFileUpload = async (resp) => {
        if (resp.data) {
            if (resp.status === 201 && resp.data.status === VerificationUploadStatus.submitted) {
                setState(VeriffState.submitted)
                setIsActive(true)
                await queryClient.cancelQueries('verificationStatus')
                const preQueryResponse: AxiosResponse | undefined = queryClient.getQueryData('verificationStatus')
                const preData = preQueryResponse?.data

                const newUploadDocument = {
                    side: resp.data.side,
                    type: resp.data.documentType,
                    status: resp.data.status,
                }
                const newQueryData = {
                    ...preData,
                    uploadedDocuments: [...(preData?.uploadedDocuments || []), newUploadDocument],
                }
                queryClient.setQueryData('verificationStatus', { data: newQueryData })
            }
        }
    }

    const tabHandler = (state: DocumentState) => {
        setCurrentDocument(state)
        push(`?tab=${state}`, '', { shallow: true })
    }

    useEffect(() => {
        refetch()
    }, [currentDocument])

    if (isLoading || !data || error) {
        return null
    }

    return (
        <MainLayout>
            {isActive ? (
                <Container>
                    <RealtiveContainer>
                        <VerificationToastMessage state={state} setIsActive={setIsActive} />
                    </RealtiveContainer>
                </Container>
            ) : null}
            <Wrapper>
                <Header>
                    <SubHeadingBig>{t('profileMenuDocuments', 'Documents')}</SubHeadingBig>
                </Header>
            </Wrapper>
            <SeparatorBig />
            <MenuContainer>
                <SubHeadingWrapper onClick={() => tabHandler(DocumentState.identity)}>
                    <SubHeading currentDocument={currentDocument === DocumentState.identity}>
                        {t('profileDocumentsIdentity', 'identity')}
                    </SubHeading>
                    <MiniSeparator borderShown={currentDocument === DocumentState.identity} />
                </SubHeadingWrapper>
                <SubHeadingWrapper onClick={() => tabHandler(DocumentState.driversLicense)}>
                    <SubHeading currentDocument={currentDocument === DocumentState.driversLicense}>
                        {t('profileDocumentsDriversLicense', "driver's license")}
                    </SubHeading>
                    <MiniSeparator borderShown={currentDocument === DocumentState.driversLicense} />
                </SubHeadingWrapper>
                <SubHeadingWrapper onClick={() => tabHandler(DocumentState.internationalDriversLicense)}>
                    <SubHeading currentDocument={currentDocument === DocumentState.internationalDriversLicense}>
                        {t('profileDocumentsInterDriversLicense', 'idl')}
                    </SubHeading>
                    <MiniSeparator borderShown={currentDocument === DocumentState.internationalDriversLicense} />
                </SubHeadingWrapper>
                <SubHeadingWrapper onClick={() => tabHandler(DocumentState.passport)}>
                    <SubHeading currentDocument={currentDocument === DocumentState.passport}>
                        {t('profileDocumentsPassport', 'passport')}
                    </SubHeading>
                    <MiniSeparator borderShown={currentDocument === DocumentState.passport} />
                </SubHeadingWrapper>
                <SubHeadingWrapper onClick={() => tabHandler(DocumentState.visa)}>
                    <SubHeading currentDocument={currentDocument === DocumentState.visa}>
                        {t('profileDocumentsVisa', 'visa')}
                    </SubHeading>
                    <MiniSeparator borderShown={currentDocument === DocumentState.visa} />
                </SubHeadingWrapper>
            </MenuContainer>
            <Wrapper>
                {documentsArray.map((item, index) => {
                    if (currentDocument !== item.state) return
                    const verificationStatus = data?.data?.uploadedDocuments.filter((filteredItem) => {
                        return filteredItem.type === item.type && filteredItem.side === item.side
                    })
                    const state =
                        verificationStatus && verificationStatus?.length > 0
                            ? verificationStatus[0].status
                            : VeriffState.awaitingSubmission
                    return (
                        <Wrapper key={index}>
                            <VerificationCard
                                currentDocument={item}
                                state={state}
                                side={item.side}
                                hasOneSide={
                                    currentDocument === DocumentState.passport || currentDocument === DocumentState.visa
                                }
                                callback={afterFileUpload}
                            />
                        </Wrapper>
                    )
                })}
            </Wrapper>
        </MainLayout>
    )
}
