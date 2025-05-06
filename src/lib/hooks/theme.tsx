import { colors } from '@/lib/colors'
import { createContext } from 'preact'
import type { ComponentChildren } from 'preact'
import { useContext, useEffect } from 'preact/hooks'
import { useSettings } from './settings.js'

const ThemeContext = createContext<{
  theme: string
  toggleTheme: () => void
}>({
  theme: 'light',
  toggleTheme: () => undefined,
})

export const ThemeProvider = ({
  children,
}: { children: ComponentChildren }) => {
  const { settings, setSettings } = useSettings()

  const { mode: theme, accentColor } = settings.theme

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  useEffect(() => {
    const accentBg = colors[accentColor]?.[theme === 'dark' ? 950 : 200]
    const accentText = colors[accentColor]?.[theme === 'dark' ? 200 : 950]

    if (accentBg && accentText) {
      document.documentElement.style.setProperty('--accent-text', accentText)
      document.documentElement.style.setProperty('--accent-bg', accentBg)
    }
  }, [accentColor, theme])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setSettings({
      ...settings,
      theme: {
        ...settings.theme,
        mode: newTheme,
      },
    })
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
