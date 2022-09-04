import { useTranslation } from 'next-i18next'
import {
    ContentWrapper,
    Headline,
    SelectionCard,
    Recommended,
    SelectionHeadLine,
    SelectedPrice,
    Description,
    EllipseWrapper,
} from 'src/pages/[city]/cars/[listingsId]/summary'
import { ClickedEllipse } from '@components/global/icons/ClickedEllipse'
import { Ellipse } from '@components/global/icons/Ellipse'

export const Insurance = ({ includeExtraInsurance, toggleFullInsurance, insurances }) => {
    const { t } = useTranslation()
    return (
        <ContentWrapper>
            <Headline>{t('bookingSummaryHeadlineInsurance', 'Insurance')}</Headline>
            <SelectionCard isActive={!includeExtraInsurance} onClick={() => toggleFullInsurance(false)}>
                {insurances[0].recommended ? (
                    <Recommended>{t('bookingSummaryInsuranceRecommended', 'recommended')}</Recommended>
                ) : (
                    ''
                )}
                <div>
                    <SelectionHeadLine>
                        <h1>{insurances[0].type}</h1>
                        {/*<InfoOutline />*/}
                    </SelectionHeadLine>
                    <SelectedPrice>{insurances[0].price}</SelectedPrice>
                    <Description>{t('bookingSummaryInsuranceComprehensiveInfo', insurances[0].info)}</Description>
                </div>
                <EllipseWrapper>{!includeExtraInsurance ? <ClickedEllipse /> : <Ellipse />}</EllipseWrapper>
            </SelectionCard>
            <SelectionCard isActive={includeExtraInsurance} onClick={() => toggleFullInsurance(true)}>
                {insurances[1].recommended ? (
                    <Recommended>{t('bookingSummaryInsuranceRecommended', 'recommended')}</Recommended>
                ) : (
                    ''
                )}
                <div>
                    <SelectionHeadLine>
                        <h1>{insurances[1].type}</h1>
                        {/*<InfoOutline />*/}
                    </SelectionHeadLine>
                    <SelectedPrice>{insurances[1].price}</SelectedPrice>
                    <Description>{t('bookingSummaryInsuranceTypeInfo', insurances[1].info)}</Description>
                </div>
                <EllipseWrapper>{includeExtraInsurance ? <ClickedEllipse /> : <Ellipse />}</EllipseWrapper>
            </SelectionCard>
        </ContentWrapper>
    )
}
