'use client'

import { useUserPermissions } from '@/hooks/useUserPermissions'
import { PERMISSIONS } from '@/utils/permissions'

export default function CanView({ permission, children }) {
  const { permissions } = useUserPermissions()

  if (!permissions.has(permission)) {
    return null
  }

  return <>{children}</>
}
