// ✅ postcss.config.ts (or .js)
import tailwindcss from '@tailwindcss/postcss'
import autoprefixer from 'autoprefixer'

export default {
  plugins: [
    tailwindcss(), // pakai @tailwindcss/postcss
    autoprefixer(),
  ],
}