import axios from 'axios'
import { config, defaultCityCode } from '../util/config'
import { getMockProxy, ServiceResponse } from '../util/mock'
import { mockConfigurationService } from './configuration.mock'
import { CitySettingsResponse } from './configuration.types'

export const CONFIGURATION_API_URL = `${config.BASE_URL}/configuration`
export const IDENTITY_API_URL = `${config.BASE_URL}/identity`

export type ConfigurationService = {
    getCitySettings: (cityCode: string, product?: string) => ServiceResponse<CitySettingsResponse>
}

const realConfigurationService: Partial<ConfigurationService> = {
    getCitySettings: async (cityCode = defaultCityCode, product = 'DAILY') => {
        return await axios.get(`${CONFIGURATION_API_URL}/products/${product}/cities/${cityCode}/settings/active`)
    },
}

export const configurationService: ConfigurationService = getMockProxy(
    realConfigurationService,
    mockConfigurationService,
)
