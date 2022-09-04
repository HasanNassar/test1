export enum Currency {
    EUR = 'EUR',
    HUF = 'HUF',
    USD = 'USD',
    GBP = 'GBP',
    AED = 'AED',
}

export enum ProductType {
    SUBSCRIPTION = 'SUBSCRIPTION',
    DAILY = 'DAILY',
}

export type CitySettingsResponse = {
    id: number
    cityId: number
    cityCode: string
    currency: Currency
    timezone: string
    deliveryFee: number
    minMonthlyRentalFee: number
    maxMonthlyRentalFee: number
    minRentalPeriod: number
    minDepositMonthsToCharge: number
    maxDepositMonthsToCharge: number
    shortTermPeriodDays: number
    shortTermSurchargePercent: number
    freeCancellationPeriodDays: number
    returnNoticePeriodDays: number
    allowedKmsPerYear: number
    validFrom: Date
    createdBy: string
    createdAt: Date
    vatPercentage: number
    shortNoticePenaltyFee: number
    minDepositAmount: number
    maxStartDateOffset: number
    minSearchPrice: number
    maxSearchPrice: number
    businessZone: [
        {
            lat: number
            lng: number
        },
    ]
    holidays: []
    businessHours: {
        MONDAY: {
            start: string
            end: string
        }
        TUESDAY: {
            start: string
            end: string
        }
        WEDNESDAY: {
            start: string
            end: string
        }
        THURSDAY: {
            start: string
            end: string
        }
        FRIDAY: {
            start: string
            end: string
        }
    }
}
