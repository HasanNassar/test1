import { useTranslation } from 'next-i18next'
import styled from 'styled-components'
import { BarSpinner } from './icons/SpinnerBar'

type ButtonProps = {
    text: string
    disabled?: boolean
    onClick?: () => any
    loading?: boolean
}

export const ButtonOutlined: React.FC<ButtonProps> = ({
    text,
    disabled = false,
    onClick = () => null,
    loading = false,
}) => {
    const { t } = useTranslation()
    return (
        <ContinueBookingButton disabled={disabled} isDisabled={disabled} onClick={onClick}>
            {loading && <BarSpinner />}
            {loading ? t('uploadButtonLoadingText', 'Uploading...') : text}
        </ContinueBookingButton>
    )
}

const ContinueBookingButton = styled.button<{ isDisabled?: boolean }>`
    border: 1px solid #ff5a5a;
    background-color: white;
    border-radius: 100px;
    color: ${(props) => (props.isDisabled ? 'rgba(146, 92, 92, 0.2)' : '#ff5a5a')};
    font-size: var(--size-16);
    font-weight: var(--weight-bold);
    padding: 0.5rem 1.5rem;
    width: 100%;
    height: 45px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
`
