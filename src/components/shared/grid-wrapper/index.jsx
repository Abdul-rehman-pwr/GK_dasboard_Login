'use client'

import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'

const GridWrapper = ({ children }) => {
  return (
    <Box sx={{ width: '100%' }}>
      <Grid item xs={12}>
        <Card sx={{ p: 6 }}>
          <Box
            sx={{
              '& .MuiDataGrid-cell': {
                display: 'flex',
                alignItems: 'center'
              },
              '& .MuiDataGrid-columnHeader': {
                display: 'flex',
                alignItems: 'center'
              },
              '& .MuiDataGrid-columnHeaderCheckbox': {
                visibility: 'hidden'
              },
              '& .MuiDataGrid-row:hover': {
                cursor: 'pointer !important'
              },
              '& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within': {
                outline: 'none !important'
              },
              '& .MuiDataGrid-row:focus, & .MuiDataGrid-row:focus-within': {
                outline: 'none !important'
              },
              '& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-columnHeader:focus-within': {
                outline: 'none'
              }
            }}
          >
            {children}
          </Box>
        </Card>
      </Grid>
    </Box>
  )
}

export default GridWrapper
