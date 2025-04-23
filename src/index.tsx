import { render } from 'preact'
import { App } from '@/App'

// biome-ignore lint/correctness/noUndeclaredDependencies: it's virtual via rspack
import 'uno.css'

const root = document.getElementById('root')
if (root) {
  render(<App />, root)
}
