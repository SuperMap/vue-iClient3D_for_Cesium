# <center>@supermap/vue-iclient3d-webgl</center>

# 简介
- 官网：http://support.supermap.com.cn:8090/webgl/examples/component/examples.html#layer
- 源码：


# 安装

``` bash
npm install @supermap/vue-iclient3d-webgl
```

# 开发
#### 方法一：Vue工程，NPM 安装：

#####1、修改main.js文件：
``` bash
import Vue from 'vue';
import App from './App.vue';


//引用第三方库
import ViewUI from 'view-design';
import 'view-design/dist/styles/iview.css';
Vue.use(ViewUI);

import axios from 'axios'
window.axios = axios //挂载到window上

import echarts from 'echarts'
window.echarts = echarts //挂载到window上

//引用@supermap/vue-iclient3d-webgl组件库
import VueiClientWebgl from '@supermap/vue-iclient3d-webgl';
Vue.use(VueiClientWebgl);
 
new Vue({
  el: '#app',
  render: h => h(App)
});
```

#####2、修改index.html文件：
``` bash
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="utf-8">
  <title>vue-iclient3d-webgl</title>

  <!--    组件css-->
  <link href="./static/css/geoFont/iconfont.css" rel="stylesheet">

  <!--    Cesium-->
  <link href="./static/Cesium/Widgets/widgets.css" rel="stylesheet">
  <script src="./static/Cesium/Cesium.js"></script>

  <!--    supermap-->
  <script src="./static/js/config.js"></script>
  <script src="./static/js/tooltip.js"></script>

</head>

<body>
  <div id="app"></div>
  <!--    supermap组件-->
  <script src="./dist/vue-iclient3d-webgl.min.js"></script>
</body>

</html>
```

#####3、在 vue 工程中的App.vue 中标签引入组件：
``` bash
<template>
  <div id="app">
    <sm-viewer>
    <sm3d-measure></sm3d-measure>
    </sm-viewer>
  </div>
</template>
```


#### 方法二：在 html中通过CDN引入,使用组件：

``` bash

<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="utf-8">
  <title>cdn引入测试</title>

  <!-- //引入Cesium依赖 -->
  <link href="./node_modules/@supermap/iclient3d-webgl/Cesium/Widgets/widgets.css" rel="stylesheet">
  <script src="./node_modules/@supermap/iclient3d-webgl/Cesium/Cesium.js"></script>
  
  <!-- //引入Vue.js -->
  <script src="https://unpkg.com/vue/dist/vue.js"></script>

  <link href="./node_modules/@supermap/vue-iclient3d-webgl/static/css/geoFont/iconfont.css" rel="stylesheet">

  <!-- //引入view-design控件库 -->
  <link rel="stylesheet" href="//unpkg.com/view-design/dist/styles/iview.css">
  <script src="//unpkg.com/view-design/dist/iview.min.js"></script>

  <!-- //引入组件的库 -->
  <script src="./node_modules/@supermap/vue-iclient3d-webgl/dist/vue-iclient3d-webgl.min.js"></script>

  <style>
    html,
    body,
    #app {
      width: 100%;
      height: 100%;
      margin: 0;
      padding: 0;
      overflow: hidden;
    }

  </style>
</head>

<body>
  <div id="app">
    <sm-viewer :scene-url="URL">
      <sm3d-measure></sm3d-measure>
    </sm-viewer>
  </div>

  <script>
    new Vue({
      el: '#app',
      data: {
        URL: "http://www.supermapol.com/realspace/services/3D-ZF_normal/rest/realspace"
      },
      methods: {}
    })
  </script>
</body>


</html>

  
```

# 示例
http://support.supermap.com.cn:8090/webgl/examples/component/examples.html#layer

