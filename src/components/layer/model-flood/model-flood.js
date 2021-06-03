
// 引入依赖
import { watch, ref, reactive, toRefs, onBeforeUnmount, onMounted } from "vue";
import { storeState } from '../../../js/store/store.js'   //简单局部状态管理
import tool from '../../../js/tool/tool.js'        //提示等工具
import resource from '../../../js/local/lang.js'  //语言资源
import common from "../../../js/common/drawHandler.js"    //公共handler等js

function s3mlayerOperation(props) {

    // 设置默认值数据
    let state = reactive({
        layerNames: [],   //当前存在的可选择s3m图层
        selectedLayerName: 'none',  //默认选择图层名称
        maxHeight: 200, //最大可见高程
        minHeight: 0, //最小可见高程
        floodHeight: [0, 200],  //可见区间
        currentHeight: 0, //当前高程
        floodSpeed: 1,  //速度
        floodTrans: 0.8, //透明度
        cheackedBand: 'band1', //当前选择颜色
        colorBandShow: false, //颜色下拉框显隐
        floodPositions: [],  //分析区域
        lineVisible: true, //是否显示绘制线
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
    let floodDisplayMode = Cesium.HypsometricSettingEnum.DisplayMode.FACE;
    let hypFlood = new Cesium.HypsometricSetting();
    let floodColorTable = new Cesium.ColorTable();
    floodColorTable.insert(500, new Cesium.Color(0, 39 / 255, 148 / 255));
    floodColorTable.insert(0, new Cesium.Color(149 / 255, 232 / 255, 249 / 255));
    let interval;
    let floodPosition = [];

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

    function floodBegin(e) {
        e.preventDefault();
        hypFlood.DisplayMode = floodDisplayMode;
        hypFlood._lineColor = new Cesium.Color(1.0, 0.0, 0.0, 1.0);
        hypFlood.MinVisibleValue = Number(state.floodHeight[0]);
        hypFlood.MaxVisibleValue = 0;
        hypFlood.ColorTableMinKey = 0;
        hypFlood.ColorTableMaxKey = 200;
        hypFlood.ColorTable = floodColorTable;
        hypFlood.Opacity = Number(state.floodTrans);
        hypFlood.LineInterval = 10.0;
        if (!window.handlerPolygon) {
            common.initHandler("Polygon");
        }
        if (props && props.floodPositions) {
            floodUpdate(props.floodPositions);
            return;
        }
        common.handlerDrawing("Polygon", state.lineVisible).then(
            res => {
                let handlerPolygon = window.handlerPolygon;
                floodUpdate(res.positions);
                handlerPolygon.polygon.show = false;
                handlerPolygon.deactivate();
            },
            err => {
                console.log(err);
            }
        );
        window.handlerPolygon.activate();
        if (!viewer.scene.pickPositionSupported) {
            tool.Message.errorMsg(resource.NoPickPositionSupported);
        }
    };
    function floodUpdate(positions) {
        if (positions) {
            floodPosition = positions;
        }
        hypFlood.CoverageArea = positions;
        let  currentH = Number(state.minHeight);
        interval = setInterval("ModelFlood()", 100);
        window.ModelFlood = () => {
            if (currentH > state.maxHeight) {
                state.currentHeight = state.maxHeight;
                clearInterval(interval);
                return;
            }
            state.currentHeight = Number(currentH.toFixed(2));
            hypFlood.MaxVisibleValue = currentH;
            try {
                hypsometricSetting();
            } catch (err) {
                console.log(err);
                clearInterval(interval);
            };
            currentH += (parseFloat(state.floodSpeed) / 10);
        };
    };

   


    //选择颜色带bands
    function changeColor(band) {
        state.colorBandShow = false;
        state.cheackedBand = band;
    };
    // 清除
    function floodClear(e) {
        e.preventDefault();
        selectedLayer.hypsometricSetting.hypsometricSetting.MaxVisibleValue = -1000;
        clearInterval(interval);
        floodPosition = [];
        state.currentHeight = Number(state.floodHeight[0]);
        if (!window.handlerPolygon) return;
        common.clearHandlerDrawing("Polygon");
    };


    // 销毁
    onBeforeUnmount(() => {
        layers = scene = null;
        hypFlood.destroy();
        floodColorTable.destroy();
        hypFlood = undefined;
        floodColorTable = undefined;
    });


    // 监听
    watch(() => state.selectedLayerName, val => {
        let index = state.layerNames.indexOf(val)
        if (index == -1) return;
        selectedLayer = layers[index];
    });
    watch(() => state.maxHeight, val => {
        hypFlood.MaxVisibleValue = parseInt(val);
        hypsometricSetting();
    });
    watch(() => state.minHeight, val => {
        hypFlood.MinVisibleValue = parseInt(val);
        state.currentHeight = parseInt(val);
        hypsometricSetting();
    });
    watch(() => state.floodHeight, val => {
        state.minHeight = val[0];
        state.maxHeight = val[1];
    });
    watch(() => state.floodTrans, val => {
        hypFlood.Opacity = parseFloat(val);
        hypsometricSetting();
    });
    watch(() => state.cheackedBand, val => {
        floodColorTable = colorBandsChange(val);
        hypFlood.ColorTable = floodColorTable;
        hypsometricSetting();
    });

    function hypsometricSetting() {
        if (floodPosition.length == 0) {
            return;
        }
        selectedLayer.hypsometricSetting = {
            hypsometricSetting: hypFlood,
            analysisMode:
                Cesium.HypsometricSettingEnum.AnalysisRegionMode.ARM_REGION,
        };
    };


    return {
        ...toRefs(state),
        floodClear,
        floodBegin,
        changeColor,
        floodPosition
    };
};

export default s3mlayerOperation

function colorBandsChange(val) {
    let floodColorTable = new Cesium.ColorTable();
    switch (val) {
        case "band1":
            floodColorTable.insert(
                500,
                new Cesium.Color(0, 39 / 255, 148 / 255)
            );
            floodColorTable.insert(
                0,
                new Cesium.Color(149 / 255, 232 / 255, 249 / 255)
            );
            break;
        case "band2":
            floodColorTable.insert(
                500,
                new Cesium.Color(162 / 255, 251 / 255, 194 / 255)
            );
            floodColorTable.insert(0, new Cesium.Color(1, 103 / 255, 103 / 255));
            break;
        case "band3":
            floodColorTable.insert(
                500,
                new Cesium.Color(230 / 255, 198 / 255, 1)
            );
            floodColorTable.insert(0, new Cesium.Color(157 / 255, 0, 1));
            break;
        case "band4":
            floodColorTable.insert(
                500,
                new Cesium.Color(210 / 255, 15 / 255, 15 / 255)
            );
            floodColorTable.insert(
                100,
                new Cesium.Color(221 / 255, 224 / 255, 7 / 255)
            );
            floodColorTable.insert(
                50,
                new Cesium.Color(20 / 255, 187 / 255, 18 / 255)
            );
            floodColorTable.insert(4000, new Cesium.Color(0, 161 / 255, 1));
            floodColorTable.insert(
                0,
                new Cesium.Color(9 / 255, 9 / 255, 212 / 255)
            );
            break;
        case "band5":
            floodColorTable.insert(
                500,
                new Cesium.Color(186 / 255, 1, 229 / 255)
            );
            floodColorTable.insert(
                0,
                new Cesium.Color(26 / 255, 185 / 255, 156 / 255)
            );
            break;
        default: floodColorTable.insert(
            500,
            new Cesium.Color(0, 39 / 255, 148 / 255)
        );
            floodColorTable.insert(
                0,
                new Cesium.Color(149 / 255, 232 / 255, 249 / 255)
            );
            break;
    };
    return floodColorTable
}

