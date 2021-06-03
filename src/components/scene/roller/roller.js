
// 引入依赖
import { watch, ref, reactive, toRefs, onBeforeUnmount, onMounted } from "vue";
import tool from '../../../js/tool/tool.js'        //提示等工具
import resource from '../../../js/local/lang.js'  //语言资源
import { storeState } from '../../../js/store/store.js'   //简单局部状态管理


function roller(props) {

    // 设置默认值数据
    let state = reactive({
        useRoller: false,  //使用卷帘
        rollerMode: "lrRoller",   //卷帘模式
        lrRoller: "1",  //左右卷帘时默认屏蔽左边
        tbRoller: "4",  //上下卷帘时默认屏蔽上面
        TreeDatas: [],   //图层树
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
    let layers, imgLayers, terrainLayers, mvtLayers;
    let dom = document.getElementById('cesiumContainer');
    let wide = document.body.clientWidth - dom.clientWidth;  //定位矫正
    let heide = document.body.clientHeight- dom.clientHeight;
    let width = dom.clientWidth; // 界面宽度
    let height = dom.clientHeight; // 界面高度
    let tree = ref(null);
    let verticalSliderLeft = ref(null);
    let verticalSliderRight = ref(null);
    let horizontalSliderTop = ref(null);
    let horizontalSliderBottom = ref(null);
    let scratchSwipeRegion = new Cesium.BoundingRectangle();
    // 卷帘配置参数，以对象方式实现地址传递
    let rollerShutterConfig = {
        startX: 0.33,  //x方向左卷帘条比例
        startY: 0.33,  //y方向上卷帘条比例
        endX: 0.66,  //x方向右卷帘条比例
        endY: 0.66,  //y方向下卷帘条比例
        index: 1,  //当前控制卷帘条
        mode: 1,  //卷帘模式
    };

    
    //监听图层加载完成
    watch(() => storeState.changeLayers, val => {
        initLayers()
    });

    onMounted(() => {
        bindSliderEvt();  //绑定事件
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
            tree.value.setCheckedNodes(state.TreeDatas); //默认全部勾选参与卷帘
        }, 500)
    };

    // 分析

    // updatS3M图层
    function updataS3MLayer() {
        if (layers.length == 0) {
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

    };

    //updatImg
    function updataImgLayers() {
        if (imgLayers.length == 1) {
            return;
        }
        let imgLayersObj = {
            id: 'img',
            label: "IMG图层",
            children: []
        };
        imgLayers.forEach((layer, index) => {
            if (index === 0) return true;
            let isMvt = layer._imageryProvider instanceof Cesium.MvtProviderGL;
            if (isMvt) return true;
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
    };

    //updatMVT
    function updataMvtLayers() {
        if (mvtLayers.length == 0) {
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
    };

    //updatTerrain(地表)
    function updataTerrainLayers() {
        // if (!terrainLayers.tablename) {
        //     return;
        // }
        let terrainLayersObj = {
            id: 'globe',
            label: "地球",
            children: []
        };
        let TerrainLayer = {
            id: 'globe-0',
            label: '地表',
        };
        terrainLayersObj.children.push(TerrainLayer);
        state.TreeDatas[4] = terrainLayersObj;
    };

    //勾选节点函数
    function checkNode(data) {
        let node = tree.value.getNode(data)
        let ids = data.id.split('-');
        setLayersRoller(ids, node.checked)
    };


    /**
         * 设置卷帘的分割方向及分割条的位置。
         *
    */
    function setRollerShutterSplit() {
        let startX = rollerShutterConfig.startX;
        let startY = rollerShutterConfig.startY;
        let endX = rollerShutterConfig.endX;
        let endY = rollerShutterConfig.endY;
        let mode = rollerShutterConfig.mode;
        // 左右卷帘使用left slider滑动，上下卷帘使用top slider滑动
        switch (mode) {
            case 1:
                Cesium.BoundingRectangle.unpack([startX, 0, 1, 1], 0, scratchSwipeRegion);
                break;
            case 2:
                Cesium.BoundingRectangle.unpack([0, 0, startX, 1], 0, scratchSwipeRegion);
                break;
            case 4:
                Cesium.BoundingRectangle.unpack([0, startY, 1, 1], 0, scratchSwipeRegion);
                break;
            case 8:
                Cesium.BoundingRectangle.unpack([0, 0, 1, startY], 0, scratchSwipeRegion);
                break;
            case 15:
                Cesium.BoundingRectangle.unpack([startX, startY, endX - startX, endY - startY], 0, scratchSwipeRegion);
                break;
            default:
                Cesium.BoundingRectangle.unpack([0, 0, 1, 1], 0, scratchSwipeRegion);
                break;
        }

        let checkedKeys = tree.value.getCheckedKeys(true);
        checkedKeys.forEach((key) => {
            let ids = key.split('-');
            setLayersRoller(ids, true);
        })
    };

    //设置各类图层的卷帘
    function setLayersRoller(ids, checked) {
        let type = ids[0];
        let index = ids[1];
        switch (type) {
            case 's3m':
                if (!index) {
                    for (let i = 0; i < layers.length; i++) {
                        layers[i].swipeEnabled = checked;
                        layers[i].swipeRegion = scratchSwipeRegion;
                    }
                    return;
                }
                layers[index].swipeEnabled = checked;
                layers[index].swipeRegion = scratchSwipeRegion;
                break;
            case 'img':
                if (!index) {
                    for (let i = 1; i < imgLayers.length; i++) {
                        imgLayers[i].swipeEnabled = checked;
                        imgLayers[i].swipeRegion = scratchSwipeRegion;
                    }
                    return;
                }
                imgLayers[index].swipeEnabled = checked;
                imgLayers[index].swipeRegion = scratchSwipeRegion;
                break;
            case 'mvt':
                if (!index) {
                    for (let i = 0; i < mvtLayers.length; i++) {
                        mvtLayers[i].swipeEnabled = checked;
                        mvtLayers[i].swipeRegion = scratchSwipeRegion;
                    }
                    return;
                }
                mvtLayers[index].swipeEnabled = checked;
                mvtLayers[index].swipeRegion = scratchSwipeRegion;
                break;
            case 'globe':
                viewer.scene.globe.swipeEnabled = checked;
                viewer.scene.globe.swipeRegion = scratchSwipeRegion;
                break;
            default: null
        }
    };

    // 取消所有图层的卷帘
    function cancelLayersRoller() {
        setLayersRoller(['s3m'], false);
        setLayersRoller(['img'], false);
        setLayersRoller(['mvt'], false);
        setLayersRoller(['globe'], false);
    }

    //设置卷帘条显隐
    function enableSlider(index) {
        verticalSliderLeft.value.style.display = 'none';
        verticalSliderRight.value.style.display = 'none';
        horizontalSliderTop.value.style.display = 'none';
        horizontalSliderBottom.value.style.display = 'none';
        if (index & 1) {
            verticalSliderLeft.value.style.display = 'block';
        }
        if (index & 2) {
            verticalSliderRight.value.style.display = 'block';
        }
        if (index & 4) {
            horizontalSliderTop.value.style.display = 'block';
        }
        if (index & 8) {
            horizontalSliderBottom.value.style.display = 'block';
        }
    }


    /**
     * 注册卷帘分割条的拖拽事件。
     */
    function bindSliderEvt() {
        verticalSliderLeft.value.addEventListener('mousedown', function (e) {
            mouseDown(e, 1);
        }, false);
        verticalSliderRight.value.onmousedown = function (e) {
            mouseDown(e, 3);
        };
        horizontalSliderTop.value.onmousedown = function (e) {
            mouseDown(e, 2);
        };
        horizontalSliderBottom.value.onmousedown = function (e) {
            mouseDown(e, 4);
        };
        window.addEventListener('resize', function () {
            width = document.body.clientWidth - wide; // 窗口宽度
            height = document.body.clientHeight - heide; // 窗口高度
        });

        document.addEventListener('mouseup', mouseUp, false);
        function mouseUp(e) {
            document.removeEventListener('mousemove', sliderMove, false);
        }

        function mouseDown(e, index) {
            rollerShutterConfig.index = index;
            document.addEventListener('mousemove', sliderMove, false);
        }

        function sliderMove(e) {
            if (e.preventDefault) {
                e.preventDefault();
            } else {
                e.returnValue = false;
            }

            switch (rollerShutterConfig.index) {
                case 1:
                    verticalSliderLeft.value.style.left = e.clientX - wide + 'px';
                    rollerShutterConfig.startX = (e.clientX - wide) / width;
                    break;
                case 2:
                    horizontalSliderTop.value.style.top = e.clientY - heide+ 'px';
                    rollerShutterConfig.startY = (e.clientY- heide) / height;
                    break;
                case 3:
                    verticalSliderRight.value.style.left = e.clientX- wide + 'px';
                    rollerShutterConfig.endX = (e.clientX- wide) / width;
                    break;
                case 4:
                    horizontalSliderBottom.value.style.top = e.clientY- heide + 'px';
                    rollerShutterConfig.endY = (e.clientY- heide) / height;
                    break;
            }
            setRollerShutterSplit();
        }

    }

    //监听
    watch(() => state.multiViewport, val => {
        viewer.scene.multiViewportMode = Cesium.MultiViewportMode[val];
    });

    watch(() => state.selectedViewport, (val, oldval) => {
        let keys = tree.value.getCheckedKeys(true);
        state['KeysViewport' + oldval] = keys;
        tree.value.setCheckedKeys(state['KeysViewport' + val], true);
    });

    watch(() => state.useRoller, val => {
        if (val) {
            if (rollerShutterConfig.mode == 1 || rollerShutterConfig.mode == 2)
                enableSlider(1);
            if (rollerShutterConfig.mode == 4 || rollerShutterConfig.mode == 8)
                enableSlider(4);
            if (rollerShutterConfig.mode == 15)
                enableSlider(15);
            setRollerShutterSplit();
        } else {
            enableSlider(0);
            cancelLayersRoller()
        }
    });

    watch(() => state.rollerMode, val => {
        switch (val) {
            case "lrRoller":
                if (state.useRoller) enableSlider(1);
                rollerShutterConfig.mode = Number(state.lrRoller);
                break;
            case "tbRoller":
                if (state.useRoller) enableSlider(4);
                rollerShutterConfig.mode = Number(state.tbRoller);
                break;
            case "customRoller":
                if (state.useRoller) enableSlider(15);
                rollerShutterConfig.mode = 15;
                break;
            default:
                break;
        }
        if (!state.useRoller) return;
        setRollerShutterSplit();
    });
    watch(() => state.lrRoller, val => {
        if (!state.useRoller) return;
        rollerShutterConfig.mode = Number(val);
        setRollerShutterSplit();
    });
    watch(() => state.tbRoller, val => {
        if (!state.useRoller) return;
        rollerShutterConfig.mode = Number(val);
        setRollerShutterSplit();
    });

    // 销毁
    onBeforeUnmount(() => {
        layers = undefined;
        imgLayers = undefined;
        terrainLayers = undefined;
        mvtLayers = undefined;
    })

    return {
        ...toRefs(state),
        tree,
        checkNode,
        verticalSliderLeft,
        verticalSliderRight,
        horizontalSliderTop,
        horizontalSliderBottom
    };
};

export default roller

