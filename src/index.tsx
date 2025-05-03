import { App } from '@/App'
import { render } from 'preact'

// biome-ignore lint/correctness/noUndeclaredDependencies: it's virtual via rspack
import 'uno.css'

const root = document.getElementById('root')
const overlay = document.getElementById('loading-overlay')
if (root) {
  render(<App />, root)
  if (overlay) {
    setTimeout(() => {
      overlay.style.opacity = '0'
    }, 100)
    setTimeout(() => overlay.remove(), 350)
  }
}
