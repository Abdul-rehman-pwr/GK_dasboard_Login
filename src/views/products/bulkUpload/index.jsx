'use client'

import React, { useState } from 'react'
import Grid from '@mui/material/Grid'
import PageHeader from '@/components/shared/page-header'
import { useLocale, useTranslations } from 'next-intl'
import UploadField from './uploadField'
import productService from '@/services/productService'
import toast from 'react-hot-toast'
import getLocalizedURL from '@/utils/getLocalizedUrl'
import { useRouter } from 'next/navigation'

const BulkUploadView = () => {
  const [files, setFiles] = useState([])
  const locale = useLocale()
  const [loading, setLoading] = useState(false)
  const t = useTranslations()
  const router = useRouter()

  const handleUpload = async () => {
    if (!files.length) {
      toast.error('Please select a file to upload.')
      return
    }
    setLoading(true)

    try {
      const res = await productService.uploadProducts(files)
      if (res?.status === 200) {
        const uploadedUrl = res.data[0]
        toast.success('File uploaded successfully!')
        setLoading(false)
        router.push(getLocalizedURL(locale, 'products'))
      } else {
        setLoading(false)
        throw new Error(res.data || 'File upload failed')
      }
    } catch (error) {
      setLoading(false)
      toast.error(error.message || 'File upload failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <PageHeader
        heading={t('bulkUpload')}
        breadcrumbs={[
          { label: t('home'), href: '/' },
          { label: t('products'), href: '/products' },
          { label: t('bulkUpload') }
        ]}
      />

      <Grid container spacing={6}>
        <Grid item xs={12}>
          <UploadField files={files} setFiles={setFiles} handleUpload={handleUpload} loading={loading} />
        </Grid>
      </Grid>
    </>
  )
}

export default BulkUploadView
