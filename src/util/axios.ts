import ax, { AxiosRequestConfig } from 'axios'
import { stringify } from 'query-string'
import { config, isDev } from './config'

const axiosOptions: AxiosRequestConfig = {
    withCredentials: true,
    paramsSerializer: (params) => {
        return stringify(params, { arrayFormat: 'none', skipNull: true, skipEmptyString: true })
    },
}

if (isDev) {
    ax.defaults.headers['Authorization'] =
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJpZGVudGl0eS1zZXJ2aWNlQGRldi5qb2luc3dhcHAuY29tIiwiYXVkIjoiZGV2LmpvaW5zd2FwcC5jb20iLCJyb2xlcyI6WyJST0xFX0NVU1RPTUVSIl0sInN3YXBwVXNlcklkIjoiZmZjMjA3MzktZjlhMC00YmVhLThhNDYtZDFmM2Q0OTQwODdiIiwiZXhwIjoxNzQ4NzcxMjAwLCJpYXQiOjE2NDMwMzY0ODYsImlzcyI6ImRldi5qb2luc3dhcHAuY29tIiwiY2FyZWVtSWQiOiIwLmY4a0ViY2dseDlzZDlJYmx3Q0lwMFE9PSIsImVtYWlsIjoiMC5mOGtFYmNnbHg5c2Q5SWJsd0NJcDBRPT1Aam9pbnN3YXBwLmNvbSJ9.rn5MDFYRhUEPEJFZDBKJWYdPLRS2qL2Ydp_Tj0CVjqE'
}

export const localAxios = ax.create({
    ...axiosOptions,
    baseURL: `${isDev ? 'http://localhost:3000' : config.BASE_URL}/rental/api`,
})

export const axios = ax.create({ ...axiosOptions, baseURL: config.BASE_URL })
