import CustomTabList from '@/@core/components/mui/TabList'
import { TabContext } from '@mui/lab'
import { Tab } from '@mui/material'

const Tabs = ({ activeTab, handleChange = () => {} }) => {
  return (
    <TabContext value={activeTab}>
      <CustomTabList className='pb-4' onChange={handleChange} variant='scrollable' pill='true'>
        <Tab label='Custom' icon={<i className='bx bx-capsule' />} iconPosition='start' value='custom' />
        <Tab label='Cannaleo' icon={<i className='bx bx-package' />} iconPosition='start' value='cannaleo' />
      </CustomTabList>
    </TabContext>
  )
}

export default Tabs
