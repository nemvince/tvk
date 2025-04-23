import { Navbar } from '@/components/navbar'
import { Home } from '@/sites/home'
import { useState } from 'preact/hooks'

export const App = () => {
  const sites = [
    { name: 'Home', component: Home },
    { name: 'Something', component: () => <div>Second Page</div> },
  ]

  const [activeSite, setActiveSite] = useState(sites[0])

  return (
    <>
      <Navbar
        active={activeSite.name}
        sites={sites}
        setActiveSite={setActiveSite}
      />
      <main class='grow flex flex-col items-center justify-center'>
        {activeSite.component()}
      </main>
      <footer class='h-16 p-8 flex justify-center items-center mx-auto max-w-3xl w-full'>
        <p class='text-sm'>© {new Date().getFullYear()} tvk.lol</p>
      </footer>
    </>
  )
}
