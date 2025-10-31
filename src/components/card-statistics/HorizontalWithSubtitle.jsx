import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'

import CustomAvatar from '@core/components/mui/Avatar'

const HorizontalWithSubtitle = props => {
  const { title, stats, avatarIcon, avatarColor, trend, trendNumber, subtitle } = props

  return (
    <Card sx={{ minWidth: 300, width: 'auto', display: 'flex' }}>
      <CardContent className='flex justify-between gap-1' sx={{ display: 'flex', width: '100%' }}>
        <div className='flex flex-col gap-1 flex-grow'>
          <Typography
            color='text.primary'
            noWrap
            sx={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              width: '100%'
            }}
          >
            {title}
          </Typography>
          <div className='flex items-center gap-2 flex-wrap'>
            <Typography variant='h4'>{stats}</Typography>
            {/* <Typography color={trend === 'negative' ? 'error.main' : 'success.main'}>
              {`(${trend === 'negative' ? '-' : '+'}${trendNumber})`}
            </Typography> */}
          </div>
          <Typography variant='body2'>{subtitle}</Typography>
        </div>
        <CustomAvatar color={avatarColor} skin='light' variant='rounded' size={40}>
          <i className={avatarIcon} />
        </CustomAvatar>
      </CardContent>
    </Card>
  )
}

export default HorizontalWithSubtitle
