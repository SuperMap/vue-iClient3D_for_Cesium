
// 引入依赖
import { watch, ref, reactive, toRefs, onBeforeUnmount, onMounted } from "vue";
import resource from '../../../js/local/lang.js'  //语言资源
import { storeState,actions } from '../../../js/store/store.js'   //简单局部状态管理

function layerManage(props) {

    // 设置默认值数据
    let state = reactive({
        TreeDatas: [],
        expandedKeys: []
    })

    // 初始化数据
    let layers, imgLayers, terrainLayers, mvtLayers, terrainProvider;
    let tree = ref(null), domContextmenu = ref(null);
    let node_rightClick; //保存右键选中的节点
    let deleteCallback = () => { }; //右键删除图层的回调函数初始化
    let dom = document.getElementById('cesiumContainer');
    let wide = document.body.clientWidth - dom.clientWidth;  //定位矫正
    let heide = document.body.clientHeight- dom.clientHeight;
    if (props && props.deleteCallback) { deleteCallback = props.deleteCallback }

    //监听图层加载完成
    watch(() => storeState.changeLayers, val => {
        initLayers()
    });
    onMounted(() => {
        setTimeout(() => {
            initLayers()
        }, 500)
    });

    //初始化图层
    function initLayers() {
        layers = viewer.scene.layers.layerQueue;
        imgLayers = viewer.imageryLayers._layers;
        mvtLayers = viewer.scene._vectorTileMaps._layerQueue;
        terrainLayers = viewer.terrainProvider;
        state.TreeDatas.length = 0;
        updataS3MLayer();
        updataImgLayers();
        updataMvtLayers();
        updataTerrainLayers();
        setTimeout(() => {
            tree.value.setCheckedNodes(state.TreeDatas);
        }, 500)
        console.log(mvtLayers)
    }


    // 分析

    // updatS3M图层
    function updataS3MLayer() {
        if (layers.length == 0) {
            if (state.TreeDatas[0]) tree.value.remove(state.TreeDatas[0]);
            return;
        }
        let S3MLayersObj = {
            id: 's3m',
            label: "S3M图层",
            children: []
        };
        layers.forEach((layer, index) => {
            let S3Mlayer = {
                id: 's3m-' + index,
                label: layer._name,
            };
            S3MLayersObj.children.push(S3Mlayer);
        });
        state.TreeDatas[0] = S3MLayersObj;

    }

    //updatImg
    function updataImgLayers() {
        if (imgLayers.length == 1) {
            if (state.TreeDatas[1]) tree.value.remove(state.TreeDatas[1]);
            return;
        }
        let imgLayersObj = {
            id: 'img',
            label: "IMG图层",
            children: []
        };
        imgLayers.forEach((layer, index) => {
            let isMvt = layer._imageryProvider instanceof Cesium.MvtProviderGL;
            if (index === 0 || isMvt) return true;
            let IMGlayer = {
                id: 'img-' + index,
                label: resource.BaseMapImg,
            };
            if (layer._imageryProvider.tablename) {
                IMGlayer.label = layer._imageryProvider.tablename;
            }
            imgLayersObj.children.unshift(IMGlayer);
        });
        if (imgLayersObj.children.length > 0) state.TreeDatas[1] = imgLayersObj;
    }

    //updatMVT
    function updataMvtLayers() {
        if (mvtLayers.length == 0) {
            if (state.TreeDatas[2]) tree.value.remove(state.TreeDatas[2]);
            return;
        }
        let mvtLayersObj = {
            id: 'mvt',
            label: "MVT图层",
            children: []
        };
        mvtLayers.forEach((layer, index) => {
            let IMGlayer = {
                id: 'mvt-' + index,
                label: layer.name,
            };
            mvtLayersObj.children.unshift(IMGlayer);
        });
        state.TreeDatas[2] = mvtLayersObj;
    }

    //updatTerrain
    function updataTerrainLayers() {
        if (!terrainLayers.tablename) {
            return;
        }
        let terrainLayersObj = {
            id: 'terrain',
            label: "地形图层",
            children: []
        };
        let TerrainLayer = {
            id: 'terrain-0',
            label: terrainLayers.tablename,
        };
        terrainLayersObj.children.push(TerrainLayer);
        state.TreeDatas[3] = terrainLayersObj;

    }

    //勾选节点函数
    function checkNode(data) {
        let node = tree.value.getNode(data)
        let ids = data.id.split('-');
        setVisible(ids, node.checked)
    }

    //设置图层显隐
    function setVisible(ids, checked) {
        let type = ids[0];
        let index = ids[1];
        switch (type) {
            case 's3m':
                if (!index) {
                    for (let i = 0; i < layers.length; i++) {
                        layers[i].visible = checked;
                    }
                    return;
                }
                layers[index].visible = checked;
                break;
            case 'img':
                if (!index) {
                    for (let i = 1; i < imgLayers.length; i++) {
                        imgLayers[i].show = checked
                    }
                    return;
                }
                imgLayers[index].show = checked;
                break;
            case 'mvt':
                if (!index) {
                    for (let i = 0; i < mvtLayers.length; i++) {
                        mvtLayers[i].show = checked
                    }
                    return;
                }
                mvtLayers[index].show = checked
                break;
            case 'terrain':
                if (!checked) {
                    terrainProvider = viewer.terrainProvider;
                    viewer.terrainProvider = new Cesium.EllipsoidTerrainProvider();
                } else {
                    viewer.terrainProvider = terrainProvider;
                }
                break;
            default: null
        }
    };

    //点击节点函数
    function nodeClick(data) {
        let ids = data.id.split('-');
        flytoLayer(ids)
    }
    //定位飞向指定图层
    function flytoLayer(ids) {
        let type = ids[0];
        let index = ids[1];
        let layer;
        switch (type) {
            case 's3m':
                if (index) layer = layers[index];
                break;
            case 'img':
                if (index) layer = imgLayers[index];
                break;
            case 'mvt':
                if (index) layer = mvtLayers[index];
                break;
            case 'terrain':
                break;
            default: null
        }
        if (layer) viewer.flyTo(layer);
    };

    // 节点右键事件
    function nodeContextmenu(event, data) {
        let ids = data.id.split('-');
        if (!ids[1]) return;
        node_rightClick = data;
        domContextmenu.value.style.left = (event.clientX + 30-wide) + 'px';
        if (event.clientX >= 1810) domContextmenu.value.style.left = (event.clientX - 80-wide) + 'px';
        domContextmenu.value.style.top = event.clientY - heide + 'px';
        domContextmenu.value.style.display = 'block';

    }

    // 点击任意隐藏右键弹出的操作框
    document.onclick = function (e) {
        e.stopPropagation();
        domContextmenu.value.style.display = 'none';
    }

    // 删除图层函数
    function deleteLayer() {
        domContextmenu.value.style.display = 'none';
        let ids = node_rightClick.id.split('-');
        let type = ids[0];
        let index = ids[1];
        switch (type) {
            case 's3m':
                if (index) {
                    // layers[index].destroy();
                    viewer.scene.layers.remove(layers[index]._name);
                    updataS3MLayer();
                    setTimeout(() => {
                        state.expandedKeys = ['s3m']
                        tree.value.setCheckedNodes(state.TreeDatas);
                    }, 50)
                };
                break;
            case 'img':
                if (index) {
                    // imgLayers[index].destroy();
                    viewer.imageryLayers.remove(imgLayers[index]);
                    updataImgLayers();
                    setTimeout(() => {
                        tree.value.setCheckedNodes(state.TreeDatas);
                    }, 50)
                };
                break;
            case 'mvt':
                if (index) {
                    // mvtLayers[index].destroy();
                    viewer.scene.removeVectorTilesMap(mvtLayers[index].name);
                    updataMvtLayers();
                    setTimeout(() => {
                        tree.value.setCheckedNodes(state.TreeDatas);
                    }, 100)
                };
                break;
            case 'terrain':
                viewer.terrainProvider = new Cesium.EllipsoidTerrainProvider();
                terrainProvider = null;
                let node = tree.value.getNode(type)
                tree.value.remove(node)
                break;
            default: null
        };
        actions.setChangeLayers();
        deleteCallback(node_rightClick) //删除图层回调，用于外部在图层删除后的操作
    }


    // 销毁
    onBeforeUnmount(() => {
        document.onclick = () => { };
    })

    return {
        ...toRefs(state),
        tree,
        domContextmenu,
        checkNode,
        nodeContextmenu,
        nodeClick,
        deleteLayer
    };
};

export default layerManage

