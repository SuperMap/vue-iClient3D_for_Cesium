
// 引入依赖
import { watch, ref, reactive, toRefs, onBeforeUnmount, onMounted } from "vue";
import tool from '../../../js/tool/tool.js'        //提示等工具
import resource from '../../../js/local/lang.js'  //语言资源
import { storeState, storeDate } from '../../../js/store/store.js'   //简单局部状态管理
import { initHandler, handlerDrawing, clearHandlerDrawing } from "../../../js/common/drawHandler.js"    //公共handler.js
import { Edit, clearEditHandler, } from "../../../js/common/editHandler.js"    //公共handler.js
import createTooltip from '../../../js/tool/tooltip2.js'

function spatialQuery3d(props) {

    // 设置默认值数据
    let state = reactive({
        layerNames: [],   //当前存在的可选择图层
        selectedLayerName: null,  //默认选择图层名称
        scale: 3,   //缩放
        positionMode: "intersects",   //位置模式

        Xpitch: 0,   //x旋转
        Yroll: 0,     //y旋转
        Zheading: 0,     //z旋转
        geometryType: "box",   //选择模型类型
        drawType: "Fill_And_WireFrame",   //模型显示类型
        FillColor: "rgba(192,211,25,0.5)",   //模型填充颜色
        WireFrameColor: "rgba(89,129,228,0.8)",  // 模型线框颜色
        searchColor: "rgba(255, 186, 1, 1)",   //查询结果颜色
        GeometryBodyNames: [], //场景存在的天际线体对象等存在的数组
        //默认geometry参数
        boxParameters: [100, 100, 100],
        sphereParameters: [100],
        coneParameters: [100, 200],
        cylinderParameters: [100, 100, 200],
        ellicpseParameters: [100, 50, 50],
        rotateOrigin: null,
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
    let scene, tipFlag = true;
    let layers, spatialQuery;
    let geometry, GeometryBodys = [];

    let editEntity, s3mInstanceColc;
    let modelUrl = 'public/data/s3m/box.s3m';
    let modelEditor;

    if (storeState.isViewer) {
        if (!window.tooltip) {
            window.tooltip = createTooltip(viewer._element);
        }
        init();
    }
    //viewer 初始化完成的监听
    watch(() => storeState.isViewer, val => {
        if (val) {
            if (!window.tooltip) {
                window.tooltip = createTooltip(viewer._element);
            }
            init();
        }
    });
    //监听图层加载完成
    watch(() => storeState.changeLayers, val => {
        getLayerNames();
    });
    if (storeState.changeGeometrys) {
        setGeometryBodys()
    }
    //监听场景存在其他三维体
    watch(() => storeState.changeGeometrys, val => {
        setGeometryBodys()
    });

    function setGeometryBodys() {
        state.GeometryBodyNames = [];
        GeometryBodys = [];
        if (storeDate.geometrys) {
            for (const key in storeDate.geometrys) {
                GeometryBodys.push(key);
                let name = storeDate.geometrys[key].name;
                if (!state.GeometryBodyNames.includes(name)) {
                    state.GeometryBodyNames.push(name)
                }
            }
        }
        if (state.GeometryBodyNames.length === 0) {
            if (props && props.geometryType) {
                state.geometryType = props.geometryType
            } else {
                state.geometryType = 'box'
            }

        }
    }


    function init() {
        scene = viewer.scene;
        layers = viewer.scene.layers.layerQueue;
        spatialQuery = new Cesium.SpatialQuery3D(scene);
        spatialQuery.outlineColor = Cesium.Color.fromCssColorString(
            state.WireFrameColor
        );
        spatialQuery.fillColor = Cesium.Color.fromCssColorString(
            state.FillColor
        );
        spatialQuery.fillStyle = Cesium.FillStyle[state.drawType];
        getGeometry(state.geometryType);
        getPositionMode(state.positionMode);
        spatialQuery.build();
        setTimeout(() => {
            if (state.layerNames.length === 0) {
                getLayerNames();
            }
        }, 1000);
        
        s3mInstanceColc = new Cesium.S3MInstanceCollection(scene._context);
        viewer.scene.primitives.add(s3mInstanceColc);
    };

    function getLayerNames() {
        let layer = getLayer(state.selectedLayerName);
        if (spatialQuery && spatialQuery.layers) {
            spatialQuery.layers = layer ? [layer] : []
        }
        state.layerNames.length = 0;
        if (layers && layers.length > 0) {
            layers.forEach((element, index) => {
                if (!state.layerNames.includes(element._name)) {
                    state.layerNames.push(element._name);
                }
            });
            if (!state.selectedLayerName) {
                state.selectedLayerName = state.layerNames[0]
            }
        }
    }


    /*
     ***分析模块***
    */


    //分析
    function analysis() {
        try {
            let layer = getLayer(state.selectedLayerName);
            if (!layer) {
                tool.Message.warnMsg('请选择需要查询的图层！')
                return;
            }
            spatialQuery.layers = [layer];
            tooltip.setVisible(false);
            layer.selectedColor = Cesium.Color.fromCssColorString(state.searchColor);
            layer.selectColorType = Cesium.SelectColorType.REPLACE;
            layer.selectEnabled = false;
            console.log(spatialQuery.geometry)
            if (typeof (state.geometryType) === 'number') {      //三维体查询,目前只支持这两种
                getGeometry(state.geometryType);
                spatialQuery.build();
                return;
            }
            spatialQuery.build();
            viewer.enableCursorStyle = false;
            viewer._element.style.cursor = "";
            document.body.classList.add("measureCur");
            if (tipFlag) {   //只提示一次
                window.tooltip.showAt(' <p>点击鼠标左键确认查询位置</p>', '300px');
                tipFlag = false
            }
            //鼠标左键事件监听
            viewer.eventManager.addEventListener("CLICK", LEFT_CLICK, true);
        } catch (err) {
            console.error(err)
        }
    };

    function LEFT_CLICK(e) {
        document.body.classList.remove("measureCur");
        // 获取鼠标点击的笛卡尔坐标
        let cartesian = scene.pickPosition(e.message.position);
        let position = tool.CartesiantoDegrees(cartesian) // 将获取的点的位置转化成经纬度
        setPosition(position);
        // let h = position[2] + 60;
        // addModel(Cesium.Cartesian3.fromDegrees(position[0], position[1], h)); //添加编辑模型
        tooltip.setVisible(false);
        viewer.eventManager.removeEventListener("CLICK", LEFT_CLICK); //移除鼠标点击事件监听
    }

    function getLayer(layerName) {
        return layers.find(function (item, index) {
            return item._name === layerName
        })
    };
    function getQueryIDs() {
        return spatialQuery.getQueryIDs();
    };

    function getGeometry(geometryType) {
        switch (geometryType) {
            case "box":
                {
                    let p = state.boxParameters;
                    geometry = new Cesium.GeoBox(p[0], p[1], p[2]);
                }
                break;
            case "sphere":
                {
                    let p = state.sphereParameters;
                    geometry = new Cesium.GeoSphere(p[0]);
                }
                break;
            case "cone":
                {
                    let p = state.coneParameters;
                    geometry = new Cesium.GeoCone(p[0], p[1]);
                    if (state.rotateOrigin) {
                        geometry.rotateOrigin = getRotateOrigin();
                    }
                }
                break;
            case "cylinder":
                {
                    let p = state.cylinderParameters;
                    geometry = new Cesium.GeoCylinder(p[0], p[1], p[2]);
                }
                break;
            case "ellicpse":
                {
                    let p = state.ellicpseParameters;
                    geometry = new Cesium.GeoEllipsoid(p[0], p[1], p[2]);
                }
                break;
            default:
                {
                    geometry = new Cesium.GeoModel3D();
                    geometry.geoModel = storeDate.geometrys['SkyLineBody'];
                    spatialQuery.clear()
                }
                break;

        }
        spatialQuery.geometry = geometry;
    };
    //获取圆锥绕点旋转方式
    function getRotateOrigin() {
        let r = state.rotateOrigin;
        if (r == "APEX") {
            return Cesium.RotationOrigin.APEX;
        } else {
            return Cesium.RotationOrigin.CENTER;
        }
    };
    function getPositionMode(positionMode) {
        let mode;
        switch (positionMode) {
            case "intersects":
                mode = Cesium.PositionMode.Intersects;
                break;
            case "disjoint":
                mode = Cesium.PositionMode.Disjoint;
                break;
            case "contains":
                mode = Cesium.PositionMode.Contains;
                break;
            default:
                mode = Cesium.PositionMode.Intersects;
                break;
        }
        spatialQuery.positionMode = mode;
    };

    //设置查询中心点位置,可用于动态改变如机场预警范例
    function setPosition(newPosArr) {
        //传入经纬度数组
        if (spatialQuery && spatialQuery.geometry) {
            spatialQuery.geometry.geoPosition = new Cesium.Point3D(
                newPosArr[0],
                newPosArr[1],
                newPosArr[2]
            );
        }
    };

    function addModel(centerPositions) {
        s3mInstanceColc.add(modelUrl, {
            id: 'spatialQuery-model',
            position: centerPositions,
            // hpr: new Cesium.HeadingPitchRoll(heading, 0, 0),
            // color:Cesium.Color.RED,
            scale: new Cesium.Cartesian3(0.1, 0.1, 0.1),
        });
        editEntity = s3mInstanceColc.getInstance(modelUrl, 'spatialQuery-model');
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
                "rotation": true,
                "scale": false
            }
        });
        modelEditor.activate();
        modelEditor.changedEvt.addEventListener((param) => {
            console.log(param)
            let Cartesian3 = new Cesium.Cartesian3();
            Cesium.Matrix4.getTranslation(param.modelMatrix, Cartesian3);
            if (Cartesian3) {
            
            }
        })
    }

    // 清除
    function clear() {
        let layer = getLayer(state.selectedLayerName);
        console.log(layer)
        if (layer) {
            layer.selectedColor = new Cesium.Color(0.7, 0.7, 1, 1);
            layer.setSelection([]);
            layer.selectColorType = Cesium.SelectColorType.MIX;
        }
        spatialQuery.clear();
        tooltip.setVisible(false);
        document.body.classList.remove("measureCur");
        spatialQuery.geometry.geoPosition = new Cesium.Point3D(0, 0, 0);
        viewer.eventManager.removeEventListener("CLICK", LEFT_CLICK); //移除鼠标点击事件监听
    };

    // 监听
    watch(() => state.Xpitch, val => {
        if (val == "") return;
        geometry.geoRotationX = parseFloat(val);
    });
    watch(() => state.Yroll, val => {
        if (val == "") return;
        geometry.geoRotationY = parseFloat(val);
    });
    watch(() => state.Zheading, val => {
        if (val == "") return;
        geometry.geoRotationZ = parseFloat(val);
    });
    watch(() => state.scale, val => {
        if (val == "") return;
        geometry.geoScaleX = parseFloat(val);
        geometry.geoScaleY = parseFloat(val);
        geometry.geoScaleZ = parseFloat(val);
    });
    watch(() => state.positionMode, val => {
        if (val == "") return;
        getPositionMode(val)
    });
    watch(() => state.geometryType, val => {
        if (val === "") return;
        getGeometry(val)
    });
    watch(() => state.drawType, val => {
        if (val == "") return;
        spatialQuery.fillStyle = Cesium.FillStyle[val];
    });
    watch(() => state.FillColor, val => {
        if (val == "") return;
        spatialQuery.fillColor = Cesium.Color.fromCssColorString(val);
    });
    watch(() => state.WireFrameColor, val => {
        if (val == "") return;
        spatialQuery.outlineColor = Cesium.Color.fromCssColorString(val);
    });
    watch(() => state.searchColor, val => {
        if (val == "") return;
        getLayer(state.selectedLayerName).selectedColor = Cesium.Color.fromCssColorString(val);
    });
    watch(() => state.selectedLayerName, (val, oldval) => {
        let layer = getLayer(oldval);
        if (layer) {
            layer.selectedColor = new Cesium.Color(0.7, 0.7, 1, 1);
            layer.setSelection([]);
            layer.selectColorType = Cesium.SelectColorType.MIX;
        }
        clear()
    });

    // 销毁
    onBeforeUnmount(() => {
        spatialQuery.destroy();
        spatialQuery = undefined;
        layers = undefined;
        geometry = undefined;
    })

    return {
        ...toRefs(state),
        setPosition,
        getQueryIDs,
        analysis,
        clear
    };
};

export default spatialQuery3d

