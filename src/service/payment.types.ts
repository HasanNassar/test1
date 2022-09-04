export type UserBillingAddressResponse = {
    externalCustomerId: string
    careemId: string
    billingName: string
    vatId: string
    addressLine1: string
    addressLine2: string
    city: string
    region: string
    zipCode: string
    country: string
    createdBy: string
    createdAt: string
    updatedBy: string
    updatedAt: string
}

export type UserBillingAddress = {
    id: string
    type: string
    billingName: string
    vatId: string
    addressLine1: string
    addressLine2: string
    city: string
    region: string
    zipCode: string
    country: string
    createdBy: string
    createdAt: string
    updatedBy: string
    updatedAt: string
}

export type Address = {
    id: string
    type: AddressType
}

export enum AddressType {
    DELIVERY = 'DELIVERY',
    RETURN = 'RETURN',
}

export type AddressResponse = {
    addressType: AddressType
    comments: string
    lat: number
    long: number
    building: string
    addressLine1: string
    addressLine2: string
    city: string
    region: string
    zipCode: string
    country: string
    createdBy: string
    createdAt: string
    updatedBy: string
    updatedAt: string
}

export type CancelBookingResponse = {
    surchargeAmount: number
    status: string
}

export type CancellationFeeResponse = {
    surchargeAmount: number
}

export type UserEditBillingAddress = {
    billingName: string
    vatId?: string
    addressLine1?: string
    addressLine2?: string
    city: string
    region?: string
    zipCode?: string
    country: string
    emailAddress?: string
}

export enum InvoiceStatus {
    PENDING = 'PENDING',
    FAILED = 'FAILED',
    SUCCEEDED = 'SUCCEEDED',
    REFUNDEDN = 'REFUNDED',
}

export type CareemStatusResponse = {
    careemInvoiceId: string
    invoiceStatus: InvoiceStatus
}

export type SelectedDate = {
    from: Date
    to: Date
}

export type DailyPriceCalculation = {
    externalListingIds: [number | string]
    cityCode: string
    handoverTime: Date | string
    handbackTime: Date | string
    couponCode?: string
    includeExtraInsurance?: boolean
    includeDelivery?: boolean
}

export type BookingStatusResponse = {
    status: string
    surchargeAmount: number
}

export type RentalDetailsResponse = {
    id: number
    externalBookingId: number
    listingDescription: string
    cityCode: string
    currency: string
    handoverTime: string
    handbackTime: string
    rentalPeriodDays: number
    priceDetails: {
        externalListingId: number
        vatPercentage: number
        dailyPrice: number
        deliveryFee: number
        totalDeposit: number
        firstCharge: number
        totalPrice: number
        totalPriceAfterDiscount: number
        discountAmount: number
        allowedKmsPerDay: number
        surchargeExtraKmsPerUnit: number
        couponDetails: {
            code: string
            valid: boolean
            errors: [
                {
                    type: string
                    parameter: any
                },
            ]
            description: string
            discountAmount: number
            discountRate: number
            discountAmountLimit: number
            minRentalPeriod: number
            maxRentalPeriod: number
            minRentalFee: number
            minMonthlyRentalFee: number
        }
        extraInsuranceFee?: number
        totalExtraInsuranceFee: number
    }
    status: string
    freeCancellationEndsAt: string
    includeExtraInsurance: boolean
    includeDelivery: boolean
}
