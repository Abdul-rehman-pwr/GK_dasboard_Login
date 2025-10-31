import React from 'react'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import { useDropzone } from 'react-dropzone'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ProductImage from '@/views/products/add/ProductImage'

const ImageUploadSection = () => {
  const { getRootProps, getInputProps, acceptedFiles } = useDropzone()

  return <ProductImage />
}

export default ImageUploadSection
