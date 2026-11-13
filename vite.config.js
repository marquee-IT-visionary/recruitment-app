import { defineConfig } from 'vite';

export default defineConfig({
  base: '/recruitment-app/',
  optimizeDeps: { exclude: ['@electric-sql/pglite'] },
  worker: { format: 'es' }
});
