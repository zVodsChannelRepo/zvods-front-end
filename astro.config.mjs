import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';
import paraglide from '@inlang/paraglide-astro';
import tailwind from "@astrojs/tailwind";

import vercel from "@astrojs/vercel/serverless";

// https://astro.build/config
export default defineConfig({
  // Enable Svelte to support Svelte components.
  integrations: [svelte(), tailwind(), paraglide({
    project: "./project.inlang",
    outdir: "./src/paraglide"
  })],
  output: 'server',
  i18n: {
    defaultLocale: 'pt',
    locales: ['en', 'pt'],
    routing: {
      // prefixDefaultLocale: true
    }
  },
  trailingSlash: 'ignore',
  redirects: {},
  vite: {
    build: {
      rollupOptions: {
        output: {
          compact: true,
          entryFileNames: '[name]-[hash].js'
        }
      }
    }
  },
  adapter: vercel()
});