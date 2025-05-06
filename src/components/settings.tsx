import { Button } from '@/components/button'
import { Card } from '@/components/card'
import { H3, H4 } from '@/components/typography'
import { useSettings } from '@/lib/hooks/settings'
import { AccentColor } from '@/lib/types'
import { useState } from 'preact/hooks'
import '@/styles/settings.css'

export const SettingsDialog = ({
  open,
  onClose,
}: { open: boolean; onClose: () => void }) => {
  const { settings, setSettings } = useSettings()
  const [selected, setSelected] = useState<AccentColor>(
    settings.theme.accentColor
  )
  // Animation state
  const [visible, setVisible] = useState(open)
  const [animating, setAnimating] = useState(false)

  // Handle open/close transitions
  if (open && !visible) {
    setVisible(true)
    setAnimating(true)
  }
  // When closing, animate out then hide
  const handleClose = () => {
    setAnimating(false)
    setTimeout(() => {
      setVisible(false)
      onClose()
    }, 250) // match CSS duration
  }

  const handleSave = () => {
    setSettings({
      ...settings,
      theme: { ...settings.theme, accentColor: selected },
    })
    handleClose()
  }

  // Only render if visible
  if (!visible) {
    return null
  }

  return (
    <div class={`settings-backdrop ${open && animating ? 'open' : 'closed'}`}>
      <Card
        class={`p-6 settings-dialog ${open && animating ? 'open' : 'closed'}`}
      >
        <H3>Settings</H3>
        <H4 id='accent-color-label'>Accent Color</H4>
        <div
          class='flex flex-wrap gap-2 my-4'
          role='radiogroup'
          aria-labelledby='accent-color-label'
        >
          {Object.values(AccentColor).map(color => (
            <button
              key={color}
              type='button'
              role='radio'
              aria-checked={selected === color}
              aria-label={color}
              class={`w-7 h-7 rounded-full border-2 ${selected === color ? `border-${color}-800 dark:border-${color}-300 scale-110` : 'border-transparent'} bg-${color}-500 transition-transform`}
              style={{
                outline: selected === color ? '2px solid #000' : undefined,
              }}
              onClick={() => setSelected(color)}
            />
          ))}
        </div>
        <div class='flex flex-col gap-3 my-4'>
        <label class='flex items-center gap-2 cursor-pointer select-none text-sm font-medium'>
      <span class='relative'>
        <input
          type='checkbox'
          checked={settings.theme.cursorTrail}
          onChange={e => {
            setSettings({
              ...settings,
              theme: { ...settings.theme, cursorTrail: e.currentTarget.checked },
            })
          }}
          class='peer appearance-none w-5 h-5 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-black checked:bg-accent checked:border-accent focus-visible:ring-2 focus-visible:ring-accent transition-colors duration-150 outline-none'
        />
        <span class='pointer-events-none absolute left-0 top-0 w-5 h-5 flex items-center justify-center text-black dark:text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-150'>
          <svg
            width='16'
            height='16'
            viewBox='0 0 16 16'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          >
            <title>Checked</title>
            <polyline points='4 8.5 7 11.5 12 5.5' />
          </svg>
        </span>
      </span>
      <span>Cursor trail</span>
    </label>
    <label class='flex items-center gap-2 cursor-pointer select-none text-sm font-medium'>
      <span class='relative'>
        <input
          type='checkbox'
          checked={settings.theme.siteBackground}
          onChange={e => {
            setSettings({
              ...settings,
              theme: { ...settings.theme, siteBackground: e.currentTarget.checked },
            })
          }}
          class='peer appearance-none w-5 h-5 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-black checked:bg-accent checked:border-accent focus-visible:ring-2 focus-visible:ring-accent transition-colors duration-150 outline-none'
        />
        <span class='pointer-events-none absolute left-0 top-0 w-5 h-5 flex items-center justify-center text-black dark:text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-150'>
          <svg
            width='16'
            height='16'
            viewBox='0 0 16 16'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          >
            <title>Checked</title>
            <polyline points='4 8.5 7 11.5 12 5.5' />
          </svg>
        </span>
      </span>
      <span>Animated background</span>
    </label>
        </div>
        <div class='flex justify-end gap-4'>
          <Button type='button' variant='secondary' onClick={handleClose}>
            <svg
              viewBox='0 0 15 15'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
              width='15'
              height='15'
            >
              <title>Close</title>
              <path d='M1.5 1.5l12 12m-12 0l12-12' stroke='currentColor' />
            </svg>
            <span>Close</span>
          </Button>
          <Button type='button' onClick={handleSave}>
            <svg
              viewBox='0 0 15 15'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
              width='15'
              height='15'
            >
              <title>Save</title>
              <path
                d='M4.5 14.5v-3a1 1 0 011-1h4a1 1 0 011 1v3m3 0h-12a1 1 0 01-1-1v-12a1 1 0 011-1h8.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V13.5a1 1 0 01-1 1z'
                stroke='currentColor'
              />
            </svg>
            <span>Save</span>
          </Button>
        </div>
      </Card>
    </div>
  )
}

export const SettingsButton = () => {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button
        type='button'
        onClick={() => setOpen(true)}
        aria-label='Open settings'
      >
        <svg
          viewBox='0 0 15 15'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
          width='15'
          height='15'
        >
          <title>Settings</title>
          <path
            clip-rule='evenodd'
            d='M5.944.5l-.086.437-.329 1.598a5.52 5.52 0 00-1.434.823L2.487 2.82l-.432-.133-.224.385L.724 4.923.5 5.31l.328.287 1.244 1.058c-.045.277-.103.55-.103.841 0 .291.058.565.103.842L.828 9.395.5 9.682l.224.386 1.107 1.85.224.387.432-.135 1.608-.537c.431.338.908.622 1.434.823l.329 1.598.086.437h3.111l.087-.437.328-1.598a5.524 5.524 0 001.434-.823l1.608.537.432.135.225-.386 1.106-1.851.225-.386-.329-.287-1.244-1.058c.046-.277.103-.55.103-.842 0-.29-.057-.564-.103-.841l1.244-1.058.329-.287-.225-.386-1.106-1.85-.225-.386-.432.134-1.608.537a5.52 5.52 0 00-1.434-.823L9.142.937 9.055.5H5.944z'
            stroke='currentColor'
            stroke-linecap='square'
            stroke-linejoin='round'
          />
          <path
            clip-rule='evenodd'
            d='M9.5 7.495a2 2 0 01-4 0 2 2 0 014 0z'
            stroke='currentColor'
            stroke-linecap='square'
            stroke-linejoin='round'
          />
        </svg>
      </button>
      <SettingsDialog open={open} onClose={() => setOpen(false)} />
    </>
  )
}
