
// 引入依赖
import { watch, ref, reactive, toRefs, onBeforeUnmount, onMounted } from "vue";
import { storeState } from '../../../js/store/store.js'   //简单局部状态管理
import tool from '../../../js/tool/tool.js'        //提示等工具
import resource from '../../../js/local/lang.js'  //语言资源

function s3mlayerOperation(props) {

    // 设置默认值数据
    let state = reactive({
        layerNames: [],   //当前存在的可选择s3m图层
        selectedLayerName: 'none',  //默认选择图层名称
        selectedoffset: false,  //选中偏移
        offsetX: 0,  //沿X轴偏移
        offsetY: 0,  //沿Y轴偏移
        offsetZ: 0,  //沿Z轴偏移
        polygonOffset: false,  //多边形偏移
        polygonOffsetFactor: 0,  //偏移因子
        polygonOffsetUnit: 0,  //偏移单位
    })

    // 传入props改变默认值
    if (props) {
        for (let key in props) {
            if (state.hasOwnProperty(key)) {
                state[key] = props[key]
            } else {
                tool.Message.errorMsg(resource.AttributeError + key);
            }
        }
    }

    // 初始化数据
    let layers, scene, selectedLayer;
    if (storeState.isViewer) {
        getLayerNames();
    }
    //viewer 初始化完成的监听
    watch(() => storeState.isViewer, val => {
        if (val) {
            getLayerNames();
        }
    });

    //监听图层加载完成
    watch(() => storeState.changeLayers, val => {
        getLayerNames();
    });

    //初始化图层
    function getLayerNames() {
        scene = viewer.scene;
        layers = viewer.scene.layers.layerQueue;
        if (layers && layers.length > 0) {
            layers.forEach((element, index) => {
                if (!state.layerNames.includes(element._name)) {
                    state.layerNames.push(element._name);
                }
            });
            if (state.selectedLayerName = 'none') {
                state.selectedLayerName = state.layerNames[0];
                selectedLayer = layers[0];
            }
        }
    }

    function setObjsOffset() {
        let ids = selectedLayer.getSelection()
        selectedLayer.removeAllObjsOffset(); // 移除所有图元的偏移
        if (ids.length > 0) {
            selectedLayer.setObjsOffset(ids);
        }
    }

    // 销毁
    onBeforeUnmount(() => {
        layers = scene = null;
    });


    // 监听
    watch(() => state.selectedLayerName, val => {
        let index = state.layerNames.indexOf(val)
        if (index == -1) return;
        selectedLayer = layers[index];
    });
    watch(() => state.selectedoffset, val => {
        if (!selectedLayer) return;
        if (val) {
            let xOffset = Number(state.offsetX);
            let yOffset = Number(state.offsetY);
            let zOffset = Number(state.offsetZ);
            selectedLayer.selectedTranslate = new Cesium.Cartesian3(
                xOffset,
                yOffset,
                zOffset
            );
            viewer.eventManager.addEventListener("CLICK", setObjsOffset, true);
            setObjsOffset()
        } else {
            viewer.eventManager.removeEventListener("CLICK", setObjsOffset);
            selectedLayer.selectedTranslate = new Cesium.Cartesian3(0, 0, 0);
            selectedLayer.removeAllObjsOffset();
            selectedLayer.releaseSelection(); // 释放选择集
        }
    });
    watch(() => state.offsetX, val => {
        if (state.selectedoffset) {
            let xOffset = Number(val);
            let yOffset = Number(state.offsetY);
            let zOffset = Number(state.offsetZ);
            selectedLayer.selectedTranslate = new Cesium.Cartesian3(
                xOffset,
                yOffset,
                zOffset
            );
        }
    });
    watch(() => state.offsetY, val => {
        if (state.selectedoffset) {
            let xOffset = Number(state.offsetX);
            let yOffset = Number(state.offsetY);
            let zOffset = Number(state.offsetZ);
            selectedLayer.selectedTranslate = new Cesium.Cartesian3(
                xOffset,
                yOffset,
                zOffset
            );
        }
    });
    watch(() => state.offsetZ, val => {
        if (state.selectedoffset) {
            let xOffset = Number(state.offsetX);
            let yOffset = Number(state.offsetY);
            let zOffset = Number(state.offsetZ);
            selectedLayer.selectedTranslate = new Cesium.Cartesian3(
                xOffset,
                yOffset,
                zOffset
            );
        }
    });
    watch(() => state.polygonOffset, val => {
        if (!selectedLayer) return;
        if (val) {
            selectedLayer.setPolygonoffset(
                Number(state.polygonOffsetFactor),
                Number(val)
            );
        } else {
            selectedLayer.setPolygonoffset(0, 0);
        }
    });

    watch(() => state.polygonOffsetFactor, val => {
        if (selectedLayer && state.polygonOffset)
            selectedLayer.setPolygonoffset(
                Number(val),
                Number(state.polygonOffsetUnit)
            );
    });
    watch(() => state.polygonOffsetUnit, val => {
        if (selectedLayer && state.polygonOffset)
            selectedLayer.setPolygonoffset(
                Number(state.polygonOffsetFactor),
                Number(val)
            );
    });


    return {
        ...toRefs(state),
    };
};

export default s3mlayerOperation

