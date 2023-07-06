import { sveltekit } from "@sveltejs/kit/vite"

/** @type {import('vite').UserConfig} */
const config = {
  plugins: [sveltekit()],
  define: {
    'process.env': process.env
  }, 
  resolve: {
    preserveSymlinks: true,
  }
}

export default config
