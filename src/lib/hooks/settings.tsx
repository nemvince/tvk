import { AccentColor, Language, type Settings } from '@/lib/types'
import { type JSX, createContext } from 'preact'
import { useContext, useEffect, useState } from 'preact/hooks'

const SettingsContext = createContext<{
  isMounted: boolean
  settings: Settings
  setSettings: (settings: Settings) => void
}>({
  isMounted: false,
  settings: {} as Settings,
  setSettings: () => null,
})

const defaultSettings: Settings = {
  language: Language.English,
  theme: {
    accentColor: AccentColor.Purple,
    cursorTrail: true,
    siteBackground: true,
    mode: 'light',
  },
}

const validateSettings = (settings: Settings): boolean => {
  if (
    // biome-ignore lint/complexity/useSimplifiedLogicExpression: this is a simple check
    !settings.language ||
    !settings.theme ||
    !settings.theme.accentColor ||
    !settings.theme.cursorTrail ||
    !settings.theme.siteBackground ||
    !settings.theme.mode
  ) {
    return false
  }

  if (!Object.values(AccentColor).includes(settings.theme.accentColor)) {
    return false
  }

  if (!Object.values(Language).includes(settings.language)) {
    return false
  }

  return true
}

export const SettingsProvider = ({
  children,
}: {
  children: JSX.Element
}): JSX.Element => {
  const [settings, setSettings] = useState<Settings>({} as Settings)
  const [isMounted, setIsMounted] = useState<boolean>(false)

  useEffect(() => {
    const storedSettings = localStorage.getItem('settings')
    try {
      const parsedSettings = storedSettings
        ? JSON.parse(storedSettings)
        : defaultSettings

      if (validateSettings(parsedSettings)) {
        setSettings(parsedSettings)
      } else {
        setSettings(defaultSettings)
      }
    } catch (_) {
      setSettings(defaultSettings)
    } finally {
      setIsMounted(true)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('settings', JSON.stringify(settings))
  }, [settings])

  return (
    <SettingsContext.Provider value={{ settings, setSettings, isMounted }}>
      {children}
    </SettingsContext.Provider>
  )
}

export const useSettings = () => {
  const context = useContext(SettingsContext)
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider')
  }
  return context
}
