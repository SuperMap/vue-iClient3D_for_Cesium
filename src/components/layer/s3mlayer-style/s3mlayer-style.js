
// 引入依赖
import { watch, ref, reactive, toRefs, onBeforeUnmount, onMounted } from "vue";
import { storeState } from '../../../js/store/store.js'   //简单局部状态管理
import tool from '../../../js/tool/tool.js'        //提示等工具
import resource from '../../../js/local/lang.js'  //语言资源

function s3mlayerStyle(props) {

    // 设置默认值数据
    let state = reactive({
        layerNames: [],   //当前存在的可选择s3m图层
        selectedLayerName: 'none',  //默认选择图层名称
        foreColor: "#ffffff",  //前景色
        lineColor: "rgba(27, 27, 27, 1)",  //线颜色
        selectedColor: "#A40FF4",  //选中色
        selectColorMode: 'mix',  //选中色模式
        bottomAltitude: 0,  //底部高程
        LODScale: 5,  //LOD
        layerTrans: 1,  //图层透明度
        fillStyle: 'fill',//填充风格
        visibleDistanceMin: 0,  //最小可见距离
        visibleDistanceMax: 10000,  //最大可见距离
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
    let layers, scene, selectedLayer;


    if (storeState.isViewer) {
        getLayerNames();
    }
    //viewer 初始化完成的监听
    watch(() => storeState.isViewer, val => {
        if (val) {
            getLayerNames();
        }
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
        }else{
            state.layerNames = []
        }
    }


    // 销毁
    onBeforeUnmount(() => {
        layers = scene = null;
    });


    // 监听
    watch(() => state.selectedLayerName, val => {
        let index = state.layerNames.indexOf(val)
        if (index == -1) return;
        selectedLayer = layers[index];
    });
    watch(() => state.foreColor, val => {
        if (selectedLayer)
            selectedLayer.style3D.fillForeColor = Cesium.Color.fromCssColorString(
                val
            );
    });
    watch(() => state.lineColor, val => {
        if (selectedLayer)
            selectedLayer.style3D.lineColor = Cesium.Color.fromCssColorString(
                val
            );
    });
    watch(() => state.selectedColor, val => {
        if (selectedLayer)
            selectedLayer.selectedColor = Cesium.Color.fromCssColorString(
                val
            );
    });
    watch(() => state.selectColorMode, val => {
        if (selectedLayer)
            selectedLayer.selectColorType = val === 'mix' ? 0 : 1;
    });
    watch(() => state.bottomAltitude, val => {
        if (selectedLayer)
            selectedLayer.style3D.bottomAltitude = Number(val);
        selectedLayer.refresh();
    });
    watch(() => state.fillStyle, val => {
        if (selectedLayer)
            switch (val) {
                case "fill":
                    selectedLayer.style3D.fillStyle = Cesium.FillStyle.Fill;
                    break;
                case "wireframe":
                    selectedLayer.style3D.fillStyle = Cesium.FillStyle.WireFrame;
                    selectedLayer.style3D.lineColor = Cesium.Color.fromCssColorString(
                        state.lineColor
                    );
                    break;
                case "fill-and-wireframe":
                    selectedLayer.style3D.fillStyle =
                        Cesium.FillStyle.Fill_And_WireFrame;
                    selectedLayer.style3D.lineColor = Cesium.Color.fromCssColorString(
                        state.lineColor
                    );
                    break;
                default:
                    break;
            }
        selectedLayer.refresh();
    });
    watch(() => state.LODScale, val => {
        if (selectedLayer)
            selectedLayer.lodRangeScale = Number(val);
    });
    watch(() => state.layerTrans, val => {
        if (selectedLayer)
            selectedLayer.style3D.fillForeColor.alpha = Number(val);
    });
    watch(() => state.visibleDistanceMin, val => {
        if (val == "") {
            val = 0.0;
        }
        if (selectedLayer)
            selectedLayer.visibleDistanceMin = Number(val);
    });

    watch(() => state.visibleDistanceMax, val => {
        if (val == "") {
            val = this.maxNumber;
        }
        if (selectedLayer)
            selectedLayer.cullEnabled = val;
        selectedLayer.visibleDistanceMax = Number(val);

    });



    return {
        ...toRefs(state),
    };
};

export default s3mlayerStyle

