import React from 'react'
import PropTypes from 'prop-types'
import countries from '../../assets/countries.json'
import styled from 'styled-components'
import { ChevronRight } from './icons/ChevronRight'

const CountrySelect: React.FC<any> = (props) => {
    const { option, ...rest } = props
    return (
        <SelectWarpper>
            <Select {...rest}>{countries.map((country) => option(country))}</Select>
            <Chevron>
                <ChevronRight />
            </Chevron>
        </SelectWarpper>
    )
}

const SelectWarpper = styled.div`
    position: relative;
`

const Chevron = styled.div`
    position: absolute;
    top: 0;
    right: 0rem;
    height: 48px;
    display: flex;
    align-items: center;
    margin-inline-end: 0.5rem;
    transform: rotate(90deg);
    pointer-events: none;
`

const Select = styled.select`
    width: 120px;
    border: none;
    height: 48px;
    background: rgba(0, 0, 0, 0.04);
    border-radius: 4px;
    border: none;
    padding: 0 1rem;
    font-weight: var(--weight-bold);
    font-size: 14px;
    font-weight: var(--weight-bold);
    -webkit-appearance: none;
    appearance: none;
`

CountrySelect.propTypes = {
    option: PropTypes.func,
}

CountrySelect.defaultProps = {
    option: ({ cca2, flag, name }) => (
        <option value={cca2} key={cca2}>
            {`${flag} ${name}`}
        </option>
    ),
}

export default CountrySelect
