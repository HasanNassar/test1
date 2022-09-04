import { CheckCircle } from '@components/global/icons/CheckCircle'
import { ErrorCircle } from '@components/global/icons/ErrorCircle'
import { MarkEmailRead } from '@components/global/icons/MarkEmailRead'
import { VerifiedUser } from '@components/global/icons/VerifiedUser'
import axios from 'axios'
import styled from 'styled-components'
import { VerificationDotWithBorder } from './VerificationDotWithBorder'

const DotContainer = styled.div`
    display: flex;
    margin-bottom: 1.5rem;
    justify-content: space-between;
    min-width: 300px;
`

const Dot = styled.div<{ color?: string; textColor?: string }>`
    height: 40px;
    width: 40px;
    background-color: ${(props) => (props.color ? props.color : '#E1E1E1')};
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${(props) => props.textColor};
    margin-bottom: 1rem;
`
const SmallSeparator = styled.div<{ color: string }>`
    margin-top: 28px;

    background: linear-gradient(270deg, ${(props) => props.color} 0%, #e1e1e1 100%);
    transform: matrix(-1, 0, 0, 1, 0, 0);
    height: 2px;
    width: 100%;
`

const SmallSeparatorApproved = styled.div<{ color: string }>`
    margin-top: 28px;
    background: linear-gradient(270deg, #09b46b 0%, ${(props) => props.color} 100%);
    transform: matrix(-1, 0, 0, 1, 0, 0);
    height: 2px;
    width: 100%;
`

const BigSeparator = styled.div<{ color?: string }>`
    margin-top: 28px;
    height: 2px;
    width: 100%;
    background: ${(props) => (props.color ? props.color : '#e1e1e1')};
`

const DotLabel = styled.p`
    font-style: normal;
    font-weight: 600;
    font-size: 10px;
    margin: 0 0 1.5rem 0;
    text-transform: uppercase;
    color: rgba(0, 0, 0, 0.4);
    opacity: 0.8;
`
const DotWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 0.5rem;
    text-align: center;
    white-space: nowrap;
    text-overflow: ellipsis;
    max-width: 40px;
`

const DotWrapperWithBorder = styled.div<{ margin?: string }>`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: ${(props) => props.margin};
    text-align: center;
    white-space: nowrap;
    text-overflow: ellipsis;
    max-width: 56px;
`

const label = ['identity', "driver's license", 'passport', 'visa']

export enum Side {
    oneSided = '',
    front = 'FRONT',
    back = 'BACK',
}

export enum VeriffState {
    awaitingSubmission = 'AWAITING_SUBMISSION',
    pending = 'PENDING',
    submitted = 'SUBMITTED',
    approved = 'APPROVED',
    declined = 'DECLINED',
    resubmissionRequested = 'RESUBMISSION_REQUESTED',
}

export enum VerificationUploadStatus {
    submitted = 'SUBMITTED',
    approved = 'APPROVED',
    declined = 'DECLINED',
}

export enum DocumentState {
    identity = 'IDENTITY',
    driversLicense = 'DRIVERS_LICENSE',
    internationalDriversLicense = 'INTERNATIONAL_DRIVERS_LICENSE',
    passport = 'PASSPORT',
    visa = 'VISA',
}

export enum UploadedDocument {
    id = 'ID_CARD',
    visa = 'VISA',
    passport = 'PASSPORT',
    driversLicense = 'DRIVERS_LICENSE',
    internationalDriversLicense = 'INTERNATIONAL_DRIVERS_LICENSE',
    residence = 'RESIDENCE_PERMIT',
    other = 'OTHER',
}
export const api = axios.create({
    baseURL: 'https://dev.joinswapp.com',
})

export const veriffHost = process.env.VERIFF_HOST || 'https://stationapi.veriff.com'
export const token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJpZGVudGl0eS1zZXJ2aWNlQGRldi5qb2luc3dhcHAuY29tIiwiYXVkIjoiZGV2LmpvaW5zd2FwcC5jb20iLCJyb2xlcyI6WyJST0xFX0NVU1RPTUVSIl0sInN3YXBwVXNlcklkIjoiZmZjMjA3MzktZjlhMC00YmVhLThhNDYtZDFmM2Q0OTQwODdiIiwiZXhwIjoxNjQ4NzcxMjAwLCJpYXQiOjE2NDMwMzY0ODYsImlzcyI6ImRldi5qb2luc3dhcHAuY29tIiwiY2FyZWVtSWQiOiIwLmY4a0ViY2dseDlzZDlJYmx3Q0lwMFE9PSIsImVtYWlsIjoiMC5mOGtFYmNnbHg5c2Q5SWJsd0NJcDBRPT1Aam9pbnN3YXBwLmNvbSJ9.-7aC2s_KAkq3kNmkaOfKecY8dAUcGTlVnSTWJRsH5F4'

export const veriffApiKeyID = process.env.VERIFF_ID_API_KEY || 'e3e2a655-9e4b-4b3e-87fe-e9507e54274c'
export const veriffApiKeyDrivingLicence =
    process.env.VERIFF_DRIVERS_LICENSE_API_KEY || '75899e73-a0bf-4529-9064-37c31865244f'

export const stateColor = {
    [VeriffState.awaitingSubmission]: {
        color: '#FF5A5A',
        background: 'rgba(255, 90, 90, 0.2)',
        text: 'unverified',
        icon: <VerifiedUser />,
        alertText: 'Please complete verification so you can book a car',
    },
    [VeriffState.pending]: {
        color: '#FFA845',
        background: 'rgba(255, 168, 69, 0.2)',
        text: 'pending',
        icon: <MarkEmailRead />,
        alertText: 'Documents succesfully submitted for verification',
    },
    [VeriffState.submitted]: {
        color: '#FFA845',
        background: 'rgba(255, 168, 69, 0.2)',
        text: 'submitted',
        icon: <MarkEmailRead />,
        alertText: 'Documents succesfully submitted for verification',
    },
    [VeriffState.approved]: {
        color: '#09B46B',
        background: 'rgba(9, 180, 107, 0.2)',
        text: 'verified',
        icon: <CheckCircle />,
        alertText: 'Congratulations, your documents have been successfully verified',
    },
    [VeriffState.declined]: {
        color: '#FF5A5A',
        background: 'rgba(255, 90, 90, 0.2)',
        text: 'unverified',
        icon: <ErrorCircle />,
        alertText: 'Verification failed, please resubmit documents to continue booking',
    },
    [VeriffState.resubmissionRequested]: {
        color: '#FF5A5A',
        background: 'rgba(255, 90, 90, 0.2)',
        text: 'unverified',
        icon: <ErrorCircle />,
        alertText: 'Verification failed, please resubmit documents to continue booking',
    },
}

export const stateMetaData = {
    [DocumentState.identity]: {
        headerText: { key: 'identityHeaderText', default: 'Verify UAE Identity' },
        dots: (state) => {
            return (
                <DotContainer>
                    <DotWrapperWithBorder>
                        <VerificationDotWithBorder color={stateColor[state].color} number="1" />
                        <DotLabel>{label[0]}</DotLabel>
                    </DotWrapperWithBorder>
                    <SmallSeparator color={stateColor[state].color} />
                    <DotWrapper>
                        <Dot>2</Dot>
                        <DotLabel>{label[1]}</DotLabel>
                    </DotWrapper>
                    <BigSeparator />
                    <DotWrapper>
                        <Dot>3</Dot>
                        <DotLabel>{label[2]}</DotLabel>
                    </DotWrapper>
                    <BigSeparator />
                    <DotWrapper>
                        <Dot>4</Dot>
                        <DotLabel>{label[3]}</DotLabel>
                    </DotWrapper>
                </DotContainer>
            )
        },
    },
    [DocumentState.driversLicense]: {
        headerText: { key: 'driverLicenseHeaderText', default: 'Verify UAE Driver’s License' },
        dots: (state) => {
            return (
                <DotContainer>
                    <DotWrapper>
                        <Dot color="#09B46B">1</Dot>
                        <DotLabel>{label[0]}</DotLabel>
                    </DotWrapper>
                    <SmallSeparatorApproved color={stateColor[state].color} />
                    <DotWrapperWithBorder>
                        <VerificationDotWithBorder color={stateColor[state].color} number="2" />
                        <DotLabel>{label[1]}</DotLabel>
                    </DotWrapperWithBorder>
                    <SmallSeparator color={stateColor[state].color} />
                    <DotWrapper>
                        <Dot>3</Dot>
                        <DotLabel>{label[2]}</DotLabel>
                    </DotWrapper>
                    <BigSeparator />
                    <DotWrapper>
                        <Dot>4</Dot>
                        <DotLabel>{label[3]}</DotLabel>
                    </DotWrapper>
                </DotContainer>
            )
        },
    },
    [DocumentState.internationalDriversLicense]: {
        headerText: { key: 'interDriverLicenseHeaderText', default: 'Verify International Driver’s License' },
        dots: (state) => {
            return (
                <DotContainer>
                    <DotWrapper>
                        <Dot color="#09B46B">1</Dot>
                        <DotLabel>{label[0]}</DotLabel>
                    </DotWrapper>
                    <SmallSeparatorApproved color={stateColor[state].color} />
                    <DotWrapperWithBorder>
                        <VerificationDotWithBorder color={stateColor[state].color} number="2" />
                        <DotLabel>{label[1]}</DotLabel>
                    </DotWrapperWithBorder>
                    <SmallSeparator color={stateColor[state].color} />
                    <DotWrapper>
                        <Dot>3</Dot>
                        <DotLabel>{label[2]}</DotLabel>
                    </DotWrapper>
                    <BigSeparator />
                    <DotWrapper>
                        <Dot>4</Dot>
                        <DotLabel>{label[3]}</DotLabel>
                    </DotWrapper>
                </DotContainer>
            )
        },
    },
    [DocumentState.passport]: {
        headerText: { key: 'passportHeaderText', default: 'Upload Passport' },
        dots: (state) => {
            return (
                <DotContainer>
                    <DotWrapper>
                        <Dot color="#09B46B">1</Dot>
                        <DotLabel>{label[0]}</DotLabel>
                    </DotWrapper>
                    <BigSeparator color="#09B46B" />
                    <DotWrapper>
                        <Dot color="#09B46B">2</Dot>
                        <DotLabel>{label[1]}</DotLabel>
                    </DotWrapper>
                    <SmallSeparatorApproved color={stateColor[state].color} />
                    <DotWrapperWithBorder>
                        <VerificationDotWithBorder color={stateColor[state].color} number="3" />
                        <DotLabel>{label[2]}</DotLabel>
                    </DotWrapperWithBorder>
                    <SmallSeparator color={stateColor[state].color} />
                    <DotWrapper>
                        <Dot>4</Dot>
                        <DotLabel>{label[3]}</DotLabel>
                    </DotWrapper>
                </DotContainer>
            )
        },
    },
    [DocumentState.visa]: {
        headerText: { key: 'visaHeaderText', default: 'Upload VISA' },
        dots: (state) => {
            return (
                <DotContainer>
                    <DotWrapper>
                        <Dot color="#09B46B">1</Dot>
                        <DotLabel>{label[0]}</DotLabel>
                    </DotWrapper>
                    <BigSeparator color="#09B46B" />
                    <DotWrapper>
                        <Dot color="#09B46B">2</Dot>
                        <DotLabel>{label[1]}</DotLabel>
                    </DotWrapper>
                    <BigSeparator color="#09B46B" />
                    <DotWrapper>
                        <Dot color="#09B46B">3</Dot>
                        <DotLabel>{label[2]}</DotLabel>
                    </DotWrapper>
                    <SmallSeparatorApproved color={stateColor[state].color} />
                    <DotWrapperWithBorder>
                        <VerificationDotWithBorder color={stateColor[state].color} number="4" />
                        <DotLabel>{label[3]}</DotLabel>
                    </DotWrapperWithBorder>
                </DotContainer>
            )
        },
    },
}
