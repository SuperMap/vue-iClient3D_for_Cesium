import { createApp } from 'vue'
import App from './App.vue'
const app = createApp(App);
app.config.productionTip = false;
import '@babel/polyfill'

// 第三方库ui
import ElementPlus from 'element-plus';
import 'element-plus/lib/theme-chalk/index.css';
// app.use(ElementPlus)
import locale from 'element-plus/lib/locale/lang/zh-cn'
app.use(ElementPlus, { locale })

import * as echarts from 'echarts';
window.echarts = echarts //挂载到window上

// 引入样式
import './style/globle.scss'
// 引入其他
import URL_CONFIG from 'public/js/config.js'
window.URL_CONFIG = URL_CONFIG

/*---全部引入---*/
import s from "./components/components.js"
app.use(s)  
   

// 测试d
// import s from "../dist/vue-webgl1.min.js"
// app.use(s)  

/*---按需引入---*/
// import terrainSlope from "../lib/terrain-slope/index.esm"
// app.use(terrainSlope) 
// init(app)  //初始组件化语言等配置 
//let options = {isDrag:false}  init(app,options)  全局配置关闭拖拽

// 测试d
// import {init} from "../dist/vue-webgl1.es.js"
// init(app)  //初始组件化语言等配置  

app.mount('#app')
