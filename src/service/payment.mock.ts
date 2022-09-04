import { axiosify } from '@util/mock'
import { PaymentService } from './payment'
import {
    AddressResponse,
    AddressType,
    CancellationFeeResponse,
    CareemStatusResponse,
    InvoiceStatus,
    UserBillingAddressResponse,
} from './payment.types'

const userBillingAddressResponse: UserBillingAddressResponse = {
    externalCustomerId: '134513451345',
    careemId: '73456735673573567',
    billingName: 'Kuulgiraffe ltd.',
    vatId: '23452364346',
    addressLine1: 'Koskikatu 1',
    addressLine2: 'fsz 12 I emelet',
    city: 'Budapest',
    region: 'Pest',
    zipCode: '1051',
    country: 'Hungary',
    createdBy: 'Creator',
    createdAt: '2022-02-23T09:35:10.491Z',
    updatedBy: 'Updater',
    updatedAt: '2022-02-23T09:35:18.491Z',
}

// const userBillingAddressResponse: UserBillingAddressResponse = undefined

const careemStatusResponse: CareemStatusResponse = {
    careemInvoiceId: '2341345-12341234-5-134512341234-1234',
    invoiceStatus: InvoiceStatus.SUCCEEDED,
}

const addressResponse: AddressResponse = {
    addressType: AddressType.DELIVERY,
    lat: 25.197525,
    long: 55.274288,
    building: 'Burj Khalifa',
    comments: 'I will be at the fountain.',
    addressLine1: '1 Sheikh Mohammed bin Rashid Blvd',
    addressLine2: 'Downtown Dubai',
    city: 'Dubai',
    region: 'Dubai',
    zipCode: '11111',
    country: 'United Arab Emirates',
    createdBy: 'Creator',
    createdAt: '2022-02-23T09:35:10.491Z',
    updatedBy: 'Updater',
    updatedAt: '2022-02-23T09:35:18.491Z',
}

const cancellationFeeResponse: CancellationFeeResponse = {
    surchargeAmount: 0,
}

export const mockPaymentService = {
    getCancellationFee: async () => await axiosify(cancellationFeeResponse),
    getUserBillingAddress: async () => await axiosify(userBillingAddressResponse),
    postUserBillingAddress: async () => await axiosify(userBillingAddressResponse),
    postCareemPayment: async () => await axiosify(careemStatusResponse),
    getAddress: async () => await axiosify(addressResponse),
    getCareemPayment: async () => await axiosify(careemStatusResponse),
}
