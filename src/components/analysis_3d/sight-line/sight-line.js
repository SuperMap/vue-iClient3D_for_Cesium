
// 引入依赖
import { watch, ref, reactive, toRefs, onBeforeUnmount, onMounted } from "vue";
import tool from '../../../js/tool/tool.js'        //提示等工具
import resource from '../../../js/local/lang.js'  //语言资源
import { storeState, storeDate } from '../../../js/store/store.js'   //简单局部状态管理
import { initHandler, handlerDrawing, clearHandlerDrawing } from "../../../js/common/drawHandler.js"    //公共handler.js
import { Edit, clearEditHandler, } from "../../../js/common/editHandler.js"    //公共handler.js
import createTooltip from '../../../js/tool/tooltip2.js'
import DragEntity from '../../../js/common/dragEntity.js'


function sightLine(props) {

    // 设置默认值数据
    let state = reactive({
        viewPosition: null,
        visibleColor: "rgb(0, 200, 0)",
        hiddenColor: "rgb(200, 0, 0)",
        highlightBarrierColor: "rgba(255, 186, 1, 1)",
        highlightBarrier: false,
        lineWidth: 3,
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
    let scene, sightline, dragEntity
    let timer, tipFlag = true, clickFlag = false, ObjectIds = [];
    let point_index = 0, sightTargetPoints = [], sightBarrierPoints = [],sightBarrierPointsColor = [];
    let viewPointPosition;
    if (storeState.isViewer) {
        if (!window.tooltip) {
            window.tooltip = createTooltip(viewer._element);
        }
        init();
    }
    //viewer 初始化完成的监听
    watch(() => storeState.isViewer, val => {
        if (val) {
            if (!window.tooltip) {
                window.tooltip = createTooltip(viewer._element);
            }
            init();
        }
    });
    function init() {
        scene = viewer.scene;
        sightline = new Cesium.Sightline(scene);
        sightline.visibleColor = Cesium.Color.fromCssColorString(
            state.visibleColor
        );
        sightline.hiddenColor = Cesium.Color.fromCssColorString(state.hiddenColor);
      
        sightline.lineWidth = Number(state.lineWidth);
        dragEntity = new DragEntity(viewer, 'sightPoint_', _moveEndCallBack, _leftUpCallBack)
    };

    /*
     ***分析模块***
    */

    //分析
    function analysis() {
        viewer.enableCursorStyle = false;
        viewer._element.style.cursor = "";
        document.body.classList.add("measureCur");
        if (tipFlag) {   //只提示一次
            window.tooltip.showAt(' <p>点击鼠标左键确认观察者位置</p><p>再点击左键确认目标位置</p> <p>右键单击结束分析</p>', '250px');
            tipFlag = false
        }
        dragEntity.removeEventListener() //清除编辑交互事件
        //鼠标左键事件监听
        viewer.eventManager.addEventListener("CLICK", LEFT_CLICK, true);
        viewer.eventManager.addEventListener("MOUSE_MOVE", MOUSE_MOVE);
        viewer.eventManager.addEventListener("RIGHT_CLICK", RIGHT_CLICK, true);
    };

    //   点击左键确认观察者点和目标点
    function LEFT_CLICK(e) {
        clickFlag = true;
        clearTimeout(timer);
        timer = setTimeout(() => { clickFlag = false }, 20);  //添加点时延迟移动添加目标点
        let position = scene.pickPosition(e.message.position);
        let p = tool.CartesiantoDegrees(position) // 将获取的点的位置转化成经纬度
        if (p[2] < 0) {
            p[2] = 0;
            position = Cesium.Cartesian3.fromDegrees(p[0], p[1], p[2])
        }
        if (state.viewPosition) {
            sightline.addTargetPoint({
                position: p,
                name: "sightPoint_Target" + point_index,
            });
            sightTargetPoints.push(position);
            // 添加障碍点
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    sightline.getBarrierPoint(('sightPoint_Target' + point_index), (obj) => {
                        addSightPoint_Target(point_index);  //添加目标点 
                        if (obj && obj.position) {
                            obj.position.height += 2;
                            let position = Cesium.Cartographic.toCartesian(obj.position);
                            sightBarrierPoints.push(position);  //记录障碍点信息
                            // 记录障碍物id
                            let ObjectId = sightline.getObjectIds();
                            ObjectIds.push(ObjectId);
                            sightBarrierPointsColor.push(state.hiddenColor);
                        } else {
                            sightBarrierPoints.push({ x: 6378137, y: 0, z: 0 });
                            sightBarrierPointsColor.push(state.visibleColor);
                        }
                        addBarrierCone(point_index);  //添加障碍点
                        point_index += 1;
                    })
                })
            })
        } else {
            sightline.viewPosition = p;
            // 观察者信息记录
            state.viewPosition = p;
            sightline.build();
            addSightPoint_view();
            viewPointPosition = position;
        }
    };

    // 添加观察点
    function addSightPoint_view() {
        viewer.entities.add(new Cesium.Entity({
            id: 'sightPoint_view',
            point: new Cesium.PointGraphics({
                color: Cesium.Color.fromCssColorString(state.highlightBarrierColor),
                pixelSize: 10
            }),
            position: new Cesium.CallbackProperty(() => {
                return viewPointPosition;
            }, false),
        }));
    }

    function addSightPoint_Target(i) {
        viewer.entities.add(new Cesium.Entity({
            id: 'sightPoint_Target' + i,
            point: new Cesium.PointGraphics({
                // color: Cesium.Color.fromCssColorString(state.highlightBarrierColor),
                color:new Cesium.CallbackProperty(() => {
                    return Cesium.Color.fromCssColorString(sightBarrierPointsColor[i]);
                }, false),
                pixelSize: 10
            }),
            position: new Cesium.CallbackProperty(() => {
                return (sightTargetPoints[i]);
            }, false),
        }));
    }
    // 绘制障碍点圆锥
    function addBarrierCone(i) {
        viewer.entities.add({
            name: 'Point_Barrier' + i,
            position: new Cesium.CallbackProperty(() => {
                return (sightBarrierPoints[i]);
            }, false),
            // orientation: Cesium.Transforms.headingPitchRollQuaternion(sightBarrierPoints[i], new Cesium.HeadingPitchRoll(0, 0, Math.PI)),
            cylinder: {
                length: 3,
                topRadius: 2,
                bottomRadius: 0,
                material: Cesium.Color.fromCssColorString("#d60000")
            }
        });
    }

    // 鼠标移动实时分析
    function MOUSE_MOVE(e) {
        if (!state.viewPosition || clickFlag) return;
        //获取鼠标屏幕坐标,并将其转化成笛卡尔坐标
        let endPosition = scene.pickPosition(e.message.endPosition);
        let p = tool.CartesiantoDegrees(endPosition) // 将获取的点的位置转化成经纬度
        sightline.addTargetPoint({
            position: p,
            name: "point",
        });
    }

    // //鼠标右键确认分析距离和方向，不再执行鼠标移动事件中对可视域的操作
    function RIGHT_CLICK() {
        window.tooltip.setVisible(false);
        document.body.classList.remove("measureCur");
        if (state.highlightBarrier) {
            getHighlightBarriers()
        }
            sightline.removeTargetPoint('point');
            sightline.build()
        //拖拽编辑点
        dragEntity.addEventListener()
        viewer.eventManager.removeEventListener("CLICK", LEFT_CLICK); //移除鼠标点击事件监听
        viewer.eventManager.removeEventListener("MOUSE_MOVE", MOUSE_MOVE); //移除鼠标点击事件监听
        viewer.eventManager.removeEventListener("RIGHT_CLICK", RIGHT_CLICK); //移除鼠标点击事件监听
    };

    function _moveEndCallBack(Entity) {
        if(!Entity.id) return;
        if (Entity.id.includes('sightPoint_Target')) {
            let p = tool.CartesiantoDegrees(Entity.position._value) // 将获取的点的位置转化成经纬度
            sightline.addTargetPoint({
                position: p,
                name: Entity.id,
            });
        } else if (Entity.id.includes('sightPoint_view')) {
            let p = tool.CartesiantoDegrees(Entity.position._value) // 将获取的点的位置转化成经纬度
            sightline.viewPosition = p;
        }
    }

    function _leftUpCallBack(Entity) {
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                if (!Entity.id) return;
                if (Entity.id.includes('sightPoint_view')) {
                    for (let i = 0, j = sightBarrierPoints.length; i < j; i++) {
                        setBarrierPoints('sightPoint_Target' + i,true)
                    }
                } else {
                    setBarrierPoints(Entity.id)
                }
                function setBarrierPoints(Barrier_id,isPointView) {
                    sightline.getBarrierPoint((Barrier_id), (obj) => {
                        let index = Barrier_id.charAt(Barrier_id.length - 1);
                        if (obj && obj.position) {
                            obj.position.height += 2;
                            let position = Cesium.Cartographic.toCartesian(obj.position);
                            let distance;
                            if(isPointView){
                                let lan_lon = sightline._targetPoints.values[index];
                                let Cartesian = Cesium.Cartesian3.fromDegrees(lan_lon[0], lan_lon[1], lan_lon[2])
                                distance = Cesium.Cartesian3.distance(Cartesian, position);
                            }else{
                                distance = Cesium.Cartesian3.distance(Entity.position._value, position);
                            }
                            if (distance >= 2.5) {
                                sightBarrierPoints[index] = position;  //更新障碍点信息
                                sightBarrierPointsColor[index] = state.hiddenColor;
                            } else {
                                sightBarrierPoints[index] = { x: 6378137, y: 0, z: 0 };  //更新障碍点信息
                                sightBarrierPointsColor[index] = state.visibleColor;
                            }
                            // 更新障碍物id
                            let ObjectId = sightline.getObjectIds();
                            ObjectIds.splice(index, 1, ObjectId);
                            if (state.highlightBarrier) {
                                for (let layer of scene.layers.layerQueue) {
                                    layer.removeAllObjsColor();
                                }
                                getHighlightBarriers()
                            }
                        } else {
                            sightBarrierPoints[index] = { x: 6378137, y: 0, z: 0 };  //更新障碍点信息
                            sightBarrierPointsColor[index] = state.visibleColor;
                        }
                    })
                }
            })
        })
    }
    // 获取障碍物
    function getHighlightBarriers() {
        let color = Cesium.Color.fromCssColorString(state.highlightBarrierColor);
        try {
            if (ObjectIds.length === 0) return;
            ObjectIds.forEach((ObjectId) => {
                for (let index in ObjectId) {
                    let layer = viewer.scene.layers.findByIndex(Number(index) - 3); // 底层索引从3开始
                    let ids = ObjectId[index];
                    layer.setObjsColor(ids, color);
                }
            })

        } catch (error) {
            console.log(error)
        }
    }



    // 清除
    function clear() {
        sightline.removeAllTargetPoint();
        for (let layer of scene.layers.layerQueue) {
            layer.removeAllObjsColor();
        }
        point_index = 0;
        ObjectIds.length = 0;
        sightTargetPoints.length = 0;
        sightBarrierPoints.length = 0;
        sightBarrierPointsColor.length =0;
        dragEntity.removeEventListener()
        viewer.entities.removeAll();
        document.body.classList.remove("measureCur");
        window.tooltip.setVisible(false);
        state.viewPosition = null;
        viewer.eventManager.removeEventListener("CLICK", LEFT_CLICK); //移除鼠标点击事件监听
        viewer.eventManager.removeEventListener("MOUSE_MOVE", MOUSE_MOVE); //移除鼠标点击事件监听
        viewer.eventManager.removeEventListener("RIGHT_CLICK", RIGHT_CLICK); //移除鼠标点击事件监听
    };

    // 监听
    watch(() => state.highlightBarrier, newValue => {
        if (newValue) {
            getHighlightBarriers()
        } else {
            for (let layer of scene.layers.layerQueue) {
                layer.removeAllObjsColor();
            }
        }
    });

    // 销毁
    onBeforeUnmount(() => {
        clear();
        sightline = undefined;
    })

    return {
        ...toRefs(state),
        analysis,
        clear
    };
};

export default sightLine

