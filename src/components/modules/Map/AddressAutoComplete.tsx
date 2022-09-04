import { Address, AddressActionKind, AddressType, useSearch } from '@contexts/search'
import { useEffect, useRef } from 'react'
import { AddressModalType } from 'src/pages/[city]/cars/[listingsId]/summary'
import styled from 'styled-components'
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete'
import { useClickOutside } from '@hooks/clickOutside'
import { CrossRounded } from '@global/icons/CrossRounded'
import { Location } from '@global/icons/Location'
import { useMap } from '@contexts/map'
import { uaeCountryCode } from '@util/config'

const Wrapper = styled.div`
    margin: var(--padding);
`
const InputListWrapper = styled.div`
    display: flex;
`
const InputField = styled.input`
    position: relative;
    width: 100%;
    height: 48px;
    background: rgba(0, 0, 0, 0.04);
    padding: 0 4.5rem 0 1rem;
    border-radius: 4px;
    border: none;
    font-weight: var(--weight-bold);
    font-size: 14px;
    color: 'rgba(0, 0, 0, 0.8)';
    :focus {
        outline: none;
    }
`

const SuggestionsWrapper = styled.div`
    position: absolute;
    left: 0;
    right: 0;
    width: calc(100% - 48px); /* Need a specific value to work */
    margin: 8px auto;
    padding-top: 24px;

    z-index: 1;
    background: white;
    border-radius: 16px;
    box-shadow: var(--boxShadow);
`

const Suggestion = styled.div`
    padding-bottom: 16px;
    padding-left: 16px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-weight: var(--weight-bold);
    font-size: 14px;
    color: 'rgba(0, 0, 0, 0.8)';
`
const IconWrapper = styled.div`
    height: 48px;
    display: flex;
    align-items: center;
    gap: 10px;
    position: absolute;
    right: 40px;
`

const Button = styled.button`
    padding: 0;
    margin: 0;
    height: 20px;
    width: 20px;
    border: none;
    background: none;
`

export const AddressAutoComplete: React.FC<{
    isScriptLoaded: boolean
    type: AddressModalType
    setLocation?: ({ lat, lng }) => void
    markerPosition?: { lat: number; lng: number }
}> = ({
    isScriptLoaded,
    type,
    setLocation: setLocation = () => {
        // console.log('Location pressed')
    },
    markerPosition,
}) => {
    if (!isScriptLoaded) return null
    const ref = useRef(null)
    const { map, mapDispatch } = useMap()

    const { addressDispatch } = useSearch()
    const {
        ready,
        value,
        suggestions: { status, data },
        setValue,
        clearSuggestions,
    } = usePlacesAutocomplete({
        defaultValue: map.address,
        requestOptions: {
            componentRestrictions: {
                country: uaeCountryCode,
            },
        },
        debounce: 300,
    })

    // Use this to make moving the pin also update the location selected
    // useEffect(() => {
    //     getGeocode({ location: markerPosition }).then((results) => {
    //         setAddressComponent(results[0].address_components, {
    //             latitude: results[0].geometry.location.lat().toString(),
    //             longitude: results[0].geometry.location.lng().toString(),
    //         })
    //         setValue(results[0].formatted_address, false)
    //     })
    // }, [markerPosition])

    useEffect(() => {
        mapDispatch({ type: 'input', value, name: 'address' })
    }, [value])

    const handleInput = (e) => {
        setValue(e.target.value)
    }

    useClickOutside(ref, () => {
        clearSuggestions()
    })

    const getAddressFromComponents = (geo: any[]): Partial<Address> => {
        const plusCode = geo?.find((g: { types: string[] }) => g.types?.find((t) => t === 'plus_code'))?.long_name
        const streetNumber = geo?.find((g: { types: string[] }) =>
            g.types?.find((t) => t === 'street_number'),
        )?.long_name
        const streetName = geo.find((g: { types: string[] }) => g.types?.find((t) => t === 'route'))?.long_name
        const cityName = geo.find(
            (g) => g.types?.find((t: string) => t === 'locality') && g.types.find((t) => t === 'political'),
        )?.long_name
        const stateName = geo.find(
            (g) =>
                g.types?.find((t: string) => t === 'administrative_area_level_1') &&
                g.types.find((t: string) => t === 'political'),
        )?.long_name
        const countryName = geo.find(
            (g: { types: string[] }) =>
                g.types?.find((t: string) => t === 'country') && g.types.find((t) => t === 'political'),
        )?.long_name
        const zip = geo.find((g: { types: string[] }) => g.types?.find((t) => t === 'postal_code'))?.long_name
        return {
            addressLine1: streetNumber,
            addressLine2: streetName,
            city: cityName,
            region: stateName,
            country: countryName,
        }
    }

    const setAddressComponent = (
        address: any,
        shortDescription: string,
        latlng?: { latitude: string; longitude: string },
    ) => {
        const add = getAddressFromComponents(address)
        const addressLine = add.addressLine2 ? `${shortDescription} - ${add.addressLine2}` : shortDescription
        addressDispatch({
            type: AddressActionKind.REPLACE,
            name:
                type === AddressModalType.delivery
                    ? AddressType.TEMPORARY_HANDOVER_ADDRESS
                    : AddressType.TEMPORARY_HANDBACK_ADDRESS,
            value: {
                ...add,
                addressLine2: undefined,
                addressLine1: addressLine,
                ...latlng,
            },
        })
    }

    const handleSelect =
        ({ description }, shortDescription) =>
        async () => {
            setValue(description, false)
            clearSuggestions()

            const results = await getGeocode({ address: description })
            const { lat, lng } = await getLatLng(results[0])
            setLocation({ lat, lng })

            setAddressComponent(results[0].address_components, shortDescription, {
                latitude: lat.toString(),
                longitude: lng.toString(),
            })
        }
    const handleLocation = () => {
        navigator.geolocation.getCurrentPosition(function (position) {
            const latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude)
            getGeocode({ location: latlng })
                .then((results) => setValue(results[0].formatted_address, false))
                .catch(() => {
                    // console.log('Error: ', error)
                })
            setLocation({ lat: latlng.lat(), lng: latlng.lng() })
        })
    }

    const renderSuggestions = () =>
        data.map((suggestion) => {
            const {
                place_id,
                structured_formatting: { main_text, secondary_text },
            } = suggestion

            return (
                <Suggestion key={place_id} onClick={handleSelect(suggestion, main_text)}>
                    {main_text}, {secondary_text}, {secondary_text}
                </Suggestion>
            )
        })
    return (
        <Wrapper ref={ref}>
            <InputListWrapper>
                <InputField
                    value={value}
                    onChange={handleInput}
                    disabled={!ready}
                    placeholder="Select an address"
                    onSubmit={(e) => {
                        e.preventDefault()
                    }}
                />
                <IconWrapper>
                    <Button
                        onClick={() => {
                            setValue('')
                            mapDispatch({ type: 'isValid', value: false })
                        }}
                    >
                        <CrossRounded />
                    </Button>
                    <Button
                        onClick={() => {
                            handleLocation()
                        }}
                    >
                        <Location />
                    </Button>
                </IconWrapper>
            </InputListWrapper>

            {/* We can use the "status" to decide whether we should display the dropdown or not */}
            {status === 'OK' && <SuggestionsWrapper>{renderSuggestions()}</SuggestionsWrapper>}
        </Wrapper>
    )
}
