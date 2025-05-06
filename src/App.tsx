import { Particles } from '@/components/background'
import { CursorTrail } from '@/components/cursor-trail'
import { Navbar } from '@/components/navbar'

import { SiteProvider, useSite } from '@/lib/hooks/site'

import { SettingsProvider, useSettings } from '@/lib/hooks/settings'
import { ThemeProvider } from '@/lib/hooks/theme'
import { sites } from '@/sites'
import type { h } from 'preact'
import { useEffect, useState } from 'preact/hooks'

const ActiveSiteRenderer = () => {
  const { activeSite } = useSite()
  const [visible, setVisible] = useState(true)
  const [pendingSite, setPendingSite] = useState(activeSite)

  useEffect(() => {
    if (activeSite.name !== pendingSite.name) {
      setVisible(false)
    }
  }, [activeSite, pendingSite])

  useEffect(() => {
    if (!visible && activeSite.name !== pendingSite.name) {
      const timeout = setTimeout(() => {
        setPendingSite(activeSite)
        setVisible(true)
      }, 200)
      return () => clearTimeout(timeout)
    }
  }, [visible, activeSite, pendingSite])

  const ActiveComponent = pendingSite.component

  return (
    <div
      class={`grow flex transition-opacity duration-200 ${visible ? 'opacity-100' : 'opacity-0'}`}
    >
      <ActiveComponent />
    </div>
  )
}

const WithSettings = ({ children }: { children: h.JSX.Element }) => {
  return <SettingsProvider>{children}</SettingsProvider>
}

const Layout = () => {
  const { settings, isMounted } = useSettings()

  if (!isMounted) {
    return null
  }

  return (
    <ThemeProvider>
      {settings.theme.cursorTrail && <CursorTrail />}
      {settings.theme.siteBackground && <Particles />}
      <SiteProvider sites={sites}>
        <>
          <Navbar />
          <ActiveSiteRenderer />
        </>
      </SiteProvider>
      <footer class='h-16 p-8 flex justify-center items-center mx-auto max-w-3xl w-full'>
        <p class='text-sm'>© {new Date().getFullYear()} tvk.lol</p>
      </footer>
    </ThemeProvider>
  )
}

export const App = () => {
  return (
    <WithSettings>
      <Layout />
    </WithSettings>
  )
}
