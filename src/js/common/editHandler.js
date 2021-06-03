import { isEqualArr, CartesiantoDegrees} from '../tool/tool.js';

/**
 * 编辑功能
 * EditPositions：编辑前的区域，用于编辑后的比较变化（array）
 * isEditZ：是否编辑z轴
 * callback：编辑后触发的回调函数
 * 注意：为了更好的性能，编辑功能是全局的唯一的，所以只能进行当前操作的编辑
 */
const Edit = (EditPositions, isEditZ, callback) => {
    if (!window.selectHandler) {
        window.selectHandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    }
    let selectHandler = window.selectHandler;
    if (window.handlerPolygon && window.handlerPolygon.polygon) {
        window.handlerPolygon.polygon.show = true;
    }
    selectHandler.setInputAction(() => {
        let entity = viewer.selectedEntity;
        let editHandler = window.editHandler
        if (!entity) {
            if (editHandler) {
                editHandler && editHandler.deactivate();
            }
            return;
        }
        if (!editHandler) {
            window.editHandler = new Cesium.EditHandler(viewer, entity);
            if (isEditZ) {
                window.editHandler.isEditZ = isEditZ;
            } else {
                window.editHandler.isEditZ = false
            }
            window.editHandler.activate();
        } else {
            editHandler.deactivate();
            editHandler.setEditObject(entity);
            editHandler.activate();
        }
        selectHandler.setInputAction(() => {
            entity = viewer.selectedEntity;
            editHandler = window.editHandler
            if (!entity) {
                return;
            }
            if (editHandler && editHandler._positions) {
                let positions = CartesiantoDegrees(editHandler._positions)
                if (isEqualArr(EditPositions, positions)) {
                    return;
                } else {
                    EditPositions = positions;
                    if (callback) {
                        callback(positions, window.editHandler)
                    }
                }
                if (window.handlerPolygon &&window.handlerPolygon.polygon && window.handlerPolygon.polygon.show) {
                    let p3 = [...editHandler._positions]
                    p3.push(p3[0])
                    window.polylineTransparent.positions = p3; //半透线
                }
            }

        }, Cesium.ScreenSpaceEventType.LEFT_UP)
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
};

const clearEditHandler = () => {
    if (window.editHandler) {
        window.editHandler.deactivate();
        window.editHandler.clear()
    };
    if (window.selectHandler) {
        //移除鼠标移动事件监听
        window.selectHandler.removeInputAction(
            Cesium.ScreenSpaceEventType.LEFT_UP
        );
        window.selectHandler.removeInputAction(
            Cesium.ScreenSpaceEventType.LEFT_CLICK
        );
        window.selectHandler.destroy()
        window.selectHandler = null
    }
};

export {
    Edit,
    clearEditHandler,
}
