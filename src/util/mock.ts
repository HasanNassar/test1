import { AxiosResponse } from 'axios'
import { isMock } from './config'

export const getMockProxy: MockProxy = (realObject, mockObject) => {
    if (!mockObject) return realObject
    const mockHandler = {
        get(_, prop) {
            if (prop in mockObject || prop in realObject) {
                if (isMock) return mockObject[prop]
                if (realObject[prop] === undefined) {
                    return mockObject[prop]
                }
            }
            return realObject[prop]
        },
    }
    return new Proxy(realObject, mockHandler)
}

export const axiosify = <T>(payload: T): Promise<Partial<AxiosResponse<T>>> => {
    return new Promise((res) => {
        res({ data: payload })
    })
}

export type MockProxy = <T>(realObject: Partial<T>, mockObject: T) => T
export type ServiceResponse<T> = Promise<Partial<AxiosResponse<T>>>
