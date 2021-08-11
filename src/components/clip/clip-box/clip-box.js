
// 引入依赖
import { watch, reactive, toRefs, onBeforeUnmount } from "vue";
import tool from '../../../js/tool/tool.js'        //提示等工具
import createTooltip from '../../../js/tool/tooltip.js';
import resource from '../../../js/local/lang.js'  //语言资源
import { storeState, storeDate } from '../../../js/store/store.js'   //简单局部状态管理


function clipBoxAnalysis(props) {

    // 设置默认值数据
    let state = reactive({
        clipLength: 10,
        clipWidth: 10,
        clipHeight: 10,
        clipRotate: 0,
        boxClipModel: 'CutInsideBoxNOFrame',
        isShowBox: true
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
    let clipModeOption = "clip_behind_all_plane";
    let layers, screenSpaceEventHandler, boxEntity;
    let hasClipLine = true;
    if (storeState.isViewer) {
        layers = viewer.scene.layers.layerQueue;
        screenSpaceEventHandler = new Cesium.ScreenSpaceEventHandler(
            viewer.scene.canvas
        );
        if (!window.tooltip) {
            window.tooltip = createTooltip(viewer._element);
        }
    }
    //viewer 初始化完成的监听
    watch(() => storeState.isViewer, val => {
        if (val) {
            screenSpaceEventHandler = new Cesium.ScreenSpaceEventHandler(
                viewer.scene.canvas
            );
            layers = viewer.scene.layers.layerQueue;
        }
    })

    /*
     ***box分析模块***
    */

    // 分析
    function BoxClip(e) {
        e.preventDefault();
        viewer.entities.removeAll();
        setAllLayersClipColor();
        //  提示
        screenSpaceEventHandler.setInputAction(evt => {
            tooltip.showAt(evt.endPosition, `<p>${resource.ClickModelAddBox}</p>`);
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

        screenSpaceEventHandler.setInputAction(evt => {
            let length = Number(state.clipLength);
            let width = Number(state.clipWidth);
            let height = Number(state.clipHeight);
            if (height <= 0 || width <= 0 || length <= 0) {
                return;
            }
            let rotate = parseFloat(state.clipRotate);
            let position = scene.pickPosition(evt.position);
            let boxOption = {
                dimensions: new Cesium.Cartesian3(length, width, height),
                position: position,
                clipMode: clipModeOption,
                heading: rotate
            };
            let hpr = new Cesium.HeadingPitchRoll(rotate, 0, 0);
            let orientation = Cesium.Transforms.headingPitchRollQuaternion(
                position,
                hpr
            );
            boxEntity = viewer.entities.add({
                box: {
                    dimensions: new Cesium.Cartesian3(length, width, height),
                    material: Cesium.Color.fromRandom({
                        alpha: 0.2
                    })
                },
                show: state.isShowBox,
                position: position,
                orientation: orientation
            });
            setAllLayersClipOptions(boxOption);
            tooltip.setVisible(false);
            screenSpaceEventHandler.removeInputAction(
                Cesium.ScreenSpaceEventType.MOUSE_MOVE
            );
            screenSpaceEventHandler.removeInputAction(
                Cesium.ScreenSpaceEventType.LEFT_CLICK
            );
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    };

    // 设置是否带线框裁剪
    function setAllLayersClipOptions(boxOptions) {
        for (let layer of layers) {
            hasClipLine
                ? (layer.clipLineColor = new Cesium.Color(1, 1, 1, 1))
                : (layer.clipLineColor = new Cesium.Color(1, 1, 1, 0));
            layer.setCustomClipBox(boxOptions);
        }
    };
    // 设置裁剪线颜色
    function setAllLayersClipColor() {
        for (let i = 0, j = layers.length; i < j; i++) {
            layers[i].selectEnabled = false;
            layers[i].clipLineColor = new Cesium.Color(1, 1, 1, 0.5);
        }
    };
    // 更新
    function ClipBoxUpdate() {
        let newDim = boxEntity.box.dimensions.getValue();
        let position = boxEntity.position.getValue(0);
        let clipMode = clipModeOption;
        let heading = Cesium.Math.toRadians(parseFloat(state.clipRotate));
        let boxOptions = {
            dimensions: newDim,
            position: position,
            clipMode: clipMode,
            heading: heading
        };
        setAllLayersClipOptions(boxOptions);
    };

    // 清除
    function clearBoxClip(e) {
        e.preventDefault();
        if (!boxEntity) {
            return;
        }
        tooltip.setVisible(false);
        viewer.entities.removeAll();
        boxEntity = null;
        for (let layer of layers) {
            layer.clearCustomClipBox();
        }
        screenSpaceEventHandler.removeInputAction(
            Cesium.ScreenSpaceEventType.MOUSE_MOVE
        );
        screenSpaceEventHandler.removeInputAction(
            Cesium.ScreenSpaceEventType.LEFT_CLICK
        );
    };

    // 监听

    watch(() => state.clipLength, val => {
        if (!boxEntity) {
            return;
        }
        let dim = boxEntity.box.dimensions.getValue();
        let newVal = Number(val);
        boxEntity.box.dimensions = new Cesium.Cartesian3(
            newVal,
            dim.y,
            dim.z
        );
        ClipBoxUpdate();
    });
    watch(() => state.clipWidth, val => {
        if (!boxEntity) {
            return;
        }
        let dim = boxEntity.box.dimensions.getValue();
        let newVal = Number(val);
        boxEntity.box.dimensions = new Cesium.Cartesian3(
            dim.x,
            newVal,
            dim.z
        );
        ClipBoxUpdate();
    });
    watch(() => state.clipHeight, val => {
        if (!boxEntity) {
            return;
        }
        let dim = boxEntity.box.dimensions.getValue();
        let newVal = Number(val);
        boxEntity.box.dimensions = new Cesium.Cartesian3(
            dim.x,
            dim.y,
            newVal
        );
        ClipBoxUpdate();
    });
    watch(() => state.clipRotate, val => {
        if (!boxEntity) {
            return;
        }
        let position = boxEntity.position.getValue(0);
        let newVal = Number(val);
        let rotate = Cesium.Math.toRadians(newVal);
        let hpr = new Cesium.HeadingPitchRoll(rotate, 0, 0);
        let orientation = Cesium.Transforms.headingPitchRollQuaternion(
            position,
            hpr
        );
        boxEntity.orientation = orientation;
        ClipBoxUpdate();
    });
    watch(() => state.boxClipModel, val => {
        if (!boxEntity) {
            return;
        }
        switch (val) {
            case "CutInsideBoxNOFrame":
                hasClipLine = true;
                clipModeOption = "clip_behind_all_plane";
                break;
            case "CutOutBoxNOFrame":
                hasClipLine = true;
                clipModeOption = "clip_behind_any_plane";
                break;
            case "CutInsideBoxFrame":
                hasClipLine = false;
                clipModeOption = "clip_behind_all_plane";
                break;
            case "CutOutBoxFrame":
                hasClipLine = false;
                clipModeOption = "clip_behind_any_plane";
                break;
        }
        ClipBoxUpdate();
    });
    watch(() => state.isShowBox, val => {
        if (!boxEntity) {
            return;
        }
        boxEntity.show = val
    });


    // 销毁
    onBeforeUnmount(() => {
        screenSpaceEventHandler.destroy();
        layers = undefined;
        screenSpaceEventHandler = undefined;
    })

    return {
        ...toRefs(state),
        BoxClip,
        clearBoxClip
    };
};

export default clipBoxAnalysis
