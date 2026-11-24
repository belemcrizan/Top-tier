import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createServer, transformWithEsbuild } from 'vite';
import type { Plugin } from 'vite';

/** Render with Vite so the static page uses the same source, JSX transform and asset base. */
export function prerenderCollection(base: string): Plugin {
  return {
    name: 'prerender-collection',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      async handler(html, { bundle }) {
        const server = await createServer({
          configFile: false,
          base,
          server: { middlewareMode: true, hmr: false, watch: null, ws: false },
          optimizeDeps: { noDiscovery: true, include: [] },
        });
        try {
          const { renderCollection } = (await server.ssrLoadModule('/src/prerender.tsx')) as {
            renderCollection: () => string;
          };
          let rendered = renderCollection();
          // Discover the LCP artwork in the first HTML bytes, ahead of all styles or modules.
          const hero = rendered.match(
            /<link rel="preload" as="image"[^>]*fetchpriority="high"[^>]*>/i,
          );
          if (hero) {
            rendered = rendered.replace(hero[0], '');
            html = html.replace(/<meta charset="[^"]+"\s*\/?>/i, (meta) => meta + hero[0]);
          }
          const entry = html.match(/<script type="module"[^>]*\bsrc="([^"]+)"[^>]*><\/script>/);
          if (!entry) throw new Error('Missing Vite entry module for hydration');
          const path = resolve(server.config.root, 'src/boot/collection-entry.ts');
          const loader = await transformWithEsbuild(await readFile(path, 'utf8'), path, {
            minify: true,
            target: 'es2022',
          });
          html = html
            .replace(entry[0], '')
            .replace(
              '</body>',
              () => `<script data-app-entry="${entry[1]}">${loader.code}</script></body>`,
            );
          const page = html.replace(
            '<div id="root"></div>',
            () => '<div id="root">' + rendered + '</div>',
          );
          // Only inline entry styles. Stylesheets for lazy routes keep their own cacheable chunks.
          return page.replace(/<link\b[^>]*rel="stylesheet"[^>]*>/g, (tag: string) => {
            const href = /href="([^"]+)"/.exec(tag)?.[1];
            const css = href?.startsWith(base) ? bundle?.[href.slice(base.length)] : undefined;
            return css?.type === 'asset' ? `<style>${css.source}</style>` : tag;
          });
        } finally {
          await server.close();
        }
      },
    },
  };
}
