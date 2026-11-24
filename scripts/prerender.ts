import { createServer } from 'vite';
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
          const page = html.replace(
            '<div id="root"></div>',
            () => '<div id="root">' + renderCollection() + '</div>',
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
