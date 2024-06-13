import { vitePlugin as remix } from '@remix-run/dev';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    remix({
      ignoredRouteFiles: ["**/*.css"],
    }),
    tsconfigPaths(),
  ],
  server: {
    proxy: {
      '/image-api': {
        target: 'http://localhost:3789/api/images',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/image-api/, ''),
      },
    },
    cors: {
      origin: '*',
      methods: '*'
    }
  },
});
