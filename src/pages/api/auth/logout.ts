import cookie from 'cookie'
import { NextApiHandler } from 'next'
import { isDev } from '../../../util/config'

const logout: NextApiHandler = async (_, res) => {
    const cookieSerialized = cookie.serialize('id_token', '', {
        sameSite: 'lax',
        maxAge: -1,
        httpOnly: true,
        secure: !isDev,
    })
    res.setHeader('Set-Cookie', cookieSerialized)
    res.status(200).end()
}

export default logout
