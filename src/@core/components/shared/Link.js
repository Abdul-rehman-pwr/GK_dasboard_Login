'use client'

import React from 'react'
import NextLink from 'next/link'
import { useLocale } from 'use-intl'

const Link = ({ href, children, className = '', ...restProps }) => {
  const locale = useLocale()

  return (
    <NextLink href={`/${locale}/${href}`} className={className} {...restProps}>
      {children}
    </NextLink>
  )
}

export default Link
