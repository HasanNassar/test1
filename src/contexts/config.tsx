import { useState, createContext, useContext, useEffect, ReactNode } from 'react'
import { configurationService } from '@service/configuration'
import { CitySettingsResponse } from '@service/configuration.types'
import { defaultCityCode } from '@util/config'
import { useRouter } from 'next/router'

type ConfigContextTypes = {
    citySettings: CitySettingsResponse | undefined
    lang: string | undefined
}

export const ConfigContext = createContext<ConfigContextTypes | null>(null)

export const ConfigProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [citySettings, setCitySettings] = useState<CitySettingsResponse | undefined>(undefined)
    const [lang, setLang] = useState<string | undefined>('en')
    const { locale } = useRouter()
    useEffect(() => {
        const getCitySettings = async () => {
            const response = await configurationService.getCitySettings(defaultCityCode)
            setCitySettings(response?.data)
        }
        getCitySettings()
    }, [])
    useEffect(() => {
        setLang(locale)

    }, [locale])
    return (
        <ConfigContext.Provider
            value={{
                citySettings,
                lang,
            }}
        >
            {children}
        </ConfigContext.Provider>
    )
}

export const useConfig = (): ConfigContextTypes => useContext(ConfigContext) as ConfigContextTypes
