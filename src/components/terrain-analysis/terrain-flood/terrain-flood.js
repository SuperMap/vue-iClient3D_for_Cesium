
// 引入依赖
import { watch, reactive, toRefs, onBeforeUnmount } from "vue";
import common from "../../../js/common/drawHandler.js"    //公共handler等js
import tool from '../../../js/tool/tool.js'        //提示等工具
import resource from '../../../js/local/lang.js'  //语言资源

function terrainFlood(props) {

    // 设置默认值数据
    let state = reactive({
        maxHeight: 9000, //最大可见高程
        minHeight: 1000, //最小可见高程
        floodHeight: [1000, 9000],
        currentHeight: 1000, //当前高程
        floodTrans: 0.8, //透明度
        cheackedBand: 'band1', //当前选择颜色
        colorBandShow: false, //颜色下拉框显隐
        floodSpeed: 800, //速度
        floodPositions: [],
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
    let floodDisplayMode = Cesium.HypsometricSettingEnum.DisplayMode.FACE;
    let hypFlood = new Cesium.HypsometricSetting();
    let floodColorTable = new Cesium.ColorTable();
    floodColorTable.insert(9000, new Cesium.Color(0, 39 / 255, 148 / 255));
    floodColorTable.insert(0, new Cesium.Color(149 / 255, 232 / 255, 249 / 255));
    let interval;
    let floodPosition = [];
    /*
     ***地形淹没分析模块***
    */


    // 分析
    function floodBegin(e) {
        e.preventDefault();
        hypFlood.DisplayMode = floodDisplayMode;
        hypFlood._lineColor = new Cesium.Color(1.0, 0.0, 0.0, 1.0);
        hypFlood.MinVisibleValue = state.minHeight;
        hypFlood.MaxVisibleValue = 0;
        hypFlood.ColorTableMinKey = 1;
        hypFlood.ColorTableMaxKey = 9000;
        hypFlood.ColorTable = floodColorTable;
        hypFlood.Opacity = state.floodTrans;
        hypFlood.LineInterval = 200.0;
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
                // handlerPolygon.polyline.show = false;
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
        let currentH = parseFloat(state.minHeight);
        hypFlood.CoverageArea = positions;
        interval = setInterval("flood()", 100);
        window.flood = () => {
            if (currentH <= state.maxHeight) {
                state.currentHeight = parseInt(currentH);
            }
            if (currentH > state.maxHeight) {
                state.currentHeight = state.maxHeight;
                clearInterval(interval);
                return;
            }
            hypFlood.MaxVisibleValue = currentH;
            try {
                viewer.scene.globe.HypsometricSetting = {
                    hypsometricSetting: hypFlood,
                    analysisMode:
                        Cesium.HypsometricSettingEnum.AnalysisRegionMode.ARM_REGION
                };
            } catch (err) {
                console.log(err);
                clearInterval(interval);
            };
            currentH += parseFloat(state.floodSpeed) / 10;
        };


    };
    // 清除
    function floodClear(e) {
        e.preventDefault();
        floodPosition = [];
        if (!window.handlerPolygon) return;
        viewer.scene.globe.HypsometricSetting = undefined;
        clearInterval(interval);
        common.clearHandlerDrawing("Polygon");
    };
    //选择颜色带bands
    function changeColor(band) {
        state.colorBandShow = false;
        state.cheackedBand = band;
    };

    //监听
    watch(() => state.floodTrans, val => {
        hypFlood.Opacity = parseFloat(val);
        if (floodPosition.length == 0) {
            return;
        }
        viewer.scene.globe.HypsometricSetting = {
            hypsometricSetting: hypFlood,
            analysisMode:
                Cesium.HypsometricSettingEnum.AnalysisRegionMode.ARM_REGION,
        };
    });
    watch(() => state.floodHeight, val => {
        state.minHeight = val[0];
        state.maxHeight = val[1];
    });
    watch(() => state.minHeight, val => {
        hypFlood.MinVisibleValue = parseInt(val);
        if (floodPosition.length == 0) {
            state.currentHeight = parseInt(val);
            return;
        }
        viewer.scene.globe.HypsometricSetting = {
            hypsometricSetting: hypFlood,
            analysisMode:
                Cesium.HypsometricSettingEnum.AnalysisRegionMode.ARM_REGION,
        };
    });
    watch(() => state.maxHeight, val => {
        hypFlood.MaxVisibleValue = parseInt(val);
        if (floodPosition.length == 0) {
            return;
        }
        viewer.scene.globe.HypsometricSetting = {
            hypsometricSetting: hypFlood,
            analysisMode:
                Cesium.HypsometricSettingEnum.AnalysisRegionMode.ARM_REGION,
        };
    });

    watch(() => state.cheackedBand, val => {
        floodColorTable = colorBandsChange(val);
        hypFlood.ColorTable = floodColorTable;
        if (floodPosition.length == 0) {
            return;
        }
        if (interval) {
            viewer.scene.globe.HypsometricSetting = {
                hypsometricSetting: hypFlood,
                analysisMode:
                    Cesium.HypsometricSettingEnum.AnalysisRegionMode.ARM_REGION
            };
        }
    });

    // 销毁
    onBeforeUnmount(() => {
        hypFlood.destroy();
        floodColorTable.destroy();
        hypFlood = undefined;
        floodColorTable = undefined;
    })

    return {
        ...toRefs(state),
        floodBegin,
        floodClear,
        changeColor,
        floodPosition
    };
};

export default terrainFlood

function colorBandsChange(val) {
    let floodColorTable = new Cesium.ColorTable();
    switch (val) {
        case "band1":
            floodColorTable.insert(
                9000,
                new Cesium.Color(0, 39 / 255, 148 / 255)
            );
            floodColorTable.insert(
                0,
                new Cesium.Color(149 / 255, 232 / 255, 249 / 255)
            );
            break;
        case "band2":
            floodColorTable.insert(
                9000,
                new Cesium.Color(162 / 255, 251 / 255, 194 / 255)
            );
            floodColorTable.insert(0, new Cesium.Color(1, 103 / 255, 103 / 255));
            break;
        case "band3":
            floodColorTable.insert(
                9000,
                new Cesium.Color(230 / 255, 198 / 255, 1)
            );
            floodColorTable.insert(0, new Cesium.Color(157 / 255, 0, 1));
            break;
        case "band4":
            floodColorTable.insert(
                9000,
                new Cesium.Color(210 / 255, 15 / 255, 15 / 255)
            );
            floodColorTable.insert(
                6000,
                new Cesium.Color(221 / 255, 224 / 255, 7 / 255)
            );
            floodColorTable.insert(
                5000,
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
                9000,
                new Cesium.Color(186 / 255, 1, 229 / 255)
            );
            floodColorTable.insert(
                0,
                new Cesium.Color(26 / 255, 185 / 255, 156 / 255)
            );
            break;
        default: floodColorTable.insert(
            9000,
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