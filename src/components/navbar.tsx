import { ThemeToggle } from '@/components/theme'
import type { Site } from '@/lib/types'

export const Navbar = ({
  active,
  sites,
  setActiveSite,
}: { active: string; sites: Site[]; setActiveSite: (s: Site) => void }) => {
  return (
    <>
      <header class='h-16 p-8 flex justify-between items-center mx-auto max-w-3xl w-full'>
        <button
          type='button'
          class='text-xl font-bold cursor-pointer transition-all hover:text-purple-500'
          onKeyPress={() => setActiveSite(sites[0])}
          onClick={() => setActiveSite(sites[0])}
        >
          tvk.lol
        </button>
        <nav class='flex gap-4'>
          {sites.map(site => (
            <button
              type='button'
              class={`cursor-pointer transition-all hover:font-semibold ${active === site.name ? 'underline' : ''}`}
              onClick={() => setActiveSite(site)}
              onKeyPress={() => setActiveSite(site)}
              key={site.name}
            >
              {site.name}
            </button>
          ))}
          <ThemeToggle />
        </nav>
      </header>
    </>
  )
}
