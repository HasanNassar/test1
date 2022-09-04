import { Side, UploadedDocument } from '@components/modules/Verification/VerificationUtils'
import { axios } from '@util/axios'
import { config } from '../util/config'
import { getMockProxy, ServiceResponse } from '../util/mock'
import { mockIdentityService } from './identity.mock'
import {
    MeResponse,
    VerificationUploadResponse,
    VerificationResponse,
    VerificationVeriffUploadResponse,
    UserProfileData,
    SaveUserProfileDataResponse,
    MarketingResponse,
} from './identity.types'

export const IDENTITY_API_URL = `${config.BASE_URL}/identity`

export type IdentityService = {
    getMe: () => ServiceResponse<MeResponse>
    getVerificationStatus: () => ServiceResponse<VerificationResponse>
    uploadDocument: (
        uploadDocumentType: UploadedDocument,
        side: Side,
        formData: FormData,
    ) => ServiceResponse<VerificationUploadResponse>
    sendToVerification: (
        id: string,
        sessionUrl: string,
        documentType: UploadedDocument,
    ) => ServiceResponse<VerificationVeriffUploadResponse>
    sendMarketingConsent: (isAccepted: boolean) => ServiceResponse<MarketingResponse>
    saveUserProfileData: (userProfileData: UserProfileData) => ServiceResponse<SaveUserProfileDataResponse>
}

const realIdentityService: Partial<IdentityService> = {
    getMe: async () => {
        return await axios.get(`${IDENTITY_API_URL}/me/details`)
    },
    getVerificationStatus: async () => {
        return await axios.get(`${IDENTITY_API_URL}/me/verification/status`)
    },
    uploadDocument: async (uploadDocumentType, side, formData) => {
        return await axios.post(`${IDENTITY_API_URL}/me/documents/${uploadDocumentType}/${side}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        })
    },
    sendToVerification: async (id, url, uploadedDocument) => {
        return await axios.put('/identity/me/verification/status', {
            id: id,
            sessionUrl: url,
            documentType: uploadedDocument,
        })
    },
    sendMarketingConsent: async (isAccepted) => {
        return await axios.patch('/identity/me/details/marketing-consent', { marketingMessagesAccepted: isAccepted })
    },
    saveUserProfileData: async (userProfileData) => {
        return await axios.put(`${IDENTITY_API_URL}/me/profile`, userProfileData)
    },
}

export const identityService: IdentityService = getMockProxy(realIdentityService, mockIdentityService)
