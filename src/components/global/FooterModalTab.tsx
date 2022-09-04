import { useState } from 'react'
import styled from 'styled-components'
import { ArrowDown } from './icons/ArrowDown'

export const FooterModalTab = ({ tabContent }) => {
    const [isOpen, setIsOpen] = useState(false)
    return (
        <TabBlock>
            <TabHeader onClick={() => setIsOpen(!isOpen)}>
                <TabTitle>{tabContent.title}</TabTitle>
                <ArrowDown isOpen={isOpen} />
            </TabHeader>
            {isOpen && <TabContent>{tabContent.content}</TabContent>}
        </TabBlock>
    )
}

const TabBlock = styled.div`
    border-radius: 16px;
    box-shadow: 0px 2px 20px rgb(0 0 0 / 8%);
    padding: 1rem;
    margin: 1.5rem 0;
`

const TabHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
`

const TabTitle = styled.h3`
    margin: 0;
`

const TabContent = styled.div`
    padding: 0.5rem 0;
`
