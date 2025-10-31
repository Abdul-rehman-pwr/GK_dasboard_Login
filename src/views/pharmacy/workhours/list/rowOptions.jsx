'use client'

import React, { useState } from 'react'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { GridMoreVertIcon } from '@mui/x-data-grid'
import { useTranslations } from 'next-intl'

import ConfirmationDialog from '@/components/shared/dialogs/confirmation-dialog'

const RowOptions = ({ onEdit = () => {}, onDelete = () => {} }) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const [loading, setLoading] = useState(false)
  const t = useTranslations()
  const [alertUserForDelete, setAlertUserForDelete] = useState(false)

  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleEdit = () => {
    onEdit()
    handleClose()
  }

  const handleDelete = () => {
    setLoading(true)
    onDelete()
    handleClose()
    setLoading(false)
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
        <MenuItem onClick={handleEdit}>{t('edit')}</MenuItem>
        <MenuItem
          onClick={() => {
            setAlertUserForDelete(true)
            handleClose()
          }}
        >
          {t('delete')}
        </MenuItem>
      </Menu>
      <ConfirmationDialog
        open={alertUserForDelete}
        heading={t('deletePharmacyWorking')}
        text={t('deletePharmacyWorkingHourConfirmation')}
        onProceed={handleDelete}
        onCancel={handleCancelAlert}
        loading={loading}
      />
    </>
  )
}

export default RowOptions
