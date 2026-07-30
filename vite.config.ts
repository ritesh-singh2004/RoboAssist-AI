import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';

// ESM-compatible __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify — file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
    build: {
      // Raise the warning threshold to 800kb
      chunkSizeWarningLimit: 800,
      rollupOptions: {
        output: {
          // Split vendor libraries into separate chunks for better caching & parallel loading
          manualChunks: {
            // React core
            'vendor-react': ['react', 'react-dom'],
            // Charts library
            'vendor-recharts': ['recharts'],
            // Animation library
            'vendor-motion': ['motion'],
            // Icon library
            'vendor-lucide': ['lucide-react'],
          },
        },
      },
    },
  };
});
