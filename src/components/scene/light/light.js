
// 引入依赖
import { watch, ref, reactive, toRefs, onBeforeUnmount, onMounted } from "vue";
import { storeState } from '../../../js/store/store.js'   //简单局部状态管理
import tool from '../../../js/tool/tool.js'        //提示等工具
import resource from '../../../js/local/lang.js'  //语言资源
import { initHandler, handlerDrawing, clearHandlerDrawing } from "../../../js/common/drawHandler.js"    //公共handler.js
import createTooltip from '../../../js/tool/tooltip2.js'
import config from "./config.js";

function addPointSymbol(props) {
    // 设置默认值数据
    let state = reactive({
        lightSelectId: 0,
        lightColor: "#FFFFFF",
        cutoffDistance: 200,
        lightDecay: 5,
        lightIntensity: 5,
        spotLightAngle: 30,
        visibleModel: true,
        dockFontShow: true, //停靠图标显示
        modelPosition: [0, 0, 0],
        modelLongitude: '',
        modelLatitude: '',
        modelHeight: '',
        bubbleShow: false,
        visiblePositions:false,
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
    let currentSelectedEntity, selectdeLightSource, s3mInstanceColc;
    let isAddPointLight = false;
    let entityLightPairs = new Map(); // Entity和点光源对象的键值对
    let modelUrl = 'public/data/s3m/light.s3m';
    let modelEditor;
    const bubble = ref(null);

    if (storeState.isViewer) {
        if (!window.tooltip) {
            window.tooltip = createTooltip(viewer._element);
        }
        s3mInstanceColc = new Cesium.S3MInstanceCollection(scene._context);
        viewer.scene.primitives.add(s3mInstanceColc);

    }
    //viewer 初始化完成的监听
    watch(() => storeState.isViewer, val => {
        if (val) {
            if (!window.tooltip) {
                window.tooltip = createTooltip(viewer._element);
            }
            s3mInstanceColc = new Cesium.S3MInstanceCollection(scene._context);
            viewer.scene.primitives.add(s3mInstanceColc);
        }
    });

    function addModel(position, pointLight) {
        let id = "light-model-" + new Date().getTime();
        s3mInstanceColc.add(modelUrl, {
            id: id,
            position: position,
            scale: new Cesium.Cartesian3(2, 2, 2),
        });
        currentSelectedEntity = s3mInstanceColc.getInstance(modelUrl, id);
        entityLightPairs.set(id, pointLight);
    }

    function getTooltipText() {
        if (state.lightSelectId === 0) {
            return '<p>点击确认点光源位置</p><p>选中光源模型可编辑与删除</p>'
        }
        return '<p>点击第一点确认光源位置</p><p>第二点确认光源方向</p><p>选中光源模型可编辑与删除</p>'
    }

    let isModelMoving = false;
    function addModelEditor(model) {
        modelEditor = new Cesium.ModelEditor({
            model: model,
            scene: viewer.scene,
            axesShow: {
                "translation": true,
                "rotation": false,
                "scale": true
            }
        });
        modelEditor.activate();
        modelEditor.changedEvt.addEventListener((param) => {
            let Cartesian3 = new Cesium.Cartesian3();
            Cesium.Matrix4.getTranslation(param.modelMatrix, Cartesian3);
            if (Cartesian3) {
                selectdeLightSource.position = Cartesian3;
                isModelMoving = true;
                changeSlider(() => isModelMoving = false)
                let position= tool.CartesiantoDegrees(Cartesian3);
                state.modelPosition.length = 0;
                state.modelPosition.push(...[position[0].toFixed(6),position[1].toFixed(6),position[2].toFixed(2)])
            }
        })
    }

    function drawPolyline() {
        if (!window.handlerPolyline) {
            initHandler("Polyline");
        }
        handlerDrawing("Polyline").then(
            res => {
                if (state.lightSelectId === 1) {
                    addSpotLight(res.result.object.positions)
                } else {
                    addDirectionalLight(res.result.object.positions)
                }
                let handlerPolyline = window.handlerPolyline;
                handlerPolyline.polyline.show = false;
                window.polylineTransparent.show = false; //半透线隐藏
                handlerPolyline.deactivate();
                tooltip.setVisible(false);
            },
            (err) => {
                console.log(err);
            }
        );
        window.handlerPolyline.activate();
    }

    function addLight() {
        let test = getTooltipText()
        window.tooltip.showAt(test, '400px');
        viewer.eventManager.addEventListener("CLICK", click_light, true);
        if (state.lightSelectId === 0) {
            viewer.enableCursorStyle = false;
            viewer._element.style.cursor = "";
            document.body.classList.add("measureCur");
            isAddPointLight = true;
            return;
        }
        drawPolyline();
    }

    function click_light(e) {
        if (isAddPointLight) {
            isAddPointLight = false;
            viewer.enableCursorStyle = true;
            document.body.classList.remove("measureCur");
            let targetPosition = scene.pickPosition(e.message.position);
            addPointLight(targetPosition);
            tooltip.setVisible(false);
        } else {
            let symbol = viewer.scene.pick(e.message.position) || viewer.selectedEntity;
            if (symbol && symbol.id && typeof (symbol.id) === 'string' && symbol.id.indexOf("light-model-") != -1) {
                if (currentSelectedEntity && currentSelectedEntity.id === symbol.id.id) return;
                currentSelectedEntity = symbol;
                selectdeLightSource = entityLightPairs.get(symbol.id);
                if (!modelEditor) addModelEditor(symbol.primitive)
                else modelEditor.setEditObject(symbol.primitive);
                //
                bubble.value.style.top = (e.message.position.y - 160) + 'px';
                bubble.value.style.left = (e.message.position.x) + 'px';
                console.log(modelEditor)
                let position = tool.CartesiantoDegrees(modelEditor._position);
                state.modelPosition.length = 0;
                state.modelPosition.push(...[position[0].toFixed(6),position[1].toFixed(6),position[2].toFixed(2)]);
                state.bubbleShow = true;
                return;
            }
            currentSelectedEntity = undefined;
            selectdeLightSource = undefined;
            if (modelEditor) modelEditor.deactivate();
            state.bubbleShow = false
        }
    }

    function addPointLight(position0) {
        let position = addModleHeight(position0);
        let options = {
            color: Cesium.Color.fromCssColorString(state.lightColor),
            cutoffDistance: Number(state.cutoffDistance),
            decay: Number(state.lightDecay),
            intensity: Number(state.lightIntensity),
        };
        let pointLight = new Cesium.PointLight(position, options);
        selectdeLightSource = pointLight;
        viewer.scene.addLightSource(pointLight);
        addModel(position, pointLight)
    }

    function addSpotLight(positions) {
        let position1 = addModleHeight(positions[0]);
        let position2 = positions[1];
        let options = {
            color: Cesium.Color.fromCssColorString(state.lightColor),
            distance: Number(state.cutoffDistance),
            decay: Number(state.lightDecay),
            intensity: Number(state.lightIntensity),
            angle: Cesium.Math.toRadians(Number(state.spotLightAngle))
        };
        let spotLight = new Cesium.SpotLight(
            position1,
            position2,
            options
        );
        selectdeLightSource = spotLight;
        viewer.scene.addLightSource(spotLight);
        addModel(position1, spotLight)
    }

    function addDirectionalLight(positions) {
        let position1 = addModleHeight(positions[0]);
        let position2 = positions[1];
        let options = {
            targetPosition: position2,
            color: Cesium.Color.fromCssColorString(state.lightColor),
            intensity: Number(state.lightIntensity),
        };
        let directionalLight = new Cesium.DirectionalLight(
            position1,
            options
        );
        selectdeLightSource = directionalLight;
        viewer.scene.addLightSource(directionalLight);
        addModel(position1, directionalLight)
    }

    function addModleHeight(Cartesian3) {
        let Cartographic = Cesium.Cartographic.fromCartesian(Cartesian3);
        Cartographic.height += 0.5;
        return Cesium.Cartographic.toCartesian(Cartographic)
    }

    function clearLight() {
        if (currentSelectedEntity) {
            entityLightPairs.delete(currentSelectedEntity.id);
            s3mInstanceColc.removeInstance(modelUrl, currentSelectedEntity.id);
            currentSelectedEntity = null;
        }
        if (selectdeLightSource) viewer.scene.removeLightSource(selectdeLightSource);
        if (entityLightPairs.size === 0) viewer.eventManager.removeEventListener("CLICK", click_light);
        if (modelEditor) modelEditor.deactivate();
        isAddPointLight = false;
        selectdeLightSource = null;
        clearHandlerDrawing();
        viewer.enableCursorStyle = true;
        document.body.classList.remove("measureCur");
        tooltip.setVisible(false);
        closeBubble();
    }

    //关闭气泡
    function closeBubble() {
        state.bubbleShow = false
    }
    //悬停气泡
    function dockBubble(val) {
        if (val) {
            bubble.value.classList.add('bubbleDock');
            state.dockFontShow = false
        } else {
            bubble.value.classList.remove('bubbleDock');
            state.dockFontShow = true
        }
    }

    watch(() => state.lightColor, val => {
        if (!selectdeLightSource) return;
        let color = Cesium.Color.fromCssColorString(val);
        selectdeLightSource.color = color;
    })
    watch(() => state.cutoffDistance, val => {
        if (!selectdeLightSource) return;
        if (selectdeLightSource.lightType === 1) {
            selectdeLightSource.cutoffDistance = Number(val);
            return;
        }
        if (selectdeLightSource.lightType === 2) {
            selectdeLightSource.distance = Number(val);
            return;
        }
    })
    watch(() => state.lightDecay, val => {
        if (!selectdeLightSource) return;
        if (selectdeLightSource.lightType !== 0) {
            selectdeLightSource.decay = Number(val);
        }
    })
    watch(() => state.lightIntensity, val => {
        if (!selectdeLightSource) return;
        selectdeLightSource.intensity = Number(val);
    })
    watch(() => state.spotLightAngle, val => {
        if (!selectdeLightSource) return;
        if (selectdeLightSource.lightType === 2) {
            selectdeLightSource.angle = Cesium.Math.toRadians(Number(val));
        }
    })
    watch(() => state.visibleModel, val => {
        if (!currentSelectedEntity) return;
        if (modelEditor) modelEditor.deactivate();
        s3mInstanceColc.visible = val
    })


    watch(() => state.modelPosition, val => {
        if (!currentSelectedEntity || isModelMoving) return;
        changeSlider(() => {
            let lon = Number(val[0]);
            let lat = Number(val[1]);
            let hei = Number(val[2]);
            let position = Cesium.Cartesian3.fromDegrees(lon, lat, hei);
            selectdeLightSource.position = position;
            currentSelectedEntity.primitive.updatePosition(position);
            if (modelEditor) modelEditor.setEditObject(currentSelectedEntity.primitive);
        })
    },
        {
            deep: true
        })

    let timer;
    // 防止滑块快速滑动的多次执行
    function changeSlider(callback) {
        if (timer) clearTimeout(timer);
        timer = setTimeout(function () {
            callback()
        }, 1000);

    }




    // 销毁
    onBeforeUnmount(() => {
        // if (viewer) viewer.eventManager.removeEventListener("CLICK", click_light);
    });


    return {
        ...toRefs(state),
        config,
        addLight,
        clearLight,

        bubble,
        closeBubble,
        dockBubble
    };
};

export default addPointSymbol

