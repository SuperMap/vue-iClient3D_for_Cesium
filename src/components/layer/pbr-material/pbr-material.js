
// 引入依赖
import { watch, ref, reactive, toRefs, onBeforeUnmount, onMounted } from "vue";
import { storeState } from '../../../js/store/store.js'   //简单局部状态管理
import tool from '../../../js/tool/tool.js'        //提示等工具
import resource from '../../../js/local/lang.js'  //语言资源
import pbrLibrary from './config.js'  //语言资源


function s3mlayerAttribute(props) {

    // 设置默认值数据
    let state = reactive({
        layerNames: [],   //当前存在的可选择s3m图层
        selectedLayerName: 'none',  //默认选择图层名称
        selectedPbr: 'Iron'  //默认选中铁
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
        let terrainLayers = viewer.terrainProvider
        if (terrainLayers instanceof Cesium.EllipsoidTerrainProvider) return;
        if (state.layerNames.includes('地形')) return;
        state.layerNames.push('地形');
        if (state.selectedLayerName = 'none')
            state.selectedLayerName = state.layerNames[0];
    }


    function addPBR() {
        let url = "public/data/pbr/jsons/" + state.selectedPbr + ".json"
        if (state.selectedLayerName === '地形') {
            viewer.scene.globe.setPBRMaterialFromJSON(url);
            return;
        }
        if (selectedLayer) selectedLayer.setPBRMaterialFromJSON(url);
    }

    function clear() {
        if (state.selectedLayerName === '地形') {
            viewer.scene.globe.removePBRMaterial();
            return;
        }
        if (selectedLayer) selectedLayer.removePBRMaterial();
    }



    // 销毁
    onBeforeUnmount(() => {
        layers = scene = null;
    });


    // 监听
    watch(() => state.selectedLayerName, val => {
        if (val === '地形') return;
        let index = state.layerNames.indexOf(val)
        if (index == -1) {
            selectedLayer = undefined;
            return;
        }
        selectedLayer = layers[index];
    });


    return {
        ...toRefs(state),
        pbrLibrary,
        addPBR,
        clear
    };
};

export default s3mlayerAttribute

