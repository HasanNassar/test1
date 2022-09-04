import { Pencil } from '@components/global/icons/Pencil'
import { useTranslation } from 'next-i18next'
import {
    ContentWrapper,
    Headline,
    Description,
    ArrowWrapper,
    TextWrapper,
    FullListText,
    Overlay,
} from 'src/pages/[city]/cars/[listingsId]/summary'
import styled from 'styled-components'
import { Plus } from '@components/global/icons/Plus'

const PickedColor = styled.div`
    margin-top: 1.5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
`

const Color = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-start;
    border-radius: 1rem;
    height: 50px;
    column-gap: 1rem;
`

const Circle = styled.div<{ color: string }>`
    width: 24px;
    height: 24px;
    border-radius: 999px;
    ${({ color }) => color === 'white' && 'border: 1px solid black'};

    ${({ color }) =>
        color === 'transparent'
            ? `
        background-image: linear-gradient(45deg, #ccc 25%, transparent 25%),
        linear-gradient(135deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%),
        linear-gradient(135deg, transparent 75%, #ccc 75%);
    background-size: 10px 10px; /* Must be a square */
    background-position: 0 0, 5px 0, 5px -5px, 0px 5px; /* Must be half of one side of the square */
    `
            : `background: #${color}`};
`

export const ColorPreference = ({ selectedColor, colors, setOverlay }) => {
    const { t } = useTranslation()
    return (
        <ContentWrapper>
            <Headline>{t('bookingSummaryColorPreference', 'Color preference')}</Headline>
            <Description>
                {t(
                    'bookingSummaryColorPreferenceDescription',
                    'You can mark your color preference and we’ll do our best try to match it.',
                )}
            </Description>
            {selectedColor ? (
                <PickedColor>
                    {colors.map((color) => {
                        if (color.id === selectedColor) {
                            return (
                                <Color key={color.id}>
                                    <Circle color={color.hexCode} />
                                    {t(color.i18nKey)}
                                </Color>
                            )
                        } else return null
                    })}
                    <ArrowWrapper onClick={() => setOverlay(Overlay.colorPreference)}>
                        <Pencil color="#ff5a5a" />
                    </ArrowWrapper>
                </PickedColor>
            ) : (
                <TextWrapper onClick={() => setOverlay(Overlay.colorPreference)}>
                    <Plus />
                    <FullListText>{t('bookingSummaryAddColorPreference', 'Add color preference')}</FullListText>
                </TextWrapper>
            )}
        </ContentWrapper>
    )
}
