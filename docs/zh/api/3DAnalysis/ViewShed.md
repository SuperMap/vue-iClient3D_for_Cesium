

# 可视域分析



<sm-iframe src="http://support.supermap.com.cn:8090/webgl/examples/component/vue_viewShed.html"></sm-iframe>

```vue
<sm3d-viewshed :spatial-analysis-url="spatialAnalysisUrl"></sm3d-viewshed>
```

### Attributes

| 参数               | 说明                 | 类型   | 可选值 | 默认值                                                       |
| :----------------- | :------------------- | :----- | :----- | :----------------------------------------------------------- |
| spatial-analysis-url | 可视域分析服务的地址 | string | -      | 'http://www.supermapol.com/realspace/services/spatialAnalysis-data_all/restjsr/spatialanalyst/geometry/3d/viewshedbody.json' |
|                    |                      |        |        |                                                              |

### 介绍
- 第三方依赖：axios。
- 使用说明：点击分析后，选择需要分析的位置，点击鼠标左键确认观察点位置，然后鼠标控制分析方向与范围，鼠标右键结束。