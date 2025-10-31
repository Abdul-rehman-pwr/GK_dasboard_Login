'use client'

import { createContext, useState, useEffect, useCallback } from 'react'
import { jwtDecode } from 'jwt-decode'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import axios from 'axios'
import authConfig from '@/configs/auth'
import { useLocale } from 'next-intl'
import { USER_SERVICE_BASE_URL } from '@/configs/app'
import userService from '@/services/userService'
import { GET_KONG_SERVICE_BASE_URL } from '@/utils/axios/axiosInstance'

const defaultProvider = {
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve()
}

const AuthContext = createContext(defaultProvider)

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(defaultProvider.user)
  const [loading, setLoading] = useState(defaultProvider.loading)
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const locale = useLocale()
  const refreshThresholdInSeconds = 5
  const returnUrl = searchParams.get('returnUrl')
  const getLocalizedURL = pathname => {
    return `/${locale}/${pathname}`
  }

  const pathNames = {
    register: getLocalizedURL('register'),
    registerSuccess: getLocalizedURL('register/success/'),
    registerFailure: getLocalizedURL('register/failure/'),
    login: getLocalizedURL('login'),
    confirmEmail: getLocalizedURL('confirm-email'),
    home: getLocalizedURL('home'),
    forgotPassword: getLocalizedURL('forgot-password'),
    resetPassword: getLocalizedURL('reset-password'),
    twoSteps: getLocalizedURL('two-steps/')
  }

  const allowedPaths = [
    pathNames.login,
    pathNames.register,
    pathNames.forgotPassword,
    pathNames.confirmEmail,
    pathNames.resetPassword,
    pathNames.twoSteps,
    pathNames.registerSuccess,
    pathNames.registerFailure
  ]

  const redirectToLogin = pathname => {
    if (!allowedPaths.some(path => pathname?.includes(path))) {
      router.replace(pathNames.login)
    }
  }

  const redirectToTwoFA = email => {
    router.push(`${pathNames.twoSteps}?email=${email}`)
  }

  const getAccessToken = () => localStorage.getItem('accessToken')

  const isTokenExpiringSoon = () => {
    const token = getAccessToken()
    if (!token) return false

    try {
      const decoded = jwtDecode(token)
      const currentTime = Math.floor(Date.now() / 1000)
      const timeToExpiry = decoded.exp - currentTime
      if (timeToExpiry < 0) {
        localStorage.clear()
        return false
      }
      return timeToExpiry <= refreshThresholdInSeconds
    } catch (err) {
      console.error('Error decoding token:', err)
      return false
    }
  }
  const refreshAccessToken = async () => {
    const userData = JSON.parse(localStorage.getItem('userData'))
    const refreshToken = userData?.userToken?.refreshToken

    if (!refreshToken) {
      console.error('No refresh token found!')
      return
    }

    try {
      const response = await userService.refreshToken(refreshToken)
      const result = response.data
      const newAccessToken = result.data.sessionToken
      localStorage.setItem('accessToken', newAccessToken)
    } catch (err) {
      console.error('Failed to refresh access token:', err)
    }
  }

  useEffect(() => {
    const initAuth = async () => {
      if (typeof window !== 'undefined') {
        const localUser = JSON.parse(localStorage.getItem('userData'))
        const storedToken = localStorage.getItem(authConfig.storageTokenKeyName)

        if (storedToken) {
          setLoading(false)
          setUser(localUser)
          if (pathname.includes('login')) {
            router.replace(pathNames.home)
          }
        } else {
          setLoading(false)
          redirectToLogin(pathname)
        }
      }
    }
    if (pathname) {
      initAuth()
      if (isTokenExpiringSoon()) {
        refreshAccessToken()
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]) // Track the pathname for route changes

  const handleLogin = async (params, errorCallback) => {
    try {
      const response = await axios.post(`${GET_KONG_SERVICE_BASE_URL}/users/login`, params)
      const { status, description, data } = response.data
      if (status == '200') {
        if (data) {
          const userData = data
          setUser(userData)
          localStorage.setItem(authConfig.storageTokenKeyName, userData.sessionToken)
          localStorage.setItem('userData', JSON.stringify(userData))
          if (returnUrl) {
            router.push(returnUrl)
            return
          }
          router.push(pathNames.home)
        } else {
          redirectToTwoFA(params.email)
        }
      } else {
        errorCallback(description || 'An error occurred')
      }
    } catch (err) {
      console.error(err)
      if (errorCallback) errorCallback(err.message || 'An error occurred')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem(authConfig.storageTokenKeyName)
    localStorage.removeItem('userData')
    router.push(pathNames.login)
    setUser(null)
  }

  const values = {
    user,
    loading,
    setUser,
    setLoading,
    login: handleLogin,
    logout: handleLogout
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
