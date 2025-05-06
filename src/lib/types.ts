import type { JSX } from 'preact/jsx-runtime'

export interface Site {
  name: string
  component: () => JSX.Element
}

export enum Language {
  English = 'en',
  Hungarian = 'hu',
}

export enum AccentColor {
  Red = 'red',
  Orange = 'orange',
  Amber = 'amber',
  Yellow = 'yellow',
  Lime = 'lime',
  Green = 'green',
  Emerald = 'emerald',
  Teal = 'teal',
  Cyan = 'cyan',
  Sky = 'sky',
  Blue = 'blue',
  Indigo = 'indigo',
  Violet = 'violet',
  Purple = 'purple',
  Fuchsia = 'fuchsia',
  Pink = 'pink',
  Rose = 'rose',
}

export interface Settings {
  theme: {
    accentColor: AccentColor
    cursorTrail: boolean
    siteBackground: boolean
    mode: 'light' | 'dark'
  }
  language: Language
}
