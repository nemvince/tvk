import { defineConfig } from '@rsbuild/core'
import { pluginPreact } from '@rsbuild/plugin-preact'
import { presetWind4 } from '@unocss/preset-wind4'
import { UnoCSSRspackPlugin } from '@unocss/webpack/rspack'
import { AccentColor } from './src/lib/types.ts'

const generateUnoSafelist = () =>
  Object.values(AccentColor).flatMap(color =>
    ['bg', 'border', 'text'].flatMap(prefix =>
      Array.from(
        { length: 9 },
        (_, i) => `${prefix}-${color}-${(i + 1) * 100 - (i === 0 ? 50 : 0)}`
      )
    )
  )

// biome-ignore lint/style/noDefaultExport: need a default export for rsbuild config
export default defineConfig({
  plugins: [pluginPreact()],
  html: {
    template: './index.html',
  },
  output: {
    cleanDistPath: true,
    inlineStyles: true,
    legalComments: 'none',
    sourceMap: {
      js: false,
      css: false,
    },
  },
  tools: {
    rspack: {
      plugins: [
        UnoCSSRspackPlugin({
          presets: [presetWind4()],
          content: {
            filesystem: ['index.html'],
          },
          rules: [
            ['bg-accent', { 'background-color': 'var(--accent-bg)' }],
            ['text-accent', { color: 'var(--accent-text)' }],
          ],
          safelist: generateUnoSafelist(),
        }),
      ],
    },
  },
})
