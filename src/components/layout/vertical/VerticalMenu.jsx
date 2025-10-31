// 'use client'

// // MUI Imports
// import { useTheme } from '@mui/material/styles'
// import { useState, useEffect } from 'react'

// // Third-party Imports
// import PerfectScrollbar from 'react-perfect-scrollbar'

// // Component Imports
// import { Menu, MenuItem } from '@menu/vertical-menu'

// // Hook Imports
// import useVerticalNav from '@menu/hooks/useVerticalNav'

// // Styled Component Imports
// import StyledVerticalNavExpandIcon from '@menu/styles/vertical/StyledVerticalNavExpandIcon'

// // Style Imports
// import menuItemStyles from '@core/styles/vertical/menuItemStyles'
// import menuSectionStyles from '@core/styles/vertical/menuSectionStyles'
// import { useLocale, useTranslations } from 'next-intl'

// const RenderExpandIcon = ({ open, transitionDuration }) => (
//   <StyledVerticalNavExpandIcon open={open} transitionDuration={transitionDuration}>
//     <i className='bx-chevron-right' />
//   </StyledVerticalNavExpandIcon>
// )

// const VerticalMenu = ({ scrollMenu }) => {
//   // Hooks
//   const theme = useTheme()
//   const verticalNavOptions = useVerticalNav()
//   const t = useTranslations()
//   const locale = useLocale()

//   const { transitionDuration, isBreakpointReached } = verticalNavOptions
//   const ScrollWrapper = isBreakpointReached ? 'div' : PerfectScrollbar

//   const [activeItem, setActiveItem] = useState('')

//   useEffect(() => {
//     const currentPath = window.location.pathname.split('/').pop() || 'home'
//     setActiveItem(currentPath)
//   }, [])
//   console.log('activeItem', activeItem)
//   const handleSetActiveItem = item => () => setActiveItem(item)

//   const menuItems = [
//     { key: 'home', href: `/${locale}/home`, icon: 'bx-home', label: t('home') },
//     { key: 'client/list', href: `/${locale}/client/list`, icon: 'bx bx-user', label: t('Clients') },
//     { key: 'quotes/list', href: `/${locale}/quotes/list`, icon: 'bx bx-file', label: t('quote') },
//     { key: 'invoices/pre-sent', href: `/${locale}/invoices/pre-sent`, icon: 'bx bx-receipt', label: t('invoice') }
//   ]
//   return (
//     <ScrollWrapper
//       {...(isBreakpointReached
//         ? {
//             className: 'bs-full overflow-y-auto overflow-x-hidden',
//             onScroll: container => scrollMenu(container, false)
//           }
//         : {
//             options: { wheelPropagation: false, suppressScrollX: true },
//             onScrollY: container => scrollMenu(container, true)
//           })}
//     >
//       <Menu
//         popoutMenuOffset={{ mainAxis: 27 }}
//         menuItemStyles={menuItemStyles(verticalNavOptions, theme)}
//         renderExpandIcon={({ open }) => <RenderExpandIcon open={open} transitionDuration={transitionDuration} />}
//         renderExpandedMenuItemIcon={{ icon: <i className='bx-bxs-circle' /> }}
//         menuSectionStyles={menuSectionStyles(verticalNavOptions, theme)}
//       >
//         {menuItems.map(({ key, href, icon, label }) => (
//           <MenuItem
//             key={key}
//             href={href}
//             icon={<i className={icon} />}
//             style={{
//               color: activeItem === key ? '#696CFF' : 'inherit',
//               fontWeight: activeItem === key ? '600' : 'normal'
//             }}
//             onClick={handleSetActiveItem(key)}
//           >
//             {label}
//           </MenuItem>
//         ))}
//       </Menu>
//     </ScrollWrapper>
//   )
// }

// export default VerticalMenu

'use client'

// MUI Imports
import { useTheme } from '@mui/material/styles'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'

// Third-party Imports
import PerfectScrollbar from 'react-perfect-scrollbar'

// Component Imports
import { Menu, MenuItem, SubMenu } from '@menu/vertical-menu'

// Hook Imports
import useVerticalNav from '@menu/hooks/useVerticalNav'

// Styled Component Imports
import StyledVerticalNavExpandIcon from '@menu/styles/vertical/StyledVerticalNavExpandIcon'

// Style Imports
import menuItemStyles from '@core/styles/vertical/menuItemStyles'
import menuSectionStyles from '@core/styles/vertical/menuSectionStyles'
import { useLocale, useTranslations } from 'next-intl'
import { PERMISSIONS } from '@/utils/permissions'
import { useUserPermissions } from '@/hooks/useUserPermissions'
import CustomChip from '@/@core/components/mui/Chip'
const RenderExpandIcon = ({ open, transitionDuration }) => (
  <StyledVerticalNavExpandIcon open={open} transitionDuration={transitionDuration}>
    <i className='bx-chevron-right' />
  </StyledVerticalNavExpandIcon>
)

const VerticalMenu = ({ scrollMenu }) => {
  // Hooks
  const theme = useTheme()
  const verticalNavOptions = useVerticalNav()
  const t = useTranslations()
  const locale = useLocale()
  const pathname = usePathname()
  const { permissions } = useUserPermissions()

  const { transitionDuration, isBreakpointReached } = verticalNavOptions
  const ScrollWrapper = isBreakpointReached ? 'div' : PerfectScrollbar

  const [activeItem, setActiveItem] = useState('')

  useEffect(() => {
    const pathWithoutLocale = pathname.replace(new RegExp(`^/${locale}`), '').replace(/^\/|\/$/g, '')
    const pathSegments = pathWithoutLocale.split('/')

    if (pathSegments[0] === 'quote' || pathSegments[0] === 'quotes') {
      setActiveItem('quotes/list')
    } else if (pathSegments[0] === 'invoice' || pathSegments[0] === 'invoices') {
      setActiveItem('invoices/pre-sent')
    } else if (pathWithoutLocale === 'home') {
      setActiveItem('home')
    } else if (pathWithoutLocale === 'client/list') {
      setActiveItem('client/list')
    } else {
      setActiveItem('')
    }
  }, [pathname, locale])

  const menuItems = [
    { key: 'home', href: `/${locale}/home`, icon: 'bx bx-home', label: t('home'), permission: PERMISSIONS.VIEW_HOME },
    {
      key: 'orders',
      href: `/${locale}/orders`,
      icon: 'bx bx-receipt',
      label: t('Orders'),
      permission: PERMISSIONS.ORDER.LIST
    },
    {
      key: 'clients',
      href: `/${locale}/pharmacy-admin`,
      icon: 'bx bx-user',
      label: t('pharmacyAdmins'),
      permission: PERMISSIONS.PHARMACY_ADMIN.LIST
    },
    {
      key: 'pharmacy',
      icon: 'bx bx-capsule',
      href: `/${locale}/pharmacy/list?source=custom`,
      label: t('pharmacies'),
      permission: PERMISSIONS.PHARMACY.LIST
    },
    {
      key: 'products',
      href: `/${locale}/products?source=custom`,
      icon: 'bx bx-package',
      label: t('products'),
      permission: PERMISSIONS.PRODUCT.LIST
    }
  ]
  const visibleMenuItems = menuItems.filter(item => permissions.has(item.permission))

  return (
    <ScrollWrapper
      {...(isBreakpointReached
        ? {
            className: 'bs-full overflow-y-auto overflow-x-hidden',
            onScroll: container => scrollMenu(container, false)
          }
        : {
            options: { wheelPropagation: false, suppressScrollX: true },
            onScrollY: container => scrollMenu(container, true)
          })}
    >
      <Menu
        popoutMenuOffset={{ mainAxis: 27 }}
        menuItemStyles={menuItemStyles(verticalNavOptions, theme)}
        renderExpandIcon={({ open }) => <RenderExpandIcon open={open} transitionDuration={transitionDuration} />}
        renderExpandedMenuItemIcon={{ icon: <i className='bx-bxs-circle' /> }}
        menuSectionStyles={menuSectionStyles(verticalNavOptions, theme)}
      >
        {visibleMenuItems.map(({ key, href, icon, label, options }) =>
          options ? (
            <SubMenu
              key={key}
              label={label}
              icon={<i className={icon} />}
              style={{
                color: activeItem === key ? '#696CFF' : 'inherit',
                fontWeight: activeItem === key ? '600' : 'normal'
              }}
            >
              {options.map(({ key: subKey, href: subHref, icon: subIcon, label: subLabel }) => (
                <MenuItem
                  key={subKey}
                  href={subHref}
                  icon={<i className={subIcon} />}
                  style={{
                    color: activeItem === subKey ? '#696CFF' : 'inherit',
                    fontWeight: activeItem === subKey ? '600' : 'normal'
                  }}
                >
                  {subLabel}
                </MenuItem>
              ))}
            </SubMenu>
          ) : (
            <MenuItem
              key={key}
              href={href}
              icon={<i className={icon} />}
              style={{
                color: activeItem === key ? '#696CFF' : 'inherit',
                fontWeight: activeItem === key ? '600' : 'normal'
              }}
            >
              {label}
            </MenuItem>
          )
        )}
      </Menu>
    </ScrollWrapper>
  )
}

export default VerticalMenu
