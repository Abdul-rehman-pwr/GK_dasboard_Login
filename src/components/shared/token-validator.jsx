'use client'

import { useEffect } from 'react'
import { jwtDecode } from 'jwt-decode'
import { useRouter } from 'next/navigation' // or 'next/navigation' for App Router

const TokenValidator = () => {
  const router = useRouter()

  useEffect(() => {
    if (typeof window === 'undefined') return

    const token = localStorage.getItem('accessToken')

    if (!token) {
      console.log('No access token found.')
      return
    }

    try {
      const decoded = jwtDecode(token)
      const currentTime = Math.floor(Date.now() / 1000)

      if (decoded.exp && decoded.exp < currentTime) {
        console.warn('Token has expired.')

        localStorage.clear()

        // Detect locale from pathname
        const pathname = window.location.pathname
        const localeMatch = pathname.match(/^\/(en|de)(\/|$)/)
        const locale = localeMatch ? localeMatch[1] : 'en' // fallback

        const returnUrl = pathname + window.location.search
        const loginRedirect = `/${locale}/login?redirectUrl=${encodeURIComponent(returnUrl)}`

        window.location.href = loginRedirect
      } else {
        console.log('Token is still valid.')
      }
    } catch (err) {
      console.error('Failed to decode token:', err)
      localStorage.clear()

      const pathname = window.location.pathname
      const localeMatch = pathname.match(/^\/(en|de)(\/|$)/)
      const locale = localeMatch ? localeMatch[1] : 'en'

      //   const returnUrl = pathname + window.location.search
      const loginRedirect = `/${locale}/login`

      window.location.href = loginRedirect
    }
  }, [])

  return null // This is a non-visual component
}

export default TokenValidator
