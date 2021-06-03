
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
        shadowMode: 'noShadow',
        shadowDarkness: 0.3,
        selectEnabled:true,
        multiChoose: false,
        cullEnabled: false,
        visibility: 'showAll',
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
            selectedLayer.saturation = Number(val);
    });
    watch(() => state.gamma, val => {
        if (selectedLayer)
            selectedLayer.gamma = Number(val);
    });
    watch(() => state.shadowMode, val => {
        if (selectedLayer)
            switch (val) {
                case "noShadow":
                    viewer.shadows = false;
                    selectedLayer.shadowType = Cesium.ShadowType.NONE;
                    break;
                case "chooseShadow":
                    viewer.shadows = true;
                    selectedLayer.shadowType = Cesium.ShadowType.SELECTION;
                    selectedLayer.refresh();
                    break;
                case "allShadow":
                    viewer.shadows = true;
                    selectedLayer.shadowType = Cesium.ShadowType.ALL;
                    selectedLayer.refresh();
                    break;
                default:
                    null;
                    break;
            }
    });
    watch(() => state.shadowDarkness, val => {
        viewer.shadowMap.darkness = Number(val);
    });
    watch(() => state.multiChoose, val => {
        if (selectedLayer)
            selectedLayer.multiChoose = val;
    });
    watch(() => state.selectEnabled, val => {
        if (selectedLayer)
            selectedLayer.selectEnabled = val;
    });
    
    watch(() => state.cullEnabled, val => {
        if (selectedLayer)
            selectedLayer.cullEnabled = val;
    });
    watch(() => state.visibility, val => {
        if (selectedLayer)
            switch (val) {
                case "showAll":
                    selectedLayer.setObjsVisible([], false);
                    break;
                case "onlyHideSlection":
                    let chooseIDs = selectedLayer.getSelection();
                    selectedLayer.setObjsVisible(chooseIDs, false);
                    break;
                case "onlyShowSlection":
                    let chooseIDs2 = selectedLayer.getSelection();
                    selectedLayer.setObjsVisible(chooseIDs2, true);
                    break;
                default:
                    null;
                    break;
            }
    });


    return {
        ...toRefs(state),
    };
};

export default s3mlayerAttribute

