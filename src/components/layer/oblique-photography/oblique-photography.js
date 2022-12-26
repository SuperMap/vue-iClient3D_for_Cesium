// 引入依赖
import { watch, reactive, toRefs,onBeforeUnmount } from "vue";
import { initHandler, handlerDrawing, clearHandlerDrawing } from "../../../js/common/drawHandler.js"    //公共handler.js
import tool from '../../../js/tool/tool.js'        //提示等工具
import resource from '../../../js/local/lang.js'  //语言资源
import { storeState } from '../../../js/store/store.js'   //简单局部状态管理

function obliquePhotography(props) {
    // 设置默认值数据
    let state = reactive({
        layerNames: [],   //当前存在的可选择s3m图层
        selectedLayerName: 'none',  //默认选择图层名称
        operationType: 'Excavation',  //操作类型
        lineVisible: true,
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
    // 非响应式数据定义
    let excavationPositions = [];
    let flattenPositions = [];
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

    /*
     ***挖掘模块***
    */

    function startExcavation(e) {
        e.preventDefault();
        if (!window.handlerPolygon) {
            initHandler("Polygon");
        }
        if (props && props.excavationPositions) {
            excavationUpdate(props.excavationPositions);
            return;
        }
        handlerDrawing("Polygon", state.lineVisible).then(
            res => {
                let handlerPolygon = window.handlerPolygon;
                excavationUpdate(res.positions);
                handlerPolygon.polygon.show = false;
                handlerPolygon.polyline.show = false;
                handlerPolygon.deactivate();
            },
            err => {
                console.log(err);
            }
        );
        window.handlerPolygon.activate();
        if (!viewer.scene.pickPositionSupported) {
            tool.Message && tool.Message.errorMsg(resource.NoPickPositionSupported);
        }

    }

    //更新地形挖掘
    function excavationUpdate(excavation_position) {
        if (excavation_position) {
            excavationPositions = excavation_position;
        }
        selectedLayer.addExcavationRegion({
            position: excavation_position,
            name: "excavation_" + Math.random(),
        });
    }
    // 清除
    function clearExcavation(e) {
        e.preventDefault();
        excavationPositions = [];
        if (!window.handlerPolygon) return;
        selectedLayer.removeAllExcavationRegion();
        clearHandlerDrawing("Polygon");
    }



    /*
     ***压平模块***
     */
    function startFlatten(e) {
        e.preventDefault();
        if (!window.handlerPolygon) {
            initHandler("Polygon");
        }
        if (props && props.flattenPositions) {
            flattenUpdate(props.flattenPositions);
            return;
        }
        handlerDrawing("Polygon", state.lineVisible).then(
            res => {
                let handlerPolygon = window.handlerPolygon;
                flattenUpdate(res.positions);
                handlerPolygon.polygon.show = false;
                handlerPolygon.polyline.show = false;
            },
            err => {
                console.log(err);
            }
        );

        window.handlerPolygon.activate();
        if (!viewer.scene.pickPositionSupported) {
            tool.Message && tool.Message.errorMsg(resource.NoPickPositionSupported);
        }
    }
    function clearFlatten(e) {
        e.preventDefault();
        if (!window.handlerPolygon) return;
        selectedLayer.removeAllFlattenRegion();
        clearHandlerDrawing("Polygon");
    }
    //更新地形修改
    function flattenUpdate(positions) {
        if (positions) {
            flattenPositions = positions;
        }
        selectedLayer.addFlattenRegion({
            position: positions,
            name: "flatten" + Math.random(),
        });
    }
    // 监听
    watch(() => state.selectedLayerName, val => {
        let index = state.layerNames.indexOf(val)
        if (index == -1) return;
        selectedLayer = layers[index];
    });

    // 销毁
    onBeforeUnmount(() => {
        layers = scene = null;
    });

    return {
        ...toRefs(state),
        startExcavation, //开始挖掘
        clearExcavation,
        startFlatten,  //开始压平
        clearFlatten, //清除压平
        excavationPositions,  //返回当前操作区域
        flattenPositions,  //返回当前操作区域
    };
};

export default obliquePhotography
