// Context Imports
'use client'
import { VerticalNavProvider } from '@menu/contexts/verticalNavContext'
import { SettingsProvider } from '@core/contexts/settingsContext'
import { AuthProvider } from '@/@core/contexts/AuthContext'
import ThemeProvider from '@components/theme'
import store, { persistor } from '@/store/index' // Adjusted path to the store
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { Suspense } from 'react'
import LoadingFallback from './shared/loading'

// Util Imports
// import { getMode, getSettingsFromCookie, getSystemMode } from '@core/utils/serverHelpers'

const Providers = props => {
  // Props
  const { children, direction } = props

  // Vars
  const mode = 'light'
  const settingsCookie = {}
  const systemMode = 'light'

  return (
    <Suspense fallback={<LoadingFallback />}>
      <VerticalNavProvider>
        <SettingsProvider settingsCookie={settingsCookie} mode={mode}>
          <ThemeProvider direction={direction} systemMode={systemMode}>
            <AuthProvider>
              <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                  {children}
                </PersistGate>
              </Provider>
            </AuthProvider>
          </ThemeProvider>
        </SettingsProvider>
      </VerticalNavProvider>
    </Suspense>
  )
}

export default Providers
