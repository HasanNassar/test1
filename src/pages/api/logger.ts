import { cookieName } from '@util/config'
import logger from '@util/logger'
import cookie from 'cookie'
import { StatusCodes } from 'http-status-codes'
import { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.method !== 'POST') {
            res.status(StatusCodes.METHOD_NOT_ALLOWED).send('')
            return
        }

        const parsedCookies = cookie.parse(req.headers.cookie || '')
        const token = parsedCookies[cookieName]

        if (!token) {
            throw new Error('Unauthorized')
        }

        const { msg, type } = req.body

        logger[type](msg)

        res.status(StatusCodes.OK).send(true)
    } catch (e: unknown) {
        console.error('Error:', e instanceof Error ? e.message : 'Error during logging')
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(e)
    }
}
