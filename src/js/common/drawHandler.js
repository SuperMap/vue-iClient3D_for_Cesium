//DrawHandler封装

import createTooltip from '../tool/tooltip.js';
import {CartesiantoDegrees} from '../tool/tool.js';
import resource from '../local/lang.js'  //语言资源

/**
 * 初始化
 * DrawMode：类型
 * clampMode：模式
 */
const initHandler = function (DrawMode, clampMode) {
    let clampmode = 0;
    if (clampMode) {
        clampmode = clampMode
    };
    switch (DrawMode) {
        case "Point":
            window.handlerPoint = new Cesium.DrawHandler(viewer, Cesium.DrawMode.Point);
            break;
        case "Polyline":
            window.handlerPolyline = new Cesium.DrawHandler(viewer, Cesium.DrawMode.Line, clampmode);
            break;
        case "Polygon":
            window.handlerPolygon = new Cesium.DrawHandler(viewer, Cesium.DrawMode.Polygon, clampmode);
            break;
        case "Marker":
            window.handlerMarker = new Cesium.DrawHandler(viewer, Cesium.DrawMode.Marker, clampmode);
            break;
        case "Box":
            window.handlerBox = new Cesium.DrawHandler(viewer, Cesium.DrawMode.Box, clampmode);
            break;
        default:
            null;
    };
    if (!window.tooltip) {
        window.tooltip = createTooltip(viewer._element);
    }
    // 半透线创建
    if (!window.polylineCollection) {
        window.polylineCollection = new Cesium.PolylineCollection({
            translucentRS: Cesium.RenderState.fromCache({
                depthMask: false,
                depthTest: {
                    enabled: false
                }
            })
        });
        window.polylineTransparent = window.polylineCollection.add({
            width: 2,
            material: Cesium.Material.fromType(Cesium.Material.ColorType, {
                color: Cesium.Color.fromCssColorString("#51ff00").withAlpha(
                    0.3
                )
            })
        });
        viewer.scene.primitives.add(window.polylineCollection);
    }
};

/**
 * 绘制
 * PolyType：类型 
 * lineVisib：绘制时是否显示绘制线（boolean）
 * toolTipObj：绘制时提示内容{beforeDrawing：绘制开始前提示(string)，isDrawing：正在绘制时提示,即绘制过程中（string）}
 */
const handlerDrawing = function (PolyType, lineVisib, toolTipObj) {
    let lineVisible = true;
    if (lineVisib===false) {
        lineVisible = lineVisib
    }
    let DrawHandler = judgeDrawHandlerType(PolyType); //获取操作对象
    return new Promise((resolve, reject) => { //做一些异步操作
        let tooltip = window.tooltip;
        let clearActFn = DrawHandler.activeEvt.addEventListener((isActive) => {
            if (isActive == true) {
                viewer.enableCursorStyle = false;
                viewer._element.style.cursor = '';
                if (PolyType == "Point" || PolyType == "Marker") {
                    document.body.classList.add("measureCur");
                } else {
                    document.body.classList.add("drawCur");
                }
            } else {
                viewer.enableCursorStyle = true;
                tooltip.setVisible(false);
                if (PolyType == "Point" || PolyType == "Marker") {
                    document.body.classList.remove('measureCur');
                } else {
                    document.body.classList.remove('drawCur');
                }
            }
        });

        let clearMovFn = DrawHandler.movingEvt.addEventListener((windowPosition) => {
            if (windowPosition.x < 200 && windowPosition.y < 150) {
                tooltip.setVisible(false);
                return;
            };
            // if (tiptext) {
            //     tooltip.showAt(windowPosition, tiptext);
            // } else if (toolTipObj && toolTipObj.beforeDrawing) {
            //     tooltip.showAt(windowPosition, toolTipObj.beforeDrawing);
            // }else if (DrawHandler.isDrawing && toolTipObj.isDrawing) {
            //     tooltip.showAt(windowPosition, toolTipObj.isDrawing);
            // }
            
            if (DrawHandler.polyline && DrawHandler.isDrawing) {
                let p  = [...DrawHandler.positions]
                if (PolyType == "Polygon") { //画面时，需要首尾相连
                    p.push(p[0])
                };
                window.polylineTransparent.show = true;
                window.polylineTransparent.positions = p
            }
        });

        let clearDrawFn = DrawHandler.drawEvt.addEventListener((result) => {
            if (!result.object.positions && PolyType != "Point" &&  PolyType != "Box") {
                tooltip.showAt(result, '<p>请绘制正确的多边形</p>');
                DrawHandler.polygon.show = false;
                DrawHandler.polyline.show = false;
                DrawHandler.deactivate();
                DrawHandler.activate();
                return;
            };
            // tooltip.setVisible(false);
            if(PolyType == "Box"){
                resolve({
                    result: result
                });
                return;
            }
            if (PolyType == "Point" || PolyType == "Marker") {
                DrawHandler.clear(); // 不显示绘制的点
                resolve({
                    result: result
                });
            } else { //半透线
                window.polylineTransparent.show = lineVisible;
                if (lineVisible) {
                    if (PolyType == "Polygon" && lineVisible) {
                        DrawHandler.polygon._polygon._material._color._value.alpha = 0.1 //绘制面透明度
                        let p2 = [...result.object.positions]; //画面时，需要首尾相连
                        p2.push(p2[0]);
                        window.polylineTransparent.positions = p2;
                    };
                }

                let positions = CartesiantoDegrees(result.object.positions)
                resolve({
                    result: result,
                    positions: positions
                });
            };
            //清除监听事件
            clearActFn();
            clearMovFn();
            clearDrawFn()
        });
    });
};

//清除
const clearHandlerDrawing = (PolyType) => {
    let DrawHandler
    if (!PolyType) {
        DrawHandler = window.handlerPolygon
    } else {
        DrawHandler = judgeDrawHandlerType(PolyType);
    };
    if(!DrawHandler) return;
    DrawHandler.deactivate();
    DrawHandler.clear()
    viewer.enableCursorStyle = true;
    // document.body.classList.remove("drawCur");
    // document.body.classList.remove("measureCur");
    window.tooltip.setVisible(false);
    if (window.polylineTransparent) {
        window.polylineTransparent.show = false
    }
};
// 类型判断
const judgeDrawHandlerType = (PolyType) => {
    let DrawHandler;
    switch (PolyType) {
      case "Point":
        DrawHandler = window.handlerPoint;
        break;
      case "Polyline":
        DrawHandler = window.handlerPolyline;
        break;
      case "Polygon":
        DrawHandler = window.handlerPolygon;
        break;
      case "Marker":
        DrawHandler = window.handlerMarker;
        break;
      case "Box":
        DrawHandler = window.handlerBox;
        break;
      default:
        null;
    }
    return DrawHandler;
  };
  
export default{
    initHandler,
    handlerDrawing,
    clearHandlerDrawing,
}
export {
    initHandler,
    handlerDrawing,
    clearHandlerDrawing,
}