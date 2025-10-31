'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'
import getLocalizedURL from '@/utils/getLocalizedUrl'
import { useUserPermissions } from '@/hooks/useUserPermissions'

export default function Guard({ permission, children }) {
  const { permissions, loading } = useUserPermissions()
  const router = useRouter()
  const locale = useLocale()

  useEffect(() => {
    if (!loading && !permissions.has(permission)) {
      router.replace(getLocalizedURL(locale, 'home'))
    }
  }, [loading, permissions, router, locale, permission])

  if (loading) return null

  if (!permissions.has(permission)) return null

  return <>{children}</>
}
