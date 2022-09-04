import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { loginCareemWithCode } from '../../../service/frontend'

const CareemCallback = () => {
    const { query, push } = useRouter()

    useEffect(() => {
        if (query.code) {
            const getLocalToken = async () => {
                const resp = await loginCareemWithCode(query.code as string, query.country as string)
                if (resp.status === 200) {
                    push(`/en-dxb/dubai/${query?.page || ''}`)
                }
            }
            getLocalToken()
        }
    }, [query])

    if (!query.code) return <div>No Query Code</div>

    return null
}

export default CareemCallback
