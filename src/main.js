import Vue from 'vue'
import App from './App.vue'

// import echarts from 'echarts'
// window.echarts = echarts //挂载到window上

import mycomnents from './components/index'
Vue.use(mycomnents);

new Vue({
  el: '#app',
  render: h => h(App)
})
