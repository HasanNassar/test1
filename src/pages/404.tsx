import { useTranslation } from 'next-i18next'

const Page404 = () => {
    const { t } = useTranslation()
    return <h1>{t('404', '404 - Page Not Found')}</h1>
}

export default Page404
