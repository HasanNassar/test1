import { LogTypes } from '@util/enums'
import { localAxios } from '../util/axios'

export const logOut = () => {
    return localAxios.get(`/auth/logout`)
}

export const loginCareemWithCode = (code: string, country: string) => {
    return localAxios.post(`/auth/careem/`, {
        code,
        country,
    })
}

export const logToBackend = (msg: string, type: LogTypes) => {
    return localAxios.post(`/logger/`, {
        msg,
        type,
    })
}
