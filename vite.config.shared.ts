import { defineConfig, type UserConfig } from 'vite';

/**
 * Converts kebab-case to PascalCase for library global names
 * e.g., "markdown-editor" -> "MarkdownEditor"
 */
function toPascalCase(str: string): string {
  return str
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

/**
 * Creates a Vite configuration for building a Web Component library.
 *
 * Produces three bundle formats:
 * - ESM (.es.js) - For modern bundlers
 * - UMD (.umd.js) - For legacy bundlers and AMD loaders
 * - IIFE (.min.js) - For direct <script> tag usage
 *
 * @param name - Package name in kebab-case (e.g., "markdown-editor")
 * @param entry - Entry file path relative to package root (e.g., "src/index.ts")
 */
export function createLibraryConfig(name: string, entry: string): UserConfig {
  return defineConfig({
    build: {
      lib: {
        entry,
        name: toPascalCase(name),
        formats: ['es', 'umd', 'iife'],
        fileName: (format) => {
          if (format === 'iife') return `${name}.min.js`;
          return `${name}.${format}.js`;
        },
      },
      rollupOptions: {
        // Bundle all dependencies for IIFE (standalone script tag usage)
        external: [],
        output: {
          // Ensure CSS is extracted
          assetFileNames: `${name}.[ext]`,
        },
      },
      minify: 'esbuild',
      sourcemap: true,
      // Generate separate chunks for better caching (ESM only)
      target: 'es2022',
    },
    esbuild: {
      // Keep class names for Web Component registration
      keepNames: true,
    },
  });
}

export default defineConfig({});
