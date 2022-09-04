type Config = {
    ENV: string
    VERSION: string
    GA_TRACKING_ID: string
    GMAPS_API_KEY: string
    BASE_URL: string
    IMAGEX_URL: string
    IMAGIN_STUDIOS_BASE_URL: string
    FCWIDGET_TOKEN: string
    BYPASS_CAREEM_PAY: boolean
    CAREEM_PAY_APP_URI: string
    PRODUCT_SELECTOR_LINK: string
}

export const config: Config = {
    // Runtime variables
    ENV: process.env.NODE_ENV || 'development',
    VERSION: process.env.APP_VERSION || 'no-version',
    // Build time vairables
    GA_TRACKING_ID: process.env.NEXT_PUBLIC_GA_TRACKING_ID || '',
    GMAPS_API_KEY: process.env.NEXT_PUBLIC_GMAPS_API_KEY || '',
    BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || 'https://dev.joinswapp.com',
    IMAGEX_URL: process.env.NEXT_PUBLIC_IMAGEX_URL || 'https://dev-swapp-rental.imgix.net',
    IMAGIN_STUDIOS_BASE_URL: process.env.NEXT_PUBLIC_IMAGIN_STUDIOS_BASE_URL || 'https://cdn.imagin.studio',
    FCWIDGET_TOKEN: process.env.NEXT_PUBLIC_FCWIDGET_TOKEN || '93a44544-1a9e-4fc8-b86b-5904027bd6db',
    BYPASS_CAREEM_PAY: process.env.NEXT_PUBLIC_BYPASS_CAREEM_PAY
        ? process.env.NEXT_PUBLIC_BYPASS_CAREEM_PAY === 'true'
        : false,
    CAREEM_PAY_APP_URI: process.env.NEXT_PUBLIC_CAREEM_PAY_APP_URI || 'careem://app.careem.com/pay',
    PRODUCT_SELECTOR_LINK:
        process.env.NEXT_PUBLIC_PRODUCT_SELECTOR_LINK ||
        'https://identity.qa.careem-engineering.com/authorize?client_id=0a2d2f09-97cb-40e8-8e53-bfabc36db36f&redirect_uri=https://dev.joinswapp.com/auth/careem/callback%3Ftarget%3DproductSelector&response_type=code',
}

export const isDev = config.ENV === 'development'
export const isProd = config.ENV === 'production'
export const isTest = config.ENV === 'test'
export const isMock =
    process.env.NEXT_PUBLIC_IS_MOCK !== undefined ? process.env.NEXT_PUBLIC_IS_MOCK.toLowerCase() === 'true' : false
export const isCi = process.env.CI || false

// Nextjs stuff
export const isServer = typeof window === 'undefined'

// Further hard-coded constants
export const defaultMapCoords = {
    lat: 25.2048, // Middle of Dubai
    lng: 55.2708,
}
export const DXB = 'DXB'
export const defaultCityCode = DXB
export const placeholderAvatarImage = 'placeholder-avatar.jpg'
export const uaeCountryCode = 'ae'
export const cookieName = 'swapp_auth_jwt'
export const doorToDoorDeliverySelector = true
export const doorToDoorDeliveryIsDefault = true

export const nextDayDeliveryLimits = {
    todayCurrentHoursLimit: 16,
    nextDayBusinessHoursStart: 9,
    nextDayNoonHours: 12,
}

export const formatPrice = (price: number) => new Intl.NumberFormat().format(price)
