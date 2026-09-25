import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      target: 'esnext',
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
          seemore: path.resolve(__dirname, 'see-more.html'),
          demo: path.resolve(__dirname, 'demo.html'),
          clinic: path.resolve(__dirname, 'clinic-demos.html'),
          restaurant: path.resolve(__dirname, 'restaurant-demos.html'),
          coaching: path.resolve(__dirname, 'coaching-demos.html'),
          ecommerce: path.resolve(__dirname, 'ecommerce-demos.html'),
          privacy: path.resolve(__dirname, 'privacy-policy.html'),
          terms: path.resolve(__dirname, 'terms.html')
        },
        external: [
          'three/webgpu',
          'three/tsl',
          /^three\/addons\/.*/
        ]
      }
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
