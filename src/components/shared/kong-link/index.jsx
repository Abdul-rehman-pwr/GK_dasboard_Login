'use client'
import React from 'react'
import { useLocale } from 'next-intl'
import Link from '@/components/Link'
const KongLink = ({ children, href }) => {
  const locale = useLocale()
  return <Link href={`${locale}/${href}`}>{children}</Link>
}

export default KongLink
