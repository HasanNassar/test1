import React, { createContext, FC, useReducer, useContext, ReactNode } from 'react'
import { defaultMapCoords } from '@util/config'

type MapContextState = {
    mapDispatch: React.Dispatch<MapAction>
    map: MapState
}

type MapAction =
    | { type: 'input'; name: string; value: string }
    | { type: 'position'; value: { lat: number; lng: number } }
    | { type: 'isValid'; value: boolean }
    | { type: undefined }

type MapState = {
    address: string
    coordinates: {
        lat: number
        lng: number
    }
    isValid: boolean
}

const defaultMapState = {
    address: '',
    coordinates: { ...defaultMapCoords },
    isValid: false,
}

const contextDefaultValues: MapContextState = {
    mapDispatch: () => null,
    map: { ...defaultMapState },
}

const MapContext = createContext<MapContextState>(contextDefaultValues)

export const useMap = () => useContext(MapContext)

const MapProvider: FC<{ address: string; children: ReactNode }> = ({ children, address: addr = '' }) => {
    const [map, mapDispatch] = useReducer(mapReducer, {
        ...defaultMapState,
    })

    return (
        <MapContext.Provider
            value={{
                mapDispatch,
                map,
            }}
        >
            {children}
        </MapContext.Provider>
    )
}

const mapReducer = (state: MapState, action: MapAction) => {
    switch (action.type) {
        case 'input':
            return { ...state, address: action.value }
        case 'position':
            return { ...state, coordinates: action.value }
        case 'isValid':
            return { ...state, isValid: action.value }
        default:
            return state
    }
}

export default MapProvider
