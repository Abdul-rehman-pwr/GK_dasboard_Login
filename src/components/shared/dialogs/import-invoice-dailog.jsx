'use client'

import { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { toast } from 'react-hot-toast'
import { coreAxiosInstance } from '@/utils/axios/axiosInstance'
import { IoIosCloudDownload } from 'react-icons/io'
import { useRouter } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'

const ImportInvoiceDialog = ({ openInvoiceDialog, onCloseInvoiceDialog, heading }) => {
  const [uploadProgress, setUploadProgress] = useState(0)
  const [file, setFile] = useState(null)
  const [uploadError, setUploadError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const router = useRouter()
  const locale = useLocale()
  const t = useTranslations()
  const parseErrorMessage = errorResponse => {
    try {
      if (typeof errorResponse === 'object' && errorResponse !== null) {
        const exceptionMessage = errorResponse?.Exception || t('unknown_error')
        return exceptionMessage
      }

      if (typeof errorResponse === 'string') {
        const duplicateKeyMatch = errorResponse.match(/Key \(invoice_id\)=\((\d+)\) already exists/)
        if (duplicateKeyMatch) {
          if (duplicateKeyMatch) {
            return `${t('duplicate_invoice_detected_before')} ${duplicateKeyMatch[1]} ${t('duplicate_invoice_detected_after')}`
          }
        }

        if (errorResponse.includes('duplicate key value violates unique constraint')) {
          return t('duplicate_entry')
        }

        return t('xml_processing_error')
      }
    } catch (error) {
      return t('response_processing_error')
    }
  }

  const onDrop = (acceptedFiles, rejectedFiles) => {
    if (rejectedFiles.length > 0) {
      toast.error(t('only_xml_allowed'))
      return
    }
    if (acceptedFiles.length > 1) {
      toast.error(t('single_xml_upload_allowed'))
      return
    }
    const uploadedFile = acceptedFiles[0]
    if (uploadedFile.size > 10 * 1024 * 1024) {
      setUploadError(true)
      toast.error(t('file_size_limit'))
      return
    }
    setFile(uploadedFile)
    setUploadProgress(0)
    handleUploadFile(uploadedFile)
  }

  const handleUploadFile = async file => {
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await coreAxiosInstance.post('/invoice/importXml', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: progressEvent => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          setUploadProgress(percentCompleted)
        }
      })

      if (response?.data?.status == '200') {
        onCloseInvoiceDialog()
        toast.success(t('invoice_added_successfully'))
        setTimeout(() => {
          setFile(null)
          router.push(`/${locale}/invoice/preview/?id=${response?.data?.data?.id}&invocieUserType=INVOICE`)
        }, 1000)
        return
      }

      if (response?.data?.Exception || typeof response?.data === 'string') {
        const error = parseErrorMessage(response?.data?.Exception || response?.data, t)
        setErrorMessage(error)
        setUploadError(true)
        toast.error(t('xml_potential_error'))
        return
      }
    } catch (error) {
      if (error.response?.data) {
        const parsedError = parseErrorMessage(error?.response?.data, t)
        setErrorMessage(parsedError)
        setUploadError(true)
      } else {
        toast.error(t('file_processing_failed'))
        setUploadError(true)
      }
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'application/xml': ['.xml'] },
    onDrop
  })
  const handleTryAgain = () => {
    setUploadError(false)
    setFile(null)
  }
  const handleCloseDialog = () => {
    setUploadError(false)
    onCloseInvoiceDialog()
    if (file) setFile(null)
  }
  return (
    <Dialog fullWidth maxWidth={file ? 'md' : 'sm'} open={openInvoiceDialog} onClose={handleCloseDialog}>
      <DialogContent className='flex flex-col tab:flex-row items-center tab:items-start gap-4 text-center transition-all duration-300'>
        {/* Dropzone */}
        <div
          {...getRootProps()}
          className={`flex flex-col cursor-pointer items-center border p-10 border-slate-300 rounded-md shadow-md transition-all duration-300 ${
            file ? 'w-full tab:w-1/2' : 'w-full'
          }`}
        >
          <IoIosCloudDownload size={80} className='text-blue-500' />
          <Typography variant='h4'>{heading}</Typography>
          <div
            className={`mt-4 p-4 border-2 border-dashed rounded-lg text-center transition-all duration-300 ${
              isDragActive
                ? 'border-blue-500 bg-blue-100'
                : 'border-gray-300 hover:bg-slate-100 transition-all duration-300 transform '
            }`}
          >
            <input {...getInputProps()} />
            {isDragActive ? (
              <p className='text-blue-500'>{t('drop_xml_here')}</p>
            ) : (
              <p className=''>{t('drag_drop_xml')}</p>
            )}
          </div>
        </div>

        {/* File Previewer */}
        {file && (
          <div className='w-full tab:w-1/2 gap-4 flex flex-col items-start transition-all duration-300'>
            <div className=' w-full flex flex-col items-start transition-all duration-300'>
              <div className='flex w-full justify-between items-center gap-4'>
                <Typography
                  variant='body2'
                  className='text-gray-600 flex flex-col p-2 text-start rounded-md font-semibold'
                >
                  {file.name}
                  <span className='text-slate-500 text-lg font-normal'>
                    ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                  </span>
                </Typography>
              </div>
              <div className='w-full bg-gray-200 rounded-full h-2 mt-2'>
                <div
                  className='bg-blue-500 h-2 rounded-full transition-all duration-300'
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <div className='my-2 flex justify-end w-full'>
                {uploadProgress}% {uploadProgress < 100 ? t('uploading') : t('uploaded')}
              </div>
            </div>
            {uploadError && (
              <div className=' flex-1 w-full flex justify-center items-center border border-red-600 bg-red-100 rounded-md p-2 text-red-500'>
                {errorMessage}
              </div>
            )}
          </div>
        )}
      </DialogContent>

      <DialogActions className='max-sm:flex-col max-sm:gap-4 justify-end'>
        {uploadProgress > 0 && uploadProgress < 100 ? (
          <Button disabled variant='contained' className='max-sm:mis-0 bg-yellow-500 text-white max-sm:is-full'>
            {t('uploading')}
          </Button>
        ) : (
          uploadError && (
            <Button
              onClick={handleTryAgain}
              variant='contained'
              className='max-sm:mis-0 bg-red-500 text-white max-sm:is-full'
            >
              {t('try_again')}
            </Button>
          )
        )}

        <Button onClick={handleCloseDialog} variant='tonal' color='secondary' className='max-sm:mis-0 max-sm:is-full'>
          {t('close')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ImportInvoiceDialog
