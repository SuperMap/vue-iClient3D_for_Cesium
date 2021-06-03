
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
        isShowproPerties: false,  //显示当前子图层属性
        isShowSymbol: false,  //显示运算符号
        propertyKeys: [],  //子图层属性数组
        symbols: [],  //符号数组
        clickGetFeature: { layer: { id: null }, id: null }, //点击查询属性
        setFilterString: '',  //设置过滤或查询条件语句
        isClickShowProperty: false,  //是否点击显示要素
        dockFontShow: true, //停靠图标显示
        bubbleShow: false  //悬浮窗口显示
    })

    // 初始化数据
    let mvtLayers, selectedLayer, selectedChildLayer;
    let saveOldPropertyStates = [];
    let isFilter = false;
    let setFilterString_dom = ref(null);
    const bubble = ref(null);
    state.symbols = ['!', '!=', '>', '>=', '<', '<=', '==', 'in', 'like', '!like', 'left', 'right'];

    if (storeState.isViewer) {
        setTimeout(()=> getLayerNames(),500)
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
        }else{
            state.selectedLayerIndex = 'none'
        }
    }


    // 分析
    //点击属性添加到语句
    function clickProperty(text) {
        if (setFilterString_dom.value)
            setFilterString_dom.value.focus();
        if (text == 'left' || text == 'right') {
            state.setFilterString += text;
            return;
        }
        state.setFilterString += text + ' ';
    }



    // 查询功能
    function propertySearch() {
        let filter = getFilter();
        if (filter) {
            setHighlightLayer(filter)
        }
    }

    // 获取查询过滤语句
    function getFilter() {
        let str = state.setFilterString.trim();
        if (str == '') return false;
        let filterArr = ['any'];
        let conditions = str.split(';');
        conditions.forEach((condition) => {
            let arr = condition.split(' ').filter((el) => { return el != '' });
            if (arr.length == 3) {
                let val = arr[0];
                arr[0] = arr[1];
                arr[1] = val;
                if (typeof (Number(arr[2])) == 'number') arr[2] = Number(arr[2]);
                filterArr.push(arr)
            } else {
                tool.Message.warnMsg('请检查条件格式是否正确？')
            }
        })
        if (filterArr.length < 2) return false;
        return filterArr
    }

    let highlightLayer;

    // 设置查询高亮图层
    function setHighlightLayer(filter) {
        if (highlightLayer) clearSearch();
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
        state.setFilterString = '';
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
        if(val === 'none') return;
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
                console.log(selectedLayer)
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
    watch(() => state.isShowproPerties, val => {
        if (!selectedLayer) return;
        if (state.propertyKeys.length < 1) {
            let features = selectedLayer.querySourceFeatures({ sourceLayer: selectedChildLayer.id, filter: ["<", "$id", 10] });
            if (features.length > 0)
                state.propertyKeys = features[0]._keys;
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



    // 销毁
    onBeforeUnmount(() => {
        mvtLayers = null;
        selectedLayer = null;
        selectedChildLayer = null;
    })

    return {
        ...toRefs(state),
        clickProperty,
        propertySearch,
        propertyFilter,
        clear,
        setFilterString_dom,
        bubble,
        closeBubble,
        dockBubble
    };
};

export default mvtlayerStyle

