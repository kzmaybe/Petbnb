import { defineConfig } from 'vite';

export default defineConfig({
  base: '/petbnb/',
  esbuild: {
    jsx: 'automatic'
  },
  server: {
    port: 5173,
    host: '0.0.0.0'
  }
});
