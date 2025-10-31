'use client'

// React Imports
import { useRef, useState } from 'react'

// Next Imports
import { redirect, useRouter } from 'next/navigation'

// MUI Imports
import { styled } from '@mui/material/styles'
import Badge from '@mui/material/Badge'
import Popper from '@mui/material/Popper'
import Fade from '@mui/material/Fade'
import Paper from '@mui/material/Paper'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import MenuList from '@mui/material/MenuList'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import Link from '@components/Link'
import NextLink from 'next/link'

// Component Imports
import CustomAvatar from '@core/components/mui/Avatar'

// Hook Imports
import { useSettings } from '@core/hooks/useSettings'
import { useAuth } from '@core/hooks/useAuth'
import { useLocale, useTranslations } from 'next-intl'
import getLocalizedURL from '@/utils/getLocalizedUrl'
import ConfirmationDialog from '@/components/shared/dialogs/confirmation-dialog'

// Styled component for badge content
const BadgeContentSpan = styled('span')({
  width: 8,
  height: 8,
  borderRadius: '50%',
  cursor: 'pointer',
  backgroundColor: 'var(--mui-palette-success-main)',
  boxShadow: '0 0 0 2px var(--mui-palette-background-paper)'
})

const UserDropdown = () => {
  const t = useTranslations()
  // States
  const [open, setOpen] = useState(false)
  const auth = useAuth()
  const locale = useLocale()
  const [alertUserForLogout, setAlertUserForLogout] = useState(false)
  const hanldeAlertUserForLogout = () => {
    setOpen(false)
    setAlertUserForLogout(true)
  }

  const profileImage = auth.user?.image || '/images/avatars/1.png'

  // Refs
  const anchorRef = useRef(null)

  // Hooks
  const router = useRouter()
  const { settings } = useSettings()

  const handleDropdownOpen = () => {
    !open ? setOpen(true) : setOpen(false)
  }
  const handleCancelLogoutAlert = () => {
    setAlertUserForLogout(false)
  }

  const handleDropdownClose = (event, url) => {
    if (url) {
      router.push(url)
    }

    if (anchorRef.current && anchorRef.current.contains(event?.target)) {
      return
    }

    setOpen(false)
  }

  const handleUserLogout = async () => {
    await auth?.logout()
    setAlertUserForLogout(false)
  }

  const redirectToProfile = () => {
    redirect(getLocalizedURL(locale, 'profile'))
  }

  return (
    <>
      <Badge
        ref={anchorRef}
        overlap='circular'
        badgeContent={<BadgeContentSpan onClick={handleDropdownOpen} />}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        className='mis-2.5'
      >
        <CustomAvatar
          ref={anchorRef}
          alt='John Doe'
          src={profileImage}
          onClick={handleDropdownOpen}
          className='cursor-pointer'
        />
      </Badge>
      <Popper
        open={open}
        transition
        disablePortal
        placement='bottom-end'
        anchorEl={anchorRef.current}
        className='min-is-[240px] !mbs-4 z-[1]'
      >
        {({ TransitionProps, placement }) => (
          <Fade
            {...TransitionProps}
            style={{
              transformOrigin: placement === 'bottom-end' ? 'right top' : 'left top'
            }}
          >
            <Paper className={settings.skin === 'bordered' ? 'border shadow-none' : 'shadow-lg'}>
              <ClickAwayListener onClickAway={e => handleDropdownClose(e)}>
                <MenuList>
                  <div className='flex items-center plb-2 pli-5 gap-2' tabIndex={-1}>
                    <CustomAvatar size={40} alt='John Doe' src={profileImage} />
                    <div className='flex items-start flex-col'>
                      <Typography variant='h6'>
                        {' '}
                        {`${auth?.user?.firstName ?? 'Doctor'} ${auth?.user?.lastName ?? ''}`}
                      </Typography>
                      <Typography variant='body2' color='text.disabled'>
                        {auth?.user?.email}
                      </Typography>
                    </div>
                  </div>
                  {/* <Divider className='mlb-1' /> */}
                  {/* <NextLink href={`/${locale}/profile`}>
                    <MenuItem className='gap-3' onClick={e => handleDropdownClose(e)}>
                      <i className='bx-user' />

                      {t('myProfile')}
                    </MenuItem>
                  </NextLink> */}

                  <Divider className='mlb-1' />
                  <MenuItem className='gap-3' onClick={hanldeAlertUserForLogout}>
                    <i className='bx-power-off' />
                    <Typography color='text.primary'>{t('logout')}</Typography>
                  </MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Fade>
        )}
      </Popper>

      <ConfirmationDialog
        open={alertUserForLogout}
        heading={t('logout')}
        text={t('areYouSureToLogout')}
        onProceed={handleUserLogout}
        onCancel={handleCancelLogoutAlert}
      />
    </>
  )
}

export default UserDropdown
