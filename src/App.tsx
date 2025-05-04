import { Navbar } from '@/components/navbar'
import { SiteProvider, useSite } from '@/lib/hooks/site'
import { About } from '@/sites/about'
import { Home } from '@/sites/home'

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

export const App = () => {
  const sites = [
    { name: 'Home', component: Home },
    { name: 'About', component: About },
  ]

  return (
    <>
      <SiteProvider sites={sites}>
        <>
          <Navbar />
          <ActiveSiteRenderer />
        </>
      </SiteProvider>
      <footer class='h-16 p-8 flex justify-center items-center mx-auto max-w-3xl w-full'>
        <p class='text-sm'>© {new Date().getFullYear()} tvk.lol</p>
      </footer>
    </>
  )
}
