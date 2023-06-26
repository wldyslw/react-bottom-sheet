import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), dts({ rollupTypes: true, insertTypesEntry: true })],
    esbuild: {
        jsxDev: false,
    },
    build: {
        outDir: 'lib',
        sourcemap: true,
        target: 'esnext',
        lib: {
            name: 'BottomSheet',
            fileName: 'react-bottom-sheet',
            entry: resolve(__dirname, 'src/BottomSheet/main.ts'),
        },
        rollupOptions: {
            external: ['react', 'react-dom'],
            output: {
                globals: {
                    react: 'React',
                    'react-dom': 'ReactDOM',
                },
            },
        },
    },
});
