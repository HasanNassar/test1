import { NextRequest, NextResponse } from 'next/server'

const PUBLIC_FILE = /\.(.*)$/

// eslint-disable-next-line import/prefer-default-export
export function middleware(request: NextRequest) {
    const shouldHandleLocale =
        !PUBLIC_FILE.test(request.nextUrl.pathname) &&
        !request.nextUrl.pathname.includes('/api/') &&
        !request.nextUrl.pathname.includes('/auth/') &&
        request.nextUrl.locale === 'default'
    return shouldHandleLocale
        ? NextResponse.redirect(new URL(`/rental/en-dxb${request.nextUrl.pathname}`, request.url))
        : undefined
}
