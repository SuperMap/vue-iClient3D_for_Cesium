
// 引入依赖
import { watch, ref, reactive, toRefs, onBeforeUnmount, onMounted, onUpdated } from "vue";
import { storeState } from '../../../js/store/store.js'   //简单局部状态管理
import tool from '../../../js/tool/tool.js'        //提示等工具
import resource from '../../../js/local/lang.js'  //语言资源
import { initHandler, handlerDrawing, clearHandlerDrawing } from "../../../js/common/drawHandler.js"    //公共handler.js
import createTooltip from '../../../js/tool/tooltip2.js'
import textures from './textures.js'

function scanEffect(props) {
    // 设置默认值数据
    let state = reactive({
        scanMode: "lineMode",
        scanColor: "#0F7AF4",
        scanTextures: [],
        selectedTextureIndex: 0,
        bloomShow: false,  //开启反光
        openHDR: false,  //开启HDR
        threshold: 0.01,  //亮度阈值
        intensity: 0.5,  //泛光强度
        lineWidth: 100,  //获取或设置线状扫描线的宽度，单位：米。
        period: 3.0,  //获取或设置扫描线的运行周期，单位：秒。
        speed: 100,  //获取或设置扫描线的运行速度，单位：米/秒。
        addTextures: null, //[{name:纹理1,type:'line / ring',url:xxx}]
        scanShow: false,
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
    let lineScanTextures = [
        {
            name: '无纹理',
            type: 'line',
            url: ''
        }
    ];
    let circleScanTextures = [
        {
            name: '无纹理',
            type: 'ring',
            url: ''
        }
    ];
    getTextures(textures);

    function getTextures(arr) {
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].type === 'line') {
                lineScanTextures.push(arr[i])
            } else {
                circleScanTextures.push(arr[i])
            }
        }
        state.scanTextures = state.scanMode === 'lineMode' ? lineScanTextures : circleScanTextures;
    };

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
        viewer.scene.scanEffect.color = Cesium.Color.fromCssColorString(state.scanColor);
        viewer.scene.scanEffect.textureUrl = '';
        viewer.scene.scanEffect.lineWidth = Number(state.lineWidth);
        viewer.scene.scanEffect.period = Number(state.period);
        viewer.scene.scanEffect.speed = Number(state.speed);
        viewer.scene.scanEffect.centerPostion = new Cesium.Cartesian3.fromDegrees(0, 0, 0);
    };

    function drawPolyline() {
        if (!window.handlerPolyline) {
            initHandler("Polyline");
        }
        window.tooltip.showAt(' <p>点击鼠标左键开始绘制</p><p>绘制两点确定扫描线方向</p><p>鼠标右键结束绘制</p>', '350px');
        handlerDrawing("Polyline").then(
            res => {
                addLineScans(res.result.object.positions)
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

    function addLineScans(positions) {
        let dir = new Cesium.Cartesian3();
        Cesium.Cartesian3.subtract(positions[1], positions[0], dir); // 获取扫描方向向量
        if (state.scanShow) {
            viewer.scene.scanEffect.add(positions[0]);
            viewer.scene.scanEffect.lineMoveDirection = dir;
            return;
        }
        viewer.scene.scanEffect.centerPostion = positions[0];
        viewer.scene.scanEffect.lineMoveDirection = dir;
        state.scanShow = true;
    }

    function addCircleScans(e) {
        viewer.enableCursorStyle = true;
        document.body.classList.remove("measureCur");
        let centerPosition = viewer.scene.pickPosition(e.message.position);
        if (state.scanShow) {
            viewer.scene.scanEffect.add(centerPosition);
            return;
        }
        viewer.scene.scanEffect.centerPostion = centerPosition;
        state.scanShow = true;
        viewer.eventManager.removeEventListener("CLICK", addCircleScans);
    }



    function addScans() {
        if (state.scanMode === 'lineMode') {
            drawPolyline();
            return
        }
        viewer.enableCursorStyle = false;
        viewer._element.style.cursor = "";
        document.body.classList.add("measureCur");
        viewer.eventManager.addEventListener("CLICK", addCircleScans, true);
    }


    function clear() {
        state.scanShow = false;
        let index = viewer.scene.scanEffect.count;
        for (let i = 0; i < index; i++) {
            viewer.scene.scanEffect.remove(i);
        }
        viewer.eventManager.removeEventListener("CLICK", addCircleScans);
        clearHandlerDrawing('Polyline');
    }

    // 监听
    watch(() => state.scanShow, val => {
        viewer.scene.scanEffect.show = val;
    });
    watch(() => state.scanMode, val => {
        if(val ==="lineMode"){
            viewer.scene.scanEffect.mode = Cesium.ScanEffectMode.LINE;
            state.scanTextures = lineScanTextures ;
            return
        }
        viewer.scene.scanEffect.mode =  Cesium.ScanEffectMode.CIRCLE;
        state.scanTextures =  circleScanTextures;
    });
    watch(() => state.scanColor, val => {
        viewer.scene.scanEffect.color = Cesium.Color.fromCssColorString(val);
    });
    watch(() => state.selectedTextureIndex, val => {
        viewer.scene.scanEffect.textureUrl = state.scanTextures[val].url;
    });
    watch(() => state.scanTextures, val => {
        state.selectedTextureIndex = 0;
    });
    
    watch(() => state.bloomShow, val => {
        viewer.scene.bloomEffect.show = val;
        viewer.scene.bloomEffect.threshold = Number(state.threshold);
        viewer.scene.bloomEffect.bloomIntensity = Number(state.intensity);
    });
    watch(() => state.openHDR, val => {
        viewer.scene.hdrEnabled = val;
    });
    watch(() => state.threshold, val => {
        viewer.scene.bloomEffect.threshold = Number(val);
    });
    watch(() => state.intensity, val => {
        viewer.scene.bloomEffect.bloomIntensity = Number(val);
    });
    watch(() => state.lineWidth, val => {
        viewer.scene.scanEffect.lineWidth = Number(val);
    });
    watch(() => state.period, val => {
        viewer.scene.scanEffect.period = Number(val);
    });
    watch(() => state.speed, val => {
        viewer.scene.scanEffect.speed = Number(val);
    });
    watch(() => state.scanShow, val => {
        viewer.scene.scanEffect.scanShow = val;
    });
    watch(() => state.addTextures, val => {
        if(typeof(val) === 'object'){
            getTextures(val);
        }else{
            console.log('addTextures类型不是数组！')
        }
    });




    // 销毁
    onBeforeUnmount(() => {

    });


    return {
        ...toRefs(state),
        addScans,
        clear,
    };
};

export default scanEffect

