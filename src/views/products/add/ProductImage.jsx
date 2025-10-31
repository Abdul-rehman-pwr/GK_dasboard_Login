'use client'

import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import { useDropzone } from 'react-dropzone'
import Link from '@components/Link'
import CustomAvatar from '@core/components/mui/Avatar'
import AppReactDropzone from '@/libs/styles/AppReactDropzone'
import { useEffect } from 'react'

const Dropzone = styled(AppReactDropzone)(({ theme }) => ({
  '& .dropzone': {
    minHeight: 'unset',
    padding: theme.spacing(12),
    [theme.breakpoints.down('sm')]: {
      paddingInline: theme.spacing(5)
    },
    '&+.MuiList-root .MuiListItem-root .file-name': {
      fontWeight: theme.typography.body1.fontWeight
    },
    cursor: props => (props.disabled ? 'not-allowed' : 'pointer')
  }
}))

const ProductImage = ({ files, setFiles, initialFileUrl = '', disabled = false }) => {
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: acceptedFiles => {
      if (disabled) return
      const file = acceptedFiles[0]
      if (file) setFiles([file])
    },
    noClick: disabled,
    noKeyboard: disabled,
    disabled
  })

  const renderFilePreview = file => {
    const src = file.preview || URL.createObjectURL(file)
    return <img width={38} height={38} alt={file.name} src={src} />
  }

  const handleRemoveFile = file => {
    if (disabled) return
    const uploadedFiles = files
    const filtered = uploadedFiles.filter(i => i.name !== file.name)
    setFiles([...filtered])
  }

  useEffect(() => {
    if (initialFileUrl && files.length === 0) {
      const fakeFile = {
        name: initialFileUrl.split('/').pop(),
        size: 123456,
        type: 'image/jpeg',
        preview: initialFileUrl
      }
      setFiles([fakeFile])
    }
  }, [initialFileUrl, files, setFiles])

  const fileList = files.map(file => (
    <ListItem key={file.name} className='pis-4 plb-3'>
      <div className='file-details'>
        <div className='file-preview'>{renderFilePreview(file)}</div>
        <div>
          <Typography variant='h6' className='file-name'>
            {file.name}
          </Typography>
          <Typography className='file-size' variant='body2'>
            {Math.round(file.size / 100) / 10 > 1000
              ? `${(Math.round(file.size / 100) / 10000).toFixed(1)} mb`
              : `${(Math.round(file.size / 100) / 10).toFixed(1)} kb`}
          </Typography>
        </div>
      </div>
    </ListItem>
  ))

  return (
    <Dropzone disabled={disabled}>
      <Card>
        <CardHeader title='Product Image' sx={{ '& .MuiCardHeader-action': { alignSelf: 'center' } }} />
        <CardContent style={{ pointerEvents: disabled ? 'none' : 'auto', opacity: disabled ? 0.6 : 1 }}>
          <div {...getRootProps({ className: 'dropzone' })}>
            <input {...getInputProps()} disabled={disabled} />
            <div className='flex items-center flex-col gap-2 text-center'>
              <CustomAvatar variant='rounded' skin='light' color='secondary' size={40}>
                <i className='bx-upload' />
              </CustomAvatar>
              <Typography variant='h4'>Drag and Drop Your Image Here.</Typography>
              <Typography color='text.disabled'>or</Typography>
              <Button variant='tonal' size='small' disabled={disabled}>
                Browse Image
              </Button>
            </div>
          </div>
          {files.length ? (
            <>
              <List>{fileList}</List>
            </>
          ) : null}
        </CardContent>
      </Card>
    </Dropzone>
  )
}

export default ProductImage
