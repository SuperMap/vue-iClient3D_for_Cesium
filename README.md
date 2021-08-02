# <center>@supermap/vue-iclient3d-webgl</center>

# Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:3000
npm run dev

# build for production with minification
npm run build:js
npm run build:style

```


注：项目存放文件夹路径中不能有中文字符，否则启动会有异常报错。


# 简介
### 特点：
- 采用当前Vue3升级组件，相比原来有更快的速度和更好的性能
- 实现了界面与功能分离，可以更灵活的适用于各种应用场景
- 全面的开源组件源码，可以更容易的理解和修改等二次开发，轻松实现自定义组件。

### 示例：https://www.supermapol.com/earth/vue-iEarth/examples/index.html


# 开发
#### 方法一：Vue工程，NPM 安装：

``` bash
npm install @supermap/iclient3d-vue-for-webgl --save-d
```

##### 1、修改main.js文件：

``` bash

import { createApp } from 'vue'
import App from './App.vue'
const app = createApp(App);
 
// 完整引入第三方库，部分组件需要
import ElementPlus from 'element-plus';
import 'element-plus/lib/theme-chalk/index.css';
app.use(ElementPlus)
//import * as echarts from 'echarts';
//window.echarts = echarts //挂载到window上
 
// 引入webgl3d组件包
import '@supermap/iclient3d-vue-for-webgl/lib/theme/index.css'
import webgl3d from "@supermap/iclient3d-vue-for-webgl"
app.use(webgl3d)  
app.mount('#app')

```

##### 2、修改index.html文件：

- 引入依赖: 在node_module里找到本组件安装包，复制里面的public里需要的资源到工程目录public文件下，然后在index.html里引入cesium等资源文件。

``` bash
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="public/Cesium/Widgets/widgets.css" rel="stylesheet">
  <script src="public/Cesium/Cesium.js" ></script>
  <title>webgl3d</title>
</head>
<body>
  <div id="app"></div>
  <script type="module" src="/src/main.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/echarts@5.0.2/dist/echarts.min.js" async></script>
  <script src="public/js/axios.min.js" ></script>
</body>
</html>
```

##### 3、在App.vue里测试使用量算功能组件：

``` bash
<template>
  <sm3d-viewer scene-url="http://www.supermapol.com/realspace/services/3D-ZF_normal/rest/realspace">
    <sm3d-measure></sm3d-measure>
  </sm3d-viewer>
</template>
<script>
```


#### 方法二：在 html中通过CDN引入,使用组件：

``` bash

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">
    <!-- vue + element-plus-->
    <script src="https://www.supermapol.com/earth/vue-iEarth/examples/public/js/vue.global.prod.js"></script>
    <link rel="stylesheet" href="https://www.supermapol.com/earth/vue-iEarth/examples/public/element-plus/index.css">
    <script src="https://www.supermapol.com/earth/vue-iEarth/examples/public/element-plus/index.full.js"></script>
    <!-- cesium -->
    <link href="https://www.supermapol.com/earth/vue-iEarth/examples/public/Cesium/Widgets/widgets.css"
        rel="stylesheet">
    <script src="https://www.supermapol.com/earth/vue-iEarth/examples/public/Cesium/Cesium.js"></script>
    <!-- 组件包 -->
    <link href="https://www.supermapol.com/earth/vue-iEarth/examples/dist/components.css" rel="stylesheet">
    <script src="https://www.supermapol.com/earth/vue-iEarth/examples/dist/components.js"></script>
    <title>完整组件-CDN引入-demo</title>
</head>
<body>
      <div id="app">
        <sm3d-viewer scene-url="http://www.supermapol.com/realspace/services/3D-ZF_normal/rest/realspace">
            <sm3d-measure></sm3d-measure>
        </sm3d-viewer>
    </div>
    <script>
        const app = Vue.createApp({});
        app.use(webgl3d);  
        app.mount("#app");
    </script>
</body>
<!-- 根据使用具体组件的需要引入其他第三方依赖 -->
<!-- <script src="https://cdn.jsdelivr.net/npm/echarts@5.0.2/dist/echarts.min.js" async></script>
<script src="https://www.supermapol.com/earth/vue-iEarth/examples/public/js/axios.min.js" async></script> -->
</html>

```



