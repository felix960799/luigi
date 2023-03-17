import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

const luigiPlugin = () => {
  return {
    enforce: 'pre',
    name: 'luigi-postprocess',
    generateBundle: (options, bundle) => {
      const cssFile = bundle['luigi_core.css'];
      cssFile.source = cssFile.source.replace(/(\.svelte-[a-z0-9]+){2,}/g, match => {
        const singleHash = match.match(/\.svelte-[a-z0-9]+/g)[0];
        // console.log(match, singleHash);
        return singleHash;
      });
      // console.log(bundle);

      const jsFile = bundle['luigi.js'];
      jsFile.code = jsFile.code.replace('__luigi_dyn_import', 'import');
    }
  };
};

export default defineConfig({
  assetsInclude: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2|css)$/,
  base: '',
  build: {
    cssCodeSplit: true,
    assetsInlineLimit: 0,
    sourcemap: true,
    rollupOptions: {
      input: ['src/main.js', 'src/styles/fd.scss', 'src/styles/theming.scss'],
      output: {
        entryFileNames: 'luigi.js',
        format: 'es',
        assetFileNames: assetInfo => {
          if (assetInfo.name.endsWith('main.css')) {
            return 'luigi_core.css';
          } else if (assetInfo.name.endsWith('fd.css')) {
            return 'fd.css';
          } else if (assetInfo.name.endsWith('theming.css')) {
            return 'theming.css';
          }
          return '[name]-[hash][extname]';
        }
      },
      plugins: []
    },
    outDir: 'public'
  },
  publicDir: 'public_root',
  plugins: [luigiPlugin(), svelte()]
});
