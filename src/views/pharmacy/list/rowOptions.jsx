'use client'

import React, { useState } from 'react'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { GridCheckCircleIcon, GridMoreVertIcon } from '@mui/x-data-grid'
import { useLocale, useTranslations } from 'next-intl'
import toast from 'react-hot-toast'
import { useRouter, useSearchParams } from 'next/navigation'
import getLocalizedURL from '@/utils/getLocalizedUrl'
import pharmacyServices from '@/services/pharmacy-services'
import ConfirmationDialog from '@/components/shared/dialogs/confirmation-dialog'
import { set } from 'date-fns'
import CanView from '@/@core/components/can/can-view'
import { PERMISSIONS } from '@/utils/permissions'

const RowOptions = ({ row, setData }) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const t = useTranslations()
  const router = useRouter()
  const locale = useLocale()
  const [alertUserForDelete, setAlertUserForDelete] = useState(false)

  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleEdit = () => {
    router.push(getLocalizedURL(locale, `pharmacy/edit?pharmacyId=${row.pharmacyId}&source=${row.source}`))
    handleClose()
    // your edit logic here
  }

  const handleWorkingHours = () => {
    router.push(getLocalizedURL(locale, `pharmacy/workhours/list?pharmacyId=${row.pharmacyId}&source=${row.source}`))
    handleClose()
    // your edit logic here
  }

  const handleDelete = () => {
    const deletePharmacyPromise = new Promise((resolve, reject) => {
      try {
        pharmacyServices.deletePharmacy(row.pharmacyId).then(res => {
          if (res.status == 200 || res.status == 201) {
            resolve(res.description || res.data || 'Pharmacy deleted successfully')
            handleClose()
            setAlertUserForDelete(false)
            pharmacyServices.getPharmacies({ size: 10, page: 0, source: 'custom', values: [] }).then(res => {
              if (res.status == 200 || res.status == 201) {
                setData(res.data)
              }
            })
          } else {
            handleClose()
            reject(res.description || res.data || 'Failed To Delete Pharmacy')
          }
        })
      } catch (error) {
        reject(error)
      }
    })

    toast.promise(deletePharmacyPromise, {
      loading: 'Deleting Pharmacy',
      success: msg => msg,
      error: err => err
    })
  }

  const handleCancelAlert = () => {
    setAlertUserForDelete(false)
  }

  const handleConnectAdyen = () => {
    const redirectUrl = `${process.env.NEXT_PUBLIC_ADYEN_REDIRECT_URL}/${locale}/requestProcessing?pharmacyId=${row.pharmacyId}&source=${row.source}`
    const connectionAdyenPromise = new Promise((resolve, reject) => {
      try {
        pharmacyServices.connectAdyen(row.pharmacyId, row.source, redirectUrl).then(res => {
          if (res.status == 200 || res.status == 201) {
            if (res.data && res.data?.url !== null) {
              router.replace(res?.data?.url)
            }
            resolve(res.description || res.data)
          } else {
            reject(res.description || res.data || res.Exception || t('failedConnection'))
          }
        })
      } catch (error) {
        reject(error)
      } finally {
        handleClose()
      }
    })
    toast.promise(connectionAdyenPromise, {
      loading: t('connectingToAdyen'),
      success: msg => msg,
      error: err => err
    })
  }

  const CONNECT_ADYEN_BUTTON_STATUSES = {
    COMPLETED: 'COMPLETED',
    PENDING: 'PENDING'
  }

  const status = row?.pharmacyOnboardingStatus || CONNECT_ADYEN_BUTTON_STATUSES.PENDING
  const connectAdyenButtonEnabled = !!row?.legalName && !!row?.country

  return (
    <>
      <IconButton size='small' onClick={handleClick}>
        <GridMoreVertIcon />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
      >
        <MenuItem onClick={handleEdit}>{t('edit')}</MenuItem>
        {row?.source !== 'cannaleo' ? (
          <MenuItem
            onClick={() => {
              setAlertUserForDelete(true)
              handleClose()
            }}
          >
            {t('delete')}
          </MenuItem>
        ) : (
          ''
        )}

        <MenuItem onClick={handleWorkingHours}>{t('WorkingHours')}</MenuItem>
        <CanView permission={PERMISSIONS.PHARMACY.CONNECT_ADYEN_ACCOUNT}>
          <MenuItem onClick={handleConnectAdyen} disabled={!connectAdyenButtonEnabled || status === 'COMPLETED'}>
            {status !== 'COMPLETED' ? (
              t('connectAdyenAccount')
            ) : (
              <>
                <GridCheckCircleIcon style={{ color: 'green' }} />
                {t('Connected')}
              </>
            )}
          </MenuItem>
        </CanView>
      </Menu>
      <ConfirmationDialog
        open={alertUserForDelete}
        heading={t('deletePharmacy')}
        text={t('deletePharmacyConfirmation')}
        onProceed={handleDelete}
        onCancel={handleCancelAlert}
      />
    </>
  )
}

export default RowOptions
