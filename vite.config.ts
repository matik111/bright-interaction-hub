import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",  // Listens on all network interfaces
    port: 8080,  // Default dev server port
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(), // Only include this plugin in development mode
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // Aliasing @ to the src directory for easier imports
    },
  },
  build: {
    // Enable file hashing for cache busting in production
    rollupOptions: {
      output: {
        entryFileNames: `[name].[hash].js`,
        chunkFileNames: `[name].[hash].js`,
        assetFileNames: `[name].[hash].[ext]`, // Add hashing to assets like CSS, images, etc.
      },
    },
    // Ensure production mode correctly updates with the latest assets
    outDir: 'dist',  // Make sure build output goes to the 'dist' folder
    assetsDir: 'assets', // Group static assets into their own folder in dist
    // If you are using service workers or any offline caching, make sure cache is managed correctly
    // Service workers can cause old assets to persist, leading to issues with viewing updates
    chunkSizeWarningLimit: 500, // You can adjust the chunk size warning threshold if you like
  },
  // Optimize the caching of static assets for production
  cache: {
    // Allow for assets to be re-validated in production to ensure the latest build is served
    // This will help in avoiding loading old files when previewing from separate windows
    maxAge: 31536000, // Assets can live in cache for one year
    immutable: true, // Mark assets as immutable
  },
}));
