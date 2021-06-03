
// 引入依赖
import { watch, ref, reactive, toRefs, onBeforeUnmount, onMounted } from "vue";
import { storeState } from '../../../js/store/store.js'   //简单局部状态管理
import tool from '../../../js/tool/tool.js'        //提示等工具
import resource from '../../../js/local/lang.js'  //语言资源
import createTooltip from '../../../js/tool/tooltip2.js'
import ColorTable from './colorTable.js'

function volume(props) {

    // 设置默认值数据
    let state = reactive({
        dataUrl:'',
        operationType: 'addDate',
        dimensions: [],
        variables: [],
        selectedDateName: null,
        xDim: null,
        yDim: null,
        zDim: null,
        timeDim: null,
        //数值模式
        drawMode: 'volume',
        opacityInterval: [0, 1],
        useGradientOpacity: false,
        gradientOpacityValue: [0, 1],
        gradientOpacity: [0, 1],
        showClipPlane: false,
        clipX: 0.5,
        clipY: 0.5,
        clipRotate: 0,
        //剖切
        xOffset: 0.5,
        yOffset: 0.5,
        zOffset: 0.5,
        //等值面
        contourValue: 1,
        contourRange:[0,1],
        // 公共部分
        zScale: 0,
        colorInterval: [0, 1],
        timeOrder: 0,
        timeRange: [0,24],
        openLight: false,
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
    let gridLayer;
    let scaleScratch = new Cesium.Cartesian3(1, 1, 1); //z拉伸
    let scratchCartesian3 = new Cesium.Cartesian3(0.5, 0.5, 0.5); //偏移
    let scratchClipPlane = Cesium.Plane.fromPointNormal(new Cesium.Cartesian3(0, 0, 0), new Cesium.Cartesian3(1, 0, 0)); //裁剪面
    let colorTable;

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
        };
    });

    function init() {
        if(!state.dataUrl) return tool.Message.warnMsg('请先定义数据路径！');
        // let promise = viewer.scene.addVoxelGridLayer("public/data/netcdf/Ningxia_24.nc", "test");
        // let promise = scene.addVoxelGridLayer("public/data/netcdf/result_100_200_9_40.nc", );
        let promise = viewer.scene.addVoxelGridLayer(state.dataUrl,"test");
        Cesium.when(promise, function (layer) {
            gridLayer = layer;
            state.dimensions = gridLayer._NetCDFInfo.dimensions; 
            state.variables = gridLayer._NetCDFInfo.variables;
            state.selectedDateName = state.variables[0].name;
            state.xDim = state.dimensions[0].name;
            state.yDim = state.dimensions[0].name;
            state.zDim = state.dimensions[0].name;
            state.timeDim = state.dimensions[0].name;
            //默认体渲染位置
            gridLayer.layerBounds = new Cesium.Rectangle(99.95422, 32.25671, 107.1912, 37.1386);
            gridLayer.zBounds = new Cesium.Cartesian2(500, 50000);
            console.log(gridLayer)
        })
    }

    // 加载数据开始渲染
    function startRender() {
        if (!gridLayer) {
            init();
            return;
        }
        if (state.xDim == state.yDim || state.xDim == state.zDim || state.yDim == state.zDim) {
            tool.Message.warnMsg("各维度名不能一样")
            return;
        }
        colorTable = new ColorTable({
            opacityMinValue: 0.0,
            opacityMaxValue: 0.8,
            gradientMinOpacity: 1.0,
            gradientMaxOpacity: 1.0,
            visibleMinValue: 0,
            visibleMaxValue: 0.37
        });
        colorTable.setColorTable(gridLayer, 0);
        gridLayer.startRender({
            variableName: state.selectedDateName,
            xDimName: state.xDim,
            yDimName: state.yDim,
            zDimName: state.zDim,
            timeDimName: state.timeDim
        });
        changeAttrbute();
        viewer.scene.camera.flyTo({
            destination: {x: -1688158.0372444934, y: 6654029.431965283, z: 2998692.1265170774},
            orientation: {
                heading: 0.028840576504810755,
                pitch: -0.8994386458052253,
                roll:6.283185307179586
              }
        })
    }

    // 加载数据后再修改部分最大最小属性值
    function changeAttrbute(){
        state.contourRange = [Math.ceil(gridLayer.minValue),Math.ceil(gridLayer.maxValue)];
        state.contourValue = Math.ceil(gridLayer.minValue);
        let recordDimension = gridLayer._NetCDFInfo.recordDimension;
        if(recordDimension && recordDimension.length>0){
            state.timeRange=[0,recordDimension.length]
        }
    }

    // 添加裁剪面
    function addClipPlane() {
        if (!Cesium.defined(gridLayer) || gridLayer.getNumberOfClipPlanes() > 0) {
            return;
        }
        state.showClipPlane = true;
        gridLayer.addClipPlane(scratchClipPlane);
        addPoint();
    }

    //在裁剪时增加点标志
    function addPoint() {
        let lat = gridLayer.layerBounds.west + (gridLayer.layerBounds.east - gridLayer.layerBounds.west) * Number(state.clipX);
        let lng = gridLayer.layerBounds.south + (gridLayer.layerBounds.north - gridLayer.layerBounds.south) * Number(state.clipY);
        viewer.entities.removeById('volume-clip-plane');
        viewer.entities.add({
            id: 'volume-clip-plane',
            position: Cesium.Cartesian3.fromDegrees(lat, lng, 50000),
            point: {
                color: Cesium.Color.YELLOW,
                pixelSize: 10
            }
        });
    }

    // 移除裁剪面
    function removeClipPlane() {
        if (!Cesium.defined(gridLayer) || gridLayer.getNumberOfClipPlanes() === 0) {
            return;
        }
        state.showClipPlane = false;
        gridLayer.removeAllClipPlanes();
        viewer.entities.removeById('volume-clip-plane');
    }

    function clear(){
        if (!gridLayer) {
            return;
        }
        viewer.scene.layers.remove(gridLayer.name);
        gridLayer = null;
        init();
    }

    // 销毁
    onBeforeUnmount(() => {
        viewer.scene.layers.remove(gridLayer.name);
        gridLayer = null;
    });

    // 监听
    // 数值部分
    watch(() => state.drawMode, val => {
        if (!gridLayer) return;
        if (val === 'slice') {
            gridLayer.volumeRenderMode = 1;
        } else if (val === 'gradient') {
            gridLayer.volumeRenderMode = 2;
        } else {
            gridLayer.volumeRenderMode = 0;
        }
    });
    watch(() => state.useGradientOpacity, val => {
        if (!gridLayer) return;
        gridLayer.useGradientOpacity = val;
    });
    watch(() => state.gradientOpacityValue, val => {
        if (!gridLayer) return;
        colorTable.gradientMinOpacity = val[0];
        colorTable.gradientMaxOpacity = val[1];
        colorTable.setGradientOpacityValue(gridLayer);
    });
    watch(() => state.opacityInterval, val => {
        if (!gridLayer) return;
        colorTable.opacityMinValue = val[0];
        colorTable.opacityMaxValue = val[1];
        colorTable.setColorTable(gridLayer);
    });
    watch(() => state.gradientOpacity, val => {
        if (!gridLayer) return;
        gridLayer.gradientOpacityMinOpacity = val[0];
        gridLayer.gradientOpacityMaxOpacity = val[1];
    });

    watch(() => state.zScale, val => {
        if (!gridLayer) return;
        scaleScratch.z = parseFloat(val);
        gridLayer.scale = scaleScratch;
    });
    watch(() => state.colorInterval, val => {
        if (!gridLayer) return;
        colorTable.visibleMinValue = val[0];
        colorTable.visibleMaxValue = val[1];
        colorTable.setColorTable(gridLayer);
    });
    watch(() => state.timeOrder, val => {
        if (!gridLayer) return;
        gridLayer.frameIndex = Number(val);
    });
    watch(() => state.openLight, val => {
        if (!gridLayer) return;
        gridLayer.enableLighting = val;
    });
    watch(() => state.clipX, val => {
        if (!gridLayer) return;
        addPoint();
        let newPosX = parseFloat(val);
        let newPosY = parseFloat(state.clipY);
        let newRot = Cesium.Math.toRadians(state.clipRotate);
        let qua = Cesium.Quaternion.fromAxisAngle(Cesium.Cartesian3.UNIT_Z, newRot);
        let pos = new Cesium.Cartesian3(newPosX, newPosY, 0.0);
        let transRotScale = new Cesium.TranslationRotationScale(pos, qua);
        let transformMatrix = Cesium.Matrix4.fromTranslationRotationScale(transRotScale);
        Cesium.Plane.fromPointNormal(new Cesium.Cartesian3(0, 0, 0), new Cesium.Cartesian3(1, 0, 0), scratchClipPlane);
        Cesium.Plane.transform(scratchClipPlane, transformMatrix, scratchClipPlane);
    });
    watch(() => state.clipY, val => {
        if (!gridLayer) return;
        addPoint();
        var newPosX = parseFloat(state.clipX);
        var newPosY = parseFloat(val);
        var pos = new Cesium.Cartesian3(newPosX, newPosY, 0.0);
        Cesium.Plane.fromPointNormal(pos, new Cesium.Cartesian3(0, 1, 0), scratchClipPlane);
    });
    watch(() => state.clipRotate, val => {
        if (!gridLayer) return;
        var newPosX = parseFloat(state.clipX);
        var newPosY = parseFloat(state.clipY);
        var newRot = Cesium.Math.toRadians(val);
        var qua = Cesium.Quaternion.fromAxisAngle(Cesium.Cartesian3.UNIT_Z, newRot);
        var pos = new Cesium.Cartesian3(newPosX, newPosY, 0.0);
        var rotMatrix3 = Cesium.Matrix3.fromQuaternion(qua);
        var rotMatrix4 = Cesium.Matrix4.fromRotationTranslation(rotMatrix3);
        var normal = new Cesium.Cartesian3(1, 0, 0);
        normal = Cesium.Matrix4.multiplyByPoint(rotMatrix4, normal, new Cesium.Cartesian3());
        Cesium.Plane.fromPointNormal(pos, normal, scratchClipPlane);
    });
    // 剖切模式
    watch(() => state.xOffset, val => {
        if (!gridLayer) return;
        scratchCartesian3.x = parseFloat(val);
        gridLayer.sliceCoordinate = scratchCartesian3;
    });
    watch(() => state.yOffset, val => {
        if (!gridLayer) return;
        scratchCartesian3.y = parseFloat(val);
        gridLayer.sliceCoordinate = scratchCartesian3;
    });
    watch(() => state.zOffset, val => {
        if (!gridLayer) return;
        scratchCartesian3.z = parseFloat(val);
        gridLayer.sliceCoordinate = scratchCartesian3;
    });
    watch(() => state.contourValue, val => {
        if (!gridLayer) return;
        gridLayer.contourValue = parseFloat(val);;
    });

   
    return {
        ...toRefs(state),
        startRender,
        addClipPlane,
        removeClipPlane,
        clear
    };
};

export default volume

