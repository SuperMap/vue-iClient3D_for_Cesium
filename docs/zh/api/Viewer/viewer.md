

# Viewer

<sm-iframe src="http://support.supermap.com.cn:8090/webgl/examples/component/vue_viewer.html"></sm-iframe>

```vue
<sm-viewer></sm-viewer>
```

### Attributes

| 参数 | 说 明   | 类型  | 可选值  | 默认值|
|:-----| :------| :---- | :------ | :---- |
|    sceneUrl  | 加载场景数据，由supermap的iserver发布提供的场景    |   String   |   参考SuperMap官网[webgl范例](http://support.supermap.com.cn:8090/webgl/examples/examples.html#analysis)      |   无     |
|     s3mScps |  加载s3m切片    |    Array  |    参考SuperMap官网[webgl范例](http://support.supermap.com.cn:8090/webgl/examples/examples.html#layer-S3M)    |    无    |
|     collapsed | 开启折叠面板，只有在组合模式时生效     |   Boolean   |     true/false    |    false    |

#### 注意：
> 1. 属性为驼峰式，在使用属性时需要把大写字母变为小写，中间用短横线连接,如添加场景时：
> ```vue
> <sm-viewer :scene-url="xxx"></sm-viewer>
>```
> 2. 组合模式示范：由于组件操作面板大小有限，一般组合不超过四个组件，实际需要更多可自定义界面大小，随意组合任意个数不同类型组件
> ```vue
>// 同类型组合示范:
> <sm-viewer >
>   <sm3d-clip-box ></sm3d-clip-box>
>   <sm3d-clip-plane ></sm3d-clip-plane>
>   <sm3d-clip-cross ></sm3d-clip-cross>
>   <sm3d-clip-polygon ></sm3d-clip-polygon>
> </sm-viewer>
> // 任意类型组合示范:
> <sm-viewer>
>   <sm3d-clip-box></sm3d-clip-box>
>   <sm3d-measure></sm3d-measure>
>   <sm3d-terrain-flood></sm3d-terrain-flood>
> </sm-viewer>
> ```

### viewer拓展
viewer具有很多属性，为了后期开发的灵活性和使用的简易性，本产品没有开过多的接口，若有需要，建议用户自己在程序中vue生命周期mounted里调用或设置viewer其他属性，如下示范：

```js
mounted(){
  //bingmap
  viewer.imageryLayers.addImageryProvider(
    new Cesium.BingMapsImageryProvider({
    url: "https://dev.virtualearth.net",
    mapStyle: Cesium.BingMapsStyle.AERIAL,
    key: URL_CONFIG.BING_MAP_KEY
    })
  );
  //加载地形
  viewer.terrainProvider = new Cesium.CesiumTerrainProvider({
    url : URL_CONFIG.SiChuan_TERRAIN,
    isSct : true//地形服务源自SuperMap iServer发布时需设置isSct为true
  });
  // 相机位置
  viewer.scene.camera.setView({
    destination : new Cesium.Cartesian3(-1206939.1925299785, 5337998.241228442, 3286279.2424502545),
    orientation : {
      heading : 1.4059101895600987,
      pitch : -0.20917672793046682,
      roll : 2.708944180085382e-13
    }
  });
  ···
}
```