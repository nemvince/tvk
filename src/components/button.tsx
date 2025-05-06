import { useSettings } from '@/lib/hooks/settings'
import type { h } from 'preact'

interface ButtonProps extends h.JSX.ButtonHTMLAttributes {
  variant?: 'primary' | 'secondary'
  children: h.JSX.Element | h.JSX.Element[]
}

export const Button = ({
  variant = 'primary',
  children,
  ...props
}: ButtonProps) => {
  const { settings } = useSettings()
  const theme = settings.theme

  const buttonClasses = {
    base: 'inline-flex items-center justify-center gap-2 px-2 py-1.5 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
    primary: `bg-${theme.accentColor}-500 text-white hover:bg-${theme.accentColor}-600 focus-visible:ring-${theme.accentColor}-500`,
    secondary: `bg-${theme.accentColor}-100 text-${theme.accentColor}-800 hover:bg-${theme.accentColor}-200 focus-visible:ring-${theme.accentColor}-300`,
  }

  return (
    <button
      class={`${buttonClasses.base} ${buttonClasses[variant]} ${theme.accentColor}`}
      {...props}
    >
      {children}
    </button>
  )
}
