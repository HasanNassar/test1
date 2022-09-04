import { axios } from '@util/axios'
import { config } from '@util/config'
import { getMockProxy, ServiceResponse } from '@util/mock'
import { mockBookingService } from './booking.mock'
import {
    ListingByIdResponse,
    ListingQuery,
    ListingsResponse,
    BookingResponse,
    BookingStatusUpdateResponse,
    UpdateStatus,
    BookingCustomerByIdResponse,
    CreateBookingType,
} from './booking.types'

const BOOKING_API_URL = `${config.BASE_URL}/booking`

export type BookingService = {
    getListings: (filterParams: ListingQuery) => ServiceResponse<ListingsResponse>
    getListingById: (listingsId: number) => ServiceResponse<ListingByIdResponse>
    createBooking: (bookingParams: CreateBookingType) => ServiceResponse<BookingResponse>
    updateBookingStatus: (bookingId: number, updateStatus: UpdateStatus) => ServiceResponse<BookingStatusUpdateResponse>
    getCustomerBookingById: (bookingId: string | number) => ServiceResponse<BookingCustomerByIdResponse>
    getBookings: () => ServiceResponse<any>
}

const realBookingService: Partial<BookingService> = {
    getListings: async (filterParams) => {
        return await axios.get(`${BOOKING_API_URL}/listings`, {
            params: filterParams,
        })
    },
    getListingById: async (listingsId) => {
        return await axios.get(`${BOOKING_API_URL}/listings/${listingsId}`)
    },
    getBookings: async () => {
        return await axios.get(`${BOOKING_API_URL}/me/bookings`)
    },
    createBooking: async (bookingParams) => {
        return await axios.post(`${BOOKING_API_URL}/me/bookings`, bookingParams)
    },
    updateBookingStatus: async (bookingId, updateStatus) => {
        return await axios.patch(`${BOOKING_API_URL}/me/bookings/${bookingId}/status`, updateStatus)
    },
    getCustomerBookingById: async (bookingId: string | number) => {
        return await axios.get(`${BOOKING_API_URL}/me/bookings/${bookingId}`)
    },
}

export const bookingService: BookingService = getMockProxy(realBookingService, mockBookingService)
