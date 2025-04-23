import { useState, useEffect } from 'preact/hooks'

export const ThemeToggle = () => {
  const [theme, setTheme] = useState('light')

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      setTheme(savedTheme)
      document.documentElement.classList.toggle('dark', savedTheme === 'dark')
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      const defaultTheme = prefersDark ? 'dark' : 'light'
      setTheme(defaultTheme)
      document.documentElement.classList.toggle('dark', defaultTheme === 'dark')
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    document.documentElement.classList.toggle('dark', newTheme === 'dark')
  }

  return (
    <button
      type='button'
      class=''
      onClick={toggleTheme}
      aria-label='Toggle theme'
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  )
}