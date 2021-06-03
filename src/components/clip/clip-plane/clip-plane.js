
// 引入依赖
import { watch, reactive, toRefs, onBeforeUnmount } from "vue";
import { initHandler, handlerDrawing, clearHandlerDrawing } from "../../../js/common/drawHandler.js"    //公共handler.js
import { Edit, clearEditHandler } from "../../../js/common/editHandler.js"   //编辑
import tool from '../../../js/tool/tool.js'        //提示等工具
import resource from '../../../js/local/lang.js'  //语言资源
import createTooltip from '../../../js/tool/tooltip2.js';
import { storeState } from '../../../js/store/store.js'   //简单局部状态管理

function clipPlaneAnalysis(props) {
    // 设置默认值数据
    let state = reactive({
        isEdit: false,//是否编辑
        isEditZ: false,
        lineVisible: true,//是否显示绘制线
        PlanePositions: []
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
    let layers;
    let planePosition = [];

    /*
     ***平面分析模块***
    */

    //初始化分析区域 （后面有需要可以添加监听）
    if (props && props.PlanePositions) {
        clipPolygonUpdate(props.PlanePositions);
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
    function clipPlaneStart(e) {
        e.preventDefault();
        tooltip.setVisible(false);
        tooltip.showAt(' <p>点击鼠标左键开始绘制</p><p>绘制三点确定一个平面</p><p>点击鼠标右键结束绘制</p>', '230px');
        if (!layers ) {
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
            res => {
                let position = res.result.object.positions;
                clipPlaneUpdate(position);
                // handlerPolygon.polygon.show = false;
                // handlerPolygon.polyline.show = false;
                window.handlerPolygon.deactivate();
                tooltip.setVisible(false);
                if (state.isEdit) {
                    Edit(planePosition, state.isEditZ, clipPlaneUpdate);
                }
            },
            err => {
                console.log(err);
            }
        );
        window.handlerPolygon.activate();
        if (!scene.pickPositionSupported) {
            alert("不支持深度纹理,无法绘制多边形，裁剪功能无法使用！");
        }
    };
    // 更新
    function clipPlaneUpdate(p) {
        planePosition = p;
        for (let layer of layers) {
            layer.clearCustomClipBox();
            layer.setCustomClipPlane(
                p[0],
                p[1],
                p[2]
            );
        }
    };

    // 清除
    function clearClipPlane(e) {
        e.preventDefault();
        tooltip.setVisible(false);
        planePosition = [];
        if (!window.handlerPolygon) return;
        clearHandlerDrawing("Polygon");
        for (let layer of layers) {
            layer.clearCustomClipBox();
        }
    };

    // 监听

    watch(() => state.isEdit, val => {
        if (val && window.handlerPolygon) {
            Edit(planePosition, state.isEditZ, clipPlaneUpdate);
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
        clipPlaneStart,
        clearClipPlane,
        planePosition
    };
};

export default clipPlaneAnalysis

