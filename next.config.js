/** @type {import('next').NextConfig} */
const { i18n } = require('./next-i18next.config')

module.exports = {
    basePath: '/rental',
    assetPrefix: '/rental/',
    i18n,
    trailingSlash: true,
    reactStrictMode: true,
    productionBrowserSourceMaps: true,
}
