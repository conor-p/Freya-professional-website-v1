// vite.config.js
import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  // FIX 1: Set the base path for GitHub Pages
  // You MUST replace 'your-repo-name' with the EXACT name of your GitHub repository.
  base: 'https://conor-p.github.io/Freya-professional-website-v1/dist/article1/article1.html', 
  
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        // FIX 2: Explicitly point to the JS file for bundling, and the HTML for creation.
        // We're pointing to the HTML file for the build process to find the scripts within it.
        article1: resolve(__dirname, 'article1/article1.html'), 
      },
    },
  },
})