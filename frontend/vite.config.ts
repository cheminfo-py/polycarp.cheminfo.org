import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// Where the dev server forwards `/api` requests. Defaults to the live
// deployment so `npm run dev` works with no setup; point it at a local
// backend with VITE_API_PROXY (e.g. http://localhost:8000). The `/api`
// prefix is stripped, matching the production nginx reverse proxy.
const apiTarget =
  process.env.VITE_API_PROXY ?? 'https://polycarp.cheminfo.org/api';

export default defineConfig({
  plugins: [react()],
  envDir: '..',
  server: {
    proxy: {
      '/api': {
        target: apiTarget,
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  build: {
    outDir: 'dist',
  },
  optimizeDeps: {
    include: ['openchemlib'],
  },
});
