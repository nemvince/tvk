import { useTheme } from '../lib/hooks/theme.js'

export const ThemeToggle = () => {
  const { toggleTheme } = useTheme()

  return (
    <button
      type='button'
      class='inline-flex items-center justify-center gap-2'
      onClick={toggleTheme}
      aria-label='Toggle theme'
    >
      <span class='transition-all scale-100 rotate-180 dark:scale-0 dark:rotate-none'>
        <svg
          viewBox='0 0 15 15'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
          width='15'
          height='15'
        >
          <title>Light theme</title>
          <path
            d='M7.5 1.5v-1m0 13.99v-.998m6-5.997h1m-13 0h-1m2-4.996l-1-1m12 0l-1 1m-10 9.993l-1 1m12 0l-1-1m-2-4.997a2.999 2.999 0 01-3 2.998 2.999 2.999 0 113-2.998z'
            stroke='currentColor'
            stroke-linecap='square'
          />
        </svg>
      </span>
      <span class='absolute transition-all scale-0 dark:scale-100 dark:rotate-90'>
        <svg
          viewBox='0 0 15 15'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
          width='15'
          height='15'
        >
          <title>Dark theme</title>
          <path
            d='M1.66 11.362A6.5 6.5 0 007.693.502a7 7 0 11-6.031 10.86z'
            stroke='currentColor'
            stroke-linejoin='round'
          />
        </svg>
      </span>
    </button>
  )
}
