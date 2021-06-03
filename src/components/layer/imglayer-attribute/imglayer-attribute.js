
// 引入依赖
import { watch, ref, reactive, toRefs, onBeforeUnmount, onMounted } from "vue";
import { storeState } from '../../../js/store/store.js'   //简单局部状态管理
import tool from '../../../js/tool/tool.js'        //提示等工具
import resource from '../../../js/local/lang.js'  //语言资源

function s3mlayerAttribute(props) {

    // 设置默认值数据
    let state = reactive({
        layerNames: [],   //当前存在的可选择s3m图层
        selectedLayerName: 'none',  //默认选择图层名称
        brightness: 1,
        contrast: 1,
        hue: 0,
        saturation: 1,
        gamma: 1,
        alpha:1,
        transparentBackColor:'#eecccc',
        transparentBackColorTolerance:0,
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
        layers = viewer.imageryLayers._layers;
        if (layers && layers.length > 1) {
            layers.forEach((layer, index) => {
            let isMvt = layer._imageryProvider instanceof Cesium.MvtProviderGL;
                if (index === 0 ||isMvt) return true;
                if (!state.layerNames.includes(layer._imageryProvider.tablename)) {
                    state.layerNames.push(layer._imageryProvider.tablename);
                }
            });
            if (state.selectedLayerName = 'none') {
                state.selectedLayerName = state.layerNames[0];
                selectedLayer = layers[1];
            }
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
        selectedLayer = layers[index+1];
    });
    watch(() => state.brightness, val => {
        if (selectedLayer)
            selectedLayer.brightness = Number(val);
    });
    watch(() => state.contrast, val => {
        if (selectedLayer)
            selectedLayer.contrast = Number(val);
    });
    watch(() => state.hue, val => {
        if (selectedLayer)
            selectedLayer.hue = Number(val);
    });
    watch(() => state.saturation, val => { 
        if (selectedLayer)
            selectedLayer.saturation  = Number(val);
    });
    watch(() => state.gamma, val => {
        if (selectedLayer)
            selectedLayer.gamma = Number(val);
    });
    watch(() => state.alpha, val => {
        if (selectedLayer)
            selectedLayer.alpha = Number(val);
    });
    watch(() => state.transparentBackColor, val => {
        let color = Cesium.Color.fromCssColorString(val);
        if (selectedLayer)
        selectedLayer.transparentBackColor = color;
    });
    watch(() => state.transparentBackColorTolerance, val => {
        if (selectedLayer)
            selectedLayer.transparentBackColorTolerance = Number(val);
    });
    


    return {
        ...toRefs(state),
    };
};

export default s3mlayerAttribute

