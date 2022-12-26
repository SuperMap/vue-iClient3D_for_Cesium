
// 引入依赖
import { watch, ref, reactive, toRefs, onBeforeUnmount, onMounted } from "vue";
import { storeState } from '../../../js/store/store.js'   //简单局部状态管理
import tool from '../../../js/tool/tool.js'        //提示等工具
import resource from '../../../js/local/lang.js'  //语言资源
import { initHandler, handlerDrawing, clearHandlerDrawing } from "../../../js/common/drawHandler.js"    //公共handler.js
import { Edit, clearEditHandler, } from "../../../js/common/editHandler.js"    //公共handler.js
import createTooltip from '../../../js/tool/tooltip2.js'
import config from './config.js'  //语言资源
import debounce from "../../../js/drag/debounce.js";

function draw(props) {
    // 设置默认值数据
    let state = reactive({
        drawModle: "space",  //绘制模式
        currentId: "1",  //当前选中线id
        config: config,  //线类型配置  
        lineColor: "rgba(250, 196, 65, 1)",  //设置线颜色
        lineWidth: 5,  //设置选中线宽
        dottedColor: "rgba(250, 196, 65, 0)",  //间隔颜色
        dottedLength: 30,
        outLineColor: "rgba(29, 206, 200, 1)",
        outLineWidth: 2,
        glowStrength: 0.5,
        trailPercentage: 0.3,
        trailPeroid: 2,
        isEdit: true,
        isEditZ: false,
        //面
        drawType: 'polyline',
        solidColor: "rgba(250, 196, 65, 1)",
        gridColor: "rgba(250, 196, 65, 1)",
        gridWidth: 1,
        gridCount: 8,
        gridCellAlpha: 0.1,
        stripeEvenColor: "#FFFFFF",
        stripeOddColor: "#000000",
        stripeRepeat: 12,
        stripeOffset: 0,
        stripeOrientation: "horizontal",
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
    let clampToGround = undefined, classificationType = undefined;
    let perPositionHeight = true, clampToS3M = undefined, classificationType_gon = Cesium.ClassificationType.TERRAIN;
    let selected_line = undefined;
    let selected_gon = undefined;
    let setHeight = undefined;


    if (storeState.isViewer) {
        if (!window.tooltip) {
            window.tooltip = createTooltip(viewer._element);
        }
        viewer.eventManager.addEventListener("CLICK", LEFT_CLICK_Listener, false);
        Edit(); //编辑功能
    }
    //viewer 初始化完成的监听
    watch(() => storeState.isViewer, val => {
        if (val) {
            if (!window.tooltip) {
                window.tooltip = createTooltip(viewer._element);
            }
            viewer.eventManager.addEventListener("CLICK", LEFT_CLICK_Listener, false);
            Edit(); //编辑功能
        }
    });

    function changeSelect(id) {
        state.currentId = id;
    }

    function drawPolyline() {
        if (!window.handlerPolyline) {
            initHandler("Polyline");
        }
        window.tooltip.showAt(' <p>点击鼠标左键开始绘制</p><p>右键单击结束分析</p><p>选中对象进行编辑或清除</p>', '50%');
        handlerDrawing("Polyline").then(
            res => {
                creat_entity_line(res.result.object.positions)
                let handlerPolyline = window.handlerPolyline;
                handlerPolyline.polyline.show = false;
                window.polylineTransparent.show = false; //半透线隐藏
                handlerPolyline.deactivate();
                tooltip.setVisible(false);
            },
            (err) => {
                console.log(err);
            }
        );
        window.handlerPolyline.activate();
    }

    function creat_entity_line(position) {
        let lineColor = Cesium.Color.fromCssColorString(state.lineColor);
        let lineWidth = Number(state.lineWidth);
        let material;
        switch (state.currentId) {
            case '1':
                material = lineColor
                break;
            case '2':
                let dottedColor = Cesium.Color.fromCssColorString(state.dottedColor); //间隔颜色
                let dottedLength = Number(state.dottedLength);
                material = new Cesium.PolylineDashMaterialProperty({
                    color: lineColor,
                    gapColor: dottedColor,
                    dashLength: dottedLength,
                })
                break;
            case '3':
                let outLineColor = Cesium.Color.fromCssColorString(state.outLineColor); //轮廓颜色
                let outLineWidth = Number(state.outLineWidth);
                material = new Cesium.PolylineOutlineMaterialProperty({
                    color: lineColor,
                    outlineWidth: outLineWidth,
                    outlineColor: outLineColor,
                })
                break;
            case '4':
                material = new Cesium.PolylineArrowMaterialProperty(lineColor)
                break;
            case '5':
                let glowStrength = Number(state.glowStrength);
                material = new Cesium.PolylineGlowMaterialProperty({
                    glowPower: glowStrength,
                    color: lineColor,
                })
                break;
            case '6':
                let trailPercentage = Number(state.trailPercentage);
                material = new Cesium.PolylineTrailMaterialProperty({
                    color: lineColor,
                    trailLength: trailPercentage,
                    period: state.trailPeroid,
                })
                break;
            default: material = lineColor
                break;
        };
        selected_line = viewer.entities.add({
            id: "polyline-symbol-line-" + new Date().getTime(),
            polyline: {
                positions: position,
                width: lineWidth,
                material: material,
                clampToGround: clampToGround, //线贴地
                classificationType: classificationType, //线面贴对象
                height: setHeight
            },
        });

    }

    function LEFT_CLICK_Listener(e) {
        //获取点击位置笛卡尔坐标
        let selectedEntity = viewer.scene.pick(e.message.position);
        if (selectedEntity && selectedEntity.id && selectedEntity.id.id && typeof (selectedEntity.id.id) === 'string') {
            if (selectedEntity.id.id.indexOf("polyline-symbol-line") != -1) {
                selected_line = selectedEntity.id;
            }
            if (selectedEntity.id.id.indexOf("polygon-symbol-gon") != -1) {
                selected_gon = selectedEntity.id;
            }
        }
    }

    function clear() {
        if (selected_line && state.drawType === 'polyline') viewer.entities.removeById(selected_line.id);
        if (selected_gon && state.drawType === 'polygon') viewer.entities.removeById(selected_gon.id);
        window.tooltip.setVisible(false);
        clearHandlerDrawing('Polyline');
        clearHandlerDrawing('Polygon');
        if (window.editHandler) window.editHandler.clear()
    }

    function draw() {
        if (state.drawType === 'polyline') drawPolyline();
        else drawPolygon()
    }

    function drawPolygon() {
        if (!window.handlerPolygon) {
            initHandler("Polygon");
        }
        handlerDrawing("Polygon", false).then(
            res => {
                let handlerPolygon = window.handlerPolygon;
                creat_entity_gon(res.result.object.positions);
                handlerPolygon.polygon.show = false;
                handlerPolygon.polyline.show = false;
                handlerPolygon.deactivate();
            },
            err => {
                console.log(err);
            }
        );
        window.handlerPolygon.activate();
    }

    function creat_entity_gon(position) {
        console.log(position)
        let material;
        switch (state.currentId) {
            case '1':
                let polygonColor = Cesium.Color.fromCssColorString(state.solidColor);
                material = polygonColor
                break;
            case '2':
                let gridColor = Cesium.Color.fromCssColorString(state.gridColor); //间隔颜色
                let gridWidth = Number(state.gridWidth);
                let gridCount = Number(state.gridCount);
                let gridCellAlpha = Number(state.gridCellAlpha);
                material = new Cesium.GridMaterialProperty({
                    color: gridColor,
                    cellAlpha: gridCellAlpha,
                    lineCount: new Cesium.Cartesian2(
                        gridCount,
                        gridCount
                    ),
                    lineThickness: new Cesium.Cartesian2(
                        gridWidth,
                        gridWidth
                    )
                })
                break;
            case '3':
                let stripeEvenColor = Cesium.Color.fromCssColorString(state.stripeEvenColor); //间隔颜色
                let stripeOddColor = Cesium.Color.fromCssColorString(state.stripeOddColor); //间隔颜色
                let stripeRepeat = Number(state.stripeRepeat);
                let stripeOffset = Number(state.stripeOffset);
                material = new Cesium.StripeMaterialProperty({
                    evenColor: stripeEvenColor,
                    oddColor: stripeOddColor,
                    repeat: stripeRepeat,
                    offset: stripeOffset,
                    orientation: state.stripeOrientation === 'horizontal' ? 0 : 1,
                })
                break;

            default:
                break;
        };
        selected_gon = viewer.entities.add({
            id: "polygon-symbol-gon-" + new Date().getTime(),
            polygon: {
                hierarchy: {
                    positions: position,
                },
                material: material,
                perPositionHeight: perPositionHeight,
                // heightReference: Cesium.HeightReference.NONE 
                groundBottomAltitude:0,
                groundExtrudedHeight:100
            },
            // clampToS3M: clampToS3M
            classificationType: classificationType, //面贴对象
            height: setHeight,


        });
    }

    // 销毁
    onBeforeUnmount(() => {
        if (viewer) viewer.eventManager.removeEventListener("CLICK", LEFT_CLICK_Listener);
    });


    // 监听
    function setLineMode(val1, val2, val3) {
        clampToGround = val1;
        classificationType = val2;
        setHeight = val3;
        if (selected_line) {
            selected_line.polyline.clampToGround = clampToGround;
            selected_line.polyline.classificationType = classificationType;
            selected_line.polyline.height = val3;
        }
    }
    // 
    function setGonMode(val1, val2, val3) {
        perPositionHeight = val1;
        classificationType = val2;
        setHeight = val3;
        if (selected_gon) {
            selected_gon.polygon.perPositionHeight = perPositionHeight;
            selected_gon.classificationType = classificationType;
            selected_gon.polygon.height = val3;
        }
    }

    watch(() => state.drawModle, val => {
        let isLine = state.drawType === 'polyline' ? true : false;
        switch (val) {
            case "space":
                if (isLine) setLineMode(undefined, undefined, undefined);
                else setGonMode(true, undefined, undefined)
                break;
            case "stick":
                if (isLine) setLineMode(true, Cesium.ClassificationType.TERRAIN, 0);
                else setGonMode(false, Cesium.ClassificationType.TERRAIN, 0)
                break;
            case "postObject":
                if (isLine) setLineMode(true, Cesium.ClassificationType.S3M_TILE, undefined);
                else setGonMode(false, Cesium.ClassificationType.S3M_TILE, undefined)
                break;
            default:
                setLineMode(undefined, undefined, undefined);
                setGonMode(true, false, undefined)
                break;
        };
    });
    watch(() => state.lineColor, val => {
        let color = Cesium.Color.fromCssColorString(val);
        if (selected_line)
            selected_line.polyline.material.color = color;
    });
    watch(() => state.lineWidth, val => {
        if (selected_line)
            selected_line.polyline.width = Number(val);
    });

    watch(() => state.dottedColor, val => {
        let color = Cesium.Color.fromCssColorString(val);
        if (selected_line)
            selected_line.polyline.material.gapColor = color;
    });

    watch(() => state.dottedLength, val => {
        if (selected_line)
            selected_line.polyline.material.dashLength = Number(val);
    });
    watch(() => state.outLineColor, val => {
        let color = Cesium.Color.fromCssColorString(val);
        if (selected_line)
            selected_line.polyline.material.outlineColor = color;
    });
    watch(() => state.outLineWidth, val => {
        if (selected_line)
            selected_line.polyline.material.outlineWidth = Number(val);
    });
    watch(() => state.glowStrength, val => {
        if (selected_line)
            selected_line.polyline.material.glowPower = Number(val);
    });
    watch(() => state.trailPercentage, val => {
        if (selected_line)
            selected_line.polyline.material.trailLength = Number(val);
    });
    watch(() => state.isEdit, val => {
        if (!selected_line) return;
        if (val) { Edit(); return; }
        clearEditHandler();
    });
    watch(() => state.isEditZ, val => {
        if (!selected_line) return;
        if (window.editHandler) {
            window.editHandler.isEditZ = val;
        }
    });

    //面
    watch(() => state.drawType, val => {
        state.currentId = '1';
    });
    watch(() => state.solidColor, val => {
        let color = Cesium.Color.fromCssColorString(val);
        if (selected_gon)
            selected_gon.polygon.material = color;
    });
    watch(() => state.gridColor, val => {
        let color = Cesium.Color.fromCssColorString(val);
        if (selected_gon)
            selected_gon.polygon.material.color = color;
    });
    watch(() => state.gridWidth, val => {
        if (selected_gon)
            selected_gon.polygon.material.lineThickness = new Cesium.Cartesian2(
                Number(val),
                Number(val)
            );
    });
    watch(() => state.gridCount, val => {
        if (selected_gon)
            selected_gon.polygon.material.lineCount = new Cesium.Cartesian2(
                Number(val),
                Number(val)
            );
    })
    watch(() => state.gridCellAlpha, val => {
        if (selected_gon)
            selected_gon.polygon.material.cellAlpha = Number(val)
    })
    watch(() => state.stripeEvenColor, val => {
        let color = Cesium.Color.fromCssColorString(val);
        if (selected_gon)
            selected_gon.polygon.material.evenColor = color;
    });
    watch(() => state.stripeOddColor, val => {
        let color = Cesium.Color.fromCssColorString(val);
        if (selected_gon)
            selected_gon.polygon.material.oddColor = color;
    });
    watch(() => state.stripeRepeat, val => {
        if (selected_gon)
            selected_gon.polygon.material.repeat = Number(val)
    })
    watch(() => state.stripeOffset, val => {
        if (selected_gon)
            selected_gon.polygon.material.offset = Number(val)
    })
    watch(() => state.stripeOrientation, val => {
        if (!selected_gon) return;
        let or = val === 'horizontal' ? 0 : 1;
        selected_gon.polygon.material.orientation = or
    })



    return {
        ...toRefs(state),
        draw,
        changeSelect,
        clear
    };
};

export default draw

