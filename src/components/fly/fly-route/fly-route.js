
// 引入依赖
import { watch, ref, reactive, toRefs, onBeforeUnmount, onMounted } from "vue";
import { storeState } from '../../../js/store/store.js'   //简单局部状态管理
import tool from '../../../js/tool/tool.js'        //提示等工具
import resource from '../../../js/local/lang.js'  //语言资源
import createFlyLine_xml from "./fly-line-xml.js"
import createTooltip from '../../../js/tool/tooltip2.js'

function compass(props) {

    // 设置默认值数据
    let state = reactive({
        routeType: "designatedRoute",  //自定义还得指定路线类型
        fileSrc: "",  //文件地址,不能同时使用fpfUrl
        fpfUrl: null, //指定fpf路径
        selectedStopIndex: 0,  //选中当前站点
        showRoute: false,  //显示路线
        showStop: false,   //显示站点
        currentStopNames: [],   //当前路线的站点名称集合
        //自定义
        customRouteNames: [],  //保存自定义路线名称
        customRouteSelectedIndex: null,  //自定义选中路线索引
        routeStops: [],  //自定义当前路线的站点集合
        selectedAddedStopIndex: null,    //自定义已加站点选中索引
        //站点
        setStopName: 'Stop-1',  //设置当前站点名称
        setStopSpeed: 0,   // 设置当前站点速度
        stopPlayMode: 'StopPause',  //设置站点模式:默认停留
        waitTime: 0,  //停留时间
        surroundDuration: 1,  //环绕模式时间
        //飞行路线设置
        isAlongline: false,  //获取或者设置该飞行路线是否是沿线飞行。
        routeSpeed: 200,  //飞行路线速度
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
    let flyManager, routeCollection; //创建飞行路线集合对象类
    let flyFile_dom = ref(null);
    let currentStops //当前路线所有站点集合
    let reader = new FileReader();
    let createXml, flyLineXmls = []; //创建和保存xml飞行路线文件

    if (storeState.isViewer) {
        if (!window.tooltip) {
            window.tooltip = createTooltip(viewer._element);
        }
        initFlyManager()
    }
    //viewer 初始化完成的监听
    watch(() => storeState.isViewer, val => {
        if (val) {
            if (!window.tooltip) {
                window.tooltip = createTooltip(viewer._element);
            }
            initFlyManager()
        }
    });

    onMounted(() => {
        fileChange();
    })


    /**
    * 指定路线分析
    */
    //初始化飞行管理
    function initFlyManager() {
        routeCollection = new Cesium.RouteCollection(viewer.entities);
        flyManager = new Cesium.FlyManager({
            scene: viewer.scene,
            routes: routeCollection
        });
        createXml = new createFlyLine_xml();
        if (state.fpfUrl) {
            fpfUrlChange()
        }
    }
    // 点击选择文件函数
    function chooseFile() {
        flyFile_dom.value.click();
    }

    // 改变默认fpf文件路径触发
    function fpfUrlChange() {
        flyManager.stop();
        routeCollection.fromFile(state.fpfUrl);
        flyManager.readyPromise.then(function () {
            let route = flyManager.currentRoute;
            route.isLineVisible = state.showRoute;
            route.isStopVisible = state.showStop;
            updateCurrentStops();
        })
    }
    //文件夹改变文件触发
    function fileChange() {
        flyFile_dom.value.addEventListener("change", evt => {
            flyManager.stop();
            let route = flyManager.currentRoute;
            if (route) route.clear(); //清除之前的
            routeCollection = new Cesium.RouteCollection(viewer.entities);  //飞行路线底层默认第一条路线，所以重新new
            let file = evt.target.files[0];
            if (!file) return;
            state.fileSrc = flyFile_dom.value.value;
            reader.onload = function (e) {
                // 读取操作完成时出发
                let XMLContent = e.target.result;
                routeCollection.fromXML(XMLContent);
            };
            reader.readAsBinaryString(file);
            readyPromise();
        });
    }
    // 异步飞行管理准备就绪函数
    function readyPromise() {
        routeCollection.readyPromise.then(() => {
            flyManager.routes = routeCollection;
            let route = flyManager.currentRoute;
            route.isLineVisible = state.showRoute;
            route.isStopVisible = state.showStop;
            updateCurrentStops();
        })
    }

    // 更新当前路线站点
    function updateCurrentStops() {
        state.currentStopNames.length = 0;
        currentStops = flyManager.getAllRouteStops();
        for (let i = 0, j = currentStops.length; i < j; i++) {
            let stopName = currentStops[i].stopName || 'Stop' + (i + 1);
            state.currentStopNames.push(stopName)
        }
    }
    // 更新当前飞行管理的所有路线(暂不支持路线选择,所有未开放)
    function updateAllRoutes() {
        state.allRoutes.length = 0;
        let allRoutes = routeCollection.routes;
        for (let i = 0, j = allRoutes.length; i < j; i++) {
            let route = '飞行路线' + (i + 1);
            state.allRoutes.push(route)
        }
    }

    function flyStart() {
        flyManager.readyPromise.then(() => {
            flyManager.play();
        })
    };
    function flyPause() {
        flyManager && flyManager.pause();
    };
    function flyStop() {
        flyManager && flyManager.stop();
    };

    /**
   * 自定义路线分析
   */
    // 添加站点
    function addStop() {
        flyManager.stop();
        let point = viewer.camera.position;
        let position = tool.CartesiantoDegrees(point);
        let stop = {
            stopName: state.setStopName,
            point: position,
            heading: viewer.camera.heading,
            tilt: viewer.camera.pitch,
            speed: state.setStopSpeed,
            stopPlayMode: state.stopPlayMode,
            surroundDuration: state.surroundDuration,
            waitTime: state.waitTime
        }
        state.routeStops.push(stop);
        if (state.routeStops.length > 0) {
            let len = state.routeStops.length;
            let lastStopName = state.routeStops[len - 1].stopName;
            let index = lastStopName.split('-')[1] || 1;
            let name = 'Stop-' + (Number(index) + 1);
            state.setStopName = name;
        }
        state.selectedAddedStopIndex = state.routeStops.length - 1;
    }

    // 保存站点
    function saveStop() {
        if (state.routeStops.length < 2) {
            tool.Message.warnMsg('节点小于2')
            return;
        }

        // 飞行路线配置
        let index = flyLineXmls.length + 1;
        let route = {
            routeName: '飞行路线_' + index,
            speed: state.routeSpeed,
            isAlongLine: "False",
            routeStops: state.routeStops
        }
        let xml = createXml.createXMLflyLine(route);
        flyLineXmls.push(xml);
        state.customRouteNames.push(route.routeName);
        // restStops();
        if (state.customRouteSelectedIndex === null)
            state.customRouteSelectedIndex = 0;
    }

    // 重置当前路线
    function restStops() {
        state.routeStops.length = 0;
        state.setStopName = 'Stop-1';
        state.setStopSpeed = 0;
        state.stopPlayMode = 'StopPause';
        state.waitTime = 0;
        state.surroundDuration = 1;
    }

    // 下载选择的飞行路线fpf文件
    function downLoad() {
        let data = flyLineXmls[state.customRouteSelectedIndex];
        if (!data) return;
        let blob = new Blob([data]);//将返回的数据包装成blob（方法的具体使用参考mdn）
        let alink = document.createElement("a");
        alink.download = 'fly-route.fpf';//文件名,大部分浏览器兼容,IE10及以下不兼容
        alink.href = URL.createObjectURL(blob);//根据blob 创建 url
        alink.click(); //自动点击
    }
    // 清除选中飞行路线
    function clearRoute() {
        flyManager.stop();
        if (flyLineXmls.length < 1) return;
        flyLineXmls.splice(state.customRouteSelectedIndex, 1);
        state.customRouteNames.splice(state.customRouteSelectedIndex, 1);
        if (flyLineXmls.length > 0) {
            state.customRouteSelectedIndex = 0;
            return;
        }
        state.customRouteSelectedIndex = null;
        state.currentStopNames.length = 0;
        let route = flyManager.currentRoute;
        if (route) route.clear(); //清除之前的

    }

    // 清除选中站点
    function clearStop() {
        state.routeStops.splice(state.selectedAddedStopIndex, 1);
        if (state.routeStops.length > 0) {
            state.selectedAddedStopIndex = state.routeStops.length - 1;
            return;
        }
        state.selectedAddedStopIndex = null;
        state.setStopName = 'Stop-1';
    }


    // 监听
    watch(() => state.selectedStopIndex, val => {
        flyManager && flyManager.stop();
        let index = Number(val);
        let stop = currentStops[index];
        flyManager.viewToStop(stop);
    });
    watch(() => state.showRoute, val => {
        let route = flyManager.currentRoute;
        if (route) route.isLineVisible = val
    });
    watch(() => state.showStop, val => {
        let route = flyManager.currentRoute;
        if (route) route.isStopVisible = val
    });
    watch(() => state.fpfUrl, val => {
        fpfUrlChange()
    });

    watch(() => state.customRouteSelectedIndex, val => {
        if (val === null) return;
        flyManager && flyManager.stop();
        let route = flyManager.currentRoute;
        if (route) route.clear(); //清除之前的
        routeCollection = new Cesium.RouteCollection(viewer.entities);  //飞行路线底层默认第一条路线，所以重新new
        routeCollection.fromXML(flyLineXmls[val]);
        readyPromise()
    });

    watch(() => state.selectedAddedStopIndex, val => {
        let stop = state.routeStops[val];
        if (!stop) return;
        viewer.camera.setView({
            destination: Cesium.Cartesian3.fromDegrees(stop.point[0], stop.point[1], stop.point[2]),
            orientation: {
                heading: stop.heading,
                pitch: stop.tilt,
                roll: 0
            }
        });
    });

    watch(() => state.routeType, val => {
        if(val === 'customRoute'){
            window.tooltip.showAt(' <p>调整当前相机位置和视角</p><p>以当前相机位置和视角设置站点</p><p>点击添加保存此站点</p>', '50%');
            setTimeout(()=>{
                window.tooltip.setVisible(false);
            },5000)
        }else{
            window.tooltip.setVisible(false);
        }
    });


    // 销毁
    onBeforeUnmount(() => {
        state = null;
        flyManager = routeCollection = null;
        currentStops = null;
        createXml = flyLineXmls = null;
    });


    return {
        ...toRefs(state),
        flyFile_dom,
        chooseFile,
        flyStart,
        flyPause,
        flyStop,
        addStop,
        saveStop,
        restStops,
        downLoad,
        clearRoute,
        clearStop
    };
};

export default compass

