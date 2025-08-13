import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  root: '.', // Use current root directory
  plugins: [react()],
  build: {
    outDir: 'dist',  // Where build output will go
    emptyOutDir: true
  },
  
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'client'),
    },
  },
});
