
// 引入依赖
import { watch, reactive, toRefs, onBeforeUnmount } from "vue";
import { initHandler, handlerDrawing, clearHandlerDrawing } from "../../../js/common/drawHandler.js"    //公共handler.js
import { Edit, clearEditHandler } from "../../../js/common/editHandler.js"   //编辑
import tool from '../../../js/tool/tool.js'        //提示等工具
import resource from '../../../js/local/lang.js'  //语言资源
import createTooltip from '../../../js/tool/tooltip2.js';
import { storeState } from '../../../js/store/store.js'   //简单局部状态管理

function clipPolygonAnalysis(props) {
    // 设置默认值数据
    let state = reactive({
        clipModelPolygon: 'ClipInside',//裁剪模式js
        isEdit: false,//是否编辑
        isEditZ: false,
        lineVisible: true,//是否显示绘制线
    });

    // 传入props改变默认值
    if (props) {
        for (let key in props) {
            if (state.hasOwnProperty(key)) {
                state[key] = props[key]
            } else {
                tool.Message && tool.Message.errorMsg(resource.AttributeError + key);
            }
        }
    }

    // 初始化数据
    let clipMode = Cesium.ModifyRegionMode.CLIP_INSIDE;   //裁剪模式值 外部: Cesium.ModifyRegionMode.CLIP_OUTSIDE;
    let layers,tipFlag = true;
    let polygonPosition = [];

    /*
     ***裁剪平面分析模块***
    */

    //初始化分析区域 （后面有需要可以添加监听）
    if (props && props.polygonPositions) {
        clipPolygonUpdate(props.slopePositions);
    }
    if (storeState.isViewer) {
        layers = viewer.scene.layers.layerQueue;
        if (!window.tooltip) {
            window.tooltip = createTooltip(viewer._element);
        }
    }
    //viewer 初始化完成的监听
    watch(() => storeState.isViewer, val => {
        if (val) {
            layers = viewer.scene.layers.layerQueue;
            if (!window.tooltip) {
                window.tooltip = createTooltip(viewer._element);
            }
        }
    })

    // 分析
    function clipPolygon(e) {
        e.preventDefault();
        tooltip.setVisible(false);
        if (tipFlag) {   //只提示一次
            tooltip.showAt(' <p>点击鼠标左键开始绘制多边形</p><p>点击鼠标右键结束绘制</p>', '230px');
            tipFlag = false
        }
        if (!layers) {
            layers = viewer.scene.layers.layerQueue;
        }
        for (let layer of layers) {
            layer.selectEnabled = false;
            // 设置被裁剪对象的颜色
            layer.clipLineColor = new Cesium.Color(1, 1, 1, 0);
        }
        if (!window.handlerPolygon) {
            initHandler("Polygon");
        }
        handlerDrawing("Polygon", state.lineVisible).then(
            (res) => {
                clipPolygonUpdate(res.positions)
                let handlerPolygon = window.handlerPolygon;
                handlerPolygon.polygon.show = false;
                handlerPolygon.polyline.show = false;
                handlerPolygon.deactivate();
                if (state.isEdit) {
                    Edit(polygonPosition, state.isEditZ, clipPolygonUpdate);
                }
            },
            (err) => {
                console.log(err);
            }
        );
        window.handlerPolygon.activate();
        if (!scene.pickPositionSupported) {
            tool.Message && tool.Message.errorMsg(resource.NoPickPositionSupported);
        }
    };
    // 更新
    function clipPolygonUpdate(p) {
        polygonPosition = p;
        for (let layer of layers) {
            layer.setModifyRegions([p], clipMode);
        }
    };

    // 清除
    function clearClipPolygon(e) {
        e.preventDefault();
        polygonPosition = [];
        tooltip.setVisible(false);
        if (!window.handlerPolygon) return;
        clearHandlerDrawing("Polygon");
        for (let layer of layers) {
            layer.clearModifyRegions();
        }
    };
    // 监听
    watch(() => state.clipModelPolygon, val => {
        switch (val) {
            case "ClipInside":
                clipMode = Cesium.ModifyRegionMode.CLIP_INSIDE;
                break;
            case "ClipOutside":
                clipMode = Cesium.ModifyRegionMode.CLIP_OUTSIDE;
                break;
            default:
                break;
        }
        if (polygonPosition.length > 0) {
            clipPolygonUpdate(polygonPosition);
        }
    });
    watch(() => state.isEdit, val => {
        if (val && window.handlerPolygon) {
            Edit(polygonPosition, state.isEditZ, clipPolygonUpdate);
        } else {
            clearEditHandler("Polygon");
            if (window.handlerPolygon && window.handlerPolygon.polygon) {
                window.handlerPolygon.polygon.show = false;
            }
        }
    });
    watch(() => state.isEditZ, val => {
        if (window.editHandler) {
            window.editHandler.isEditZ = val;
        }
    });


    // 销毁
    onBeforeUnmount(() => {
        layers = undefined;
    })

    return {
        ...toRefs(state),
        clipPolygon,
        clearClipPolygon,
        polygonPosition
    };
};

export default clipPolygonAnalysis

