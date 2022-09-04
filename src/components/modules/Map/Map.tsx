import { useSearch } from '@contexts/search'
import { GoogleMap, LoadScript, Marker, Polygon } from '@react-google-maps/api'
import { config, defaultMapCoords } from '@util/config'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { AddressModalType } from 'src/pages/[city]/cars/[listingsId]/summary'
import styled from 'styled-components'
import { AddressAutoComplete } from './AddressAutoComplete'
import { useMap } from '@contexts/map'

const Wrapper = styled.div`
    background: red;
    width: 100%;
`

const nonAllowedZoneCords = [
    { lat: 90, lng: 90 },
    { lat: 90, lng: -90 },
    { lat: 0, lng: 90 },
    { lat: 0, lng: -90 },
]

const polygonOptions = {
    fillColor: 'rgba(255, 90, 90)',
    fillOpacity: 0.2,
    strokeColor: '#FF5A5A',
    strokeOpacity: 1,
    strokeWeight: 2,
    clickable: false,
    draggable: false,
    editable: false,
    geodesic: false,
    zIndex: 1,
}

export const Map: React.FC<{
    height: string
    type: AddressModalType
    draggable?: boolean
    withAutoComplete?: boolean
    mapPosition?: { lat: number; lng: number }
}> = ({ height, type, draggable = true, withAutoComplete = true, mapPosition = defaultMapCoords }) => {
    const [libraries] = useState<('geometry' | 'drawing' | 'places' | 'localContext' | 'visualization')[]>([
        'geometry',
        'drawing',
        'places',
    ])
    const [isScriptLoaded, setIsScriptLoaded] = useState(false)
    const [center, setCenter] = useState(mapPosition)
    const [markerPosition, setMarkerPosition] = useState<any>(mapPosition)
    const [selectedPosition, setSelectedPosition] = useState<any>()
    const [acMarkerPosition, setAcMarkerPosition] = useState<
        | {
              lat: number
              lng: number
          }
        | undefined
    >(undefined)
    const [map, setMap] = useState<any>(null)
    const [polygon, setPolygon] = useState(null)
    const { mapDispatch } = useMap()

    const { polygon: poly } = useSearch()
    const marker = useRef<any>(null)

    const mapOptions = draggable
        ? { disableDefaultUI: true, gestureHandling: 'greedy' }
        : {
              disableDefaultUI: true,
              draggable: false,
              zoomControl: false,
              scrollwheel: false,
              disableDoubleClickZoom: true,
          }

    // Called when google maps script has been loaded
    const onLoad = useCallback(function callback(map) {
        setIsScriptLoaded(true)
        setMap(map)
    }, [])

    const onLoadPolygon = useCallback(function callback(polygon) {
        setPolygon(polygon)
    }, [])

    const onUnmount = useCallback(function callback() {
        setMap(null)
        setPolygon(null)
    }, [])

    // Keep marker in center while dragging
    const onDrag = () => {
        setMarkerPosition(map ? { lat: map.center.lat(), lng: map.center.lng() } : null)
    }

    // Checking if its in the polygon, or not
    const updateLocation = () => {
        if (selectedPosition && polygon) {
            const isValid = !google.maps.geometry.poly.containsLocation(selectedPosition, polygon as any)
            const coordinates = { lat: marker.current.props.position.lat, lng: marker.current.props.position.lng }
            mapDispatch({ type: 'isValid', value: isValid })
            mapDispatch({ type: 'position', value: coordinates })
            setAcMarkerPosition(coordinates)
        }
    }

    const setLocation = (pos) => {
        setCenter(pos)
        setMarkerPosition(pos)
        setSelectedPosition(pos)
    }

    useEffect(() => {
        if (typeof google !== 'undefined') updateLocation()
    }, [selectedPosition])

    return (
        <LoadScript googleMapsApiKey={config.GMAPS_API_KEY} libraries={libraries}>
            {withAutoComplete ? (
                <AddressAutoComplete
                    isScriptLoaded={isScriptLoaded}
                    setLocation={setLocation}
                    markerPosition={acMarkerPosition}
                    type={type}
                />
            ) : null}
            <Wrapper>
                <GoogleMap
                    mapContainerStyle={{
                        height: height,
                    }}
                    zoom={13}
                    center={center}
                    onDrag={onDrag}
                    onDragEnd={updateLocation}
                    onLoad={onLoad}
                    onUnmount={onUnmount}
                    clickableIcons={false}
                    options={mapOptions}
                >
                    <Marker ref={marker} position={markerPosition} />
                    <Polygon
                        paths={[
                            [...nonAllowedZoneCords],
                            poly.map((p) => {
                                return {
                                    lat: p.lat,
                                    lng: p.long,
                                }
                            }),
                        ]}
                        options={polygonOptions}
                        onLoad={onLoadPolygon}
                    />
                </GoogleMap>
            </Wrapper>
        </LoadScript>
    )
}
