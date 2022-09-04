import { Navigation } from '@components/global/Navigation'
import styled from 'styled-components'
import { size } from '@util/responsive'
import { ReactNode } from 'react'

const MainLayout = ({ children }: { children: ReactNode }): JSX.Element => {
    return (
        <MainLayoutW>
            <Navigation />
            <MainContainer>{children}</MainContainer>
        </MainLayoutW>
    )
}

const MainLayoutW = styled.div`
    width: 100%;
    position: relative;
    display: flex;
    flex-direction: column;
`

const MainContainer = styled.main`
    padding-top: var(--navMobileHeight);

    @media (min-width: ${size.laptop}) {
        padding-top: var(--navHeight);
    }
`

export default MainLayout
