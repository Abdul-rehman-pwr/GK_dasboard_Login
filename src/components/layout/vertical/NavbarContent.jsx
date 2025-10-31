'use client'

// Third-party Imports
import classnames from 'classnames'

// Component Imports
import NavToggle from './NavToggle'
import ModeDropdown from '@components/layout/shared/ModeDropdown'
import UserDropdown from '@components/layout/shared/UserDropdown'

// Util Imports
import { verticalLayoutClasses } from '@layouts/utils/layoutClasses'
import LanguageDropdown from '@/components/shared/language-dropdown'
import { useLocale } from 'next-intl'

const NavbarContent = () => {
  const locale = useLocale()
  return (
    <div className={classnames(verticalLayoutClasses.navbarContent, 'flex items-center justify-between gap-4 is-full')}>
      <div className='flex items-center gap-4'>
        <NavToggle />
        {/* <ModeDropdown /> */}
      </div>
      <div className='flex items-center gap-4'>
        <LanguageDropdown defaultValue={locale} />
        <UserDropdown />
      </div>
    </div>
  )
}

export default NavbarContent
