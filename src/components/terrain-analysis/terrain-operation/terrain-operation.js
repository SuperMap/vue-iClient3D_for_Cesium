// 引入依赖
import { watch, reactive, toRefs } from "vue";
import { initHandler, handlerDrawing, clearHandlerDrawing } from "../../../js/common/drawHandler.js"    //公共handler.js
import { Edit, clearEditHandler } from "../../../js/common/editHandler.js"   //编辑
import tool from '../../../js/tool/tool.js'        //提示等工具
import resource from '../../../js/local/lang.js'  //语言资源

function terrainAnalysis(props) {
    // 设置默认值数据
    let state = reactive({
        digDepth: 500,
        isEdit: false,
        isEditZ: false,
        lineVisible: true,
        digPositions:[],
        modifyPositions:[],
        operationType:'dig',
        terrainVisible: "terrainVisible"
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
    // 非响应式数据定义
    let digPosition = [];
    let modifyPosition = [];
    let operationType = "dig";


    /*
     ***挖掘模块***
    */
    //初始化挖掘区域(暂时只支持一个开挖区域)
    if (props && props.digPositions) {
        digUpdate(props.digPositions);
    }

    function digTerrain(e) {
        e.preventDefault();
        operationType = "dig";
        if (!window.handlerPolygon) {
            initHandler("Polygon");
        }
        handlerDrawing("Polygon", state.lineVisible).then(
            res => {
                digPosition = res.positions;
                let handlerPolygon = window.handlerPolygon;
                digUpdate(res.positions);
                handlerPolygon.polygon.show = false;
                handlerPolygon.polyline.show = false;
                handlerPolygon.deactivate();
                if (state.isEdit) {
                    Edit(digPosition, state.isEditZ, digUpdate);
                }
            },
            err => {
                console.log(err);
            }
        );
        window.handlerPolygon.activate();
        if (!viewer.scene.pickPositionSupported) {
            tool.Message.errorMsg(resource.NoPickPositionSupported);
        }

    }

    //更新地形挖掘
    function digUpdate(dig_position) {
        if (dig_position) {
            digPosition = dig_position;
        }
        viewer.scene.globe.removeAllExcavationRegion();
        viewer.scene.globe.addExcavationRegion({
            name: "dig_terrain",
            position: digPosition,
            height: state.digDepth,
            transparent: false
        });
    }
    // 清除
    function clearDig(e) {
        e.preventDefault();
        digPosition = [];
        if (!window.handlerPolygon) return;
        viewer.scene.globe.removeAllExcavationRegion();
        clearHandlerDrawing("Polygon");
        clearEditHandler("Polygon");
    }

    watch(() => state.digDepth, val => {
        if (digPosition.length == 0) {
            return;
        }
        digUpdate();
    });

    /*
     ***地形修改模块***
     */
    function modifyTerrain(e) {
        e.preventDefault();
        operationType = "modify";
        // if (viewer.terrainProvider.tablename) {
            if (!window.handlerPolygon) {
                initHandler("Polygon");
            }
            handlerDrawing("Polygon", state.lineVisible).then(
                res => {
                    modifyPosition = res.positions;
                    let handlerPolygon = window.handlerPolygon;
                    modifyUpdate(res.positions);
                    handlerPolygon.polygon.show = false;
                    handlerPolygon.polyline.show = false;
                    if (state.isEdit) {
                        Edit(modifyPosition, state.isEditZ, modifyUpdate);
                    }
                },
                err => {
                    console.log(err);
                }
            );

            window.handlerPolygon.activate();
            if (!viewer.scene.pickPositionSupported) {
                alert("不支持深度纹理,无法绘制多边形，地形修改功能无法使用！");
            }
        // }
    }
    function clearModify(e) {
        e.preventDefault();
        if (!window.handlerPolygon) return;
        viewer.scene.globe.removeAllModifyRegion();
        clearHandlerDrawing("Polygon");
        clearEditHandler("Polygon");
    }
    //更新地形修改
    function modifyUpdate(modify_positions) {
        if (modify_positions) {
            modifyPosition = modify_positions;
        }
        viewer.scene.globe.removeAllModifyRegion();
        viewer.scene.globe.addModifyRegion({
            name: "ggg",
            position: modifyPosition
        });
    }

    // 编辑
    watch(() => state.isEdit, val => {
        if (val && window.handlerPolygon) {
            if (operationType === "dig") {
                Edit(digPosition, state.isEditZ, digUpdate);
            } else {
                Edit(modifyPosition, state.isEditZ, modifyUpdate);
            }
        } else {
            clearEditHandler("Polygon");
            if (window.handlerPolygon && window.handlerPolygon.polygon) {
                window.handlerPolygon.polygon.show = false;
            }
        }
    });
    watch(() => state.isEditZ, val => {
        if (window.editHandler) {
            window.editHandler.isEditZ = val;
        }
    });

    //地形显隐  （此功能当前还有缺陷）
    watch(() => state.terrainVisible, val => {
        switch (val) {
            case "terrainVisible":
                viewer.terrainProvider._visible = true;
                break;
            case "terrainUnvisible":
                viewer.terrainProvider._visible = false;
                break;
            default:
                break;
        }
    });

    return {
        ...toRefs(state),
        digTerrain,
        clearDig,
        modifyTerrain,
        clearModify,
        digPosition,  //导出开挖区域，便于用户需要保存当前开挖区域数据方案，使用组件时可以通过digPositions默认传入
        modifyPosition  //同上导出修改区域
    };
};

export default terrainAnalysis
