
// 引入依赖
import { watch, ref, reactive, toRefs, onBeforeUnmount, onMounted } from "vue";
import resource from '../../../js/local/lang.js'  //语言资源
import { storeState, actions } from '../../../js/store/store.js'   //简单局部状态管理
import tool from "../../../js/tool/tool.js";

function mvtlayerStyle(props) {

    // 设置默认值数据
    let state = reactive({
        layerNames: [],   //当前存在的可选择mvt图层
        selectedLayerIndex: 'none',  //默认选择图层名称
        childLayerNames: [],  //子图层
        selectedChildLayerIndex: 'none',  //默认子图层选择
        mvtAlpha: 1,  //透明度
        showLayer: true,  //显隐图层
        textAvoidance: true,  //文字避让
        openFilter: false,
        propertyKeys: [],  //子图层属性数组
        symbols: [],  //符号数组
        clickGetFeature: { layer: { id: null }, id: null }, //点击查询属性
        isClickShowProperty: true,  //是否点击显示要素
        dockFontShow: true, //停靠图标显示
        bubbleShow: false,  //悬浮窗口显示
        selectedPropertyKeys: [''],  //下拉选择属性
        selectedSymbols: [''], //下拉选择符号
        inputPropertys: [''], //输入框属性
        inputSymbols: [''], //输入框符号
        inputValues: [''],  //输入框值
    })

    // 初始化数据
    let mvtLayers, selectedLayer, selectedChildLayer;
    let saveOldPropertyStates = [];
    let isFilter = false;
    const bubble = ref(null);
    state.symbols = ['!', '!=', '>', '>=', '<', '<=', '==', 'in', 'like', '!like', 'left', 'right'];

    if (storeState.isViewer) {
        setTimeout(() => getLayerNames(), 500)
    }
    //viewer 初始化完成的监听
    watch(() => storeState.isViewer, val => {
        getLayerNames();
    });
    //监听图层加载完成
    watch(() => storeState.changeLayers, val => {
        getLayerNames()
    });


    //初始化图层
    function getLayerNames() {
        mvtLayers = viewer.scene._vectorTileMaps._layerQueue;
        if (mvtLayers && mvtLayers.length > 0) {
            mvtLayers.forEach((element, index) => {
                if (!state.layerNames.includes(element.name)) {
                    state.layerNames.push(element.name);
                }
            });
            console.log('init')
            if (state.selectedLayerIndex = 'none') {
                state.selectedLayerIndex = 0;
            }
        } else {
            state.selectedLayerIndex = 'none'
        }
        viewer.eventManager.addEventListener("CLICK", clickShowProperty, true);
    }


    // 分析
    // 增行删行
    function addCondition(flag) {
        if (!flag) {
            state.selectedPropertyKeys = deletelast(state.selectedPropertyKeys);
            state.selectedSymbols = deletelast(state.selectedSymbols);
            state.inputSymbols = deletelast(state.inputSymbols);
            state.inputPropertys = deletelast(state.inputPropertys);
            state.inputValues = deletelast(state.inputValues);
            return
        }
        state.selectedPropertyKeys = state.selectedPropertyKeys.concat(['']);
        state.selectedSymbols = state.selectedSymbols.concat(['']);
        state.inputSymbols = state.inputSymbols.concat(['']);
        state.inputPropertys = state.inputPropertys.concat(['']);
        state.inputValues = state.inputValues.concat(['']);
    }
    function deletelast(arr) {
        return arr.slice(0, arr.length - 1)
    }
    // 获取过滤条件
    function getFilter() {
        if (state.inputPropertys[0] == '') return false;
        let filterArr = ['any'];
        state.inputPropertys.forEach((pro, i) => {
            let arr = [];
            arr[0] = state.inputSymbols[i];
            arr[1] = pro;
            arr[2] = state.inputValues[i];
            if (typeof (Number(arr[2])) == 'number') arr[2] = Number(arr[2]);
            filterArr.push(arr);
        })
        if (filterArr.length < 2) return false;
        return filterArr
    }


    // 查询功能
    function propertySearch() {
        let filter = getFilter();
        if (filter) {
            setHighlightLayer(filter)
        }
    }

    let highlightLayer;

    // 设置查询高亮图层
    function setHighlightLayer(filter) {
        if (highlightLayer) clearSearch();
        if (!selectedChildLayer) return;
        let highlightLayerID = selectedChildLayer.id + "_highlight";
        // var highlightLayer = highlightLayers[highlightLayerID];
        if (!highlightLayer) {
            highlightLayer = Cesium.clone(selectedChildLayer, true);
            highlightLayer.id = highlightLayerID;
            if (selectedChildLayer.type == "line") { // 线
                highlightLayer.paint["line-color"] = "rgba(0,255,255,1.00)";
            } else if (selectedChildLayer.type == "fill") { // 面
                highlightLayer.paint["fill-color"] = "rgba(0,255,255,1.00)";
            } else {
                highlightLayer.paint["text-color"] = "rgba(255,0,0,1.00)";
            }
            highlightLayer.layout['visibility'] = 'visible';
            highlightLayer.minzoom = 3;
            selectedLayer.addLayer(highlightLayer);
            // 设置过滤条件
            selectedLayer.setFilter(highlightLayer.id, filter);
        }
    }


    // 开始过滤
    function propertyFilter() {
        let filter = getFilter();
        isFilter = true;
        if (!selectedLayer) return;
        selectedLayer.mapboxStyle.layers.forEach((ly) => {
            selectedLayer.setLayoutProperty(ly.id, 'visibility', 'none');//隐藏图层
        })
        selectedLayer.setLayoutProperty(selectedChildLayer.id, 'visibility', 'visible');//隐藏某个图层
        if (filter)
            selectedLayer.setFilter(selectedChildLayer.id, filter)
    }

    // 点击显示属性
    function clickShowProperty(e) {
        let selectedEntity = viewer.scene.pick(e.message.position) || viewer.selectedEntity;
        if (!Cesium.defined(selectedEntity) || !Cesium.defined(selectedEntity.pickResult)) {
            state.bubbleShow = false;
            return;
        }
        let cha = document.body.clientWidth - e.message.position.x;
        if (cha >= 300)
            bubble.value.style.left = (e.message.position.x) + 'px';
        else bubble.value.style.left = (e.message.position.x - 250) + 'px';
        bubble.value.style.top = (e.message.position.y - 220) + 'px';
        state.bubbleShow = true;
        let obj = null;
        for (var key in selectedEntity.pickResult) {
            obj = selectedEntity.pickResult[key];
            break;
        }
        let feature = obj[0].feature;
        if (feature) state.clickGetFeature = feature;
        console.log(feature)
    }

    // 删除查询函数
    function clearSearch() {
        // viewer.scene.removeVectorTilesMap(mvtLayers[index].name);
        if (!highlightLayer) return;
        selectedLayer.removeLayer(highlightLayer.id);
        highlightLayer = null;
    };

    //删除过滤
    function clearFilter() {
        if (!isFilter) return;
        selectedLayer.mapboxStyle.layers.forEach((ly, index) => {
            selectedLayer.setLayoutProperty(ly.id, 'visibility', saveOldPropertyStates[index]);//隐藏某个图层
        })
        selectedLayer.setFilter(selectedChildLayer.id, null)
        selectedLayer.refresh();
        isFilter = false;
    }


    function clear() {
        clearSearch();
        clearFilter()
    }

    //关闭气泡
    function closeBubble() {
        state.bubbleShow = false
    }
    //悬停气泡
    function dockBubble(val) {
        if (val) {
            bubble.value.classList.add('bubbleDock');
            state.dockFontShow = false
        } else {
            bubble.value.classList.remove('bubbleDock');
            state.dockFontShow = true
        }
    }

    watch(() => state.selectedLayerIndex, val => {
        if (val === 'none') return;
        saveOldPropertyStates.length = 0;
        selectedLayer = mvtLayers[val];
        state.showLayer = selectedLayer.show;
        selectedLayer.readyPromise.then((res) => {
            if (res) {
                selectedLayer.mapboxStyle.layers.forEach((layer, index) => {
                    if (!state.childLayerNames.includes(layer.id)) {
                        state.childLayerNames.push(layer.id);
                    }
                    let visible = selectedLayer.getLayoutProperty(layer.id, 'visibility');
                    saveOldPropertyStates.push(visible);
                });
                state.selectedChildLayerIndex = 0;
            }
        })
    });

    watch(() => state.selectedChildLayerIndex, val => {
        selectedChildLayer = selectedLayer.mapboxStyle.layers[val];
        let features = selectedLayer.querySourceFeatures({ sourceLayer: selectedChildLayer.id, filter: ["<", "$id", 10] });
        if (features.length == 0) {
            state.propertyKeys = [];
        } else {
            state.propertyKeys = features[0]._keys.length > 0 ? features[0]._keys : [];
        }
    });
    watch(() => state.mvtAlpha, val => {
        if (selectedLayer)
            selectedLayer.alpha = Number(val);
    });
    watch(() => state.showLayer, val => {
        if (selectedLayer)
            selectedLayer.show = val;
    });
    watch(() => state.textAvoidance, val => {
        if (!selectedLayer) return;
        let layers = selectedLayer.mapboxStyle.layers;
        for (let i = 0; i < layers.length; i++) {
            layers[i].isOverlapDisplayed = val
        }
    });
    watch(() => state.isClickShowProperty, val => {
        if (val) {
            viewer.eventManager.addEventListener("CLICK", clickShowProperty, true);
            state.bubbleShow = true
            return;
        }
        viewer.eventManager.removeEventListener("CLICK", clickShowProperty); //移除鼠标点击事件监听
        state.bubbleShow = false
    });
    watch(() => state.selectedPropertyKeys, (val, old) => {
        if (val.length !== old.length) return;
        val.forEach((spro, i) => {
            state.inputPropertys[i] = spro;
        })
    }, { deep: true })
    watch(() => state.selectedSymbols, (val, old) => {
        if (val.length !== old.length) return;
        val.forEach((ssym, i) => {
            if (ssym === 'left' || ssym === 'right') {
                if (state.inputPropertys[i] !== '' && !state.inputPropertys[i].includes('left(') && !state.inputPropertys[i].includes('right(')) {
                    state.inputPropertys[i] = ssym + '(' + state.inputPropertys[i] + ',' + 2 + ')';
                    return;
                }
                state.inputPropertys[i] = ssym + '()';
                return;
            }
            state.inputSymbols[i] = ssym;
        })
    }, { deep: true })

    

    // 销毁
    onBeforeUnmount(() => {
        mvtLayers = null;
        selectedLayer = null;
        selectedChildLayer = null;
    })

    return {
        ...toRefs(state),
        addCondition,
        propertySearch,
        propertyFilter,
        clear,
        bubble,
        closeBubble,
        dockBubble
    };
};

export default mvtlayerStyle

