// 范例开发入口文件

import { createApp } from 'vue'
import App from './App.vue'
const app = createApp(App);
app.config.productionTip = false;

// 第三方库ui
import ElButton from "element-plus"
app.use(ElButton)
import 'element-plus/lib/theme-chalk/index.css';

// 引入场景配置文件
import URL_CONFIG from 'public/js/config.js'
window.URL_CONFIG = URL_CONFIG 

// 引入样式

import './style/css/example.scss'
import '@/style/globle.scss'

// 引入组件库
import s from "@/components/components.js"
app.use(s)  

app.mount('#app')
