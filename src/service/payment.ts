import { axios } from '@util/axios'
import { config } from '@util/config'
import { getMockProxy, ServiceResponse } from '@util/mock'

import {
    UserBillingAddressResponse,
    UserEditBillingAddress,
    CareemStatusResponse,
    AddressResponse,
    DailyPriceCalculation,
    BookingStatusResponse,
    RentalDetailsResponse,
    CancelBookingResponse,
    CancellationFeeResponse,
} from './payment.types'

export const PAYMENT_API_URL = `${config.BASE_URL}/payment`

export type PaymentService = {
    getUserBillingAddress: (externalCustomerId: string) => ServiceResponse<UserBillingAddressResponse>
    putUserBillingAddress: (
        externalCustomerId: string,
        userBillingAddress: UserEditBillingAddress,
    ) => ServiceResponse<UserBillingAddressResponse>
    postCareemPayment: (externalCustomerId: string) => ServiceResponse<CareemStatusResponse>
    getCareemPayment: (externalCustomerId: string, careemInvoiceId: string) => ServiceResponse<CareemStatusResponse>
    getRentalDetails: (externalCustomerId: string, bookingId: number) => ServiceResponse<RentalDetailsResponse>
    getAddress: () => ServiceResponse<AddressResponse>
    getCancellationFee: (customerId: string, bookingId: number) => ServiceResponse<CancellationFeeResponse>
}

const realPaymentService: PaymentService = {
    getUserBillingAddress: async (externalCustomerId) => {
        return await axios.get(`${PAYMENT_API_URL}/customers/${externalCustomerId}/billing-details`)
    },
    putUserBillingAddress: async (externalCustomerId, userBillingAddress) => {
        return await axios.put(`${PAYMENT_API_URL}/customers/${externalCustomerId}/billing-details`, {
            ...userBillingAddress,
        })
    },
    getCareemPayment: async (externalCustomerId, pamentRefId) => {
        return await axios.get(`${PAYMENT_API_URL}/customers/${externalCustomerId}/careem/intents/${pamentRefId}`)
    },
    getRentalDetails: async (externalCustomerId: string, bookingId: number) => {
        return await axios.get(`${PAYMENT_API_URL}/customers/${externalCustomerId}/bookings/daily/${bookingId}`)
    },
    postCareemPayment: async (externalCustomerId) => {
        return await axios.post(`${PAYMENT_API_URL}/customers/${externalCustomerId}/careem/intents`, {})
    },
    getAddress: async () => {
        return await axios.post(`${PAYMENT_API_URL}/customers/careem/intents`)
    },
    getCancellationFee: async (customerId, bookingId) => {
        return await axios.get(`${PAYMENT_API_URL}/customers/${customerId}/bookings/${bookingId}/cancellation-fee`)
    },
}

export const pricingService = {
    getActivePriceCalculation: async (listingId: number | string) => {
        return await axios.get(`${PAYMENT_API_URL}/listings/${listingId}/prices/daily/active`)
    },
    postPriceCalculation: async (calculationData: DailyPriceCalculation) => {
        return await axios.post(`${PAYMENT_API_URL}/listings/price-calculation/daily`, calculationData)
    },
}

export const paymentService: PaymentService = realPaymentService

export enum paymentCacheKeys {
    USER_BILLING_ADDRESS = 'USER_BILLING_ADDRESS',
    USER_ADDRESS = 'USER_ADDRESS',
}
