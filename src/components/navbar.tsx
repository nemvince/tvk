import type { Site } from "@/lib/types";

export const Navbar = ({
  active,
  sites,
  setActiveSite,
}: { active: string; sites: Site[]; setActiveSite: (s: Site) => void }) => {
  return (
    <>
      <header class='h-16 p-8 flex justify-between items-center mx-auto max-w-3xl w-full'>
        <h1 class='text-xl font-bold'>tvk.lol</h1>
        <nav class='flex gap-4'>
          {sites.map(site => (
            <span
              class={`cursor-pointer ${active === site.name ? 'underline' : ''}`}
              onClick={() => setActiveSite(site)}
              onKeyPress={() => setActiveSite(site)}
              key={site.name}
            >
              {site.name}
            </span>
          ))}
        </nav>
      </header>
    </>
  )
}