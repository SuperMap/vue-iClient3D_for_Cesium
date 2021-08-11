
// 引入依赖
import { watch, reactive, toRefs, onBeforeUnmount } from "vue";
import { initHandler, handlerDrawing, clearHandlerDrawing } from "../../../js/common/drawHandler.js"    //公共handler.js
import tool from '../../../js/tool/tool.js'        //提示等工具
import resource from '../../../js/local/lang.js'  //语言资源
import createTooltip from '../../../js/tool/tooltip2.js';
import { storeState } from '../../../js/store/store.js'   //简单局部状态管理

function clipPlane(props) {
    // 设置默认值数据
    let state = reactive({
        clipMode: 0,  //裁剪模式
        planeDirection: 'vertical', //裁剪方向
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
    let planePositionObj;
    let editEntity, s3mInstanceColc;
    let modelUrl = 'public/data/s3m/box.s3m';
    let modelEditor;

    /*
     ***平面分析模块***
    */
    //监听图层加载完成或改变触发
    watch(() => storeState.changeLayers, val => {
        layers = viewer.scene.layers.layerQueue;
        for (let layer of layers) {
            layer.selectEnabled = false;
            layer.clipLineColor = new Cesium.Color(1, 1, 1, 0);
        }
    });

    if (storeState.isViewer) {
        init()
    }
    //viewer 初始化完成的监听
    watch(() => storeState.isViewer, val => {
        init()
    })

    function init() {
        layers = viewer.scene.layers.layerQueue;
        s3mInstanceColc = new Cesium.S3MInstanceCollection(scene._context);
        viewer.scene.primitives.add(s3mInstanceColc);
        if (!window.tooltip) {
            window.tooltip = createTooltip(viewer._element);
        }
    }


    // 分析
    function clipPlaneStart(e) {
        e.preventDefault();
        if(planeSurface) clearClipPlane();
        tooltip.setVisible(false);
        tooltip.showAt('<p>点击鼠标左键开始绘制平面的一条边</p><p>绘制两点即可</p><p>点击鼠标右键结束绘制</p>', '350px');
        if (!window.handlerPolygon) {
            initHandler("Polyline");
        }
        handlerDrawing("Polyline").then(
            res => {
                let handlerPolyline = window.handlerPolyline;
                handlerPolyline.polyline.show = false;
                window.polylineTransparent.show = false; //半透线隐藏
                handlerPolyline.deactivate();
                setPlanePositions(res.positions, res.result.object._positions);
                tooltip.setVisible(false);
            },
            (err) => {
                console.log(err);
            }
        );
        window.handlerPolyline.activate();
    };

    // 垂直地面裁剪面设置
    function verticalGroundPlane(linePositions, carPos, width) {
        let point1 = linePositions.slice(0, 3);
        let point2 = linePositions.slice(3, 6);
        let point3 = point2.slice(0, 2).concat(point2[2] + width);
        let point4 = point1.slice(0, 2).concat(point1[2] + width);
        let catPoints = [].concat(carPos);
        catPoints.push(Cesium.Cartesian3.fromDegrees(point3[0], point3[1], point3[2]));
        catPoints.push(Cesium.Cartesian3.fromDegrees(point4[0], point4[1], point4[2]));
        return catPoints
    }

    // 平行地面的裁剪面
    function parallelGroundPlane(carPos, width) {
        let Vab = new Cesium.Cartesian3(0, 0, 0);
        let Vbc = new Cesium.Cartesian3(0, 0, 0);
        let py = new Cesium.Cartesian3(0, 0, 0);
        let point3 = new Cesium.Cartesian3(0, 0, 0);
        let point4 = new Cesium.Cartesian3(0, 0, 0);
        Cesium.Cartesian3.subtract(carPos[0], carPos[1], Vab);
        Cesium.Cartesian3.cross(Vab, carPos[0], Vbc);
        Cesium.Cartesian3.normalize(Vbc, Vbc);
        Cesium.Cartesian3.multiplyComponents(Vbc, new Cesium.Cartesian3(width, width, width), py)
        Cesium.Cartesian3.add(carPos[0], py, point4);
        Cesium.Cartesian3.add(carPos[1], py, point3);
        let catPoints = [carPos[0], carPos[1], point3, point4];
        return catPoints
    }


    function setPlanePositions(linePositions, carPos) {
        let cartPositions;
        let width = Cesium.Cartesian3.distance(carPos[0], carPos[1]);
        width = Cesium.defaultValue(width, 100);
        if (state.planeDirection === 'vertical') cartPositions = verticalGroundPlane(linePositions, carPos, width);
        else cartPositions = parallelGroundPlane(carPos, width);
        let centerP = Cesium.BoundingSphere.fromPoints(cartPositions).center;
        planePositionObj = {
            cartPositions: cartPositions,
            centerPositions: centerP
        }
        addsurface()
        clipPlaneUpdate()
    }

    let planeSurface;
    function addsurface() {
        planeSurface = viewer.entities.add({
            id: "clip-plane",
            polygon: {
                hierarchy: new Cesium.CallbackProperty(() => {
                    return {
                        positions: planePositionObj.cartPositions,
                        holes: []
                    }
                }, false),
                material: Cesium.Color.GOLD.withAlpha(0.2),
                outline:true,
                outlineColor:Cesium.Color.GOLD,
                perPositionHeight: true,
            },
        });
        addModel()
    }

    function addModel() {
        let getAngleAndRadian = tool.getAngleAndRadian(planePositionObj.cartPositions[0], planePositionObj.cartPositions[1]);
        let heading = getAngleAndRadian.radian;
        let id = "clip-model";
        s3mInstanceColc.add(modelUrl, {
            id: id,
            position: planePositionObj.centerPositions,
            hpr: new Cesium.HeadingPitchRoll(heading, 0, 0),
            // color:Cesium.Color.RED,
            scale: new Cesium.Cartesian3(0.1, 0.1, 0.1),
        });
        editEntity = s3mInstanceColc.getInstance(modelUrl, id);
        if (!modelEditor) addModelEditor(editEntity);
        else {
            modelEditor.setEditObject(editEntity);
            modelEditor.activate();
        }
    }

    function addModelEditor(model) {
        modelEditor = new Cesium.ModelEditor({
            model: model,
            scene: viewer.scene,
            axesShow: {
                "translation": true,
                "rotation": false,
                "scale": false
            }
        });
        modelEditor.activate();
        modelEditor.changedEvt.addEventListener((param) => {
            let Cartesian3 = new Cesium.Cartesian3();
            Cesium.Matrix4.getTranslation(param.modelMatrix, Cartesian3);
            if (Cartesian3) {
                let subx = Cartesian3.x - planePositionObj.centerPositions.x;
                let suby = Cartesian3.y - planePositionObj.centerPositions.y;
                let subz = Cartesian3.z - planePositionObj.centerPositions.z;
                for (let i = 0; i < 4; i++) {
                    planePositionObj.cartPositions[i].x += subx;
                    planePositionObj.cartPositions[i].y += suby;
                    planePositionObj.cartPositions[i].z += subz;
                }
                planePositionObj.centerPositions = Cartesian3;
                clipPlaneUpdate()
            }
        })
    }


    // 更新
    function clipPlaneUpdate() {
        if (!planePositionObj.cartPositions) return
        for (let layer of layers) {
            // layer.clearCustomClipBox();
            layer.setCustomClipPlane(
                planePositionObj.cartPositions[0],
                planePositionObj.cartPositions[1],
                planePositionObj.cartPositions[2]
            );
        }
    };

    // 清除
    function clearClipPlane() {
        tooltip.setVisible(false);
        if(planeSurface){
            viewer.entities.remove(planeSurface);
            modelEditor.deactivate();
            s3mInstanceColc.removeCollection(modelUrl);
            planeSurface = null;
            planePositionObj = null;
        }
        if (!window.handlerPolyline) return;
        clearHandlerDrawing("Polyline");
        for (let layer of layers) {
            layer.clearCustomClipBox();
        }
    };

    // 监听

    watch(() => state.clipMode, val => {
        if (planePositionObj) {
            let pos = [...planePositionObj.cartPositions]
            let newPos = [pos[1],pos[0],pos[3],pos[2]];
            planePositionObj.cartPositions = newPos;
            clipPlaneUpdate()
        }
    });


    // 销毁
    onBeforeUnmount(() => {
        layers = undefined;
        if (modelEditor) modelEditor.destroy();
    })

    return {
        ...toRefs(state),
        clipPlaneStart,
        clearClipPlane,
    };
};

export default clipPlane

