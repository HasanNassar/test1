import styled from 'styled-components'
const CheckBoxWrapper = styled.div`
    position: relative;
    display: flex;
    align-items: center;
`
const CheckBoxLabel = styled.label`
    position: absolute;
    top: 0;
    left: 0;
    width: 36px;
    height: 16px;
    border-radius: 15px;
    background: rgba(0, 0, 0, 0.2);
    cursor: pointer;
    &::after {
        content: '';
        display: block;
        border-radius: 50%;
        width: 20px;
        height: 20px;
        margin: -1.5px;
        background: white;
        box-shadow: 0px 2px 3px rgba(0, 0, 0, 0.15);
        transition: 0.2s;
    }
`
const CheckBox = styled.input`
    opacity: 0;
    z-index: 1;
    border-radius: 15px;
    width: 42px;
    height: 26px;
    &:checked + ${CheckBoxLabel} {
        background: rgba(255, 90, 90, 0.4);
        &::after {
            content: '';
            display: block;
            border-radius: 50%;
            width: 18px;
            height: 18px;
            margin-left: 21px;
            transition: 0.2s;
            background: var(--primaryColor);
        }
    }
`

export const Toggle = ({
    checked,
    setChecked,
}: {
    checked: boolean
    setChecked: React.Dispatch<React.SetStateAction<boolean>>
}) => {
    return (
        <CheckBoxWrapper>
            <CheckBox id="checkbox" type="checkbox" onChange={() => setChecked(!checked)} defaultChecked={checked} />
            <CheckBoxLabel htmlFor="checkbox" />
        </CheckBoxWrapper>
    )
}

/* Track */
