import cookie from 'cookie'
import { StatusCodes } from 'http-status-codes'
import { NextApiHandler } from 'next'
import axios from 'axios'
import { config } from '@util/config'

const QA_JWT =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJpZGVudGl0eS1zZXJ2aWNlQHFhLmpvaW5zd2FwcC5jb20iLCJhdWQiOiJxYS5qb2luc3dhcHAuY29tIiwicm9sZXMiOlsiUk9MRV9DVVNUT01FUiJdLCJzd2FwcFVzZXJJZCI6IjQwZWIxYjA4LWMwYjMtNDEzMi04NTc0LTk5ZGFhMmMwMjkyMiIsImV4cCI6MTc0ODc3MTIwMCwiaWF0IjoxNzQzMDM2NDg2LCJpc3MiOiJxYS5qb2luc3dhcHAuY29tIiwiY2FyZWVtSWQiOiIwLmY4a0ViY2dseDlzZDlJYmx3Q0lwMFE9PSIsImVtYWlsIjoiMC5mOGtFYmNnbHg5c2Q5SWJsd0NJcDBRPT1Aam9pbnN3YXBwLmNvbSJ9.7qZ92r-4e0dMFmxoknU8XctPoDiP8KC1dCybsVASrIM'
const DEV_JWT =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJpZGVudGl0eS1zZXJ2aWNlQGRldi5qb2luc3dhcHAuY29tIiwiYXVkIjoiZGV2LmpvaW5zd2FwcC5jb20iLCJyb2xlcyI6WyJST0xFX0NVU1RPTUVSIl0sInN3YXBwVXNlcklkIjoiZmZjMjA3MzktZjlhMC00YmVhLThhNDYtZDFmM2Q0OTQwODdiIiwiZXhwIjoxNzQ4NzcxMjAwLCJpYXQiOjE2NDMwMzY0ODYsImlzcyI6ImRldi5qb2luc3dhcHAuY29tIiwiY2FyZWVtSWQiOiIwLmY4a0ViY2dseDlzZDlJYmx3Q0lwMFE9PSIsImVtYWlsIjoiMC5mOGtFYmNnbHg5c2Q5SWJsd0NJcDBRPT1Aam9pbnN3YXBwLmNvbSJ9.rn5MDFYRhUEPEJFZDBKJWYdPLRS2qL2Ydp_Tj0CVjqE'

const careemLogin: NextApiHandler = async (req, res) => {
    const { code, country } = req.body

    if (!code) {
        return res.status(StatusCodes.BAD_REQUEST).send('')
    }

    try {
        let jwt = ''
        if (code === 'qa') jwt = QA_JWT
        else if (code === 'dev') jwt = DEV_JWT
        else jwt = await fetchJWT(code, country)

        const ONE_DAY_IN_MS = 60 * 60 * 24 * 1000

        const cookieSerialized = cookie.serialize('swapp_auth_jwt', jwt, {
            sameSite: 'strict',
            maxAge: ONE_DAY_IN_MS,
            httpOnly: true,
            secure: true,
            path: '/',
        })
        res.setHeader('Set-Cookie', cookieSerialized)
        res.status(StatusCodes.OK).end()
    } catch (error) {
        return res.status(StatusCodes.FORBIDDEN).send(error)
    }
}

const fetchJWT = async (code: string, country: string) => {
    const IDENTITY_API_URL = `${config.BASE_URL}/identity`

    const { data } = await axios.post(`${IDENTITY_API_URL}/login/careem`, {
        authCode: code,
        country,
    })
    return data.jwt
}

export default careemLogin
