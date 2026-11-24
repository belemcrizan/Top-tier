import react from '@vitejs/plugin-react';
import { prerenderCollection } from './scripts/prerender';
import { defineConfig, loadEnv } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  const base = env.VITE_BASE_PATH || '/';

  return {
    base,
    build: { manifest: true },
    plugins: [
      react(),
      prerenderCollection(base),
      VitePWA({
        registerType: 'autoUpdate',
        injectRegister: null,
        manifest: {
          name: 'Top Tier — Taylor Swift',
          short_name: 'Top Tier',
          description: 'Uma coleção interativa de músicas de Taylor Swift.',
          lang: 'pt-BR',
          theme_color: '#faf7f2',
          background_color: '#faf7f2',
          display: 'standalone',
          scope: base,
          start_url: base,
          icons: [
            { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
            { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
          ],
        },
        workbox: {
          skipWaiting: true,
          clientsClaim: true,
          navigateFallback: `${base}index.html`,
          globPatterns: ['**/*.{html,css,js,svg,woff2,png,webmanifest}'],
        },
      }),
    ],
  };
});
