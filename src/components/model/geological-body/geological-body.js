
// 引入依赖
import { watch, ref, reactive, toRefs, onBeforeUnmount, onMounted, onUpdated } from "vue";
import { storeState } from '../../../js/store/store.js'   //简单局部状态管理
import tool from '../../../js/tool/tool.js'        //提示等工具
import resource from '../../../js/local/lang.js'  //语言资源
import { initHandler, handlerDrawing, clearHandlerDrawing } from "../../../js/common/drawHandler.js"    //公共handler.js
import createTooltip from '../../../js/tool/tooltip2.js'
// import models from './models.js'


function scanEffect(props) {
    // 设置默认值数据
    let state = reactive({
        operationType: 'stretch_cut',  //操作类型
        stretchHeight: 1,  //拉伸高度
        modelUrls: null,  //模型配置
        digHeight: 500,
        drillRadius: 400,
        drillHeight: 2000,
        clipType: 'drawClip',
        drawClipTMode: 'KeepInside',
    });
    state.modelUrls = [
        {
            id: 1,
            model: "http://www.supermapol.com/realspace/services/data-dizhiti/rest/data/datasources/%E5%9C%B0%E8%B4%A8%E4%BD%93/datasets/Layer1/features/1.stream",
            color: new Cesium.Color(179 / 255, 179 / 255, 179 / 255, 1)
        },
        {
            id: 2,
            model:  "http://www.supermapol.com/realspace/services/data-dizhiti/rest/data/datasources/%E5%9C%B0%E8%B4%A8%E4%BD%93/datasets/Layer2/features/1.stream",
            color: new Cesium.Color(94 / 255, 179 / 255, 59 / 255, 1)
        },
        {
            id: 3,
            model: "http://www.supermapol.com/realspace/services/data-dizhiti/rest/data/datasources/%E5%9C%B0%E8%B4%A8%E4%BD%93/datasets/Layer3/features/1.stream",
            color: new Cesium.Color(52 / 255, 94 / 255, 35 / 255, 1)
        },
        {
            id: 4,
            model: "http://www.supermapol.com/realspace/services/data-dizhiti/rest/data/datasources/%E5%9C%B0%E8%B4%A8%E4%BD%93/datasets/Layer4/features/1.stream",
            color: new Cesium.Color(115 / 255, 115 / 255, 115 / 255, 1)
        },
        {
            id: 5,
            model: "http://www.supermapol.com/realspace/services/data-dizhiti/rest/data/datasources/%E5%9C%B0%E8%B4%A8%E4%BD%93/datasets/Layer5/features/1.stream",
            color: new Cesium.Color(171 / 255, 85 / 255, 66 / 255, 1)
        },
        {
            id: 6,
            model:  "http://www.supermapol.com/realspace/services/data-dizhiti/rest/data/datasources/%E5%9C%B0%E8%B4%A8%E4%BD%93/datasets/Layer6/features/1.stream",
            color: new Cesium.Color(68 / 255, 68 / 255, 68 / 255, 1)
        }
    ];

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
    let scene, solidModelsProfile, entitie_ids = [];  //剖切
    let drillConeCounts = 0, drillPoints = [];  //钻孔
    let editorBox, geoBox;  //裁剪

    if (storeState.isViewer) {
        if (!window.tooltip) {
            window.tooltip = createTooltip(viewer._element);
        }
        init()
    }
    //viewer 初始化完成的监听
    watch(() => storeState.isViewer, val => {
        if (val) {
            if (!window.tooltip) {
                window.tooltip = createTooltip(viewer._element);
            }
            init()
        }
    });

    function init() {
        scene = viewer.scene;
        scene.logarithmicDepthBuffer = true;
        scene.camera.frustum.near = 0.1;
        scene.globe.show = false;
        viewer.scene.skyAtmosphere.show = false;
        solidModelsProfile = new Cesium.SolidModelsProfile(scene);
        solidModelsProfile.addModels(state.modelUrls);
        console.log(solidModelsProfile)
        solidModelsProfile.addedEvent.addEventListener((param)=>{
            console.log(solidModelsProfile._s3mInstanceCollection.getInstance(state.modelUrls[2].model,3))
        })
          viewer.scene.camera.setView({
            destination: new Cesium.Cartesian3(-2167835.4408299956, 4423497.534529096, 4095839.2845661934),
            orientation: {
                heading: 4.029329438295484,
                pitch: -0.23796647219353817,
                roll: 8.994289757424667e-10
            }
        });
    };

    // 拉伸剖切
    function drawLine() {
        if (!window.handlerPolyline) {
            initHandler("Polyline");
        }
        window.tooltip.showAt(' <p>点击鼠标左键开始绘制</p><p>鼠标右键结束绘制</p><p>可以绘制多条线段</p>', '350px');
        handlerDrawing("Polyline").then(
            res => {
                addCutLine(res.result.object.positions)
                let handlerPolyline = window.handlerPolyline;
                handlerPolyline.polyline.show = false;
                // window.polylineTransparent.show = false; //半透线隐藏
                handlerPolyline.deactivate();
                tooltip.setVisible(false);

                let id = 'geologicalbody_cutline-' + new Date().getTime()
                entitie_ids.push(id);
                viewer.entities.add({
                    id: id,
                    polyline: {
                        positions: res.result.object.positions,
                        width: 2,
                        material: Cesium.Color.fromCssColorString('#51ff00'),
                        // clampToGround: true, //线贴地
                        // classificationType: Cesium.ClassificationType.S3M_TILE, //线面贴对象
                    },
                });
            },
            (err) => {
                console.log(err);
            }
        );
        window.handlerPolyline.activate();

    }
    function addCutLine(positions) {
        let pointArray = [];
        if (positions.length < 2) return;
        for (let i = 0; i < positions.length - 1; i++) {
            pointArray.length = 0;
            pointArray.push(positions[i]);
            pointArray.push(positions[i + 1]);
            solidModelsProfile.addProfileGeometry(pointArray);
        }
    }
    function startCut() {
        tooltip.setVisible(false);
        clearHandlerDrawing('Polyline');
        if (entitie_ids.length === 0) {
            window.tooltip.showAt(' <p>请先绘制剖切的线段</p>', '350px');
            return;
        }
        solidModelsProfile.build();
    }
    function clearCut() {
        tooltip.setVisible(false);
        solidModelsProfile.clearProfile();
        clearHandlerDrawing('Polyline');
        entitie_ids.forEach((id) => { viewer.entities.removeById(id); })
        entitie_ids.length = 0;
    }


    //开挖

    function addProfileGeometry(positions) {
        let point3ds = new Cesium.Point3Ds();
        let points = tool.CartesiantoDegreesObjs(positions);
        points.forEach((point) => {
            let point3d = new Cesium.Point3D(point.longitude, point.latitude, point.height + 1000);
            point3ds.add(point3d);
        })
        let geometry = new Cesium.GeoRegion3D([point3ds]);
        if (state.operationType === 'dig') {
            solidModelsProfile.clippingType = Cesium.ClippingType.KeepOutside;
            geometry.extrudedHeight = -Number(state.digHeight);
            //封底
            let geometry2 = new Cesium.GeoRegion3D([point3ds]);
            geometry2.isLatLon = false;
            geometry2.bottomAltitude = geometry.extrudedHeight;
            solidModelsProfile.addProfileGeometry(geometry2);
        } else {
            // solidModelsProfile.clippingType = Cesium.ClippingType.KeepOutside;
            geometry.extrudedHeight = -7000;
        }
        geometry.isLatLon = false;
        solidModelsProfile.setClipGeometry(geometry);
        //封边
        for (let i = 0; i < positions.length; i++) {
            let singleA = [];
            singleA.push(positions[i]);
            if (i == positions.length - 1) {
                singleA.push(positions[0]);
            } else {
                singleA.push(positions[i + 1]);
            }
            solidModelsProfile.addProfileGeometry(singleA);
            solidModelsProfile.build();
        }
    }

    function drawPolygon() {
        if (!window.handlerPolygon) {
            initHandler("Polygon");
        }
        handlerDrawing("Polygon", false).then(
            res => {
                let handlerPolygon = window.handlerPolygon;
                addProfileGeometry(res.result.object.positions);
                handlerPolygon.polygon.show = false;
                handlerPolygon.polyline.show = false;
                handlerPolygon.deactivate();
            },
            err => {
                console.log(err);
            }
        );
        window.handlerPolygon.activate();
    };

    function startDig() {
        clearDig();
        drawPolygon()
    }

    function clearDig() {
        tooltip.setVisible(false);
        solidModelsProfile.clearProfile();
        clearHandlerDrawing();
    }

    //钻孔
    function startDrilling() {
        clearDrilling();
        viewer.enableCursorStyle = false;
        viewer._element.style.cursor = "";
        document.body.classList.add("measureCur");
        window.tooltip.showAt(' <p>点击鼠标左键确认钻孔位置</p><p>鼠标右键结束绘制并执行钻孔</p>', '350px');
        console.log(1)
        viewer.eventManager.addEventListener("CLICK", click_point, true);
        viewer.eventManager.addEventListener("RIGHT_CLICK", click_right, true);
    };

    function click_point(e) {
        let position = viewer.scene.pickPosition(e.message.position);
        addDrillCone(position);
        drillPoints.push(position)
    }

    function click_right(e) {
        window.tooltip.setVisible(false);
        document.body.classList.remove("measureCur");
        let points = tool.CartesiantoDegreesObjs(drillPoints);
        points.forEach((point) => {
            let geoCylinder = new Cesium.GeoCylinder(Number(state.drillRadius), Number(state.drillRadius), Number(state.drillHeight));
            let height = Number(state.drillHeight)/2;
            geoCylinder.geoPosition = new Cesium.Point3D(point.longitude, point.latitude, point.height-height);
            solidModelsProfile.addProfileGeometry(geoCylinder);
        })
        for (let i = 1; i <= drillConeCounts; i++) {
            viewer.entities.removeById('Drill_Point-' + i);
        }
        solidModelsProfile.build();
        viewer.eventManager.removeEventListener("CLICK", click_point);
        viewer.eventManager.removeEventListener("RIGHT_CLICK", click_right);
    }

    function clearDrilling() {
        tooltip.setVisible(false);
        solidModelsProfile.clearProfile();
        document.body.classList.remove("measureCur");
        for (let i = 1; i <= drillConeCounts; i++) {
            viewer.entities.removeById('Drill_Point-' + i);
        }
        viewer.eventManager.removeEventListener("CLICK", click_point);
        viewer.eventManager.removeEventListener("RIGHT_CLICK", click_right);
        drillConeCounts = 0;
        drillPoints.length = 0;
    }
    // 绘制转空点
    function addDrillCone(position) {
        drillConeCounts++;
        viewer.entities.add({
            id: 'Drill_Point-' + drillConeCounts,
            position: position,
            cylinder: {
                length: 100,
                topRadius: Number(state.drillRadius),
                bottomRadius: Number(state.drillRadius),
                material: Cesium.Color.fromCssColorString("#d60000"),
            }
        });
    }

    //裁剪
    function startClip() {
        clearClip();
        solidModelsProfile.clippingType = Cesium.ClippingType[state.drawClipTMode];
        if (state.clipType === 'drawClip') {
            drawPolygon()
            return;
        }
        BoxClipByEitor()
    }

    function clearClip() {
        clearDig();
        clearHandlerDrawing('Box');
        if (editorBox) {
            editorBox.deactivate();
            editorBox.destroy()
            editorBox = null;
        }
    }

    //box裁剪

    function BoxClipByEitor() {
        if (editorBox) {
            editorBox.deactivate();
        }
        tooltip.showAt(' <p>点击鼠标左键开始绘制box底面</p><p>然后移动鼠标绘制box高度</p><p>点击鼠标右键结束绘制</p>', '350px');
        if (!window.handlerBox) {
            initHandler("Box");
        }
        handlerDrawing("Box", false).then(
            res => {
                let handlerBox = window.handlerBox;
                updateClipBox(res.result.object);
                handlerBox.deactivate();
            },
            err => {
                console.log(err);
            }
        );
        window.handlerBox.activate();
    };

    function updateClipBox(object) {
        object.show = false;
        //绘制的盒子裁剪模型
        let newDim = object.box.dimensions.getValue();
        let position = Cesium.Cartographic.fromCartesian(object.position.getValue(0));
        geoBox = new Cesium.GeoBox(newDim.x, newDim.y, newDim.z);
        geoBox.geoPosition = new Cesium.Point3D(Cesium.Math.toDegrees(position.longitude),
            Cesium.Math.toDegrees(position.latitude), position.height);
        solidModelsProfile.addProfileGeometry(geoBox);
        solidModelsProfile.build();
        // 编辑盒子
        if(!editorBox){
            editorBox = new Cesium.BoxEditor(viewer, object);
            editorBox.color = Cesium.Color.WHITE.withAlpha(0.0);//设置盒子透明
            editorBox.hoverColor = Cesium.Color.BLUE;//设置编辑轴的选中色
            let editBoxEvt = function (e) {
                let newDim = e.dimensions;
                geoBox.geoWidth = newDim.y;
                geoBox.geoHeight = newDim.z;
                geoBox.geoLength = newDim.x;
                let position = tool.CartesiantoDegrees(e.position);
                geoBox.geoPosition = new Cesium.Point3D(position[0],position[1],position[2]);
                geoBox.geoRotationZ = editorBox.hpr.heading  * (180 / Cesium.Math.PI);
            };
            editorBox.editEvt.addEventListener(editBoxEvt);
        }else{
            editorBox.setEditObject(object) //
        }
        editorBox.activate();
    }


    //叠加体元



    function clearAll() {
        clearCut();
        clearClip();
        clearDrilling()
    }

    // 监听
    watch(() => state.modelUrls, val => {
        solidModelsProfile.addModels(val);
    });
    watch(() => state.stretchHeight, val => {
        if (!state.modelUrls || state.modelUrls.length == 0) return;
        for (let model of state.modelUrls) {
            let url = model.model;
            let instance = solidModelsProfile._s3mInstanceCollection._group[url].instances._array[0];
            instance.updateScale(new Cesium.Cartesian3(1, 1, Number(val)));
        }
    });
    watch(() => state.operationType, val => {
        clearAll();
    });
    watch(() => state.drawClipTMode, val => {
        solidModelsProfile.clippingType = Cesium.ClippingType[val];
    });
    watch(() => state.clipType, val => {
        clearClip()
    });
    // 销毁
    onBeforeUnmount(() => {
        solidModelsProfile.clear()
        viewer.scene.globe.show = true;
        viewer.scene.skyAtmosphere.show = true;
        clearAll();
        scene = null;
        solidModelsProfile = null;
        geoBox= null;
    });


    return {
        ...toRefs(state),
        drawLine,
        startCut,
        clearCut,
        startDig,
        clearDig,
        startDrilling,
        clearDrilling,
        startClip,
        clearClip,
    };
};

export default scanEffect

