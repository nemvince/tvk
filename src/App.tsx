import { Navbar } from '@/components/navbar'
import { SiteProvider, useSite } from '@/lib/hooks/site'
import { About } from '@/sites/about'
import { Home } from '@/sites/home'

const ActiveSiteRenderer = () => {
  const { activeSite } = useSite()
  const ActiveComponent = activeSite.component

  return <ActiveComponent />
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
