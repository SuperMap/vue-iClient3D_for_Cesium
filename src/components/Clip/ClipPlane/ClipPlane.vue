<template>
  <div v-show="clipPlane">
    <div class="sm-function-module-content">
      <div class="sm-function-module-sub-section">
        <label class="label-container">第一点（经度，纬度，高程）:</label>
        <input
          class="middle-input"
          disabled
          type="text"
          min="0"
          v-model="planeClipPoint1"
          style="width: 100%"
        />
      </div>
      <div class="sm-function-module-sub-section">
        <label class="label-container">第二点（经度，纬度，高程）:</label>
        <input
          class="middle-input"
          disabled
          type="text"
          min="0"
          v-model="planeClipPoint2"
          style="width: 100%"
        />
      </div>
      <div class="sm-function-module-sub-section">
        <label class="label-container">第三点（经度，纬度，高程）:</label>
        <input
          class="middle-input"
          disabled
          type="text"
          min="0"
          v-model="planeClipPoint3"
          style="width: 100%"
        />
      </div>
      <div class="boxchild">
        <button @click="clipPlaneStart" class="tbtn tbn1" type="button">裁剪</button>
        <button @click="clearClipPlane" class="tbtn" type="button">清除</button>
      </div>
    </div>
  </div>
</template>

<script>
let layers;
export default {
  name: "Sm3dClipPlane",
  data() {
    return {
      sharedState: store.state,
      index: null, //当前插入界面位置
      position: [],
      planeClipPoint1: null,
      planeClipPoint2: null,
      planeClipPoint3: null,
      isDestroyFlag: true,
    };
  },
  computed: {
    clipPlane: function () {
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
    cType.push("clip");
    cName.push("平面裁剪");
  },
  methods: {
    // 多边形裁剪
    clipPlaneStart() {
      this.isDestroyFlag = false; //保留效果
      (this.planeClipPoint1 = null),
        (this.planeClipPoint2 = null),
        (this.planeClipPoint3 = null);
      this.position = [];
      for (let layer of layers) {
        layer.selectEnabled = false;
        // 设置被裁剪对象的颜色
        layer.clipLineColor = new Cesium.Color(1, 1, 1, 0);
      }
      common.handlerDrawing("Polygon", 1).then(
        (res) => {
          this.position = res.result.object.positions;
          for (let layer of layers) {
            layer.setCustomClipPlane(
              this.position[0],
              this.position[1],
              this.position[2]
            );
          }
          let cartographic1 = Cesium.Cartographic.fromCartesian(
            this.position[0]
          );
          let longitude1 = Cesium.Math.toDegrees(
            cartographic1.longitude
          ).toFixed(6);
          let latitude1 = Cesium.Math.toDegrees(cartographic1.latitude).toFixed(
            6
          );
          let height1 = cartographic1.height.toFixed(2);

          let cartographic2 = Cesium.Cartographic.fromCartesian(
            this.position[1]
          );
          let longitude2 = Cesium.Math.toDegrees(
            cartographic2.longitude
          ).toFixed(6);
          let latitude2 = Cesium.Math.toDegrees(cartographic2.latitude).toFixed(
            6
          );
          let height2 = cartographic2.height.toFixed(2);

          let cartographic3 = Cesium.Cartographic.fromCartesian(
            this.position[2]
          );
          let longitude3 = Cesium.Math.toDegrees(
            cartographic3.longitude
          ).toFixed(6);
          let latitude3 = Cesium.Math.toDegrees(cartographic3.latitude).toFixed(
            6
          );
          let height3 = cartographic3.height.toFixed(2);

          this.planeClipPoint1 =
            "" + longitude1 + ", " + latitude1 + ", " + height1;
          this.planeClipPoint2 =
            "" + longitude2 + ", " + latitude2 + ", " + height2;
          this.planeClipPoint3 =
            "" + longitude3 + ", " + latitude3 + ", " + height3;
          // handlerPolygon.polygon.show = false;
          // handlerPolygon.polyline.show = false;
          window.handlerPolygon.deactivate();
        },
        (err) => {
          console.log(err);
        }
      );
      window.handlerPolygon.activate();
      if (!scene.pickPositionSupported) {
        alert("不支持深度纹理,无法绘制多边形，裁剪功能无法使用！");
      }
    },

    clearClipPlane() {
      this.isDestroyFlag = true; //摧毁标志，释放内存
      (this.planeClipPoint1 = null),
        (this.planeClipPoint2 = null),
        (this.planeClipPoint3 = null);
      if (!layers) {
        return;
      }
      this.position = [];
      for (let layer of layers) {
        layer.clearCustomClipBox();
      }
      common.clearHandlerDrawing("Polygon");
    },

    init() {
      if (layers) return;
      layers = viewer.scene.layers.layerQueue;
    },
  },
  beforeDestroy() {
    if (this.isDestroyFlag && layers) {
      layers = undefined;
    }
  },
  mounted() {
    if (this.isInitViewer && this.clipPlane) {
      this.init();
    }
  },

  watch: {
    isInitViewer(val) {
      this.init();
    },
    clipPlane(val) {
      if (val && this.isInitViewer) {
        this.init();
      }
    },
  },
};
</script>




