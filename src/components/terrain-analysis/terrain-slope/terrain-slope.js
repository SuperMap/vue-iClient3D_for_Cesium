
// 引入依赖
import { watch, reactive, toRefs, onBeforeUnmount } from "vue";
import { initHandler, handlerDrawing, clearHandlerDrawing } from "../../../js/common/drawHandler.js"    //公共handler.js
import { Edit, clearEditHandler } from "../../../js/common/editHandler.js"   //编辑
import tool from '../../../js/tool/tool.js'        //提示等工具
import resource from '../../../js/local/lang.js'  //语言资源
import createTooltip from '../../../js/tool/tooltip2.js'
import { storeState, storeDate } from '../../../js/store/store.js'   //简单局部状态管理

function terrainSlope(props) {
    // 设置默认值数据
    let slopData = reactive({
        analysisArea: 'ARM_REGION',//分析区域
        displayMode: 'FACE_AND_ARROW',//显示模式
        wideMaxR: 90, //最大坡度
        wideMinR: 0, //最小坡度
        slopeInterval:[0,90],
        trans: 0.8, //透明度
        isEdit: false,//是否编辑
        slopePositions:[],
        lineVisible: true,//是否显示绘制线
    });

    // 传入props改变默认值
    if (props) {
        for (let key in props) {
            if (slopData.hasOwnProperty(key)) {
                slopData[key] = props[key]
            } else {
                tool.Message.errorMsg(resource.AttributeError + key);
            }
        }
    }
    // 初始化数据
    let tipFlag = true;
    let slope = new Cesium.SlopeSetting(); //分析对象
    let wide = Cesium.HypsometricSettingEnum.AnalysisRegionMode[slopData.analysisArea]; //默认分析区域值
    let disMode = Cesium.SlopeSettingEnum.DisplayMode[slopData.displayMode]; //显示模式
    let SlopColorTable = new Cesium.ColorTable();  //颜色
    let slopePosition = [];  //保存当前分析区域
    SlopColorTable.insert(80, new Cesium.Color(255 / 255, 0 / 255, 0 / 255));
    SlopColorTable.insert(
        50,
        new Cesium.Color(221 / 255, 224 / 255, 7 / 255)
    );
    SlopColorTable.insert(
        30,
        new Cesium.Color(20 / 255, 187 / 255, 18 / 255)
    );
    SlopColorTable.insert(20, new Cesium.Color(0, 161 / 255, 1));
    SlopColorTable.insert(0, new Cesium.Color(9 / 255, 9 / 255, 255 / 255));

    /*
     ***坡度分析模块***
    */

    //初始化分析区域 （后面有需要可以添加监听）
    if (props && props.slopePositions) {
        slopeUpdate(props.slopePositions);
    }

    if (storeState.isViewer) {
        if (!window.tooltip) {
            window.tooltip = createTooltip(viewer._element);
        }
    }
    //viewer 初始化完成的监听
    watch(() => storeState.isViewer, val => {
        if (val) {
            if (!window.tooltip) {
                window.tooltip = createTooltip(viewer._element);
            }
        }
    });

    // 分析
    function startSlope(e) {
        e.preventDefault();
        tooltip.setVisible(false);
        if (tipFlag) {   //只提示一次
            window.tooltip.showAt(' <p>点击鼠标左键绘制分析区域</p><p>点击鼠标右键结束绘制</p><p>坡度坡向分析需要带法线地形</p>', '250px');
            tipFlag = false
        }
        slope.DisplayMode = disMode;
        slope.MaxVisibleValue = slopData.wideMaxR;
        slope.MinVisibleValue = slopData.wideMinR;
        slope.ColorTable = SlopColorTable;
        slope.Opacity = slopData.trans;
        // this.positions = [];
        // viewer.scene.globe.enableLighting = true;
            if (!window.handlerPolygon) {
                initHandler("Polygon");
            }
            handlerDrawing("Polygon", slopData.lineVisible).then(
                (res) => {
                    slopePosition = res.positions;
                    slopeUpdate(slopePosition);
                    let handlerPolygon = window.handlerPolygon;
                    handlerPolygon.polygon.show = false;
                    handlerPolygon.polyline.show = false;
                    handlerPolygon.deactivate();
                    if (slopData.isEdit) {
                        Edit(slopePosition, false, slopeUpdate);
                    }
                },
                (err) => {
                    console.log(err);
                }
            );
            handlerPolygon.activate();
            if (!scene.pickPositionSupported) {
                tool.Message.errorMsg(resource.NoPickPositionSupported);
            }
    };
    // 更新
    function slopeUpdate(p) {
        if (p) {
            slopePosition = p;
        }
        slope.CoverageArea = p;
        viewer.scene.globe.SlopeSetting = {
            slopeSetting: slope,
            analysisMode: wide,
        };
    };
    // 清除
    function clearSlope(e) {
        e.preventDefault();
        slopePosition = [];
        if (!window.handlerPolygon) return;
        viewer.scene.globe.SlopeSetting = {
            analysisMode: Cesium.HypsometricSettingEnum.AnalysisRegionMode.ARM_NONE,
        };
        tooltip.setVisible(false);
        clearHandlerDrawing("Polygon");
        clearEditHandler("Polygon");
    };

    watch(() => slopData.analysisArea, val => {
        switch (val) {
            case "ARM_REGION":
                {
                    wide =
                        Cesium.HypsometricSettingEnum.AnalysisRegionMode.ARM_REGION;
                }
                break;
            case "ARM_ALL":
                {
                    wide =
                        Cesium.HypsometricSettingEnum.AnalysisRegionMode.ARM_ALL;
                }
                break;
            case "ARM_NONE":
                {
                    wide =
                        Cesium.HypsometricSettingEnum.AnalysisRegionMode.ARM_NONE;
                }
                break;
            default:
                break;
        }
        if (slopePosition.length == 0) {
            return;
        }
        slopeUpdate(slopePosition)
    });

    watch(() => slopData.wideMaxR, val => {
        slope.MaxVisibleValue = parseFloat(val);
        if (slopePosition.length == 0) {
            return;
        }
        viewer.scene.globe.SlopeSetting = {
            slopeSetting: slope,
            analysisMode: wide,
        };
    });
    watch(() => slopData.wideMinR, val => {
        slope.MinVisibleValue = parseFloat(val);
        if (slopePosition.length == 0) {
            return;
        }
        viewer.scene.globe.SlopeSetting = {
            slopeSetting: slope,
            analysisMode: wide,
        };
    });
    watch(() => slopData.slopeInterval, val => {
        slopData.wideMinR = val[0];
        slopData.wideMaxR = val[1];
        // slope.MinVisibleValue = parseFloat(val[0]);
        // slope.MaxVisibleValue = parseFloat(val[1]);
        // if (slopePosition.length == 0) {
        //     return;
        // }
        // viewer.scene.globe.SlopeSetting = {
        //     slopeSetting: slope,
        //     analysisMode: wide,
        // };
    });
    

    watch(() => slopData.displayMode, val => {
        switch (val) {
            case "FACE":
                {
                    disMode = Cesium.SlopeSettingEnum.DisplayMode.FACE;
                }
                break;
            case "ARROW":
                {
                    disMode = Cesium.SlopeSettingEnum.DisplayMode.ARROW;
                }
                break;
            case "FACE_AND_ARROW":
                {
                    disMode = Cesium.SlopeSettingEnum.DisplayMode.FACE_AND_ARROW;
                }
                break;
            default:
                break;
        }
        slope.DisplayMode = disMode;
        if (slopePosition.length == 0) {
            return;
        }
        slopeUpdate(slopePosition)
    });

    watch(() => slopData.trans, val => {
        slope.Opacity = parseFloat(val);
        if (slopePosition.length == 0) {
            return;
        }
        viewer.scene.globe.SlopeSetting = {
            slopeSetting: slope,
            analysisMode: wide,
        };
    });
    watch(() => slopData.isEdit, val => {
        if (val && window.handlerPolygon) {
            Edit(slopePosition, false, slopeUpdate);
        } else {
            clearEditHandler("Polygon");
            if (window.handlerPolygon && window.handlerPolygon.polygon) {
                window.handlerPolygon.polygon.show = false;
            }
        }
    });
    // 销毁
    onBeforeUnmount(() => {
        slope.destroy();
        SlopColorTable.destroy();
        slope = undefined;
        SlopColorTable = undefined;
    })

    return {
        ...toRefs(slopData),
        startSlope,
        clearSlope,
        slopePosition
    };
};

export default terrainSlope

