'use client'

// React Imports
import { useState } from 'react'

// MUI Imports
// import Grid from '@mui/material/Grid'
// import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'

import { useTranslations } from 'next-intl'

const AccountSettings = ({ tabContentList }) => {
  const t = useTranslations()
  // States
  const [activeTab, setActiveTab] = useState('account')

  const handleChange = (event, value) => {
    setActiveTab(value)
  }

  return (
    <TabContext value={activeTab}>
      {/* <Grid container spacing={6}>
        <Grid item xs={12}>
          <CustomTabList onChange={handleChange} variant='scrollable' pill='true'>
            <Tab label={t('account')} icon={<i className='bx-user' />} iconPosition='start' value='account' />
            <Tab
              label={t('companyDetails')}
              icon={<i className='bx-lock-alt' />}
              iconPosition='start'
              value='company'
            />
            <Tab label={t('taxes')} icon={<i className='bx bx-coin-stack' />} iconPosition='start' value='tax' />
          </CustomTabList>
        </Grid>
        <Grid item xs={12}>
          <TabPanel value={activeTab} className='p-0'>
            {tabContentList[activeTab]}
          </TabPanel>
        </Grid>
      </Grid> */}
    </TabContext>
  )
}

export default AccountSettings
