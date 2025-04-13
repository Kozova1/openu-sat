import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
    base: "/openu-sat/",
    plugins: [
        react(),
        viteStaticCopy({
            targets: [
                {
                    src: "node_modules/z3-solver/build/z3-built.*",
                    dest: ""
                },
                {
                    src: "node_modules/coi-serviceworker/coi-serviceworker.js",
                    dest: ""
                }
            ]
        }),
    ],
    build: {
        target: "ES2024"
    }
})
