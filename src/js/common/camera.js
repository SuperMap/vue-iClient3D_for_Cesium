
// 测试使用
const flyByCameraParam = function (cameraParam) {
    if (cameraParam) {
        viewer.scene.camera.flyTo({
            destination: new Cesium.Cartesian3(
                cameraParam.Cartesian3.x,
                cameraParam.Cartesian3.y,
                cameraParam.Cartesian3.z
            ),
            orientation: {
                heading: cameraParam.heading,
                pitch: cameraParam.pitch,
                roll: cameraParam.roll,
            },
            duration: 0,
        });
        return;
    }
        // var layers = viewer.scene.layers.layerQueue;
        // var ceterCartesianPosition = layers[0]._position;
        // var boundingSphere = new Cesium.BoundingSphere(
        //     ceterCartesianPosition,
        //     200
        // );
        // viewer.scene.camera.flyToBoundingSphere(boundingSphere);
}

const flyByLayerName = function (type, id_name) {
    if (!type || !id_name) return;
    switch (type) {
        case "S3M":
            let layer = viewer.scene.layers.find(id_name);
            viewer.flyTo(layer,{duration: 0,})
            break;
        case "MVT":
            let mvtlayer = viewer.scene.getVectorTilesMap(id_name);
            var bounds = mvtlayer.rectangle;
            viewer.scene.camera.flyTo({
                destination: new Cesium.Cartesian3.fromRadians(
                    (bounds.east + bounds.west) * 0.5,
                    (bounds.north + bounds.south) * 0.5,
                    10000
                ),
                duration: 0,
                orientation: {
                    heading: 0,
                    roll: 0
                }
            });
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
                viewer.flyTo(img_layer,{duration: 0,})
            }
            break;
        case "TERRAIN":
            break;
        default:
            null;
    }

}

export default {
    flyByCameraParam,
    flyByLayerName
}

export {
    flyByCameraParam,
    flyByLayerName
}
