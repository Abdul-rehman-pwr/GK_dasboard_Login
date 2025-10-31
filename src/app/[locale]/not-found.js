// Component Imports
import getModes from '@/utils/getModes'
import Providers from '@components/Providers'
import BlankLayout from '@layouts/BlankLayout'
import NotFound from '@views/NotFound'

const NotFoundPage = ({ params }) => {
  const direction = 'ltr'
  const systemMode = getModes()

  return (
    <BlankLayout systemMode={direction}>
      <NotFound />
    </BlankLayout>
  )
}

export default NotFoundPage
