
// 引入依赖
import { watch, ref, watchEffect, reactive, toRefs, onBeforeUnmount } from "vue";
import tool from '../../../js/tool/tool.js'        //提示等工具
import resource from '../../../js/local/lang.js'  //语言资源
import { storeState, storeDate } from '../../../js/store/store.js'   //简单局部状态管理

function measure(props) {
    // 设置默认值数据
    let state = reactive({
        measureMode: 'Space', //测量模式
        clampMode: Cesium.ClampMode.Space, //贴地模式
        Ellipsoid: null, //椭球选择
        contourColor: '#ff7d00', //等高线颜色
        isShowDVH: false, //显示等高线界面
        isShowLine: true, //显示等高线
        pickPointEnabled:true //开启顶点捕捉
    });


    // 初始化数据
    let layers, handlerDis, handlerArea, handlerHeight, isoline, lineHeight, setHypFlag,height_0= 0;
    // 等高线
    isoline = new Cesium.HypsometricSetting();
    isoline.DisplayMode = Cesium.HypsometricSettingEnum.DisplayMode.LINE;
    let colorTable = new Cesium.ColorTable();
    isoline._lineColor = Cesium.Color.fromCssColorString(state.contourColor);
    isoline.ColorTable = colorTable;
    isoline.Opacity = 0.6;
    isoline.MaxVisibleValue = -100;
    isoline.MinVisibleValue = -100;

    var init = () => {
        layers = viewer.scene.layers.layerQueue;
        viewer.scene.globe.HypsometricSetting = {
            hypsometricSetting: isoline,
            analysisMode: Cesium.HypsometricSettingEnum.AnalysisRegionMode.ARM_ALL
        };
        if (storeState.changeLayers) {
            setHypsometricSetting()
        }

        handlerDis = new Cesium.MeasureHandler(
            viewer,
            Cesium.MeasureMode.Distance,
            state.clampMode
        );
        handlerArea = new Cesium.MeasureHandler(
            viewer,
            Cesium.MeasureMode.Area,
            state.clampMode
        );
        handlerHeight = new Cesium.MeasureHandler(
            viewer,
            Cesium.MeasureMode.DVH
        );

        //初始化测量距离
        handlerDis.activeEvt.addEventListener(isActive => {
            if (isActive == true) {
                viewer.enableCursorStyle = false;
                viewer._element.style.cursor = "";
                document.body.classList.add("measureCur");
                viewer.scene.pickPointEnabled = state.pickPointEnabled;
            } else {
                viewer.enableCursorStyle = true;
                document.body.classList.remove("measureCur");
                viewer.scene.pickPointEnabled = false;
            }
        });

        //注册测距功能事件
        handlerDis.measureEvt.addEventListener(result => {
            let dis = Number(result.distance);
            let mode = state.measureMode;
            if (mode == "CGCS2000" || mode == "XIAN80" || mode == "WGS84") {
                dis = Number(calcClampDistance(result.positions));
            }
            let distance =
                dis > 1000 ? (dis / 1000).toFixed(2) + "km" : dis.toFixed(2) + "m";
            handlerDis.disLabel.text = "距离:" + distance;
        });

        //初始化测量面积
        handlerArea.activeEvt.addEventListener(isActive => {
            if (isActive == true) {
                viewer.enableCursorStyle = false;
                viewer._element.style.cursor = "";
                document.body.classList.add("measureCur");
                viewer.scene.pickPointEnabled = state.pickPointEnabled;
            } else {
                viewer.enableCursorStyle = true;
                document.body.classList.remove("measureCur");
                viewer.scene.pickPointEnabled = false;
            }
        });

        handlerArea.measureEvt.addEventListener(result => {
            let mj = Number(result.area);
            let mode = state.measureMode;
            if (mode == "CGCS2000" || mode == "XIAN80" || mode == "WGS84") {
                mj = Number(calcClampValue(result.positions));
            } else if (mode == "6") {
                mj = Number(calcAreaWithoutHeight(result.positions));
            }
            let area =
                mj > 1000000
                    ? (mj / 1000000).toFixed(2) + "km²"
                    : mj.toFixed(2) + "㎡";
            handlerArea.areaLabel.text = "面积:" + area;
        });

        let point1,point2;
        //初始化测量高度
        handlerHeight.measureEvt.addEventListener(result => {
            let distance =
                result.distance > 1000
                    ? (result.distance / 1000).toFixed(2) + "km"
                    : (result.distance / 1).toFixed(2) + "m";
            let vHeight =
                result.verticalHeight > 1000
                    ? (result.verticalHeight / 1000).toFixed(2) + "km"
                    : (result.verticalHeight / 1).toFixed(2) + "m";
            let hDistance =
                result.horizontalDistance > 1000
                    ? (result.horizontalDistance / 1000).toFixed(2) + "km"
                    : (result.horizontalDistance / 1).toFixed(2) + "m";
            handlerHeight.disLabel.text = "空间距离:" + distance;
            handlerHeight.vLabel.text = "垂直高度:" + vHeight;
            handlerHeight.vLabel.horizontalOrigin = Cesium.HorizontalOrigin.RIGHT;
            handlerHeight.hLabel.text = "水平距离:" + hDistance;
            handlerHeight.hLabel.verticalOrigin = Cesium.VerticalOrigin.BOTTOM;
            //实时等高线显示
           point1= Cesium.Cartographic.fromCartesian(result.verticalPositions[0]);
           point2= Cesium.Cartographic.fromCartesian(result.verticalPositions[1]);
            if(point1.height>point2.height) lineHeight = Number(result.verticalHeight)+ height_0;
            else lineHeight = -Number(result.verticalHeight)+ height_0;
            if (state.isShowLine) updateContourLine(lineHeight)
        });

        handlerHeight.activeEvt.addEventListener(isActive => {
            if (isActive == true) {
                viewer.enableCursorStyle = false;
                viewer._element.style.cursor = "";
                document.body.classList.add("measureCur");
                viewer.scene.pickPointEnabled = state.pickPointEnabled;
            } else {
                viewer.enableCursorStyle = true;
                document.body.classList.remove("measureCur");
                viewer.scene.pickPointEnabled = false;
            }
        });
    };

    if (storeState.isViewer) {
        init();
    }
    //viewer 初始化完成的监听
    watch(() => storeState.isViewer, val => {
        if (val) init();
    });

    //监听图层加载完成
    watch(() => storeState.changeLayers, val => {
        setHypsometricSetting()
    });

    // 初始化设置图层等高线
    function setHypsometricSetting() {
        for (let i = 0; i < layers.length; i++) {
            layers[i].hypsometricSetting = {
                hypsometricSetting: isoline,
                analysisMode: Cesium.HypsometricSettingEnum.AnalysisRegionMode.ARM_ALL
            };
        }
        setHypFlag = true;
    }

    // 分析
    //椭球贴地距离
    function calcClampDistance(positions) {
        let lonlat = [];
        for (let i = 0; i < positions.length; i++) {
            let cartographic = Cesium.Cartographic.fromCartesian(positions[i]);
            let lon = Cesium.Math.toDegrees(cartographic.longitude);
            let lat = Cesium.Math.toDegrees(cartographic.latitude);
            lonlat.push(lon, lat);
        }
        let gemetry = new Cesium.PolylineGeometry({
            positions: Cesium.Cartesian3.fromDegreesArray(lonlat)
        });
        return scene.globe.computeSurfaceDistance(gemetry, state.Ellipsoid);
    };

    //椭球贴地面积
    function calcClampValue(positions) {
        let lonlat = [];
        for (let i = 0; i < positions.length; i++) {
            let cartographic = Cesium.Cartographic.fromCartesian(positions[i]);
            let lon = Cesium.Math.toDegrees(cartographic.longitude);
            let lat = Cesium.Math.toDegrees(cartographic.latitude);
            lonlat.push(lon, lat);
        }

        let gemetry = new Cesium.PolygonGeometry.fromPositions({
            positions: Cesium.Cartesian3.fromDegreesArray(lonlat)
        });
        return scene.globe.computeSurfaceArea(gemetry, state.Ellipsoid);
    };

    //投影面积
    function calcAreaWithoutHeight(positions) {
        let totalLon = 0;
        for (let i = 0; i < positions.length; i++) {
            let cartographic = Cesium.Cartographic.fromCartesian(positions[i]);
            let lon = Cesium.Math.toDegrees(cartographic.longitude);
            totalLon += lon;
        }

        let dh = Math.round((totalLon / positions.length + 6) / 6); //带号
        let centralMeridian = dh * 6 - 3;
        //高斯投影
        let projection = new Cesium.CustomProjection({
            name: "tmerc",
            centralMeridian: centralMeridian,
            primeMeridian: 0,
            standardParallel_1: 0,
            standardParallel_2: 0,
            eastFalse: 500000.0,
            northFalse: 0.0,
            semimajorAxis: 6378137,
            inverseFlattening: 298.257222101
        });
        let cartesians = [];
        for (let i = 0; i < positions.length; i++) {
            let cartographic = Cesium.Cartographic.fromCartesian(positions[i]);

            let cartesian = projection.project(cartographic);
            cartesians.push(cartesian);
        }

        cartesians.push(cartesians[0]); //首尾相接
        let value = Cesium.getPreciseArea(
            cartesians,
            "China2000",
            centralMeridian,
            dh,
            1
        );
        return value;
    };

    //   设置等值线
    function updateContourLine(height) {
        viewer.scene.globe.HypsometricSetting.hypsometricSetting.MaxVisibleValue = height;
        viewer.scene.globe.HypsometricSetting.hypsometricSetting.MinVisibleValue = height;
        if (!setHypFlag) return;
        for (let i = 0; i < layers.length; i++) {
            if (layers[i].hypsometricSetting.hypsometricSetting) {
                layers[i].hypsometricSetting.hypsometricSetting.MaxVisibleValue = height;
                layers[i].hypsometricSetting.hypsometricSetting.MinVisibleValue = height;
            } else {
                setHypsometricSetting();
            }
        }
    };

    function distanceClk() {
        deactiveAll();
        handlerDis && handlerDis.activate();
    };

    function areaClk() {
        deactiveAll();
        handlerArea && handlerArea.activate();
    };

    function heightClk() {
        
        if (!setHypFlag) setHypsometricSetting();
        clearLine();
         //鼠标左键事件监听
         viewer.eventManager.addEventListener("CLICK", measureHeightClk, true);
        deactiveAll();
        state.isShowDVH = true;
        handlerHeight && handlerHeight.activate();
    };

    function measureHeightClk (e){
        let position = scene.pickPosition(e.message.position);
        let p = tool.CartesiantoDegrees(position) // 将获取的点的位置转化成经纬度
        height_0 = p[2];
    }

    // 清除
    function clearAll() {
        deactiveAll();
        handlerDis && handlerDis.clear();
        handlerArea && handlerArea.clear();
        handlerHeight && handlerHeight.clear();
        clearLine();
    };
    //   清除等值线
    function clearLine() {
        updateContourLine(-10000);
        viewer.eventManager.removeEventListener("CLICK", measureHeightClk); //移除鼠标点击事件监听
    };
    function deactiveAll() {
        handlerDis && handlerDis.deactivate();
        handlerArea && handlerArea.deactivate();
        handlerHeight && handlerHeight.deactivate();
        state.isShowDVH = false;
        state.Ellipsoid = null;
        lineHeight = -10000;
    };
    function clear() {
        clearAll();
        viewer.scene.pickPointEnabled = false;
    };

    // 监听
    watch(() => state.isShowLine, val => {
        if (!val) {
            updateContourLine(-10000)
        } else {
            updateContourLine(lineHeight)
        }
    });
    watch(() => state.pickPointEnabled, val => {
        viewer.scene.pickPointEnabled = val;
    });
    

    watch(() => state.measureMode, val => {
        if (val == "Space") {
            state.clampMode = Cesium.ClampMode.Space;
            handlerArea.clampMode = Cesium.ClampMode.Space;
            handlerDis.clampMode = Cesium.ClampMode.Space;
        } else {
            state.clampMode = Cesium.ClampMode.Ground;
            handlerArea.clampMode = Cesium.ClampMode.Ground;
            handlerDis.clampMode = Cesium.ClampMode.Ground;
            if (val == "XIAN80") {
                state.Ellipsoid = Cesium.Ellipsoid.XIAN80;
            } else if (val == "CGCS2000") {
                state.Ellipsoid = Cesium.Ellipsoid.CGCS2000;
            } else if (val == "WGS84") {
                state.Ellipsoid = Cesium.Ellipsoid.WGS84;
            } else {
                state.Ellipsoid = null;
            }
        }
    });

    // 销毁
    onBeforeUnmount(() => {
        isoline.destroy();
        layers = undefined;
    })

    return {
        ...toRefs(state),
        distanceClk,
        areaClk,
        heightClk,
        clear
    };
};

export default measure

