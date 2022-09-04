import { axiosify } from '../util/mock'
import { ConfigurationService } from './configuration'

const sampleCitySettings = {
    DXB: {
        id: 32,
        cityId: 4,
        cityCode: 'DXB',
        currency: 'AED',
        timezone: 'Asia/Dubai',
        minMonthlyRentalFee: 100,
        maxMonthlyRentalFee: 30000,
        minRentalPeriod: 3,
        minDepositMonthsToCharge: 0,
        maxDepositMonthsToCharge: 3,
        shortTermPeriodDays: 10,
        shortTermSurchargePercent: 0,
        freeCancellationPeriodDays: 7,
        returnNoticePeriodDays: 1,
        allowedKmsPerYear: 3000,
        validFrom: '2022-02-04T05:58:56.338Z',
        createdBy: 'akobor',
        createdAt: '2022-02-04T07:59:23.644272Z',
        vatPercentage: 0,
        shortNoticePenaltyFee: 0,
        minDepositAmount: 0,
        maxStartDateOffset: 180,
        minSearchPrice: 100,
        maxSearchPrice: 1000000,
        productType: 'DAILY',
        businessZone: [
            {
                lat: 24.46442,
                long: 54.323518,
            },
            {
                lat: 24.470962,
                long: 54.32251,
            },
            {
                lat: 24.471373,
                long: 54.323046,
            },
            {
                lat: 24.471744,
                long: 54.323325,
            },
            {
                lat: 24.472076,
                long: 54.323518,
            },
            {
                lat: 24.472408,
                long: 54.323776,
            },
            {
                lat: 24.472544,
                long: 54.323883,
            },
            {
                lat: 24.472701,
                long: 54.324076,
            },
            {
                lat: 24.472857,
                long: 54.324183,
            },
            {
                lat: 24.473052,
                long: 54.324226,
            },
            {
                lat: 24.47315,
                long: 54.324205,
            },
            {
                lat: 24.473638,
                long: 54.324183,
            },
            {
                lat: 24.474263,
                long: 54.324097,
            },
            {
                lat: 24.474849,
                long: 54.324119,
            },
            {
                lat: 24.475083,
                long: 54.324205,
            },
            {
                lat: 24.475318,
                long: 54.324312,
            },
            {
                lat: 24.475825,
                long: 54.324505,
            },
            {
                lat: 24.476079,
                long: 54.324827,
            },
            {
                lat: 24.476333,
                long: 54.32502,
            },
            {
                lat: 24.476587,
                long: 54.325342,
            },
            {
                lat: 24.47688,
                long: 54.325986,
            },
            {
                lat: 24.477017,
                long: 54.326265,
            },
            {
                lat: 24.477329,
                long: 54.326329,
            },
            {
                lat: 24.477485,
                long: 54.326286,
            },
            {
                lat: 24.477993,
                long: 54.326029,
            },
            {
                lat: 24.478325,
                long: 54.3259,
            },
            {
                lat: 24.478638,
                long: 54.325771,
            },
            {
                lat: 24.479067,
                long: 54.325149,
            },
            {
                lat: 24.479262,
                long: 54.32472,
            },
            {
                lat: 24.479458,
                long: 54.323797,
            },
            {
                lat: 24.479419,
                long: 54.323261,
            },
            {
                lat: 24.479184,
                long: 54.322488,
            },
            {
                lat: 24.47897,
                long: 54.322188,
            },
            {
                lat: 24.478911,
                long: 54.322102,
            },
            {
                lat: 24.478559,
                long: 54.321651,
            },
            {
                lat: 24.478306,
                long: 54.321136,
            },
            {
                lat: 24.478169,
                long: 54.320707,
            },
            {
                lat: 24.477895,
                long: 54.320385,
            },
            {
                lat: 24.47731,
                long: 54.319763,
            },
            {
                lat: 24.476939,
                long: 54.31957,
            },
            {
                lat: 24.476489,
                long: 54.319227,
            },
            {
                lat: 24.475982,
                long: 54.318583,
            },
            {
                lat: 24.475318,
                long: 54.318132,
            },
            {
                lat: 24.474888,
                long: 54.318025,
            },
            {
                lat: 24.474517,
                long: 54.317982,
            },
            {
                lat: 24.474283,
                long: 54.317961,
            },
            {
                lat: 24.473951,
                long: 54.317961,
            },
            {
                lat: 24.473579,
                long: 54.318132,
            },
            {
                lat: 24.473247,
                long: 54.318411,
            },
            {
                lat: 24.472701,
                long: 54.318948,
            },
            {
                lat: 24.472486,
                long: 54.319291,
            },
            {
                lat: 24.472173,
                long: 54.319763,
            },
            {
                lat: 24.471841,
                long: 54.320149,
            },
            {
                lat: 24.471666,
                long: 54.3206,
            },
            {
                lat: 24.471431,
                long: 54.321115,
            },
            {
                lat: 24.471197,
                long: 54.321544,
            },
            {
                lat: 24.470884,
                long: 54.321866,
            },
            {
                lat: 24.470533,
                long: 54.321995,
            },
            {
                lat: 24.464732,
                long: 54.322853,
            },
            {
                lat: 24.462213,
                long: 54.322467,
            },
            {
                lat: 24.457372,
                long: 54.317401,
            },
            {
                lat: 24.460497,
                long: 54.298862,
            },
            {
                lat: 24.492994,
                long: 54.288562,
            },
            {
                lat: 24.49893,
                long: 54.346927,
            },
            {
                lat: 24.466122,
                long: 54.34521,
            },
            {
                lat: 24.456434,
                long: 54.328387,
            },
            {
                lat: 24.463622,
                long: 54.323924,
            },
        ],
        businessHours: {
            MONDAY: {
                start: '10:00:00',
                end: '16:00:00',
            },
            TUESDAY: {
                start: '08:00:00',
                end: '18:00:00',
            },
            WEDNESDAY: {
                start: '08:00:00',
                end: '18:00:00',
            },
            THURSDAY: {
                start: '08:00:00',
                end: '18:00:00',
            },
            FRIDAY: {
                start: '08:00:00',
                end: '18:00:00',
            },
        },
        holidays: [],
        customerServiceInfo: {
            businessHours: {
                MONDAY: {
                    start: '09:00:00',
                    end: '17:00:00',
                },
                TUESDAY: {
                    start: '09:00:00',
                    end: '17:00:00',
                },
                WEDNESDAY: {
                    start: '09:00:00',
                    end: '17:00:00',
                },
                THURSDAY: {
                    start: '09:00:00',
                    end: '17:00:00',
                },
                FRIDAY: {
                    start: '09:00:00',
                    end: '17:00:00',
                },
            },
        },
        availableLocales: [
            {
                locale: 'en-dxb',
                language: 'EN',
                default: true,
            },
        ],
    },
}

export const mockConfigurationService: ConfigurationService = {
    getCitySettings: async (cityCode = 'DXB', product = 'DAILY') => {
        return await axiosify(sampleCitySettings[cityCode])
    },
}
