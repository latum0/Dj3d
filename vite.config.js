import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Forward /api/* to your Render backend
      '/api': {
        target: 'https://threedecom.onrender.com',
        changeOrigin: true,
        secure: true,
        // cookieDomainRewrite makes sure Set-Cookie still comes back as localhost
        cookieDomainRewrite: 'localhost',
      },
    },
  },
});