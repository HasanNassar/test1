import { axiosify } from '../util/mock'
import { IdentityService } from './identity'
import {
    Side,
    UploadedDocument,
    VeriffState,
    VerificationUploadStatus,
} from '@components/modules/Verification/VerificationUtils'
import {
    MarketingResponse,
    VerificationUploadResponse,
    VerificationVeriffUploadResponse,
    VerificationResponse,
} from './identity.types'

const meResponse = {
    careemId: 'MockCareemId', //MockCareemId
    userId: 'ffc20739-f9a0-4bea-8a46-d1f3d494087b',
    email: 'hello@joinswapp.com',
    isBanned: false,
    firstName: 'Adam',
    lastName: 'Gabor',
    dateOfBirth: '1997-01-17',
    phoneNumber: '36301111111',
    preferredLanguage: 'EN',
    marketingMessagesAccepted: true,
    termsAndConditionsAcceptedAt: '2022-01-19T09:47:01.196664Z',
    isPhoneVerified: true,
    sendSms: false,
}

const verificationResponse: VerificationResponse = {
    driversLicense: {
        status: VeriffState.pending,
        reason: 'string',
        sessionUrl: 'string',
        updatedAt: '2022-02-15T18:07:25.743Z',
    },
    idDocument: {
        status: VeriffState.approved,
        type: 'PASSPORT',
        reason: 'string',
        sessionUrl: 'string',
        updatedAt: '2022-02-15T18:07:25.743Z',
    },
    uploadedDocuments: [
        {
            type: 'string',
            side: Side.front,
            status: VeriffState.approved,
        },
    ],
}

const uploadResponse: VerificationUploadResponse = {
    userId: 0,
    imageKey: 'string',
    documentType: UploadedDocument.driversLicense,
    status: VerificationUploadStatus.approved,
}

const veriffUploadResponse: VerificationVeriffUploadResponse = {
    id: 'string',
    sessionUrl: 'string',
    documentType: UploadedDocument.passport,
}

const marketingResponse: MarketingResponse = {
    marketingMessagesAccepted: true,
}

export const mockIdentityService: IdentityService = {
    getMe: async () => {
        return await axiosify(meResponse)
    },
    getVerificationStatus: async () => {
        return await axiosify(verificationResponse)
    },
    uploadDocument: async () => {
        return await axiosify(uploadResponse)
    },
    sendToVerification: async () => {
        return await axiosify(veriffUploadResponse)
    },
    saveUserProfileData: async (userProfileData) => {
        return await axiosify({ success: true })
    },
    sendMarketingConsent: async (isAccepted) => {
        return await axiosify(marketingResponse)
    },
}
