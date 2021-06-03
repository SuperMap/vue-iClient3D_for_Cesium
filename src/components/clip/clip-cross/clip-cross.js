
// 引入依赖
import { watch, reactive, toRefs, onBeforeUnmount } from "vue";
import tool from '../../../js/tool/tool.js'        //提示等工具
import resource from '../../../js/local/lang.js'  //语言资源
import { storeState, storeDate } from '../../../js/store/store.js'   //简单局部状态管理


function clipCrossAnalysis(props) {

    // 设置默认值数据
    let state = reactive({
        clipWidth: 5,
        clipHeight: 5,
        heading: 0,
        pitch: 0,
        roll: 0,
        extrude: 1,
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
    let screenSpaceEventHandler;
    let startClip, //裁剪标志
        box, boxPosition, dim,  //entity
        position  //裁剪区域

    if (storeState.isViewer) {
        screenSpaceEventHandler = new Cesium.ScreenSpaceEventHandler(
            viewer.scene.canvas
        );
        layers = viewer.scene.layers.layerQueue;
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
     ***cross分析模块***
    */

    // 分析
    function startCross(e) {
        e.preventDefault();
        if (!viewer) {
            return;
        }
        if (box) {
            clearCross()
        }
        start();
        startClip = true;
        box.show = true;
    };
    function start() {
        for (let layer of layers) {
            layer.selectEnabled = false;
        }
        // 添加盒子
        boxPosition = Cesium.Cartesian3.fromDegrees(0, 0, 0);
        dim = new Cesium.Cartesian3(
            state.clipWidth,
            state.clipHeight,
            0.1
        );
        box = viewer.entities.add({
            // 标识盒
            id: "cross-clip-identify-box",
            position: boxPosition,
            show: false,
            box: {
                dimensions: dim,
                fill: false,
                outline: true,
                outlineColor: Cesium.Color.AQUA,
                outlineWidth: 5.0
            }
        });
        let hpr;
        screenSpaceEventHandler.setInputAction(movement => {
            if (startClip) {
                boxPosition = scene.pickPosition(movement.endPosition);

                if (!boxPosition) {
                    return;
                }
                box.position = boxPosition;
                if (!hpr) {
                    hpr = new Cesium.HeadingPitchRoll(
                        Cesium.Math.toRadians(state.heading),
                        Cesium.Math.toRadians(state.pitch),
                        Cesium.Math.toRadians(state.roll)
                    )
                }
                let orientation = Cesium.Transforms.headingPitchRollQuaternion(
                    boxPosition,
                    hpr
                );
                box.orientation = orientation;
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

        screenSpaceEventHandler.setInputAction(evt => {
            if (startClip) {
                position = scene.pickPosition(evt.position);
                if (!position) {
                    return;
                }
                updateClip();
                startClip = false;
                box.show = false;
            }
            screenSpaceEventHandler.removeInputAction(
                Cesium.ScreenSpaceEventType.MOUSE_MOVE
            );
            screenSpaceEventHandler.removeInputAction(
                Cesium.ScreenSpaceEventType.LEFT_CLICK
            );
            hpr = null;
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    };
    // 更新
    function updateClip() {
        for (let layer of layers) {
            layer.setCustomClipCross({
                position: position,
                dimensions: dim,
                heading: state.heading,
                pitch: state.pitch,
                roll: state.roll,
                extrudeDistance: Number(state.extrude)
            });
        }
    };

    // 清除
    function clearCross() {
        box && viewer.entities.removeById("cross-clip-identify-box");
        for (let layer of layers) {
            layer.clearCustomClipBox();
        }
        startClip = false;
        box = undefined;
        screenSpaceEventHandler.removeInputAction(
            Cesium.ScreenSpaceEventType.MOUSE_MOVE
        );
        screenSpaceEventHandler.removeInputAction(
            Cesium.ScreenSpaceEventType.LEFT_CLICK
        );
    };

    // 监听

    watch(() => state.clipWidth, val => {
        let temp_width = Number(val);
        if (temp_width <= 0 || !box) {
            return;
        }
        box.box.dimensions = new Cesium.Cartesian3(
            state.clipWidth,
            state.clipHeight,
            0.1
        );
        dim = new Cesium.Cartesian3(temp_width, state.clipHeight, state.extrude);
        updateClip();
    });
    watch(() => state.clipHeight, val => {
        let temp_height = Number(val);
        if (temp_height <= 0 || !box) {
            return;
        }
        box.box.dimensions = new Cesium.Cartesian3(
            state.clipWidth,
            state.clipHeight,
            0.1
        );
        dim = new Cesium.Cartesian3(state.clipWidth, temp_height, state.extrude);
        updateClip();
    });
    watch(() => state.pitch, val => {
        if (val === "" || !box) {
            return;
        }
        let pitch = Number(val);
        let hpr = new Cesium.HeadingPitchRoll(
            Cesium.Math.toRadians(state.heading),
            Cesium.Math.toRadians(pitch),
            Cesium.Math.toRadians(state.roll)
        );
        let orientation = Cesium.Transforms.headingPitchRollQuaternion(
            boxPosition,
            hpr
        );
        box.orientation = orientation;
        updateClip();
    });
    watch(() => state.roll, val => {
        if (val === "" || !box) {
            return;
        }
        let roll = Number(val);
        let hpr = new Cesium.HeadingPitchRoll(
            Cesium.Math.toRadians(state.heading),
            Cesium.Math.toRadians(state.pitch),
            Cesium.Math.toRadians(roll)
        );
        let orientation = Cesium.Transforms.headingPitchRollQuaternion(
            boxPosition,
            hpr
        );
        box.orientation = orientation;
        updateClip();
    });
    watch(() => state.heading, val => {
        if (val === "" || !box) {
            return;
        }
        let heading = Number(val);
        let hpr = new Cesium.HeadingPitchRoll(
            Cesium.Math.toRadians(heading),
            Cesium.Math.toRadians(state.pitch),
            Cesium.Math.toRadians(state.roll)
        );
        let orientation = Cesium.Transforms.headingPitchRollQuaternion(
            boxPosition,
            hpr
        );
        box.orientation = orientation;
        updateClip();
    });
    watch(() => state.extrude, val => {
        let temp_extrudeDistance = Number(val);
        if (temp_extrudeDistance <= 0 || !box) {
            return;
        }
        updateClip();
    });

    // 销毁
    onBeforeUnmount(() => {
        screenSpaceEventHandler.destroy();
        layers = undefined;
        box = undefined;
        screenSpaceEventHandler = undefined;
        dim = undefined;
    })

    return {
        ...toRefs(state),
        startCross,
        clearCross
    };
};

export default clipCrossAnalysis
