import { SettingsButton } from '@/components/settings'
import { ThemeToggle } from '@/components/theme'
import { useSite } from '@/lib/hooks/site'

export const Navbar = () => {
  const { activeSite, setActiveSite, sites } = useSite()

  return (
    <>
      <header class='h-16 p-8 flex justify-between items-center mx-auto max-w-3xl w-full'>
        <button
          type='button'
          class='text-xl font-bold cursor-pointer transition-all'
          onKeyPress={() => setActiveSite(sites[0])}
          onClick={() => setActiveSite(sites[0])}
        >
          tvk.lol
        </button>
        <nav class='flex items-center gap-4'>
          {sites.map(site => (
            <button
              type='button'
              class={`cursor-pointer transition-all hover:font-semibold ${activeSite.name === site.name ? 'underline' : ''}`}
              onClick={() => setActiveSite(site)}
              onKeyPress={() => setActiveSite(site)}
              key={site.name}
            >
              {site.name}
            </button>
          ))}
          <SettingsButton />
          <ThemeToggle />
        </nav>
      </header>
    </>
  )
}
