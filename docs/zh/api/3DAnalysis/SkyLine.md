

# 天际线分析



<sm-iframe src="http://support.supermap.com.cn:8090/webgl/examples/component/vue_skyline.html"></sm-iframe>

```vue
<sm3d-skyline></sm3d-skyline>
```

### Attributes

| 参数               | 说明                 | 类型   | 可选值 | 默认值                                                       |
| :----------------- | :------------------- | :----- | :----- | :----------------------------------------------------------- |
| spatialAnalysisUrl | 天际线分析服务的地址 | string | -      | 'http://www.supermapol.com/realspace/services/spatialAnalysis-data_all/restjsr/spatialanalyst/geometry/3d/skylinesectorbody.json' |                                                      |

### 介绍
- 第三方依赖：echarts。
使用时请注意安装依赖插件，如下参考：
```js
//main.js
import echarts from 'echarts'
window.echarts = echarts //挂载到window上
```