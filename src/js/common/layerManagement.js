
import { actions, storeDate } from '../store/store.js'   //局部状态管理

// 添加s3m
function addS3mLayers(scps, callback) {  //scps:[{ url, options:{name}]}  无返回值
    let promiseArray = [];
    try {
        if (scps) {
            //加载scps
            scps.forEach(scp => {
                promiseArray.push(
                    viewer.scene.addS3MTilesLayerByScp(scp.url, scp.options)
                );
            });
        }
        promiseWhen(promiseArray, callback, 'S3M')
    } catch (e) {
        let widget = viewer.cesiumWidget;
        if (widget._showRenderLoopErrors) {
            let title = "渲染时发生错误，已停止渲染。";
            widget.showErrorPanel(title, undefined, e);
        }
    }
};


// 添加场景
function addScene(url, options, callback) {  //无返回值options:{SceneToken,autoSetView}
    if (options && options.SceneToken) {
        Cesium.Credential.CREDENTIAL = new Cesium.Credential(options.SceneToken);
    }
    let flag = true;
    if (options && options.autoSetView) {
        flag = options.autoSetView
    }
    if (checkURL(url)) {
        try {
            let s = [viewer.scene.open(url, undefined, { 'autoSetView': flag })];
            promiseWhen(s, callback, 'SCENE');
        } catch (e) {
            let widget = viewer.cesiumWidget;
            if (widget._showRenderLoopErrors) {
                let title = "渲染时发生错误，已停止渲染。";
                widget.showErrorPanel(title, undefined, e);
            }
        }
    }
};

// 添加地形
function addTerrainLayer(LayerURL, isSct) {
    try {
        viewer.terrainProvider = new Cesium.CesiumTerrainProvider({
            url: LayerURL,
            isSct: isSct, //地形服务源自SuperMap iServer发布时需设置isSct为true
        });
    } catch (e) {
        let widget = viewer.cesiumWidget;
        if (widget._showRenderLoopErrors) {
            let title = "渲染时发生错误，已停止渲染。";
            widget.showErrorPanel(title, undefined, e);
        }
    }
};

// 添加影像
function addImageLayer(LayerURL) {    // 返回img图层layer
    try {
        let layer = viewer.imageryLayers.addImageryProvider(
            new Cesium.SuperMapImageryProvider({
                url: LayerURL,
            })
        );
        return layer
    } catch (e) {
        let widget = viewer.cesiumWidget;
        if (widget._showRenderLoopErrors) {
            let title = "渲染时发生错误，已停止渲染。";
            widget.showErrorPanel(title, undefined, e);
        }
    }

};

// 添加mvt
function addMvtLayer(LayerURL, name, callback) {    // 返回img图层layer
    try {
        let mvtMap = viewer.scene.addVectorTilesMap({
            url: LayerURL,
            canvasWidth: 512,
            name: name || 'mvt',
            viewer: viewer
        });
        Cesium.when(mvtMap.readyPromise, function (data) {
            var bounds = mvtMap.rectangle;
            viewer.scene.camera.flyTo({
                destination: new Cesium.Cartesian3.fromRadians(
                    (bounds.east + bounds.west) * 0.5,
                    (bounds.north + bounds.south) * 0.5,
                    10000
                ),
                duration:0,
                orientation: {
                    heading: 0,
                    roll: 0
                }
            });
            actions.setChangeLayers();
            callback(mvtMap)
        });
        return mvtMap
    } catch (e) {
        let widget = viewer.cesiumWidget;
        if (widget._showRenderLoopErrors) {
            let title = "渲染时发生错误，已停止渲染。";
            widget.showErrorPanel(title, undefined, e);
        }
    }

};

// 加载s3m和场景函数
function promiseWhen(promiseArray, callback, type) {
    Cesium.when.all(
        promiseArray,
        function (layers) {
            storeDate.layers = viewer.scene.layers.layerQueue;
            actions.setChangeLayers();
            callback(layers[0],type);
            storeDate.layers.forEach((s3mlayer) => {
                if (!s3mlayer.visibleDistanceMax || s3mlayer.visibleDistanceMax > 12000) {
                    s3mlayer.visibleDistanceMax = 12000   //设置模型最可见距离
                }
            })
        },
        function (e) {
            let widget = viewer.cesiumWidget;
            if (widget._showRenderLoopErrors) {
                let title = '请检查url地址是否正确？';
                widget.showErrorPanel(title, undefined, e);
            }
        }
    );
};

//   检验url地址
function checkURL(url) {
    if (url === null || url === "") {
        return false;
    }
    if (url.charAt(0) == '"' || url.charAt(0) == "'") {
        let reg = /^['|"](.*)['|"]$/;
        url = url.replace(reg, "$1");
    }
    return true
};

//   删除图层
function layersDelete(type, id_name, callback) {
    switch (type) {
        case "S3M":
            viewer.scene.layers.remove(id_name);
            actions.setChangeLayers();   //图层改变全局响应触发
            callback();
            break;
        case "IMG":
            let img_layer;
            if (typeof (id_name) === 'nunber') {
                img_layer = viewer.imageryLayers.get(id_name);
            } else {
                let img_layers = viewer.imageryLayers._layers
                for (let i = 0; i < img_layers.length; i++) {
                    if (img_layers[i].imageryProvider.tablename && img_layers[i].imageryProvider.tablename === id_name) {
                        img_layer = img_layers[i];
                    }
                };
            }
            if (img_layer) {
                viewer.imageryLayers.remove(img_layer);
                actions.setChangeLayers();
                callback();
            }

            break;
        case "TERRAIN":
            viewer.terrainProvider = new Cesium.EllipsoidTerrainProvider();
            actions.setChangeLayers();
            callback()
            break;
        case "MVT":
            viewer.scene.removeVectorTilesMap(id_name);
            actions.setChangeLayers();
            callback()
            break;
        default:
            null;
    }
}



export default {
    addS3mLayers,
    addScene,
    addTerrainLayer,
    addImageLayer,
    layersDelete,
    addMvtLayer
};
export {
    addS3mLayers,
    addScene,
    addTerrainLayer,
    addImageLayer,
    layersDelete,
    addMvtLayer
};