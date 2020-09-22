<template>
  <div class="com" v-show="clipPolygon">
    <div class="sm-function-module-content">
      <div class="sm-function-module-sub-section">
        <label class="sm-function-module-sub-section-caption">裁剪模式:</label>
        <select class="sm-select" id style="width:100%" v-model="ClipModelSelected">
          <option
            :value="Options.id"
            v-for="Options in ClipModels"
            :key="Options.id"
          >{{Options.name}}</option>
        </select>
      </div>
      <div class="boxchild">
        <button @click="clipPolygonStart" class="tbtn tbn1" type="button">裁剪</button>
        <button @click="clearClipPolygon" class="tbtn" type="button">清除</button>
      </div>
    </div>
  </div>
</template>

<script>
let layers;
export default {
  name: "Sm3dClipPolygon",
  data() {
    return {
      sharedState: store.state,
      index: null, //当前插入界面位置
      ClipModels: [
        {
          id: "0",
          name: "裁剪内部",
        },
        {
          id: "1",
          name: "裁剪外部",
        },
      ],
      ClipModelSelected: "0",
      clipModeOption: null,
      position: [],
      isDestroyFlag: true,
    };
  },
  computed: {
    clipPolygon: function () {
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
    if (cName.length == 0) {
      cShow.push(1);
    } else {
      cShow.push(0);
    }
    cType.push("clip");
    cName.push("多边形裁剪");
  },
  methods: {
    // 多边形裁剪
    clipPolygonStart() {
      this.isDestroyFlag = false; //保留效果
      this.position = [];
      for (let layer of layers) {
        layer.selectEnabled = false;
        // 设置被裁剪对象的颜色
        layer.clipLineColor = new Cesium.Color(1, 1, 1, 0);
      }
      common.handlerDrawing("Polygon").then(
        (res) => {
          this.position.push(res.positions);
          let handlerPolygon = window.handlerPolygon;
          for (let layer of layers) {
            layer.setModifyRegions(this.position, this.clipModeOption);
          }
          handlerPolygon.polygon.show = false;
          handlerPolygon.polyline.show = false;
          handlerPolygon.deactivate();
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

    clearClipPolygon() {
      common.clearHandlerDrawing("Polygon");
      if (!layers) {
        return;
      }
      this.position = [];
      for (let layer of layers) {
        layer.clearModifyRegions();
      }
      this.isDestroyFlag = true; //摧毁标志，释放内存
    },

    init() {
      this.clipModeOption = Cesium.ModifyRegionMode.CLIP_INSIDE;
      if (layers) {
        return;
      }
      layers = scene.layers.layerQueue;
    },
  },
  beforeDestroy() {
    if (this.isDestroyFlag && layers) {
      layers = undefined;
    }
  },
  mounted() {
    if (this.isInitViewer && this.clipPolygon) {
      this.init();
    }
  },
  watch: {
    clipPolygon(val) {
      if (val && this.isInitViewer) {
        this.init();
      }
    },
    isInitViewer(val) {
      this.init();
    },
    ClipModelSelected(val) {
      if (!layers) return;
      switch (val) {
        case "0":
          this.clipModeOption = Cesium.ModifyRegionMode.CLIP_INSIDE;
          break;
        case "1":
          this.clipModeOption = Cesium.ModifyRegionMode.CLIP_OUTSIDE;
          break;
      }
      for (let layer of layers) {
        layer.setModifyRegions(this.position, this.clipModeOption);
      }
    },
  },
};
</script>



