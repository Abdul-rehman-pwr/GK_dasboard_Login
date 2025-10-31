// Third-party Imports
import 'react-perfect-scrollbar/dist/css/styles.css'

// Style Imports
import '@/app/styles/global.css'
// Generated Icon CSS Imports
import '@assets/iconify-icons/generated-icons.css'
import { NextIntlClientProvider } from 'next-intl'
import ToasterProvider from '@/components/toast-provider'
import TokenValidator from '@/components/shared/token-validator'

export const metadata = {
  title: 'getKong - Dashboard',
  description: '',
  icons: {
    icon: '/logo_getKong.png' // or '/favicon.svg', etc.
  }
}

async function getMessages(locale) {
  try {
    return (await import(`../../../messages/${locale}.json`)).default
  } catch (error) {
    notFound()
  }
}
export async function generateStaticParams() {
  return ['en', 'de'].map(locale => ({ locale }))
}
const RootLayout = async ({ children, params }) => {
  const { locale } = await params
  const direction = 'ltr'
  const messages = await getMessages(locale)

  return (
    <html lang={locale} id='__next' dir={direction}>
      <body className='flex is-full min-bs-full flex-auto flex-col'>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
          <TokenValidator />
          <ToasterProvider />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}

export default RootLayout
