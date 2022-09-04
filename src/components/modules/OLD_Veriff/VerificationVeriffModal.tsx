import { createVeriffFrame, MESSAGES } from '@veriff/incontext-sdk'
import { useEffect, useState } from 'react'
import styled from 'styled-components'

import {
    DocumentState,
    api,
    veriffHost,
    veriffApiKeyID,
    veriffApiKeyDrivingLicence,
    UploadedDocument,
} from '@components/modules/OLD_Veriff/VerificationUtils'
import { identityService } from 'src/service/identity'
import { resolveSoa } from 'dns'

const Wrapper = styled.div`
    .veriff-submit {
        border: 1px solid #ff5a5a;
        color: #ff5a5a;
        background-color: white;
        border-radius: 100px;
        font-size: var(--size-16);
        font-weight: var(--weight-bold);
        text-transform: none;
        /* padding: 0.5rem 1.5rem; */
        width: 100%;
        margin: 0;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .veriff-description {
        visibility: hidden;
    }
`

export const VerificationVeriffModal = ({
    buttonText,
    setIsActive,
    currentDocument,
    onVerificationStatus,
}: {
    buttonText: string
    setIsActive: any
    currentDocument: DocumentState
    onVerificationStatus: any
}) => {
    const [isPolling, setIsPolling] = useState(false)

    const getData = () => {
        // identityService.getVerificationStatus().then(({ data }) => {
        //     const polling = onVerificationStatus(data)
        //     if (polling && polling.stopPolling) {
        //         setIsPolling(false)
        //     }
        // })
    }

    useEffect(() => {
        if (typeof window !== 'undefined') {
            // eslint-disable-next-line global-require
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const { Veriff } = require('@veriff/js-sdk')
            const veriff = Veriff({
                host: veriffHost,
                parentId: 'veriff-root',
                apiKey: ` ${currentDocument === DocumentState.identity ? veriffApiKeyID : veriffApiKeyDrivingLicence}`,
                onSession: async function (err, response) {
                    // received the response, verification can be started now
                    const url = response.verification.url
                    const id = response.verification.id
                    //PUT request to middleware
                    const res = await identityService.sendToVerification(id, url, UploadedDocument.driversLicense)
                    // const sendToVerification = () => {
                    //     api.put(
                    //         '/identity/me/verification/status',
                    //         {
                    //             id: id,
                    //             sessionUrl: url,
                    //             documentType: 'DRIVERS_LICENSE',
                    //         },
                    //         { headers: { Authorization: `Bearer ${token}` } },
                    //     ).then((res) => console.log('PUT REQUEST RESULT:', res))
                    // }

                    createVeriffFrame({
                        url,
                        onEvent: (msg) => {
                            if (msg === MESSAGES.CANCELED || msg === MESSAGES.FINISHED) {
                                setIsPolling(true)
                                setIsActive(true)
                                // veriffFrame.close()
                            }
                        },
                    })
                },
            })
            veriff.setParams({
                //TODO userId-t berakni a vendorData-ba account.userID (még nincs kész a login, ki kell szedni a userID-t)
                person: {
                    givenName: 'Adam',
                    lastName: 'Farkas',
                },
                vendorData: '7eb19312-79d6-11ec-90d6-0242ac120003',
            })
            veriff.mount({
                submitBtnText: buttonText,
            })
        }
    })

    useEffect(() => {
        if (isPolling) {
            getData()
            const timer = setInterval(() => {
                getData()
            }, 5000)
            return () => clearInterval(timer)
        } else {
            return () => null
        }
    }, [isPolling])

    return (
        <Wrapper style={{ color: 'red' }}>
            <div id="veriff-root" />
        </Wrapper>
    )
}
