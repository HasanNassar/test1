import { axiosify } from '@util/mock'
import { BookingService } from './booking'
import {
    CarType,
    GearBoxType,
    ListingByIdResponse,
    ListingsResponse,
    BookingResponse,
    BookingStatusUpdateResponse,
    BookingCustomerByIdResponse,
    StatusType,
} from './booking.types'

const listingsData: ListingsResponse = {
    paginationInfo: {
        currentPage: 0,
        pageSize: 0,
        totalElements: 0,
        totalPages: 0,
    },
    data: [
        {
            id: 0,
            pricingDetails: {
                dailyPrice: 10000,
                totalPrice: 220000,
                currency: 'HUF',
            },
            coverPhoto: '/rental/MockCar.png',
            make: 'BMW',

            model: 'i8',
            generation: '2022',
            carType: CarType.SUV,
            gearboxType: GearBoxType.AUTOMATIC,
            seats: 5,
            carFeatures: ['parkingSensors', 'airConditioning', 'heatedSeats'],
            engineSize: '1.6L',
        },
        {
            id: 2,
            pricingDetails: {
                dailyPrice: 10000,
                totalPrice: 220000,
                currency: 'HUF',
            },
            coverPhoto: '/rental/MockCar.png',
            make: 'BMW',
            model: 'i8',
            generation: '2022',
            carType: CarType.SUV,
            gearboxType: GearBoxType.AUTOMATIC,
            seats: 5,
            carFeatures: ['parkingSensors'],
            engineSize: '1.6L',
        },
    ],
}

const listingByIdData: ListingByIdResponse = {
    id: 0,
    pricingDetails: {
        dailyPrice: 1000,
        totalPrice: 221000,
        extraInsuranceFee: 4210,
        allowedKmsPerDay: 175,
        extraMileageFee: 340,
        currency: 'HUF',
    },
    photos: [
        {
            id: 0,
            imageKey: 'string',
            cover: true,
            position: 0,
        },
    ],
    carFeatures: [
        {
            i18nKey: 'string',
            id: 0,
        },
    ],
    colors: [
        {
            id: 0,
            i18nKey: 'string',
            hexCode: 'stringS',
        },
    ],
    make: 'BMW',
    model: 'i8',
    generation: '2022',
    carType: CarType.COUPE,
    gearboxType: GearBoxType.AUTOMATIC,
    seats: 5,
    engineSize: '1.6L',
    location: null,
}

const bookingResponse: BookingResponse = {
    bookingId: 0,
    paymentRefId: 'string',
}

const bookingStatusUpdateResponse: BookingStatusUpdateResponse = {
    bookingId: 0,
    paymentRefId: '123123123-123123123-paymentRefId',
}

const bookingCustomerByIdResponse: BookingCustomerByIdResponse = {
    bookingId: 0,
    listingId: 0,
    customerId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    supplierId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    status: StatusType.PENDING_PAYMENT,
    handoverTime: '2022-03-14T10:03:50.792Z',
    handbackTime: '2022-03-14T10:03:50.792Z',
    timezone: 'string',
    includeDelivery: false,
    handoverAddress: {
        id: 0,
        addressLine1: 'string',
        addressLine2: 'string',
        city: 'string',
        region: 'string',
        zipCode: 'string',
        country: 'string',
    },
    handbackAddress: {
        id: 0,
        addressLine1: 'string',
        addressLine2: 'string',
        city: 'string',
        region: 'string',
        zipCode: 'string',
        country: 'string',
    },
}

export const mockBookingService: BookingService = {
    getListings: async () => {
        return await axiosify(listingsData)
    },
    getListingById: async () => {
        return await axiosify(listingByIdData)
    },
    createBooking: async () => {
        return await axiosify(bookingResponse)
    },
    updateBookingStatus: async () => {
        return await axiosify(bookingStatusUpdateResponse)
    },
    getCustomerBookingById: async () => {
        return await axiosify(bookingCustomerByIdResponse)
    },
    getBookings: async () => {
        return await axiosify(bookingResponse)
    },
}
