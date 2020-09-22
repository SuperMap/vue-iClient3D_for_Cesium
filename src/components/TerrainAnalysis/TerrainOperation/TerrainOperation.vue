<template>
  <div v-show="terrainOperation">
    <div class="sm-function-module-content">
      <div class="sm-point"></div>
      <label class="sm-function-module-sub-section-setting">地形修改</label>
      <div class="boxchild">
        <button @click="modifyTerrain" class="tbtn tbn1" type="button">修改</button>
        <button @click="clearModify" class="tbtn" type="button">清除</button>
      </div>
      <br />
      <div class="sm-point"></div>
      <label class="sm-function-module-sub-section-setting">地形开挖</label>
      <div class="sm-function-module-sub-section">
        <label class="span-box2">开挖深度(米)</label>
        <input class="min-input mleft" min="0" type="number" v-model="depth" />
      </div>
      <div class="editBox">
        <label style="margin-left:10px">编辑:</label>
        <input style="margin-left: 5px" type="checkbox" v-model="isEdit" />&nbsp;&nbsp;
        <label>编辑Z轴:</label>
        <input style="margin-left: 5px" type="checkbox" v-model="isEditZ" />
      </div>
      <div class="boxchild">
        <button @click="dig" @touchstart="dig" class="tbtn tbn1" type="button">开挖</button>
        <button @click="clearDig" class="tbtn" type="button">清除</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Sm3dTerrainOperation",
  data() {
    return {
      depth: 500,
      positions: [], //dig
      positionM: [], //mo
      //编辑功能
      isEditZ: false,
      isEdit: false,
      EditPositions: [],
      operationType: 0, //0 挖掘 1 地形修改
      sharedState: store.state,
      index: null, //当前插入界面位置
    };
  },
  computed: {
    terrainOperation: function () {
      return this.sharedState.componentShows[this.index];
    },
    isInitViewer: function () {
      return this.sharedState.isInitViewer;
    },
  },
  created() {
    let cName = this.sharedState.componentNames;
    let cShow = this.sharedState.componentShows;
    let cType = this.sharedState.componentTypes;
    this.index = cName.length;
    if (cName.length === 0) {
      cShow.push(1);
    } else {
      cShow.push(0);
    }
    cType.push("terrain");
    cName.push("地形操作");
  },
  methods: {
    // 挖掘模块
    dig() {
      this.positions = [];
      this.operationType = 0;
      if (viewer.terrainProvider.tablename) {
        //判断地形
        common.handlerDrawing("Polygon").then(
          (res) => {
            this.positions = res.positions;
            let handlerPolygon = window.handlerPolygon;
            this.EditUpdate(res.positions);
            handlerPolygon.polygon.show = false;
            handlerPolygon.polyline.show = false;
            handlerPolygon.deactivate();
            if (this.isEdit) {
              common.Edit(this, this.EditUpdate, "Polygon");
            }
          },
          (err) => {
            console.log(err);
          }
        );
        window.handlerPolygon.activate();
        if (!scene.pickPositionSupported) {
          alert("不支持深度纹理,无法绘制多边形，地形操作功能无法使用！");
        }
      } else {
        console.log("请在地形里使用地形组件！");
      }
    },

    //更新函数
    EditUpdate(p) {
      viewer.scene.globe.removeAllExcavationRegion();
      // viewer.scene.globe.clippingType = ClippingType.KeepInside
      // viewer.scene.globe.showExcavationSide = true;
      viewer.scene.globe.addExcavationRegion({
        name: "ggg",
        position: p,
        height: this.depth,
        transparent: false,
      });
    },
    clearDig() {
      this.positions = [];
      viewer.scene.globe.removeAllExcavationRegion();
      common.clearHandlerDrawing("Polygon");
      common.clearEditHandler("Polygon");
    },
    // 地形修改模块
    modifyTerrain() {
      this.positionM = [];
      this.operationType = 1;
      if (viewer.terrainProvider.tablename) {
        common.handlerDrawing("Polygon").then(
          (res) => {
            this.positionM = res.positions;
            let handlerPolygon = window.handlerPolygon;
            this.EditUpdateMod(res.positions);
            handlerPolygon.polygon.show = false;
            handlerPolygon.polyline.show = false;
            if (this.isEdit) {
              common.Edit(this, this.EditUpdateMod, "Polygon");
            }
          },
          (err) => {
            console.log(err);
          }
        );

        window.handlerPolygon.activate();
        if (!scene.pickPositionSupported) {
          alert("不支持深度纹理,无法绘制多边形，地形修改功能无法使用！");
        }
      }
    },
    clearModify() {
      viewer.scene.globe.removeAllModifyRegion();
      common.clearHandlerDrawing("Polygon");
      common.clearEditHandler("Polygon");
    },
    //更新地形修改
    EditUpdateMod(p) {
      scene.globe.removeAllModifyRegion();
      scene.globe.addModifyRegion({
        name: "ggg",
        position: p,
      });
    },
  },

  watch: {
    // 地形操作挖掘深度
    depth(val) {
      if (this.positions.length == 0) {
        return;
      }
      this.EditUpdate(this.positions);
    },
    terrainOperation(val) {
      if (val && this.isEdit) {
        common.Edit(this, this.EditUpdate, "Polygon");
      } else {
        if (window.handlerPolygon) {
          if (window.handlerPolygon.polygon) {
            window.handlerPolygon.polygon.show = false;
          }
        }
        common.clearEditHandler("Polygon");
      }
    },
    isEdit(val) {
      //地形挖掘
      if (val) {
        if (this.operationType == 0) {
          common.Edit(this, this.EditUpdate, "Polygon");
        } else {
          common.Edit(this, this.EditUpdateMod, "Polygon");
        }
      } else {
        common.clearEditHandler("Polygon");
        if (window.handlerPolygon.polygon) {
          window.handlerPolygon.polygon.show = false;
        }
      }
    },
    isEditZ(val) {
      if (window.editHandler) {
        window.editHandler.isEditZ = val;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
@import "TerrainOperation";
</style>

