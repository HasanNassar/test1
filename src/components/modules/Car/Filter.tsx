import styled from 'styled-components'
import { device } from '@util/responsive'
import { FilterIcon } from '@global/icons/Filter'
import { useImperativeHandle, useState } from 'react'
import { FilterModal } from './FilterModal'
import { trackEvent } from '@util/ga'
import React from 'react'

export const Filter = React.forwardRef((props, ref) => {
    const [isOpen, setIsOpen] = useState(false)
    const openFromParent = () => {
        setIsOpen(true)
    }
    useImperativeHandle(ref, () => ({
        openFromParent,
    }))
    return (
        <div>
            <FilterWrapper
                data-cy="filter-button"
                onClick={() => {
                    setIsOpen(true)
                    trackEvent({
                        action: 'Filters-open',
                        category: 'BrowseDR',
                    })
                }}
            >
                <FilterIcon />
            </FilterWrapper>
            {isOpen && <FilterModal setModal={setIsOpen} />}
        </div>
    )
})

const FilterWrapper = styled.div`
    position: fixed;
    z-index: 30;
    bottom: 1rem;
    right: 1rem;
    background: white;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0px 2px 20px rgba(0, 0, 0, 0.08);
    border-radius: 50px;
    @media ${device.laptop} {
        display: none;
    }
`
