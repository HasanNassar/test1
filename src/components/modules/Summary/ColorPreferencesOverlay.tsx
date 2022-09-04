import { useTranslation } from 'next-i18next'
import { FC, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { useClickOutside } from '../../../hooks/clickOutside'
import { Headline2 } from '../../../util/typography'
import { Cross } from '../../global/icons/Cross'

export const ColorPreferencesOverlay: FC<{
    isOpen: boolean
    closeCb: () => void
    colors: any[]
    selectedColor: number | null
    setSelectedColor: React.Dispatch<React.SetStateAction<number | null>>
}> = ({ isOpen, closeCb, colors, setSelectedColor }) => {
    return isOpen ? <ColorPreferences closeCb={closeCb} colors={colors} setSelectedColor={setSelectedColor} /> : null
}

const ColorPreferences: FC<{
    closeCb: () => void
    colors: any[]
    setSelectedColor: React.Dispatch<React.SetStateAction<number | null>>
}> = ({ closeCb, colors, setSelectedColor }) => {
    const colorPrefRef = useRef(null)

    useClickOutside(colorPrefRef, closeCb)

    useEffect(() => {
        document.body.classList.add('overflow-hidden')
        document.documentElement.classList.add('remove-gutter')
        return () => {
            document.body.classList.remove('overflow-hidden')
            document.documentElement.classList.remove('remove-gutter')
        }
    })

    const saveColor = () => {
        closeCb()
        setSelectedColor(activeColor)
    }

    const [activeColor, setActiveColor] = useState<number | null>(null)
    const { t } = useTranslation()

    return (
        <>
            <T />
            <ColorprefWrapper ref={colorPrefRef}>
                <HeadlineContainer>
                    <Headline2>{t('colorPereferences.title', 'Color pereference')}</Headline2>
                    <div onClick={closeCb}>
                        <Cross />
                    </div>
                </HeadlineContainer>
                <ContentContainer>
                    <ColorPicker>
                        {colors.map((color, i) => {
                            return (
                                <Color
                                    key={color.id}
                                    onClick={() => setActiveColor(color.id === activeColor ? null : color.id)}
                                    isSelected={color.id === activeColor}
                                >
                                    <Circle color={color.hexCode} />
                                    {t(color.i18nKey)}
                                </Color>
                            )
                        })}
                    </ColorPicker>
                    <NoteText>
                        <b>Note:</b>
                        {t(
                            'colorPereferences.note',
                            `Since rental car availability changes by the minute, we cannot guarantee that you
                        will get the your car in the selected color but we will try our best.`,
                        )}
                    </NoteText>
                    <SaveButton onClick={saveColor}>{t('save', 'Save')}</SaveButton>
                    <CancelButton onClick={closeCb}>{t('cancel', 'Cancel')}</CancelButton>
                </ContentContainer>
            </ColorprefWrapper>
        </>
    )
}

const Circle = styled.div<{ color: string }>`
    width: 24px;
    height: 24px;
    border-radius: 999px;
    ${({ color }) => color === 'ffffff' && 'border: 1px solid black'};

    ${({ color }) =>
        color === 'transparent'
            ? `
        background-image: linear-gradient(45deg, #ccc 25%, transparent 25%),
        linear-gradient(135deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%),
        linear-gradient(135deg, transparent 75%, #ccc 75%);
    background-size: 10px 10px; /* Must be a square */
    background-position: 0 0, 5px 0, 5px -5px, 0px 5px; /* Must be half of one side of the square */
    `
            : `background: #${color};`};
`
const Color = styled.div<{ isSelected?: boolean }>`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.2rem;
    border-radius: 1rem;
    ${({ isSelected }) => (isSelected ? 'border: 1px solid red;' : 'border: 1px solid transparent;')}
    width: 50px;
    height: 75px;
`
const ColorPicker = styled.div`
    display: flex;
    justify-content: space-evenly;
`
const NoteText = styled.p`
    background: #ffa8451a;
    color: #ffa845;
    font-size: 12px;
    line-height: 22px;
    padding: 1rem;
    border-radius: 1rem;
    margin-bottom: 2rem;
`

const ContentContainer = styled.div`
    padding: 1.5rem;
`
const CancelButton = styled.button`
    margin-top: 1rem;
    color: #ff5a5a;
    background: transparent;
    font-size: var(--size-16);
    font-weight: var(--weight-bold);
    border: none;
    padding: 1rem;
    width: 100%;
`

const SaveButton = styled.button<{ isDisabled?: boolean }>`
    background: ${(props) => (props.isDisabled ? '#E5E5E5' : '#ff5a5a')};
    border-radius: 100px;
    color: white;
    font-size: var(--size-16);
    font-weight: var(--weight-bold);
    border: none;
    padding: 1rem;
    width: 100%;
`

const T = styled.div`
    left: 0px;
    position: fixed;
    top: var(--navMobileHeight);
    width: 100vw;
    height: 100vh;
    display: block;
    opacity: 1;
    z-index: 10;
    background: rgba(0, 0, 0, 0.4);
`

const ColorprefWrapper = styled.div`
    margin-top: var(--navMobileHeight);
    position: fixed;
    width: 100%;
    bottom: 0;
    z-index: 15;
    background: var(--white);
    box-shadow: 0px 2px 20px rgba(0, 0, 0, 0.08);
    border-radius: 16px 16px 0 0;
`

const HeadlineContainer = styled.div`
    display: flex;
    padding: 0.5rem 2rem;
    align-items: center;
    justify-content: space-between;
`
