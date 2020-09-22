# 快速上手

本节将介绍如何在项目中使用，使用前请先确认是否npm安装，没有安装请先参考[安装章节](./installation.md)。

### 使用之前

高效的开发，离不开基础工程的搭建。在开始使用 Vue-iClient3D-WebGL 之前，有必要先了解以下基础知识，我们也假设您已经写过 Vue，并掌握了下面的内容。

  - [Vue 组件](https://cn.vuejs.org/v2/guide/components.html)
  - [单文件组件](https://cn.vuejs.org/v2/guide/single-file-components.html)

以下概念贯穿 Vue-iClient3D-WebGL 前后，建议开发者花点时间来了解。

  - prop 传递数据
  - slot 内容分发
  - events $emit @click 事件

### 引入 Vue-iClient3D-WebGL

在 main.js 中写入以下内容：

```js
import Vue from 'vue';
import App from './App.vue';

// 根据所使用的组件依赖需求添加相应的第三方库, 参考具体组件,如天际线分析需要如下:
// import echarts from 'echarts'
// window.echarts = echarts //挂载到window上

//vue-iclient3d-webgl组件库
import  '@supermap/vue-iclient3d-webgl/dist/styles/vue-iclient3d-webgl.min.css';
import VueiClient from '@supermap/vue-iclient3d-webgl';
Vue.use(VueiClient);

new Vue({
  el: '#app',
  // router, //使用路由
  components: { App },
  template: '<App/>'
})
```
::: tip 注意
* 使用Vue-cli引入静态资源，请把安装包里的static文件夹下的Cesium依赖包放到工程里的static文件夹下
* 修改<font color = #0033ff  face="STCAIYUN">webpack.base.config.js</font>文件：
  在规则<font color = #0033ff  face="STCAIYUN">test: /\.(png|jpe?g|gif|svg|cur)(\?.*)?$/</font>里，
  添加处理<font color = #0033ff  face="STCAIYUN">cur</font>类型
:::
在 index.html 中写入以下内容：

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>vue-iclient3d-webgl</title>
  <!-- Cesium 依赖-->
  <link href="./static/Cesium/Widgets/widgets.css" rel="stylesheet">
  <script src="./static/Cesium/Cesium.js"></script>
</head>

<body>
  <div id="app"></div>
</body>
</html>

```

以上代码便完成了 Vue-iClient3D-WebGL 的引入。

<!-- ### 按需引入说明

```vue
import  '@supermap/vue-iclient3d-webgl/dist/styles/vue-iclient3d-webgl.min.css';
import {viewer} from '@supermap/vue-iclient3d-webgl';
Vue.component(viewer.name,viewer);
```
配置babelrc文件：

```js
 "plugins": [["import", {
    "libraryName": "@supermap/vue-iclient3d-webgl",
    "libraryDirectory": "src/components"
  }]]
``` -->

### 常见使用问题说明

1. 本产品使用了一些第三方库，使用前请先安装第三方依赖，如上示例安装引入的有：echarts，可根据项目需求和参考组件第三方依赖按需引入，使用参考如main.js。
2. 若项目工程是采用webpack-simple搭建，那么在复制本文的index.html时，请注意，需要保留自动生成的index.html里如下标签：
```html
<script src="./dist/build.js"></script>
```
3. 未知字符报错，请注意以下配置（参考）：
```js
...
 {
    test: /\.(png|jpg|gif|svg|cur)$/,
    loader: 'file-loader',
    options: {
    name: '[name].[ext]?[hash]'
    }
}
...
{
    test: /\.(eot|svg|ttf|woff|woff2)(\?\S*)?$/,
    loader: 'file-loader'
}
```
