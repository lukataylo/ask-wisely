import fs from 'fs';
import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
  plugins: [
    {
      name: 'serve-admin-html',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url === '/admin' || req.url === '/admin/' || req.url === '/admin/index.html') {
            const adminHtml = fs.readFileSync(
              path.resolve(__dirname, 'public/admin/index.html'),
              'utf-8',
            );
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html');
            res.end(adminHtml);
            return;
          }
          next();
        });
      },
    },
    tailwindcss(),
    react(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    }
  },
});
