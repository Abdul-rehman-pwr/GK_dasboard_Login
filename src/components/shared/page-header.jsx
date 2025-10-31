// MUI Imports
import { Breadcrumbs, Link } from '@mui/material'
import Typography from '@mui/material/Typography'
import { useLocale, useTranslations } from 'next-intl'

const PageHeader = ({ heading, breadcrumbs, actions = [] }) => {
  const t = useTranslations()
  const initialBreadcrumbs = [
    {
      label: t('home'),
      href: '/'
    }
  ]
  const filteredBreadcrumbs = breadcrumbs.filter(f => f.href !== '/')
  const finalBreadcrumbs = [...initialBreadcrumbs, ...filteredBreadcrumbs]

  const locale = useLocale()
  return (
    <div className='flex flex-wrap sm:items-center justify-between max-sm:flex-col gap-6 mb-4'>
      <div>
        {heading && (
          <Typography variant='h4' className='mbe-1'>
            {heading}
          </Typography>
        )}

        {breadcrumbs && (
          <Breadcrumbs>
            {finalBreadcrumbs.map(item => {
              if (item.href) {
                return (
                  <Link key={item.label} underline='hover' color='inherit' href={`/${locale}${item.href}`}>
                    {item.label}
                  </Link>
                )
              }
              return (
                <Typography className='cursor-default' key={item.label} color='text.primary'>
                  {item.label}
                </Typography>
              )
            })}
          </Breadcrumbs>
        )}
      </div>
      <div className='flex flex-wrap max-sm:flex-col gap-2'>
        {actions}
        {/* <Button variant='contained'>Publish Product</Button> */}
      </div>
    </div>
  )
}

export default PageHeader
