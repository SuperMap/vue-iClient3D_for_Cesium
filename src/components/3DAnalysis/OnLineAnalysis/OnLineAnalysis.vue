<template>
  <div v-show="onLineComb">
    <div class="sm-function-module-content">
      <div class="boxchild">
        <button type="button" class="tbtn tbn1" v-on:click="analysis">分析</button>
        <button type="button" class="tbtn" @click="clear">清除</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Sm3dOnLineAnalysis",
  data() {
    return {
      sharedState: store.state,
      index: null, //当前插入界面位置
      // tooltip: null
    };
  },
  computed: {
    onLineComb: function () {
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
    cType.push("analysis");
    cName.push("贴线分析");
  },
  mounted() {
    if (this.isInitViewer && this.onLineComb) {
      this.init();
    }
  },
  methods: {
    init() {
      let that = this;
      if (window.layers) {
        var original = window.layers.find("original");
        original.setObjsVisible([47], false);
      }
    },
    analysis() {
      viewer.entities.removeAll();
      var pastePolyLine = viewer.entities.add({
        polyline: {
          positions: Cesium.Cartesian3.fromDegreesArrayHeights([
            115.008423196501,
            39.00802071320561,
            102.1,
            115.01018439584423,
            39.00853132862415,
            102.1,
            115.011168593648,
            39.00880578673498,
            102.1,
          ]),
          width: 4.0,
          material: new Cesium.PolylineArrowMaterialProperty(Cesium.Color.RED),
        },
      });
      setTimeout(function () {
        scene.layers
          .find("original")
          .setObjsColor([202], new Cesium.Color(1, 0, 0));
        var cartesian = Cesium.Cartesian3.fromDegrees(
          115.00896686645638,
          39.00818670441549,
          111.5
        );
        var pick = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
          viewer.scene,
          cartesian
        );
        tooltip.showAt(pick, "贴线率：0.83");
        window.setTimeout(function () {
          tooltip.setVisible(false);
        }, 3000);
      }, 4000);
    },
    clear() {
      viewer.entities.removeAll();
      var layer = scene.layers.find("original");
      layer.removeObjsColor([202]);
      scene.camera.setView({
        destination: new Cesium.Cartesian3(
          -2095120.8195698452,
          4492050.236234234,
          4014691.2770372364
        ),
        orientation: {
          heading: 1.0525528821913364,
          pitch: -0.5403802934874635,
          roll: 1.616484723854228e-12,
        },
      });
    },
  },
  watch: {
    isInitViewer(val) {
      this.init();
    },
    onLineComb(val) {
      if (val && this.isInitViewer) {
        this.init();
      }
    },
  },
};
</script>


