import type { Site } from '@/lib/types'
import { type JSX, createContext } from 'preact'
import { useContext, useEffect, useState } from 'preact/hooks'

const SiteContext = createContext<{
  sites: Site[]
  activeSite: Site
  setActiveSite: (site: Site) => void
}>({
  sites: [],
  activeSite: { name: '', component: () => <></> },
  setActiveSite: () => null,
})

const SiteProvider = ({
  children,
  sites,
}: { children: JSX.Element; sites: Site[] }) => {
  const [activeSite, setActiveSite] = useState<Site>(sites[0])

  useEffect(() => {
    const storedSite = localStorage.getItem('activeSite')
    if (storedSite) {
      const site = sites.find(site => site.name === storedSite)
      if (site) {
        setActiveSite(site)
      }
    }
  }, [sites])

  useEffect(() => {
    localStorage.setItem('activeSite', activeSite.name)
  }, [activeSite])

  return (
    <SiteContext.Provider value={{ sites, activeSite, setActiveSite }}>
      {children}
    </SiteContext.Provider>
  )
}

export const useSite = () => {
  const context = useContext(SiteContext)
  if (!context) {
    throw new Error('useSite must be used within a SiteProvider')
  }
  return context
}

export { SiteProvider }
