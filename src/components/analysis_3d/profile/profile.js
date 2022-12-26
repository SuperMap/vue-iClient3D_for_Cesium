
// 引入依赖
import { watch, ref, reactive, toRefs, onBeforeUnmount, onMounted } from "vue";
import tool from '../../../js/tool/tool.js'        //提示等工具
import resource from '../../../js/local/lang.js'  //语言资源
import { storeState, storeDate } from '../../../js/store/store.js'   //简单局部状态管理
import { initHandler, handlerDrawing, clearHandlerDrawing } from "../../../js/common/drawHandler.js"    //公共handler.js
import { Edit, clearEditHandler, } from "../../../js/common/editHandler.js"    //公共handler.js
import createTooltip from '../../../js/tool/tooltip2.js'

function profile(props) {

    // 设置默认值数据
    let state = reactive({
        profile2d: false, //显示剖面分析结果
        polylineColor: "rgb(250, 213, 6)", //贴线颜色
        polylineWidth: 5,   //贴线宽度
        initEchartsOption:null,  //初始化自定义echarts配置对象
        updateEchartsOption:null , //自定义更新echarts配置对象
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
    let myChart, count, //插值点个数
        Entypositions; //当前图标的位置
    let tipFlag = true;  //提示操作提醒一次
    let LatAndLons = []; //所有点的经纬度
    let Cartesians = [];  //所有点的笛卡尔
    let EditPositions= null; //编辑时保存之前位置

    const echarts_box = ref(null);
    onMounted(() => {
        initMyChart();
    });
    if (storeState.isViewer) {
        if (!window.tooltip) {
            window.tooltip = createTooltip(viewer._element);
        }
    }
    //viewer 初始化完成的监听
    watch(() => storeState.isViewer, val => {
        if (val) {
            if (!window.tooltip) {
                window.tooltip = createTooltip(viewer._element);
            }
        }
    });

    //初始化echarts
    function initMyChart() {
        if (window.echarts) {
            if (!myChart) {
                myChart = window.echarts.init(echarts_box.value);  //初始化echarts
                window.onresize = function () {
                    myChart.resize()  //自适应屏幕
                };
            }
        } else {
            tool.Message.warnMsg(resource.EchartsErr);
            return;
        }
        if(state.initEchartsOption){
            myChart.setOption(state.initEchartsOption);
            return;
        }
        myChart.setOption({
            title: {
                text: "剖面分析",
                textStyle: {
                    fontSize: 14
                }
            },
            grid: {
                left: 30,
                right: 0,
                top: 30,
                bottom: 8
            },
            tooltip: {},
            xAxis: {
                data: [],
            },
            yAxis: {
                data: [],
            },
            series: [
                {
                    type: "bar",
                    data: [],
                },
            ],
        });
    };
    /*
     ***分析模块***
    */

    //分析
    function analysis() {
        if (tipFlag) {   //只提示一次
            tooltip.showAt(' <p>点击鼠标左键开始绘制</p> <p>单击右键结束分析</p><p>选中可进行编辑</p>', '250px');
            tipFlag = false
        }
        if (!window.handlerPolyline) {
            initHandler("Polyline");
        }
        handlerDrawing("Polyline").then(
            res => {
                myChart.showLoading();
                EditPositions = res.positions;
                DrawPolylineUpdate(res.positions); //划线效果
                let handlerPolyline = window.handlerPolyline;
                handlerPolyline.polyline.show = false;
                window.polylineTransparent.show = false; //半透线隐藏
                handlerPolyline.deactivate();
                updataProfile3D('', res.result.positions); //更新剖面
                Edit(EditPositions, false, updataProfile3D); //编辑功能
                tooltip.setVisible(false);
            },
            (err) => {
                console.log(err);
            }
        );
        window.handlerPolyline.activate();
    };

    // 绘制剖面分析的线
    function DrawPolylineUpdate(position) {
        viewer.entities.removeById('polyline-profile');
        viewer.entities.removeById('location4');
        let fullLineColor = Cesium.Color.fromCssColorString(state.polylineColor);
        viewer.entities.add({
            id: "polyline-profile",
            polyline: {
                positions: Cesium.Cartesian3.fromDegreesArrayHeights(position),
                width: state.polylineWidth,
                material: fullLineColor,
                clampToGround: true, //线贴地
                // classificationType: Cesium.ClassificationType.S3M_TILE, //线面贴对象
            },
        });
        entityUpdate();
    };

    // 更新剖面分析二维图
    function updataProfile3D(position, line) {
        state.profile2d = true; //打开echarts
        myChart.clear()
        myChart.showLoading();
        //position参数不起作用，是为了edit函数不冲突
        LatAndLons.length = 0; //清空之前的点数据
        Cartesians.length = 0; //清空之前的点数据
        let positions = [];
        //折线实现
        for (let i = 1, j = line.length; i < j; i++) {
            let startPoint = line[i - 1];
            let endPoint = line[i];
            let d = Cesium.Cartesian3.distance(startPoint, endPoint)
            getCount(parseInt(d));
            for (let i = 1, j = count; i <= j; i++) {
                positions.push(
                    Cesium.Cartesian3.lerp(
                        startPoint,
                        endPoint,
                        i / count,
                        new Cesium.Cartesian3()
                    )
                );
            }
        }
        viewer.scene
            .clampToHeightMostDetailed(positions)
            .then((clampedCartesians) => {
                Cartesians = clampedCartesians;  //记录所有点的笛卡尔坐标
                LatAndLons = tool.CartesiantoDegreesObjs(Cartesians);  //记录所有点的经纬度坐标
                echartsOption();  //更新echarts
            });
    };

    //精度计算count插值
    function getCount(distance) {
        if (distance / 10000 > 1) {
            count = parseInt(distance / 100)    //  (>10000)  100m
        } else if (distance / 1000 > 5) {
            count = parseInt(distance / 10)    // (5000-10000)  10m
        } else if (distance / 1000 > 2) {
            count = parseInt(distance / 5)     // (2000-5000)  5m
        } else if (distance / 1000 > 1) {
            count = parseInt(distance / 2)     // (1000-2000)  2m
        } else if (distance / 100 > 5) {
            count = parseInt(distance / 1.5)   //  (500-1000) 1.5m
        } else if (distance / 100 > 2) {
            count = distance                  // (200-500) 1m 
        } else {
            count = distance * 2              //   (<200) 0.5m
        }
    }

    // 更新交互图标
    function entityUpdate() {
        if (viewer.entities.getById("location4")) {
            return;
        }
        viewer.entities.add({
            id: "location4",
            position: new Cesium.CallbackProperty(() => {
                return Entypositions;
            }, false),
            billboard: {
                image: "src/style/images/location4.png",
                width: 30,
                height: 40,
                scaleByDistance: new Cesium.NearFarScalar(10, 1.0, 2000, 0.6),
                eyeOffset :new Cesium.Cartesian3(0, 1, -5)
                // heightReference :Cesium.HeightReference.RELATIVE_TO_GROUND
                // disableDepthTestDistance :5000,
                // pixelOffset : new Cesium.Cartesian2(0.0, 1.0),
                // pixelOffsetScaleByDistance : new Cesium.NearFarScalar(1.5e2, 0.0, 8.0e6, 10.0)
            },
        });
    };

    // 更新图表数据
    function echartsOption() {
        myChart.hideLoading();
        myChart.clear();
        if(state.updateEchartsOption){
            myChart.setOption(state.updateEchartsOption);
            return;
        }
        let option = {
            title: {
                text: "剖面信息",
                textStyle: {
                    fontSize: 14
                }
            },
            // 定位
            grid: {
                left: 50,
                right: 8,
                top: 40,
                bottom: 20,
            },
            // backgroundColor: "rgba(73,139,156,0.0)",
            tooltip: {
                trigger: "axis",
                backgroundColor: "#ffffff",
                textStyle: {
                    color: "#000",
                },
                formatter: (param) => {
                    let dataIndex = param[0].dataIndex;
                    Entypositions = Cartesians[dataIndex];
                    return [
                        "当前位置: " + '<hr size=1 style="margin: 3px 0">',
                        "经度: " +
                        LatAndLons[dataIndex].longitude.toFixed(6) +
                        "<br/>",
                        "纬度: " +
                        LatAndLons[dataIndex].latitude.toFixed(6) +
                        "<br/>",
                        "海拔: " +
                        LatAndLons[dataIndex].height.toFixed(2) +
                        "米" +
                        "<br/>",
                    ].join("");
                },
            },
            xAxis: {
                data: LatAndLons.map(function (item, index) {
                    return index;
                }),
                show: false,
            },
            yAxis: {
                min: function (value) {
                    return value.min < 20 ? 0 : Math.floor(value.min);
                },
                axisLabel: {
                    interval: "auto",
                    formatter: function (value, index) {
                        return value > 999
                            ? (value / 1000).toFixed(2) + "km"
                            : value + "m";
                    },
                },
                splitLine: {
                    show: true,
                },
            },
            toolbox: {
                left: "right",
                feature: {
                    dataZoom: {
                        yAxisIndex: "none",
                    },
                    restore: {},
                    saveAsImage: {},
                },
            },
            dataZoom: [
                {
                    type: "inside",
                    xAxisIndex: 0,
                    filterMode: "filter",
                    start: 0,
                    end: 100,
                },
            ],
            series: {
                name: "height",
                type: "line",
                data: LatAndLons.map(function (item) {
                    return item.height;
                }),
                areaStyle: {},
            },
        };
        myChart.setOption(option);
    };

    // 清除
    function clear() {
        state.profile2d = false;
        viewer.entities.removeById('location4');
        viewer.entities.removeById('polyline-profile');
        myChart.clear();
        LatAndLons.length = 0; //清空之前的点数据
        Cartesians.length = 0; //清空之前的点数据
        clearHandlerDrawing("Polyline");
        clearEditHandler();
        initMyChart();
        tooltip.setVisible(false);
    };

    // 监听
    watch(() => state.profile2d, newValue => {
        if (!newValue || !myChart) {
            state.getSkyline2d = false;
            return;
        }
        setTimeout(() => {
            myChart.resize()  //自适应屏幕
        }, 200)
    });

    // 销毁
    onBeforeUnmount(() => {
        clear();
        myChart.clear();
        LatAndLons.length = 0; //清空之前的点数据
        Cartesians.length = 0; //清空之前的点数据
    })

    return {
        ...toRefs(state),
        echarts_box,
        myChart,
        Entypositions,
        LatAndLons,  //所有点的经纬度
        Cartesians,  //所有点的笛卡尔
        analysis,
        clear
    };
};

export default profile

