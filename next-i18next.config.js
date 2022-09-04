const I18nextChainedBackend = require('i18next-chained-backend/dist/cjs/i18nextChainedBackend')
const I18NextHttpBackend = require('i18next-http-backend')
const axios = require('axios')

const loadResources = async (locale) => {
    let loc = locale !== 'default' ? locale : 'en-DXB'
    return await axios
        .get(
            `${process.env.I18N_BASE_URL}/configuration/products/DAILY/translations/locales/ar`,
        )
        .then(({ data }) => {
            return data.reduce((acc, curr) => {
                acc[curr.id] = curr.text
                return acc
            }, {})
        })
        .catch((error) => {
            console.error(error)
        })
}

module.exports = {
    debug: false,
    i18n: {
        // Default is required https://nextjs.org/docs/advanced-features/i18n-routing#prefixing-the-default-locale
        locales: ['default', 'en-US', 'en-DXB', 'hu-HU', 'de-DE','ar-dxb'],
        defaultLocale: 'default',
        localeDetection: false,
    },
    // Namespace is required
    ns: ['common'],
    serializeConfig: false,
    use: [I18nextChainedBackend],
    backend: {
        backends: [I18NextHttpBackend],
        allowMultiLoading: true,
        backendOptions: [
            {
                loadPath: '{{lng}}|{{ns}}',
                request: (options, url, payload, callback) => {
                    try {
                        const lng = url.split('|')[0]
                        loadResources(lng).then((response) => {
                            callback(null, {
                                data: response,
                                status: 200,
                            })
                        })
                    } catch (e) {
                        console.error(e)
                        callback(e, null)
                    }
                },
            },
        ],
    },
}
