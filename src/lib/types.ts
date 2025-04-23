import type { JSX } from 'preact/jsx-runtime'

export type Site = {
  name: string
  component: () => JSX.Element
}
