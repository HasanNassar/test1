import { Address } from '@contexts/search'

export type ListingsResponse = {
    paginationInfo: PaginationInfo
    data: ListingsResponseData[]
}

export type PaginationInfo = {
    currentPage: number
    pageSize: number
    totalElements: number
    totalPages: number
}

export type ListingsResponseData = {
    id: number | string
    pricingDetails: {
        dailyPrice: number
        totalPrice: number
        currency: string
    }
    coverPhoto: string
    make: string
    model: string
    generation: string
    carType: CarType
    gearboxType: GearBoxType
    seats: number
    carFeatures: string[]
    engineSize: string
}

export type ListingQuery = {
    page?: number
    pageSize?: number
    cityCode?: string
    handoverTime?: Date | string
    handbackTime?: Date | string
    carType?: CarType[]
    minDailyPrice: number
    maxDailyPrice: number
    minSeats?: number
    maxSeats?: number
}

export enum GearBoxType {
    MANUAL = 'MANUAL',
    AUTOMATIC = 'AUTOMATIC',
}

export type TagDto = {
    id: number
    i18nKey: string
    backgroundHexCode: string
    isLabelDark: boolean
    createdAt: string
    createdBy: string
    updatedAt: string
    updatedBy: string
}

export enum CarType {
    COUPE = 'COUPE',
    CONVERTIBLE = 'CONVERTIBLE',
    CROSSOVER = 'CROSSOVER',
    MPV = 'MPV',
    HATCHBACK = 'HATCHBACK',
    SEDAN = 'SEDAN',
    STATION_WAGON = 'STATION_WAGON',
    SUV = 'SUV',
}

export type CarFeature = {
    i18nKey: string
    id: number
}

export type EngineSize = {
    value: string
}

export type ListingPricingDetails = {
    dailyPrice: number
    totalPrice: number
    extraInsuranceFee?: number
    allowedKmsPerDay: number
    extraMileageFee: number
    currency: string
}

export type ListingByIdResponse = {
    id: number | string
    pricingDetails: ListingPricingDetails
    photos: [
        {
            id: number
            imageKey: string
            cover: boolean
            position: number
        },
    ]
    carFeatures: [CarFeature]
    colors: [
        {
            id: number
            i18nKey: string
            hexCode: string
        },
    ]
    make: string
    model: string
    generation: string
    carType: CarType
    gearboxType: GearBoxType
    seats: number
    engineSize: string
    location: {
        addressLine1: string
        addressLine2: string
        city: string
        country: string
        id: number
        latitude: string
        longitude: string
        region: string
        zipCode: number | null
    } | null
}

export type BookingParamsType = {
    listingId: number
    preferredColorId: number | null
    handoverTime: string
    handbackTime: string
    handoverAddressId: number
    handbackAddressId: number
    includeExtraInsurance: boolean
    couponCode: string
    marketingMessagesAccepted: boolean
}

export type CreateBookingType = {
    listingId: number
    preferredColorId: number
    handoverTime: Date
    handbackTime: Date
    handoverAddress: Address
    handbackAddress: Address
    includeExtraInsurance: boolean
    includeDelivery: boolean
    couponCode?: string
    marketingMessagesAccepted: boolean
}

export type BookingResponse = {
    bookingId: number
    paymentRefId: string
}

export type BookingStatusUpdateResponse = {
    bookingId: number
    paymentRefId: string
}

export enum StatusType {
    PENDING_PAYMENT = 'PENDING_PAYMENT',
    PENDING_APPROVAL = 'PENDING_APPROVAL',
    APPROVED = 'APPROVED',
    ACTIVE = 'ACTIVE',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED',
}

export type UpdateStatus = {
    status: StatusType.PENDING_APPROVAL | StatusType.APPROVED | StatusType.CANCELLED
}

export type BookingCustomerByIdResponse = {
    bookingId: number
    listingId: number
    customerId: string
    supplierId: string
    status: StatusType
    handoverTime: string
    handbackTime: string
    timezone: string
    includeDelivery: boolean
    handoverAddress: {
        id: number
        addressLine1: string
        addressLine2: string
        city: string
        region: string
        zipCode: string
        country: string
    }
    handbackAddress: {
        id: number
        addressLine1: string
        addressLine2: string
        city: string
        region: string
        zipCode: string
        country: string
    }
    roadsideAssistanceNumber?: string | null
}
