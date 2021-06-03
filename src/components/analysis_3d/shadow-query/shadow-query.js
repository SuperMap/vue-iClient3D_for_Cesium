
// 引入依赖
import { watch, ref, reactive, toRefs, onBeforeUnmount, onMounted } from "vue";
import tool from '../../../js/tool/tool.js'        //提示等工具
import resource from '../../../js/local/lang.js'  //语言资源
import { storeState, storeDate } from '../../../js/store/store.js'   //简单局部状态管理
import { initHandler, handlerDrawing, clearHandlerDrawing } from "../../../js/common/drawHandler.js"    //公共handler.js
import createTooltip from '../../../js/tool/tooltip2.js'
function shadowquery(props) {

    // 设置默认值数据
    let state = reactive({
        timeValue: [24, 64],  //开始结束时间
        currentDate: new Date(),  //当前日期
        shadowShow: true,   //显示阴影，确定阴影是否由太阳投射形成。
        marks: {    //时间刻度标记
            0: "0:00",
            8: "",
            16: "",
            24: "6:00",
            32: "",
            40: "",
            48: "12:00",
            56: "",
            64: "",
            72: "18:00",
            80: "",
            88: "",
            96: "24:00"
        },
        timeInterval: 60,  //时间间隔
        spacing: 10,     //间距（米）
        bottomHeight: 1,  //底部高程（米）
        extrudeHeight: 30,  //拉伸高度（米）
        shadowQueryRegion: [],  //分析区域
        // shadows: true,   //确定阴影是否由太阳投射形成。
        layerShadowType: Cesium.ShadowType.ALL, // 图层上阴影类型：所有的模型都产生阴影。
        terrainShadows: Cesium.ShadowMode.RECEIVE_ONLY, //确定地形是否投射或接受来自太阳的阴影:(ShadowMode:该对象仅接收阴影)。
        showStartImgForTime: true,  //显示时间轴开始图标
        showStartImgForDate: true,   //显示日期开始图标
        shadowRadio: {  //获取阴影率结果对象
            'shadowRadio': '',
            'longitude': '',
            'latitude': '',
            'height': '',
            'isShow': false
        },
        dockFontShow: true, //停靠图标显示
        legendShow: false,  //图例显示
        shadowBodyShow: false, //阴影率体显示
        shadowBodyFilter: [0, 100]
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

    // 初始化分析区域并执行
    if (props && props.shadowQueryRegion) {
        shadowQueryUpdate(props.shadowQueryRegion)
    }

    // 初始化数据
    let shadowQuery, layers, IntervalForTime,tipFlag = true, IntervalForDate, currentTimeArr = [...state.timeValue];
    const bubble = ref(null);

    let box_s3m = 'public/data/s3m/box.s3m';
    let s3mInstanceCollection, shadowQuery_points = [], setLayersFlag;
    //初始化体显示颜色(根具采光率0-100获取对应颜色值)
    let gradientColors = tool.gradientColors;  // 获取渐变色函数
    let color = ['#0000ff'];
    color = color.concat(gradientColors('#0000ff', '#00ffff', 20))
        .concat(gradientColors('#00ffff', '#00ff00', 20))
        .concat(gradientColors('#00ff00', '#ffff00', 20))
        .concat(gradientColors('#ffff00', '#ff7f00', 20))
        .concat(gradientColors('#ff7f00', '#ff0000', 20));

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
    //监听图层加载完成
    watch(() => storeState.changeLayers, val => {
        setLayerShadowType()
    });

    function init() {   //初始化函数
        let scene = viewer.scene;
        viewer.shadows = state.shadowShow;
        viewer.terrainShadows = state.terrainShadows;
        layers = viewer.scene.layers.layerQueue;
        scene.globe.enableLighting = true;
        scene.skyBox.show = true;
        viewer.clock.multiplier = 1;
        viewer.clock.shouldAnimate = true;
        shadowQuery = new Cesium.ShadowQueryPoints(scene);    //创建阴影查询对象
        s3mInstanceCollection = new Cesium.S3MInstanceCollection(scene._context);
        s3mInstanceCollection.setCullEnabled(box_s3m, true);  //开启单面渲染
        scene.primitives.add(s3mInstanceCollection);
        shadowQuery.queryPointsEvent.addEventListener(function (data) {  //分析完成回调
            shadowQuery_points = data;
            if (state.shadowBodyShow) {
                bodyShow()
            }
        })
        if (storeState.changeLayers) {
            setLayerShadowType()
        }
    }

    function setLayerShadowType() {
        for (let i = 0; i < layers.length; i++) {
            layers[i].shadowType = state.layerShadowType;
            setLayersFlag = true;
        }
    }

    /*
     ***分析模块***
    */

    // 时间轴改变
    function timeChanging(arr) {
        let tm;
        if (currentTimeArr[0] === arr[0]) {
            tm = setCurrentTime(arr[1]);
        } else {
            tm = setCurrentTime(arr[0]);
        }
        viewer.clock.currentTime = Cesium.JulianDate.fromDate(tm);
        currentTimeArr = arr;
    };

    //设置时间轴表示的当前时间
    function setCurrentTime(tm) {
        let h = parseInt(tm / 4);
        let m = parseInt((tm % 4) * 15);
        let d = state.currentDate;
        d.setHours(h);
        d.setMinutes(m);
        return d;
    };

    //时间轴改变后设置shadowQuery（不是实时监听）
    function timeChanged(val) {
        if (state.shadowShow) {
            shadowQuery.startTime = Cesium.JulianDate.fromDate(setCurrentTime(val[0]));
            shadowQuery.endTime = Cesium.JulianDate.fromDate(setCurrentTime(val[1]));
        }
        if(state.showStartImgForTime && state.shadowQueryRegion.length>0){
            shadowQuery.build()
        }
    };

    function filterChanged(val) {
        filterBodyShow(val)
    };

    // 时间轴提示函数
    function formatTooltip(val) {
        if (val === state.timeValue[0]) {
            return (
                "开始时间:" + timeSlice(setCurrentTime(val).toLocaleTimeString())
            );
        } else {
            return (
                "结束时间:" + timeSlice(setCurrentTime(val).toLocaleTimeString())
            );
        };
        function timeSlice(str) {
            let str2 = str.split(':');
            return str2[0] + ':' + str2[1]
        }
    };

    // 播放或暂停时间段内阳光和阴影动画
    function sunLightForTime(flag) {
        if (IntervalForDate) {
            state.showStartImgForDate = true;
            clearInterval(IntervalForDate)
        };
        if (!flag) {
            state.showStartImgForTime = true;
            clearInterval(IntervalForTime);
            return;
        } else {
            state.showStartImgForTime = false;
        }
        let time = [...currentTimeArr];
        let stm = time[0];
        let etm = time[1];
        let ntm = stm;
        IntervalForTime = setInterval(() => {
            if (ntm < etm) {
                ntm += 0.5;
                state.timeValue = [stm, ntm];
            } else {
                state.showStartImgForTime = true;
                clearInterval(IntervalForTime);
            }
        }, 50);
    };

    //播放一年的阳光和阴影动画
    function sunLightForDate(flag) {
        if (IntervalForTime) {
            clearInterval(IntervalForTime);
            state.showStartImgForTime = true;
        };
        if (!flag) {
            state.showStartImgForDate = true;
            clearInterval(IntervalForDate);
            return;
        } else {
            state.showStartImgForDate = false;
        }
        let d = setCurrentTime(currentTimeArr[1]); //时分秒默认按时间轴上结束的时间计算
        let mon = d.getMonth();
        IntervalForDate = setInterval(() => {
            if (mon < 11) {
                mon += 1;
            } else {
                mon = 0;
            }
            d.setMonth(mon);
            // viewer.clock.currentTime = Cesium.JulianDate.fromDate(d);
            state.currentDate = new Date(d)
        }, 1000);
    };

    //   阴影分析
    function analysis() {
        if (!state.shadowShow) {
            // tool.Message.warnMsg(resource.ShadowqueryWarn);
            state.shadowShow = true;
            return;
        }
        tooltip.setVisible(false);
        if (tipFlag) {   //只提示一次
            window.tooltip.showAt(' <p>点击鼠标左键绘制分析区域</p><p>点击鼠标右键结束绘制</p>', '350px');
            tipFlag = false
        }
        if (!setLayersFlag || layers[0].shadowType != state.layerShadowType) {
            setLayerShadowType()
        }
        if (!window.handlerPolygon) {
            initHandler("Polygon");
        }
        handlerDrawing("Polygon").then(
            res => {
                let handlerPolygon = window.handlerPolygon;
                shadowQueryUpdate(res.result.object.positions);
                handlerPolygon.polygon.show = false;
                handlerPolygon.polyline.show = false;
                //   window.polylineTransparent.show = false; //半透线隐藏
                handlerPolygon.deactivate();
                //鼠标左键事件监听
                viewer.eventManager.addEventListener("CLICK", LEFT_CLICK, true);
            },
            err => {
                console.log(err);
            }
        );
        window.handlerPolygon.activate();
        state.legendShow = true
    }

    //更新分析
    function shadowQueryUpdate(p) {
        timeChanged(state.timeValue);
        let position = [];
        shadowQuery.spacing = Number(state.spacing);
        shadowQuery.timeInterval = Number(state.timeInterval);
        let bh = Number(state.bottomHeight);
        let eh = Number(state.extrudeHeight);

        //遍历多边形，取出所有点
        let pos = Cesium.arrayRemoveDuplicates(
            p,
            Cesium.Cartesian3.equalsEpsilon
        );
        for (let i = 0, len = pos.length; i < len; i++) {
            //转化为经纬度，并加入至临时数组
            let cartographic = Cesium.Cartographic.fromCartesian(p[i]);
            let longitude = Cesium.Math.toDegrees(cartographic.longitude);
            let latitude = Cesium.Math.toDegrees(cartographic.latitude);
            position.push(longitude);
            position.push(latitude);
        }
        state.shadowQueryRegion = position;

        shadowQuery.qureyRegion({
            position: position,
            bottom: bh,
            extend: eh
        });
        shadowQuery.build();

    }


    // 鼠标左键事件 点击获取阴影率
    function LEFT_CLICK(e) {
        if (state.shadowBodyShow) {
            let box = scene.pick(e.message.position);
            if (box && box.id) {
                let point = shadowQuery_points[box.id];
                if (!point) return;
                let radio = point.shadowRatio * 100;
                if (radio < state.shadowBodyFilter[0] || radio > state.shadowBodyFilter[1]) state.shadowRadio.isShow = false;
                let position = tool.CartesiantoDegrees(point.position);
                state.shadowRadio = {
                    'shadowRadio': (point.shadowRatio * 100).toFixed(0) + '%',
                    'longitude': position[0].toFixed(8),
                    'latitude': position[1].toFixed(8),
                    'height': position[2].toFixed(8),
                    'isShow': true
                }
                bubble.value.style.top = (e.message.position.y - 160) + 'px';
                bubble.value.style.left = (e.message.position.x) + 'px';
            } else {
                state.shadowRadio.isShow = false
            }

        } else {
            let position1 = scene.pickPosition(e.message.position);
            let cartographic = Cesium.Cartographic.fromCartesian(position1);
            let shadowRadio = shadowQuery.getShadowRadio(cartographic);
            if (shadowRadio != -1) {
                let longitude = Cesium.Math.toDegrees(cartographic.longitude);
                let latitude = Cesium.Math.toDegrees(cartographic.latitude);
                let height = cartographic.height;
                state.shadowRadio = {
                    'shadowRadio': (shadowRadio * 100).toFixed(0) + '%',
                    'longitude': longitude.toFixed(8),
                    'latitude': latitude.toFixed(8),
                    'height': height.toFixed(8),
                    'isShow': true
                }
                bubble.value.style.top = (e.message.position.y - 160) + 'px';
                bubble.value.style.left = (e.message.position.x) + 'px';
            }
            else {
                state.shadowRadio.isShow = false
            }
        }
    }

    //关闭气泡
    function closeBubble() {
        state.shadowRadio.isShow = false
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

    // 清除
    function clear() {
        state.legendShow = false;
        clearHandlerDrawing();
        // viewer.entities.removeAll();
        state.shadowQueryRegion.length = 0;
        tooltip.setVisible(false);
        closeBubble();
        viewer.eventManager.removeEventListener("CLICK", LEFT_CLICK); //移除鼠标点击事件监听
        shadowQuery.clear();
        shadowQuery_points.length = 0;
        s3mInstanceCollection.removeCollection(box_s3m);
        // state.shadowBodyShow = false
        for (let i = 0; i < layers.length; i++) {
            layers[i].shadowType = Cesium.ShadowType.NONE
        }
    };

    //体显示
    function bodyShow() {
        let objs = [];
        if (shadowQuery._bottom < 0 || shadowQuery_points.length == 0) {
            return;
        }
        let width = Number(state.spacing - 0.5);
        for (let i = 0, j = shadowQuery_points.length; i < j; i++) {
            objs.push({
                position: shadowQuery_points[i].position,
                color: getShadowRadioColor(shadowQuery_points[i].shadowRatio),
                scale: new Cesium.Cartesian3(width, width, width)
            })
        };
        if (objs.length > 0) {
            s3mInstanceCollection.add(box_s3m, objs);
        }
        filterBodyShow(state.shadowBodyFilter)
    };

    //体显示获取颜色
    function getShadowRadioColor(shadowRadio) {
        let index = parseInt((shadowRadio * 100));
        let col = color[index];
        return Cesium.Color.fromCssColorString(col);
    };

    //过滤体显示
    function filterBodyShow(arr) {
        if (shadowQuery._bottom <= 0 || shadowQuery_points.length == 0) {
            return;
        }
        for (let i = 0, j = shadowQuery_points.length; i < j; i++) {
            let Ratio = shadowQuery_points[i].shadowRatio * 100;
            if (Ratio < arr[0] || Ratio > arr[1]) {
                s3mInstanceCollection.getInstance(box_s3m, i).visible = false
            } else {
                s3mInstanceCollection.getInstance(box_s3m, i).visible = true
            }
        }
    }


    //   监听
    watch(() => state.timeValue, val => {
        timeChanging(val)
    });
    watch(() => state.currentDate, val => {
        timeChanging(currentTimeArr)
    });
    watch(() => state.timeInterval, val => {
        changeSlider(() => {
            shadowQuery.timeInterval = Number(val);
        })
    });
    watch(() => state.spacing, val => {
        changeSlider(() => {
            shadowQuery.spacing = Number(val);
        })
    });
    watch(() => state.bottomHeight, val => {
        if (state.shadowQueryRegion.length === 0) return;
        changeSlider(() => {
            let bh = Number(val);
            let eh = Number(state.extrudeHeight);
            shadowQuery.qureyRegion({
                position: state.shadowQueryRegion,
                bottom: bh,
                extend: eh
            });
            shadowQuery.build();
        })
    });
    watch(() => state.extrudeHeight, val => {
        if (state.shadowQueryRegion.length === 0) return;
        changeSlider(() => {
            let bh = Number(state.bottomHeight);
            let eh = Number(val);
            shadowQuery.qureyRegion({
                position: state.shadowQueryRegion,
                bottom: bh,
                extend: eh
            });
            shadowQuery.build();
        })
    });
    watch(() => state.shadowShow, val => {
        viewer.shadows = val;
        for (let i = 0, j = layers.length; i < j; i++) {
            if (layers[i].shadowType == state.layerShadowType) break;
            else layers[i].shadowType = state.layerShadowType
        }
    });
    watch(() => state.shadowBodyShow, val => {
        if (val) {
            shadowQuery.isPointsVisible = false;
            bodyShow()
        } else {
            shadowQuery.isPointsVisible = true;
            s3mInstanceCollection.removeCollection(box_s3m);
        }
    });

    let timer;
    // 防止滑块快速滑动的多次执行
    function changeSlider(callback) {
        if (timer) clearTimeout(timer);
        timer = setTimeout(function () {
            callback()
        }, 500);

    }



    // 销毁
    onBeforeUnmount(() => {
        clear();

        shadowQuery.destroy();
        shadowQuery = undefined;
        viewer.shadows = false;
        layers = undefined;
    })

    return {
        ...toRefs(state),
        timeChanged,
        filterChanged,
        formatTooltip,
        sunLightForTime,
        sunLightForDate,
        analysis,
        clear,
        bubble,
        closeBubble,
        dockBubble
    };
};

export default shadowquery

