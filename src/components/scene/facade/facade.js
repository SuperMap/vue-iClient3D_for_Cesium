
// 引入依赖
import { watch, ref, reactive, toRefs, onBeforeUnmount, onMounted } from "vue";
import { storeState } from '../../../js/store/store.js'   //简单局部状态管理
import { initHandler, handlerDrawing, clearHandlerDrawing } from "../../../js/common/drawHandler.js"    //公共handler.js
import tool from '../../../js/tool/tool.js'        //提示等工具
import resource from '../../../js/local/lang.js'  //语言资源
import createTooltip from '../../../js/tool/tooltip2.js'

function s3mlayerAttribute(props) {

    // 设置默认值数据
    let state = reactive({
        maxDistance: 200,  //最大距离
        maxDHeight: 100,  //最大高度
        setLodrange: false,
        layerNames: [],   //当前存在的可选择s3m图层
        selectedLayerName: 'none',  //默认选择图层名称
        lodrange: 0.01, //设置图层的lOD层级切换距离缩放系数
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
    let facade
    let layers, scene, selectedLayer;
    if (storeState.isViewer) {
        if (!window.tooltip) {
            window.tooltip = createTooltip(viewer._element);
        }
        facade = new Cesium.Facade(viewer.scene);
        facade.build();
        getLayerNames();
    }
    //viewer 初始化完成的监听
    watch(() => storeState.isViewer, val => {
        if (val) {
            if (!window.tooltip) {
                window.tooltip = createTooltip(viewer._element);
            }
            facade = new Cesium.Facade(viewer.scene);
            facade.build();
            getLayerNames()
        };
    });

    //监听图层加载完成
    watch(() => storeState.changeLayers, val => {
        getLayerNames();
    });

    //初始化图层
    function getLayerNames() {
        scene = viewer.scene;
        layers = viewer.scene.layers.layerQueue;
        if (layers && layers.length > 0) {
            layers.forEach((element, index) => {
                if (!state.layerNames.includes(element._name)) {
                    state.layerNames.push(element._name);
                }
            });
            if (state.selectedLayerName = 'none') {
                state.selectedLayerName = state.layerNames[0];
                selectedLayer = layers[0];
            }
        }
    }

    //分析

    function setRegion() {
        tooltip.showAt(' <p>点击鼠标左键开始绘制起点</p><p>绘制两点确定区域宽度</p> <p>单击右键结束分析</p><p>设置模型精细度调整图片清晰度</p>', '350px');
        if (!window.handlerPolyline) {
            initHandler("Polyline");
        }
        handlerDrawing("Polyline").then(
            res => {
                let startPoint = res.result.object.positions[0];
                let endPoint = res.result.object.positions[1];
                facade.startPoint = startPoint;
                facade.endPoint = endPoint;
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
    };

    function execute() {
        facade.readyPromise.then(function (base64data) {
            download(base64data);
        });
    };

    function clear() {
        facade.clear();
        clearHandlerDrawing("Polyline");
        tooltip.setVisible(false);
    }


    /* 根据图片生成画布
    */
    function convertImageToCanvas(image) {
        let canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;
        canvas.getContext("2d").drawImage(image, 0, 0);
        return canvas;
    }
    /**
     * 下载图片
     */
    function download(base64data) {
        let image = new Image();
        image.src = base64data;
        image.onload = function () {
            let canvas = convertImageToCanvas(image);
            let url = canvas.toDataURL("image/jpeg");
            let a = document.createElement('a');
            let event = new MouseEvent('click');
            a.download = (new Date()).getTime() + ".jpg"; // 指定下载图片的名称
            a.href = url;
            a.dispatchEvent(event); // 触发超链接的点击事件
        }
    }

    // 销毁
    onBeforeUnmount(() => {
        clear();
        facade.destroy();
    });

    // 监听
    watch(() => state.maxDistance, val => {
        facade.farDistance = Number(val);
    });
    watch(() => state.maxDHeight, val => {
        facade.maxHeight = Number(val);
    });
    // 监听
    watch(() => state.selectedLayerName, val => {
        let index = state.layerNames.indexOf(val)
        if (index == -1) return;
        selectedLayer = layers[index];
    });

    watch(() => state.lodrange, val => {
       if(selectedLayer) selectedLayer.setLodRangeScale(Number(val));
    });
    watch(() => state.setLodrange, val => {
        if(!selectedLayer) return;
        if(val){
            selectedLayer.setLodRangeScale(Number(state.lodrange));
        }else{
            selectedLayer.setLodRangeScale(1);
        }
    });
    


    return {
        ...toRefs(state),
        setRegion,
        execute,
        clear
    };
};

export default s3mlayerAttribute

