'use client'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'

// Third-party Imports
import { useDropzone } from 'react-dropzone'

// Component Imports
import CustomAvatar from '@core/components/mui/Avatar'

// Styled Component Imports
import AppReactDropzone from '@/libs/styles/AppReactDropzone'
import PreviewFile from './previewFile'

// Styled Dropzone Component
const Dropzone = styled(AppReactDropzone)(({ theme }) => ({
  '& .dropzone': {
    minHeight: 'unset',
    padding: theme.spacing(12),
    [theme.breakpoints.down('sm')]: {
      paddingInline: theme.spacing(5)
    },
    '&+.MuiList-root .MuiListItem-root .file-name': {
      fontWeight: theme.typography.body1.fontWeight
    }
  }
}))

const UploadField = ({ files, setFiles, handleUpload = () => {}, loading = false }) => {
  // Dropzone with CSV/XLSX restrictions
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    },
    multiple: false,
    onDrop: acceptedFiles => {
      const file = acceptedFiles[0]
      if (file) {
        setFiles([file])
      }
    }
  })

  const handleRemoveFile = file => {
    const filtered = files.filter(i => i.name !== file.name)
    setFiles(filtered)
  }

  const fileList = files.map(file => (
    <ListItem key={file.name} className='pis-4 plb-3'>
      <div className='file-details'>
        <div className='file-preview'>
          <i className='bx-file text-2xl mr-3' />
        </div>
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
      <IconButton onClick={() => handleRemoveFile(file)}>
        <i className='bx-x text-xl' />
      </IconButton>
    </ListItem>
  ))
  const handleRemoveAllFiles = () => setFiles([])
  return (
    <Dropzone>
      <Card>
        <CardHeader title='Bulk Upload (CSV or XLSX)' sx={{ '& .MuiCardHeader-action': { alignSelf: 'center' } }} />
        <CardContent>
          <div {...getRootProps({ className: 'dropzone' })}>
            <input {...getInputProps()} />
            <div className='flex items-center flex-col gap-2 text-center'>
              <CustomAvatar variant='rounded' skin='light' color='secondary' size={40}>
                <i className='bx-upload' />
              </CustomAvatar>
              <Typography variant='h4'>Drag and Drop Your CSV/XLSX File</Typography>
              <Typography color='text.disabled'>or</Typography>
              <Button variant='tonal' size='small'>
                Browse File
              </Button>
            </div>
          </div>

          {files.length > 0 && (
            <>
              <List>{fileList}</List>
              <div className='buttons'>
                <Button color='error' variant='tonal' onClick={handleRemoveAllFiles}>
                  Remove
                </Button>
                <Button color='primary' variant='tonal' onClick={handleUpload}>
                  Upload
                </Button>
              </div>
            </>
          )}

          {/* <div className='preview-file mt-4'>
            <PreviewFile file={files[0]} />
          </div> */}
        </CardContent>
      </Card>
    </Dropzone>
  )
}

export default UploadField
