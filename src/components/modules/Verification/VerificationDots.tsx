import { DocumentState } from '@components/modules/Verification/VerificationUtils'
import styled from 'styled-components'
import { stateMetaData } from './VerificationUtils'

const DotLabelWrapper = styled.div`
    display: flex;
    column-gap: 58px;
    margin: 0;
    text-align: center;
`

const DotLabel = styled.p`
    font-style: normal;
    font-weight: 600;
    font-size: 10px;
    margin: 0 0 1.5rem 0;
    text-transform: uppercase;
    color: rgba(0, 0, 0, 0.4);
    opacity: 0.8;
`

const Container = styled.div`
    display: flex;
    flex-direction: column;
    padding: 0 1rem 0 12px;
`

//set Labels
const label = ['identity', "driver's license", 'passpost', 'visa']

export const VerificationDots = ({ currentDocument, state }: { currentDocument: DocumentState; state: any }) => {
    return <Container>{stateMetaData[currentDocument].dots(state)}</Container>
}
