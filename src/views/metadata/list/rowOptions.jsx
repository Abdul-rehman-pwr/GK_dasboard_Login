'use client'

import React, { useState } from 'react'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { GridMoreVertIcon } from '@mui/x-data-grid'
import { useLocale, useTranslations } from 'next-intl'
import productService from '@/services/productService'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import getLocalizedURL from '@/utils/getLocalizedUrl'
import CanView from '@/@core/components/can/can-view'
import { PERMISSIONS } from '@/utils/permissions'

const RowOptions = ({ row, setData }) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const t = useTranslations()
  const router = useRouter()
  const locale = useLocale()

  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleEdit = () => {
    router.push(getLocalizedURL(locale, `products/edit?id=${row.id}`))
    handleClose()
  }

  const handleDelete = () => {
    const deleteProductPromise = new Promise((resolve, reject) => {
      try {
        productService.deleteProduct(row.id).then(res => {
          if (res.status == 200 || res.status == 201) {
            resolve('Product deleted successfully')
            handleClose()
            productService.getProducts({ size: 10, page: 0, source: 'custom', values: [] }).then(res => {
              if (res.status == 200 || res.status == 201) {
                setData(res.data)
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
          <MenuItem onClick={handleDelete}>{t('delete')}</MenuItem>
        </CanView>
      </Menu>
    </>
  )
}

export default RowOptions
