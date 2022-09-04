import {
    Side,
    UploadedDocument,
    VeriffState,
    VerificationUploadStatus,
} from '@components/modules/Verification/VerificationUtils'

export type MeResponse = {
    careemId: string
    userId: string
    email: string
    isBanned: boolean
    firstName: string
    lastName: string
    dateOfBirth: string
    phoneNumber: string
    preferredLanguage: string
    marketingMessagesAccepted: boolean
    termsAndConditionsAcceptedAt: string
    isPhoneVerified: boolean
    sendSms: boolean
}

export type VerificationResponse = {
    driversLicense: {
        status: VeriffState
        reason: string
        sessionUrl: string
        updatedAt: string
    }
    idDocument: {
        status: VeriffState
        type: string
        reason: string
        sessionUrl: string
        updatedAt: string
    }
    uploadedDocuments: [
        {
            type: string
            side: Side
            status: VeriffState
        },
    ]
}

export type VerificationUploadResponse = {
    userId: number
    imageKey: string
    documentType: UploadedDocument
    status: VerificationUploadStatus
}

export type VerificationVeriffUploadResponse = {
    id: string
    sessionUrl: string
    documentType: UploadedDocument
}

export type SaveUserProfileDataResponse = {
    success: boolean
}

export type UserProfileData = {
    email: string
    firstName: string
    lastName: string
    marketingNotification: boolean
    phoneNumber: string
    phonePrefix: string
}

export type MarketingResponse = {
    marketingMessagesAccepted: boolean
}
