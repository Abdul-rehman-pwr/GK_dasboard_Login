import axios from 'axios'

export const USER_SERVICE_BASE_URL = 'https://bill-e-user-service-dev.internal.pwr.dev'

export const CORE_SERVICE_BASE_URL = process.env.NEXT_PUBLIC_CORE_SERVICE_BASE_URL
export const GET_KONG_SERVICE_BASE_URL = process.env.NEXT_PUBLIC_CORE_SERVICE_BASE_URL
export const GET_KONG_SHOP_SERVICE_BASE_URL = process.env.NEXT_PUBLIC_SHOP_SERVICE_BASE_URL

const createAxiosInstance = baseURL => {
  const instance = axios.create({
    baseURL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json'
    }
  })

  // Request interceptor
  instance.interceptors.request.use(
    config => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('accessToken')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
      }
      return config
    },
    error => Promise.reject(error)
  )

  // Response interceptor
  instance.interceptors.response.use(
    response => response,
    error => {
      if (typeof window !== 'undefined') {
        const { pathname, search } = window.location
        const returnUrl = pathname + search

        // Extract locale from URL (e.g., "/en/page" or "/de/page")
        const localeMatch = pathname.match(/^\/(en|de)(\/|$)/)
        const locale = localeMatch ? localeMatch[1] : 'en' // default to 'en'

        // Build redirect URL with returnUrl
        let redirectTo = `/${locale}/login`
        if (returnUrl && !returnUrl.includes('/login')) {
          redirectTo += `?returnUrl=${encodeURIComponent(returnUrl)}`
        }

        if (error.response && error.response.status === 401) {
          console.error('Unauthenticated! Redirecting to login...')
          localStorage.clear()
          if (!window.location.href.includes('/login')) {
            window.location.href = redirectTo
          }
        } else if (error.response && error.response.status === 403) {
          console.error('Unauthorized! Redirecting to 403...')
          localStorage.clear()
          window.location.href = `/${locale}/login`
        }
      }

      return Promise.reject(error)
    }
  )

  return instance
}

// Create specific instances
export const userAxiosInstance = createAxiosInstance(USER_SERVICE_BASE_URL)
export const coreAxiosInstance = createAxiosInstance(CORE_SERVICE_BASE_URL)
export const getKongAxiosInstance = createAxiosInstance(GET_KONG_SERVICE_BASE_URL)
export const getKongShopAxiosInstance = createAxiosInstance(GET_KONG_SHOP_SERVICE_BASE_URL)
