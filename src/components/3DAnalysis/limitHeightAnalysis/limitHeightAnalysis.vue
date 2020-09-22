<template>
    <div v-show="limitHeightComb">
      <div class="sm-function-module-content">
        <div class="boxchild ">
          <button type="button" class="tbtn tbn1" v-on:click="analysis">分析</button>
          <button type="button" class="tbtn"  @click="clear">清除</button>
        </div>
      </div>
    </div>
</template>

<script>
export default {
  name: "Sm3dLimitHeightAnalysis",
  props: {},
  data() {
    return {
      sharedState: store.state,
      index: null, //当前插入界面位置
      entity: null,
      arr: []
    };
  },
computed: {
    limitHeightComb: function () {
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
    cName.push("限高分析");
  },
  mounted() {
    if (this.isInitViewer && this.limitHeightComb) {
      this.init();
    }
  },
  methods: {
    init() {
      let that = this;
      let i = 0;
      while (i < 20000) {
        this.arr.push(i);
        i++;
      }

      if (window.layers) {
        let original = window.layers.find("original");
        let origina2 = window.layers.find("origina白膜控制");
        original.setObjsVisible([47], false);
        origina2.setObjsVisible([47], false);
      }
    },
    analysis() {
      let that = this;
      viewer.camera.flyTo({
        destination: new Cesium.Cartesian3.fromDegrees(
          115.00366140297365,
          39.01073839434967,
          331.116406992883
        ),
        orientation: {
          heading: 1.92451,
          pitch: -0.403816,
          roll: 0.0
        }
      });
      let original = scene.layers.find("original");
      let origina2 = scene.layers.find("origina白膜控制");
      let building = scene.layers.find("九号楼@九号楼");
      let building1 = scene.layers.find("九号楼@九号楼1");
      original.setObjsVisible([47], false);
      origina2.setObjsVisible([47], false);
      let instance = new Cesium.S3MInstanceCollection(scene._context);
      scene.primitives.add(instance);
      setTimeout(function() {
        that.entity = viewer.entities.add({
          id: "polygonA",
          polygon: {
            hierarchy: Cesium.Cartesian3.fromDegreesArray([
              115.00769546779887,
              39.00948953601627,
              115.01061031637882,
              39.01040583624218,
              115.01127283211821,
              39.00875368295838,
              115.00837238000206,
              39.0079302039017
            ]),
            height: 105,
            material: new Cesium.Color(1, 1, 0.2, 0.5),
            outline: true,
            outlineColor: Cesium.Color.RED
          }
        });
        building.clipLineColor = Cesium.Color.WHITE.withAlpha(0.0);
        building1.setObjsColor(
          that.arr,
          Cesium.Color.DARKORANGE.withAlpha(0.5)
        );
        original.clipLineColor = Cesium.Color.WHITE.withAlpha(0.0);
        origina2.clipLineColor = Cesium.Color.WHITE.withAlpha(0.0);
        origina2.setObjsColor(
          [21, 17, 160, 62, 50, 55, 203, 57, 69, 197, 481, 29, 198, 202, 47],
          Cesium.Color.DARKORANGE.withAlpha(0.5)
        );
        let height = 100;
        let flag = true;
        let flagA = true;
        setInterval(function() {
          if (height <= 170 && flagA) {
            if (flag) {
              height += 1.0;
            }
            if (height == 170) {
              flagA = false;
              let tooltip;
              tooltip = createTooltip(document.body);
              let cartesian = Cesium.Cartesian3.fromDegrees(
                115.00781714813387,
                39.00939422072619,
                172.618
              );
              let pick = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
                viewer.scene,
                cartesian
              );
              tooltip.showAt(pick, "建筑限高97米");
              window.setTimeout(function() {
                tooltip.setVisible(false);
              }, 3000);
            }
            that.entity.polygon.height = height + 2;
            scene.layers.find("九号楼@九号楼").setCustomClipBox({
              dimensions: new Cesium.Cartesian3(280, 250, height * 2),
              position: Cesium.Cartesian3.fromDegrees(
                115.00942125650806,
                39.00903543560274,
                height / 50 - 1
              ),
              clipMode: "clip_behind_any_plane"
            });
            scene.layers.find("九号楼@九号楼1").setCustomClipBox({
              dimensions: new Cesium.Cartesian3(280, 250, height * 2),
              position: Cesium.Cartesian3.fromDegrees(
                115.00942125650806,
                39.00903543560274,
                height / 50 - 1
              ),
              clipMode: "clip_behind_all_plane"
            });
            scene.layers.find("original").setCustomClipBox({
              dimensions: new Cesium.Cartesian3(280, 250, height * 2),
              position: Cesium.Cartesian3.fromDegrees(
                115.00942125650806,
                39.00903543560274,
                height / 50 - 1
              ),
              clipMode: "clip_behind_any_plane"
            });
            scene.layers.find("origina白膜控制").setCustomClipBox({
              dimensions: new Cesium.Cartesian3(280, 250, height * 2),
              position: Cesium.Cartesian3.fromDegrees(
                115.00942125650806,
                39.00903543560274,
                height / 50 - 1
              ),
              clipMode: "clip_behind_all_plane"
            });
          }
        }, 220);
      }, 2000);
    },
    clear() {
      this.entity = null;
      viewer.entities.removeAll();
      let building = scene.layers.find("九号楼@九号楼");
      let building1 = scene.layers.find("九号楼@九号楼1");
      building.removeObjsColor(this.arr);
      building1.removeObjsColor(this.arr);
      this.arr = [];
      scene.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(
          115.00022575830863,
          39.009956534844858,
          500
        ),
        orientation: {
          heading: 1.705646,
          pitch: -0.499956,
          roll: 0.0
        }
      });
    },
  },
  watch: {
    isInitViewer(val) {
      this.init();
    },
    limitHeightComb(val) {
      if (val && this.isInitViewer) {
        this.init();
      }
    },
  },
};
</script>


