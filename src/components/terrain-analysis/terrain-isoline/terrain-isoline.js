
// 引入依赖
import { watch, reactive, toRefs, onBeforeUnmount } from "vue";
import { initHandler, handlerDrawing, clearHandlerDrawing } from "../../../js/common/drawHandler.js"    //公共handler.js
import { Edit, clearEditHandler } from "../../../js/common/editHandler.js"   //编辑
import tool from '../../../js/tool/tool.js'        //提示等工具
import resource from '../../../js/local/lang.js'  //语言资源

function terrainIsoline(props) {

    // 设置默认值数据
    let state = reactive({
        fillMaxHeight: 9000, //最大可见高程
        fillMinHeight: 0, //最小可见高程
        fillHeight: [0, 9000],
        equivalentIsoline: 100, //等值距
        fillOptionsSelected: 'Line', //当前选择模式
        lineColor: "#FF8040", //颜色
        isEdit: false, //是否编辑
        isolinePositions: [],
        lineVisible: true, //是否显示绘制线
    });
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
    let hyp = new Cesium.HypsometricSetting();
    let DisplayModeHyp = Cesium.HypsometricSettingEnum.DisplayMode.LINE;  //显示模式
    let colorTable = new Cesium.ColorTable(); //建立颜色表
    colorTableInit(colorTable)
    let isolinePosition = [];  //保存当前分析区域

    /*
     ***等值线分析模块***
    */

    //初始化分析区域 （后面有需要可以添加监听）
    if (props && props.isolinePositions) {
        isolineUpdate(props.isolinePositions);
    }
    // 分析
    function isoLineAnalysis(e) {
        e.preventDefault();
        //参数配置
        hyp.DisplayMode = DisplayModeHyp;
        hyp._lineColor = Cesium.Color.fromCssColorString(state.lineColor);
        hyp.LineInterval = parseFloat(state.equivalentIsoline);
        hyp.MaxVisibleValue = parseFloat(state.fillMaxHeight);
        hyp.MinVisibleValue = parseFloat(state.fillMinHeight);
        hyp.ColorTableMinKey = 2736.88110351563;
        hyp.ColorTableMaxKey = 5597.06640625;
        hyp.ColorTable = colorTable;
        // hyp.Opacity = 0.4;
        if (!window.handlerPolygon) {
            initHandler("Polygon");
        }
        handlerDrawing("Polygon", state.lineVisible).then(
            res => {
                isolinePosition = res.positions;
                let handlerPolygon = window.handlerPolygon;
                //分析区域为指定区域
                isolineUpdate(isolinePosition)
                handlerPolygon.polygon.show = false;
                handlerPolygon.polyline.show = false;
                handlerPolygon.deactivate();
                if (state.isEdit) {
                    Edit(isolinePosition, false, isolineUpdate)
                }
            },
            err => {
                console.log(err);
            }
        );
        window.handlerPolygon.activate();
        if (!scene.pickPositionSupported) {
            tool.Message.errorMsg(resource.NoPickPositionSupported);
        }
    };
    // 更新
    function isolineUpdate(p) {
        if (p) {
            isolinePosition = p;
        }
        if (isolinePosition.length == 0) return;
        if (p) {
            hyp.CoverageArea = p;
        }
        viewer.scene.globe.HypsometricSetting = {
            hypsometricSetting: hyp,
            analysisMode:
                Cesium.HypsometricSettingEnum.AnalysisRegionMode.ARM_REGION
        }
    };
    // 清除
    function clearIsoLine(e) {
        e.preventDefault();
        isolinePosition = [];
        if (!window.handlerPolygon) return;
        viewer.scene.globe.HypsometricSetting = undefined;
        hyp && (hyp.MaxVisibleValue = -1000);
        hyp && (hyp.MinVisibleValue = -1000);
        clearHandlerDrawing("Polygon");
        clearEditHandler("Polygon");
    };
    //监听
    watch(() => state.fillMaxHeight, val => {
        hyp.MaxVisibleValue = parseFloat(val);
        if (isolinePosition.length == 0) {
            return;
        }
        isolineUpdate();
    });
    watch(() => state.fillMinHeight, val => {
        hyp.MinVisibleValue = parseFloat(val);
        if (isolinePosition.length == 0) {
            return;
        }
        isolineUpdate();
    });
    watch(() => state.fillHeight, val => {
        state.fillMinHeight = val[0];
        state.fillMaxHeight = val[1];
    });
    watch(() => state.equivalentIsoline, val => {
        hyp.LineInterval = parseFloat(val);
        if (isolinePosition.length == 0) {
            return;
        }
        isolineUpdate();
    });
    watch(() => state.lineColor, val => {
        if (val) {
            hyp._lineColor = Cesium.Color.fromCssColorString(val);
            // hyp.Opacity  = Number(rgbaNum(val, 3)) ;
            if (isolinePosition.length == 0) {
                return;
            }
            isolineUpdate();
        } else {
            console.warn('err: color is  null')
        }
    });
    watch(() => state.fillOptionsSelected, val => {
        switch (val) {
            case "None":
                {
                    DisplayModeHyp = undefined;
                }
                break;
            case "Line":
                {
                    DisplayModeHyp =
                        Cesium.HypsometricSettingEnum.DisplayMode.LINE;
                    hyp.Opacity = 1;
                }
                break;
            case "Region":
                {
                    DisplayModeHyp =
                        Cesium.HypsometricSettingEnum.DisplayMode.FACE;
                    hyp.Opacity = 0.5;
                }
                break;
            case "Line_Region":
                {
                    DisplayModeHyp =
                        Cesium.HypsometricSettingEnum.DisplayMode.FACE_AND_LINE;
                    hyp.Opacity = 0.5
                }
                break;
            default:
                break;
        }
        hyp.DisplayMode = DisplayModeHyp;
        if (isolinePosition.length == 0) {
            return;
        }
        isolineUpdate(isolinePosition)
    });
    watch(() => state.isEdit, val => {
        if (val && window.handlerPolygon) {
            Edit(isolinePosition, false, isolineUpdate)
        } else {
            clearEditHandler("Polygon");
            if (window.handlerPolygon && window.handlerPolygon.polygon) {
                window.handlerPolygon.polygon.show = false;
            }
        }
    });
    // 销毁
    onBeforeUnmount(() => {
        hyp.destroy();
        colorTable.destroy();
        hyp = undefined;
        colorTable = undefined;
    })

    return {
        ...toRefs(state),
        isoLineAnalysis,
        clearIsoLine,
        isolinePosition
    };
};

export default terrainIsoline

function colorTableInit(colorTable) {
    colorTable.insert(5597.06640625, new Cesium.Color(0, 0, 255 / 255));
    colorTable.insert(
        5406.3873860677086,
        new Cesium.Color(0, 51 / 255, 255 / 255)
    );
    colorTable.insert(
        5215.7083658854172,
        new Cesium.Color(0, 102 / 255, 255 / 255)
    );
    colorTable.insert(
        5025.0293457031257,
        new Cesium.Color(0, 153 / 255, 255 / 255)
    );
    colorTable.insert(
        4834.3503255208343,
        new Cesium.Color(0, 204 / 255, 255 / 255)
    );
    colorTable.insert(
        4643.6713053385429,
        new Cesium.Color(0, 255 / 255, 255 / 255)
    );
    colorTable.insert(
        4452.9922851562524,
        new Cesium.Color(51 / 255, 255 / 255, 204 / 255)
    );
    colorTable.insert(
        4262.3132649739609,
        new Cesium.Color(102 / 255, 255 / 255, 153 / 255)
    );
    colorTable.insert(
        4071.6342447916695,
        new Cesium.Color(153 / 255, 255 / 255, 102 / 255)
    );
    colorTable.insert(
        3880.9552246093781,
        new Cesium.Color(204 / 255, 255 / 255, 51 / 255)
    );
    colorTable.insert(
        3690.2762044270867,
        new Cesium.Color(255 / 255, 255 / 255, 0)
    );
    colorTable.insert(
        3499.5971842447952,
        new Cesium.Color(255 / 255, 204 / 255, 0)
    );
    colorTable.insert(
        3308.9181640625038,
        new Cesium.Color(255 / 255, 153 / 255, 0)
    );
    colorTable.insert(
        3118.2391438802129,
        new Cesium.Color(255 / 255, 102 / 255, 0)
    );
    colorTable.insert(
        2927.5601236979214,
        new Cesium.Color(255 / 255, 51 / 255, 0)
    );
    colorTable.insert(2736.88110351563, new Cesium.Color(255 / 255, 0, 0));
};

// 获取rgba里的数值(rgba:传入的rgba格式颜色值，index:想要获取第几位，有0、1、2、3)
function rgbaNum(rgba, index) {
    let val = rgba.match(/(\d(\.\d+)?)+/g);
    return val[index];
}
