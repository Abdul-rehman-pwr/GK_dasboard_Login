'use client'

import React, { useState } from 'react'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { GridMoreVertIcon } from '@mui/x-data-grid'
import { useLocale, useTranslations } from 'next-intl'
import productService from '@/services/productService'
import toast from 'react-hot-toast'
import { useRouter, useSearchParams } from 'next/navigation'
import getLocalizedURL from '@/utils/getLocalizedUrl'
import CanView from '@/@core/components/can/can-view'
import { PERMISSIONS } from '@/utils/permissions'
import ConfirmationDialog from '@/components/shared/dialogs/confirmation-dialog'

const RowOptions = ({ row, setData }) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const t = useTranslations()
  const router = useRouter()
  const locale = useLocale()
  const searchParams = useSearchParams()
  const [alertUserForDelete, setAlertUserForDelete] = useState(false)

  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const source = searchParams.get('source')

  const handleEdit = () => {
    router.push(getLocalizedURL(locale, `products/edit?id=${row.id}&source=${source}`))
    handleClose()
  }

  const handleDelete = () => {
    const deleteProductPromise = new Promise((resolve, reject) => {
      try {
        productService.deleteProduct(row.id, source).then(res => {
          if (res.status == 200 || res.status == 201) {
            resolve('Product deleted successfully')
            handleClose()
            setAlertUserForDelete(false)
            productService.getProducts({ size: 10, page: 0, source: 'custom', values: [] }).then(res => {
              if (res.data.status == 200 || res.data.status == 201) {
                setData(res.data.data?.content)
              }
            })
          } else {
            handleClose()
            reject(res.description || res.data || 'Failed To Delete Product')
          }
        })
      } catch (error) {
        reject(error)
      }
    })

    toast.promise(deleteProductPromise, {
      loading: 'Deleting Product...',
      success: msg => msg,
      error: err => err
    })
  }

  const handleCancelAlert = () => {
    setAlertUserForDelete(false)
  }

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
        <CanView permission={PERMISSIONS.PRODUCT.EDIT}>
          <MenuItem onClick={handleEdit}>{t('edit')}</MenuItem>
        </CanView>
        <CanView permission={PERMISSIONS.PRODUCT.DELETE}>
          <MenuItem
            onClick={() => {
              setAlertUserForDelete(true)
              handleClose()
            }}
          >
            {t('delete')}
          </MenuItem>
        </CanView>
        {/* <CanView permission={PERMISSIONS.PRODUCT.DELETE}>
          <MenuItem
            onClick={() => {
              router.push(getLocalizedURL(locale, `metadata?productId=${row.id}`))
            }}
          >
            {t('viewmetadata')}
          </MenuItem>
        </CanView> */}
      </Menu>
      <ConfirmationDialog
        open={alertUserForDelete}
        heading={t('deleteProduct')}
        text={t('deleteProductConfirmation')}
        onProceed={handleDelete}
        onCancel={handleCancelAlert}
      />
    </>
  )
}

export default RowOptions
