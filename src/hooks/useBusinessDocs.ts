import { useTranslation } from 'next-i18next'

export const useBusinessDocs = () => {
    const { t } = useTranslation()

    const TermsContent = {
        mainTitle: t('footer.termsAndCondTitle', 'Terms & Conditions'),
        introText: '',
        html: t('footer.termsAndConditions', ''),
    }

    const PrivacyContent = {
        mainTitle: t('footer.privacyPolicyTitle', 'Privacy Policy'),
        introText: '',
        html: t('footer.privacyPolicy', ''),
    }

    const LegalNotice = {
        mainTitle: t('footer.legalNoticeTitle', 'Legal notice'),
        introText: '',
        html: t('footer.legalNotice', ''),
    }

    return {
        termsAndCondition: TermsContent,
        privacyPolicy: PrivacyContent,
        legalNotice: LegalNotice,
    }
}
