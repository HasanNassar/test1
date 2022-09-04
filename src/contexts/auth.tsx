import React, { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react'
import { useQuery } from 'react-query'
import { identityService } from 'src/service/identity'

export type AuthContextType = {
    login: () => void
    careemLogin: () => void
    logout: () => void
    user: User | undefined
}

export type User = {
    careemId: string
    dateOfBirth: string
    email: string
    firstName: string
    isBanned: boolean
    isPhoneVerified: boolean
    lastName: string
    marketingMessagesAccepted: boolean
    phoneNumber: string
    preferredLanguage: string
    sendSms: boolean
    termsAndConditionsAcceptedAt: string
    userId: string
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isInit, setIsInit] = useState(false)
    const [user, setUser] = useState<User | null>(null)
    const [initialLoding, setInitialLoading] = useState(true)

    const { data: userData, isLoading: userLoading } = useQuery('user', () => identityService.getMe(), {
        onSuccess: ({ data }) => {
            if (data) {
                setUser(data)
            }
        },
        onError: (err) => {
            // console.error(err)
            setUser(null)
        },
        enabled: !isInit,
    })

    const login = () => {
        setIsInit(false)
    }

    const careemLogin = () => {
        setIsInit(false)
    }

    const logout = (): void => {
        setUser(null)
    }

    const memoedValue = useMemo(
        () => ({
            login,
            careemLogin,
            logout,
        }),
        [],
    )

    useEffect(() => {
        setInitialLoading(false)
    }, [])
    return (
        <AuthContext.Provider value={{ ...memoedValue, user } as AuthContextType}>
            {!initialLoding && children}
        </AuthContext.Provider>
    )
}

export const useAuth = (): AuthContextType => {
    return useContext(AuthContext)
}
