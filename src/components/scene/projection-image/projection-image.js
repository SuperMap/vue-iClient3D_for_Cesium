
// 引入依赖
import { watch, ref, reactive, toRefs, onBeforeUnmount, onMounted, onUpdated } from "vue";
import { storeState } from '../../../js/store/store.js'   //简单局部状态管理
import tool from '../../../js/tool/tool.js'        //提示等工具
import resource from '../../../js/local/lang.js'  //语言资源
import { initHandler, handlerDrawing, clearHandlerDrawing } from "../../../js/common/drawHandler.js"    //公共handler.js
import createTooltip from '../../../js/tool/tooltip2.js'

function projectionImage(props) {
    // 设置默认值数据
    let state = reactive({
        viewlongitude: "",
        viewlatitude: "",
        viewheight: "",
        direction: "",
        pitch: "",
        horizontal: 20,
        vertical: 10,
        distance: 200,
        hintLineColor: "rgba(251,250,248,1)",
        clipMode: "clip-inside",
        visibleLine: true,
        fileText: "",
        fromInfo: null,
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
    let layers, scene;
    let currentProject;
    let vedioFile_dom = ref(null)
    let modelIdProjectPairs = new Map(); // 模型id和视频投放对象对象的键值对
    let s3mInstanceColc, modelEditor;
    let modelUrl = 'public/data/s3m/projector.s3m';
    let isActive = false;
    let currentSelectedSymbol = null;
    let reader = new FileReader();
    let currntVideoDom, isClip = false;
    if (storeState.isViewer) {
        if (!window.tooltip) {
            window.tooltip = createTooltip(viewer._element);
        }
        scene = viewer.scene;
        layers = viewer.scene.layers.layerQueue;
        s3mInstanceColc = new Cesium.S3MInstanceCollection(scene._context);
        viewer.scene.primitives.add(s3mInstanceColc);
        viewer.eventManager.addEventListener("CLICK", click_set_target, true);
    }
    //viewer 初始化完成的监听
    watch(() => storeState.isViewer, val => {
        if (val) {
            if (!window.tooltip) {
                window.tooltip = createTooltip(viewer._element);
            }
            scene = viewer.scene;
            layers = viewer.scene.layers.layerQueue;
            s3mInstanceColc = new Cesium.S3MInstanceCollection(scene._context);
            viewer.scene.primitives.add(s3mInstanceColc);
        }
    });

    //监听图层加载完成
    watch(() => storeState.changeLayers, val => {
        for (let i = 0; i < layers.length; i++) {
            layers[i].selectEnabled = false;
        }
    });
    onMounted(() => {
        fileChange();
        currntVideoDom = document.getElementById("trailer-0");
    })

    // 点击选择文件函数
    function chooseFile() {
        vedioFile_dom.value.click();
    }

    //文件夹改变文件触发
    function fileChange() {
        vedioFile_dom.value.addEventListener("change", evt => {
            let file = evt.target.files[0];
            if (!file) return;
            state.fileText = vedioFile_dom.value.value;
            const aBlob = new Blob([file], { type: 'video/mp4' })
            reader.readAsDataURL(aBlob)
            reader.onload = function (e) {
                let vedio = e.target.result;
                let index = document.querySelectorAll('#videoContain>video').length;
                creatVideo_dom(vedio, index).then((res) => {
                    currntVideoDom = document.getElementById("trailer-" + index)
                });
            };
        });
    }

    function creatVideo_dom(src, index) {
        return new Promise((resolve, reject) => {
            let videoContain = document.getElementById("videoContain");
            let video = document.createElement("video");
            let source = document.createElement("source");
            source.src = src;
            video.appendChild(source);
            video.id = "trailer-" + index;
            video.classList.add("videoBox");
            video.setAttribute("autoplay", "autoplay");
            video.setAttribute("loop", "loop");
            video.setAttribute("crossorigin", "crossorigin");
            video.setAttribute("controls", "controls");
            video.setAttribute("muted", "muted");
            videoContain.appendChild(video);
            setTimeout(() => {
                resolve(video);
            }, 500);
        });
    };


    function startProjection() {
        viewer.enableCursorStyle = false;
        viewer._element.style.cursor = "";
        document.body.classList.add("measureCur");
        let viewPosition = viewer.scene.camera.position;
        currntVideoDom.play();
        currentProject = new Cesium.ProjectionImage(scene);
        currentProject.setImage({ video: currntVideoDom });
        currentProject.distance = Number(state.distance);
        currentProject.horizontalFov = Number(state.horizontal);
        currentProject.verticalFov = Number(state.vertical);
        currentProject.viewPosition = tool.CartesiantoDegrees(viewPosition);
        currentProject.build();
        isActive = true;
        window.tooltip.showAt(' <p>选中投放模型进行编辑和清除</p>', '400px');
        viewer.eventManager.addEventListener("MOUSE_MOVE", move_set_target);
        viewer.eventManager.addEventListener("CLICK", click_set_target, true);

    }

    function click_set_target(e) {
        if (isClip) return;
        if (isActive) {
            viewer.enableCursorStyle = true;
            document.body.classList.remove("measureCur");
            let Cartesian3 = Cesium.Cartesian3.fromDegrees(currentProject.viewPosition[0], currentProject.viewPosition[1], currentProject.viewPosition[2]);
            let viewPosition = JSON.parse(JSON.stringify(Cartesian3));
            viewer.eventManager.removeEventListener("MOUSE_MOVE", move_set_target);
            addModel(viewPosition);
            isActive = false;
            return;
        }
        let symbol = viewer.scene.pick(e.message.position) || viewer.selectedEntity;
        if (symbol && symbol.id && typeof (symbol.id) === 'string' && symbol.id.indexOf("projector-") != -1) {
            // if (currentSelectedSymbol && currentSelectedSymbol.id === symbol.id) return;
            if (modelEditor) modelEditor.destroy();
            currentSelectedSymbol = symbol;
            currentProject = modelIdProjectPairs.get(symbol.id);
            if (currentProject) {
                state.horizontal = currentProject.horizontalFov;
                state.vertical = currentProject.verticalFov;
                state.distance = currentProject.distance;
            }
            // modelEditor = new Cesium.ModelEditor({
            //     model: symbol.primitive,
            //     scene: viewer.scene,
            //     // offset: new Cesium.Cartesian3(0, 0, 2)
            // });
            // modelEditor.activate();
            // console.log(modelEditor)
            return;
        }
        // if (modelEditor) modelEditor.destroy();
        // modelEditor = null;
        currentSelectedSymbol = null;
        currentProject = null;
    }

    function move_set_target(e) {
        let distance = 0;
        let viewPosition = viewer.scene.camera.position;
        let targetPosition = scene.pickPosition(e.message.endPosition);
        if (targetPosition)
            distance = Cesium.Cartesian3.distance(viewPosition, targetPosition);
        if (distance > 0 && distance < 1000)
            currentProject.setDistDirByPoint(tool.CartesiantoDegrees(targetPosition));
    }

    function addModel(position, position2) {
        let id = 'projector-' + new Date().getTime();
        let direction = currentProject.direction;
        let pitch = currentProject.pitch;
        let radians = Cesium.Math.toRadians(direction);
        let heading = radians >= Cesium.Math.PI ? radians - Cesium.Math.PI : radians + Cesium.Math.PI;
        let pitch2 = -Cesium.Math.toRadians(pitch)
        s3mInstanceColc.add(modelUrl, {
            id: id,
            position: position,
            hpr: {
                heading: heading,
                pitch: 0,
                roll: pitch2,
            },
            // scale: new Cesium.Cartesian3(2, 2, 2),
            // offset: new Cesium.Cartesian3(0, 0, 0.1)
        });
        currentSelectedSymbol = s3mInstanceColc.getInstance(modelUrl, id);
        modelIdProjectPairs.set(id, currentProject);
    }

    // 裁剪
    function clipProjectImg() {
        isClip = true;
        tooltip.setVisible(false);
        window.tooltip.showAt(' <p>点击鼠标左键绘制裁剪区域</p><p>点击鼠标右键结束绘制</p><p>注：只能裁剪当前选中投放对象</p>', '400px');
        if (!window.handlerPolygon) {
            initHandler("Polygon");
        }
        handlerDrawing("Polygon").then(
            res => {
                isClip = false;
                let handlerPolygon = window.handlerPolygon;
                updateClipImg(res.positions)
                handlerPolygon.polygon.show = false;
                handlerPolygon.polyline.show = false;
                window.polylineTransparent.show = false; //半透线隐藏
                handlerPolygon.deactivate();
            },
            err => {
                console.log(err);
            }
        );
        window.handlerPolygon.activate();
    }

    function updateClipImg(position) {
        if (!currentProject) return;
        currentProject.addClipRegion({
            name: "clip-Projector" + new Date().getTime(),
            position: position,
        });
    }

    function clear() {
        viewer.eventManager.removeEventListener("MOUSE_MOVE", move_set_target);
        if (currentSelectedSymbol) {
            modelIdProjectPairs.delete(currentSelectedSymbol.id);
            s3mInstanceColc.removeInstance(modelUrl, currentSelectedSymbol.id);
            currentSelectedSymbol = null;
        }
        if (currentProject) {
            currentProject.removeAllClipRegion()
            currentProject.destroy();}
        if (modelIdProjectPairs.size === 0)
            viewer.eventManager.removeEventListener("CLICK", click_set_target);
        if (modelEditor) modelEditor.destroy();
        modelEditor = null;
        currentProject = null;
        window.tooltip.setVisible(false);
        clearHandlerDrawing();
        viewer.enableCursorStyle = true;
        document.body.classList.remove("measureCur");
    }


    watch(() => state.fileText, val => {
        if (val.indexOf("http") === -1) return;
        let index = document.querySelectorAll('#videoContain>video').length;
        creatVideo_dom(val, index).then((res) => {
            currntVideoDom = document.getElementById("trailer-" + index)
        });
    })
    watch(() => state.horizontal, val => {
        if (val == "" || !currentProject) return;
        currentProject.horizontalFov = Number(val);
    })
    watch(() => state.vertical, val => {
        if (val == "" || !currentProject) return;
        currentProject.verticalFov = Number(val);
    })
    watch(() => state.distance, val => {
        if (val == "" || !currentProject) return;
        currentProject.distance = Number(val);
    })

    watch(() => state.visibleLine, val => {
        if (!currentProject) return;
        // currentProject.hintLineVisible = val;
        s3mInstanceColc.visible = val; //隐藏所有模型
        modelIdProjectPairs.forEach((projector) => { //隐藏所有投放线
            projector.hintLineVisible = val
        })
    })
    watch(() => state.hintLineColor, val => {
        if (!currentProject) return;
        currentProject.hintLineColor = Cesium.Color.fromCssColorString(val);
    })
    watch(() => state.clipMode, val => {
        if (!currentProject) return;
        let clipMode =
            val === "clip-outside"
                ? Cesium.ModifyRegionMode.CLIP_INSIDE
                : Cesium.ModifyRegionMode.CLIP_OUTSIDE;
        currentProject.setClipMode(clipMode);
    })

    watch(() => state.viewlongitude, val => {
        if (!currentProject || val == "") return;
        currentProject.viewPosition[0] = val;
    })
    watch(() => state.viewlatitude, val => {
        if (!currentProject || val == "") return;
        currentProject.viewPosition[1] = val;
    })
    watch(() => state.viewheight, val => {
        if (!currentProject || val == "") return;
        currentProject.viewPosition[2] = val;
    })
    watch(() => state.direction, val => {
        if (!currentProject || val == "") return;
        currentProject.direction = Number(val);
    })
    watch(() => state.pitch, val => {
        if (!currentProject || val == "") return;
        currentProject.pitch = Number(val);
    });
    watch(() => state.fromInfo, val => {
        if (!val || val == "") return;
        Cesium.ProjectionImage.fromInfo(scene, state.fromInfo.infoUrl, state.fromInfo.baseUrl)
    })

    // 销毁
    onBeforeUnmount(() => {
        for (let i = 0; i < layers.length; i++) {
            layers[i].selectEnabled = true;
        }
    });


    return {
        ...toRefs(state),
        chooseFile,
        vedioFile_dom,
        startProjection,
        clear,
        clipProjectImg
    };
};

export default projectionImage

