class DragEntity {
    constructor(_viewer, _id_type, _moveEndCallBack, _leftUpCallBack) {
        this.viewer = _viewer;
        this.id_type = _id_type;
        this.pickedEntity = null;
        this.leftDownFlag = false;
        this.moveEndCallBack = _moveEndCallBack ? _moveEndCallBack : undefined;
        this.leftUpCallBack = _leftUpCallBack ? _leftUpCallBack : undefined;
        this.movePickedEntity = null;
        this.layers = _viewer.scene.layers.layerQueue;
    }
    addEventListener() {
        let that = this;
        for (let i = 0; i < that.layers.length; i++) {
            that.layers[i].selectEnabled = false
        }
        that.viewer.screenSpaceEventHandler
            .setInputAction(leftDownAction, Cesium.ScreenSpaceEventType.LEFT_DOWN);
        that.viewer.screenSpaceEventHandler
            .setInputAction(leftUpAction, Cesium.ScreenSpaceEventType.LEFT_UP);
        that.viewer.screenSpaceEventHandler
            .setInputAction(mouseMoveAction, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

        function leftDownAction(e) {
            let picked = that.viewer.scene.pick(e.position);
            that.leftDownFlag = true;
            if (picked) {
                let Entity = Cesium.defaultValue(picked.id, picked.primitive.id);
                if (Entity.id && Entity.id.includes(that.id_type)) {
                    // document.body.style.cursor = 'move';
                    that.pickedEntity = Entity;
                    //锁定相机
                    that.viewer.scene.screenSpaceCameraController.enableRotate = false;
                }
            }
        }

        function mouseMoveAction(e) {
            if (that.leftDownFlag) {
                if (that.pickedEntity) {
                    let cartesian = that.viewer.scene.pickPosition(e.endPosition)
                    that.pickedEntity.position = cartesian;
                    if (that.moveEndCallBack) {
                        that.moveEndCallBack(that.pickedEntity)
                    }
                }
            } else {
                let picked = that.viewer.scene.pick(e.endPosition);
                if (picked) {
                    let Entity = Cesium.defaultValue(picked.id, picked.primitive.id);
                    if (Entity.id && Entity.id.includes(that.id_type)) {
                        that.movePickedEntity = Entity;
                        Entity.point.pixelSize = 20;
                    } else {
                        if (that.movePickedEntity)
                            that.movePickedEntity.point.pixelSize = 10
                    }
                }else {
                    if (that.movePickedEntity)
                        that.movePickedEntity.point.pixelSize = 10
                }
            }
        }

        function leftUpAction(e) {
            that.leftDownFlag = false;
            // document.body.style.cursor = 'default';
            // 解除相机锁定
            that.viewer.scene.screenSpaceCameraController.enableRotate = true;
            if (that.leftUpCallBack && that.pickedEntity) {
                that.leftUpCallBack(that.pickedEntity)
            }
            that.pickedEntity = null;
        }
    }

    removeEventListener() {
        this.viewer.screenSpaceEventHandler.removeInputAction(
            Cesium.ScreenSpaceEventType.LEFT_DOWN
        );
        this.viewer.screenSpaceEventHandler.removeInputAction(
            Cesium.ScreenSpaceEventType.MOUSE_MOVE
        );
        this.viewer.screenSpaceEventHandler.removeInputAction(
            Cesium.ScreenSpaceEventType.LEFT_UP
        );
    }
}

export default DragEntity