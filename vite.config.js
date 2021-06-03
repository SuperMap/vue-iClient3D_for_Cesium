

import vue from '@vitejs/plugin-vue'
const { resolve, join } = require('path')
/**
 * @type {import('vite').UserConfig}
 */
export default {
  plugins: [
    vue(),
  ],
  optimizeDeps:{
    include: ["element-plus/lib/locale/lang/zh-cn"],
  },
  alias: {
    '@': resolve(__dirname, 'src'),
    'examples': resolve(__dirname, 'examples'),
    'lib': resolve(__dirname, 'lib'),
    'static': resolve(__dirname, 'static'),
    'public': resolve(__dirname, 'public'),
    'config': resolve(__dirname, 'examples/src/config'),
  },
   hmr: { overlay: false } 
}