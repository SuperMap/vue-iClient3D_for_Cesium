
// 引入依赖
import { watch, ref, reactive, toRefs, onBeforeUnmount, onMounted } from "vue";
import { storeState } from '../../../js/store/store.js'   //简单局部状态管理
import tool from '../../../js/tool/tool.js'        //提示等工具
import resource from '../../../js/local/lang.js'  //语言资源
import { initHandler, handlerDrawing, clearHandlerDrawing } from "../../../js/common/drawHandler.js"    //公共handler.js
import createTooltip from '../../../js/tool/tooltip2.js'
import s3mModels from "./models.js";
import PolygonEmitter from "./polygon-emitter.js";

function addPointSymbol(props) {
    // 设置默认值数据
    let state = reactive({
        selectedTypeId: 0, //选中符号类型id
        selectedSymbolId: 0,  //选中符号id
        symbolColor: "#ffffff",   //符号颜色
        space: 10,  //直线种树间距
        density: 100, //区域种树总数
        addType: 'single',
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
    let currentData = s3mModels[state.selectedTypeId].data;
    let s3mInstanceColc;
    let currentSelectedSymbol = null;
    let modelEditor, emitter;
    let isAddLIneFace = false;
    let currentUrls = [];
    let isAddSingle = false;
    let isTooltipShow = true;

    if (storeState.isViewer) {
        if (!window.tooltip) {
            window.tooltip = createTooltip(viewer._element);
        }
        s3mInstanceColc = new Cesium.S3MInstanceCollection(scene._context);
        viewer.scene.primitives.add(s3mInstanceColc);
        emitter = new PolygonEmitter(); //区域粒子随机发射器，用于区域添加
    }
    //viewer 初始化完成的监听
    watch(() => storeState.isViewer, val => {
        if (val) {
            if (!window.tooltip) {
                window.tooltip = createTooltip(viewer._element);
            }
            s3mInstanceColc = new Cesium.S3MInstanceCollection(scene._context);
            viewer.scene.primitives.add(s3mInstanceColc);
            emitter = new PolygonEmitter()
        }
    });

    function changeSelect(id) {
        state.selectedSymbolId = id;
    };


    function click_symbol(e) {
        if (isAddLIneFace) return;
        if (isAddSingle) {
            tooltip.setVisible(false);
            viewer.enableCursorStyle = true;
            document.body.classList.remove("measureCur");
            let position = scene.pickPosition(e.message.position);
            let color = Cesium.Color.fromCssColorString(state.symbolColor);
            let id = 'symbol-' + s3mModels[state.selectedTypeId].id + '-' + currentData[state.selectedSymbolId].id + '-' + new Date().getTime()
            let path = currentData[state.selectedSymbolId].path;
            s3mInstanceColc.add(path, {
                id: id,
                position: position,
                color: color
            });
            if (!currentUrls.includes(path)) currentUrls.push(path);
            isAddSingle = false;
            // currentSelectedSymbol = s3mInstanceColc.getInstance(currentData[state.selectedSymbolId].path, id)
            return;
        }
        let symbol = viewer.scene.pick(e.message.position) || viewer.selectedEntity;
        if (symbol && symbol.id && typeof (symbol.id) === 'string' && symbol.id.indexOf("symbol-") != -1) {
            if (currentSelectedSymbol && currentSelectedSymbol.id === symbol.id) return;
            if (modelEditor) modelEditor.destroy();
            currentSelectedSymbol = symbol;
            modelEditor = new Cesium.ModelEditor({
                model: currentSelectedSymbol.primitive,
                scene: viewer.scene,
                // offset: new Cesium.Cartesian3(0, 0, 2)
            });
            modelEditor.activate();
            return;
        }
        if (modelEditor) modelEditor.destroy();
        modelEditor = null;
        currentSelectedSymbol = null;
    };

    function clear() {
        if (currentSelectedSymbol) {
            let id = currentSelectedSymbol.id;
            let ids = id.split('-');
            let url = s3mModels[ids[1]].data[ids[2]].path;
            if (url) {
                s3mInstanceColc.removeInstance(url, id);
                currentSelectedSymbol = null;
            }
        } else {
            currentUrls.forEach((url) => {
                s3mInstanceColc.removeCollection(url)
            });
            currentUrls.length = 0;
        }
        if (currentUrls.length === 0) {
            viewer.eventManager.removeEventListener("CLICK", click_symbol); //移除鼠标点击事件监听
        }
        if (modelEditor) modelEditor.destroy();
        modelEditor = null;
        window.tooltip.setVisible(false);
        clearHandlerDrawing('Polyline');
        clearHandlerDrawing('Polygon');
        isAddSingle = false;
        viewer.enableCursorStyle = true;
        document.body.classList.remove("measureCur");
    }

    //单个添加
    function add_single() {
        viewer.enableCursorStyle = false;
        viewer._element.style.cursor = "";
        document.body.classList.add("measureCur");
        isAddSingle = true;
    }

    // 沿线添加
    function add_line() {
        isAddLIneFace = true;
        if (!window.handlerPolyline) {
            initHandler("Polyline");
        }
        handlerDrawing("Polyline").then(
            res => {
                DrawPolylineUpdate('', res.result.object); //划线效果
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

    function DrawPolylineUpdate(position, line) {
        let positions = [];
        for (let i = 1, j = line._positions.length; i < j; i++) {
            let startPoint = line._positions[i - 1];
            let endPoint = line._positions[i];
            let d = Cesium.Cartesian3.distance(startPoint, endPoint)
            let count = getCount(parseInt(d));
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
        viewer.scene.clampToHeightMostDetailed(positions)
            .then((Cartesians) => {
                isAddLIneFace = false;
                let color = Cesium.Color.fromCssColorString(state.symbolColor);
                let id = 'symbol-' + s3mModels[state.selectedTypeId].id + '-' + currentData[state.selectedSymbolId].id + '-';
                let path = currentData[state.selectedSymbolId].path;
                if (!currentUrls.includes(path)) currentUrls.push(path);
                for (let i = 0, j = Cartesians.length; i <= j; i++) {
                    s3mInstanceColc.add(path, {
                        id: id + new Date().getTime() + i,
                        position: Cartesians[i],
                        color: color
                    });
                }

            });
    }
    //精度计算count插值
    function getCount(distance) {
        let space = Number(state.space)
        return parseInt(distance / space) + 1
    }

    //区域添加
    function add_face() {
        isAddLIneFace = true;
        if (!window.handlerPolygon) {
            initHandler("Polygon");
        }
        handlerDrawing("Polygon", false).then(
            res => {
                tooltip.setVisible(false);
                let handlerPolygon = window.handlerPolygon;
                handlerPolygon.polygon.show = false;
                handlerPolygon.polyline.show = false;
                handlerPolygon.deactivate();
                emitter.initPolygonEmitter(res.result.object.positions)
                let color = Cesium.Color.fromCssColorString(state.symbolColor);
                let id = 'symbol-' + s3mModels[state.selectedTypeId].id + '-' + currentData[state.selectedSymbolId].id + '-';
                let path = currentData[state.selectedSymbolId].path;
                if (!currentUrls.includes(path)) currentUrls.push(path);
                let density = Number(state.density);
                for (let i = 0; i < density; i++) {
                    let p = emitter.getOneRandomPosition()
                    s3mInstanceColc.add(path, {
                        id: id + new Date().getTime() + i,
                        position: p,
                        color: color
                    });
                }
                isAddLIneFace = false;
            },
            err => {
                console.log(err);
            }
        );
        window.handlerPolygon.activate();

    }

    // 开始添加
    function statrtAdd() {
        if (isTooltipShow) {
            window.tooltip.showAt('<p>选中模型可以编辑和清除选中模型</p><p>未选中模型时清除所有</p>', '420px');
            isTooltipShow = false;
        }
        viewer.eventManager.addEventListener("CLICK", click_symbol, true);
        switch (state.addType) {
            case 'single':
                add_single()
                break;
            case 'line':
                add_line()
                break;
            case 'face':
                add_face()
                break;
            default: add_single()
                break;
        }
    }



    // 销毁
    onBeforeUnmount(() => {
        currentData.length = 0;
        s3mInstanceColc = null;
        currentSelectedSymbol = null;
        if (modelEditor) modelEditor.destroy();
        currentUrls.length = 0
    });



    watch(() => state.selectedTypeId, val => {
        currentData = s3mModels[state.selectedTypeId].data;
    })
    watch(() => state.symbolColor, val => {
        let color = Cesium.Color.fromCssColorString(val);
        if(currentSelectedSymbol){
            let instance = currentSelectedSymbol.primitive;
            let index = currentSelectedSymbol.id;
            instance.updateColor(color, index);
        }
    })

    

    return {
        ...toRefs(state),
        s3mModels,
        changeSelect,
        clear,
        statrtAdd,
    };
};

export default addPointSymbol

