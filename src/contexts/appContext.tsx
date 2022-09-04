import { QueryClient, QueryClientProvider } from 'react-query'
import { AuthProvider } from './auth'
import { SearchProvider } from './search'
import React, { ReactNode } from 'react'
import { ReactQueryDevtools } from 'react-query/devtools'
import { ConfigProvider } from './config'

export const ContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                refetchInterval: 60000,
            },
        },
    })

    return (
        <QueryClientProvider client={queryClient}>
            <ReactQueryDevtools initialIsOpen={false} />
            <ConfigProvider>
                <AuthProvider>
                    <SearchProvider>{children}</SearchProvider>
                </AuthProvider>
            </ConfigProvider>
        </QueryClientProvider>
    )
}
