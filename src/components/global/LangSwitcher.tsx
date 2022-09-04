import { useRef, useState } from 'react'
import { useClickOutside } from '../../hooks/clickOutside'
import { IconAndLink } from './Footer'
import { LanguageGlobe } from './icons/LanguageGlobe'
import Link from 'next/link'
import { useRouter } from 'next/router'
import styled from 'styled-components'

const langArray = {
    'en-US': 'English',
    'en-DXB': 'English',
    'hu-HU': 'Hungarian',
    'de-DE': 'Deutsch',
    'ar-dxb': 'Arabic',
}

const LangSwitcher: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false)
    const langSelector = useRef(null)

    const { locale, asPath } = useRouter()

    if (!locale) return null

    useClickOutside(langSelector, () => {
        setIsOpen(false)
    })

    return (
        <div ref={langSelector}>
            <IconAndLink
                onClick={() => {
                    setIsOpen(!isOpen)
                }}
            >
                <LanguageGlobe />
                <p>{langArray[locale]}</p>
            </IconAndLink>
            {isOpen && (
                <DropDownMenu>
                    {Object.entries(langArray).map(([key, disp]) => {
                        if (key === locale) return null
                        return (
                            <Link key={key} href={asPath} locale={key} scroll={false} passHref={true}>
                                <LangItem onClick={() => setIsOpen(false)}>{disp}</LangItem>
                            </Link>
                        )
                    })}
                </DropDownMenu>
            )}
        </div>
    )
}

const LangItem = styled.p`
    cursor: pointer;
`

const DropDownMenu = styled.div`
    display: flex;
    flex-direction: column;
    margin-top: 3rem;
    background-color: white;
    top: 0;
    border-radius: var(--borderRadius);
    position: absolute;
    padding: 16px;
    box-shadow: var(--boxShadow);
`

export default LangSwitcher
