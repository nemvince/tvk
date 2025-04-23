import { defineConfig } from '@rsbuild/core'
import { pluginPreact } from '@rsbuild/plugin-preact'
import presetWind4 from '@unocss/preset-wind4'
import { UnoCSSRspackPlugin } from '@unocss/webpack/rspack'

// biome-ignore lint/style/noDefaultExport: need a default export for rsbuild config
export default defineConfig({
  plugins: [pluginPreact()],
  html: {
    template: './index.html',
  },
  output: {
    cleanDistPath: true,
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
            filesystem: [
              'index.html'
            ]
          }
        }),
      ],
    },
  },
})
