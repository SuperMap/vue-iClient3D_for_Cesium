<template>
  <div v-show="GeologicComb">
    <div class="sm-function-module-content">
      <div class="sm-function-module-sub-section">
        <div class="sm-point"></div>
        <label class="sm-function-module-sub-section-setting">参数设置</label>
      </div>

      <div class="sm-function-module-sub-section">
        <div>
          <label class="sm-function-module-sub-section-caption">开挖深度(米):</label>
          <input
            v-model="depth"
            type="number"
            class="sm-input-right sm-GeologicBodyOperation-input"
            style="margin-left:8px"
          />
        </div>
        <div>
          <label class="sm-function-module-sub-section-caption">Z方向拉伸高度</label>
          <input
            v-model="stretchHeight"
            type="number"
            class="sm-input-right sm-GeologicBodyOperation-input"
          />
        </div>
      </div>

      <div>
        <button type="button" class="sm-btn sm-GeologicBodyOperation-btn" v-on:click="drawline">画线</button>
        <button type="button" class="sm-btn sm-GeologicBodyOperation-btn" v-on:click="profile">剖切</button>
        <button type="button" class="sm-btn sm-GeologicBodyOperation-btn" v-on:click="addhole">钻孔</button>
        <button type="button" class="sm-btn sm-GeologicBodyOperation-btn" v-on:click="clip">裁剪</button>
        <button type="button" class="sm-btn sm-GeologicBodyOperation-btn" v-on:click="dlg">开挖</button>
        <button type="button" class="sm-btn sm-GeologicBodyOperation-btn" @click="clear">清除</button>
      </div>
    </div>
  </div>
</template>

<script>
let modelDataUrls;
let polylineCollection;
export default {
  name: "Sm3dGeologicBodyAnalysis",
  props: {
    modelUrls: {
      type: Array,
      required: true,
      default: [],
    },
  },
  data() {
    return {
      sharedState: store.state,
      index: null, //当前插入界面位置
      isDestroyFlag: true,
      clipMode: Cesium.ClippingType.KeepInside,
      // modelDataUrls: null,
      pointsArray: [],
      stretchHeight: 1,
      depth: 500,
    };
  },
  computed: {
    GeologicComb: function () {
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
    cName.push("地质体分析");
  },
  mounted() {
    if (this.isInitViewer && this.GeologicComb) {
      this.init();
    }
  },
  methods: {
    init() {
      let that = this;

      if (window.viewer) {
        // scene.logarithmicDepthBuffer = true;
        // scene.camera.frustum.near = 0.1;
        scene.globe.show = false;

        this.solidModelsProfile = new Cesium.SolidModelsProfile(scene);

        this.showModel();

        // this.handlerPolygon = new Cesium.DrawHandler(
        //   viewer,
        //   Cesium.DrawMode.Polygon,
        //   0
        // );
        let handlerPolygon = window.handlerPolygon;
        handlerPolygon.activeEvt.addEventListener(function (isActive) {
          if (isActive == true) {
            viewer.enableCursorStyle = false;
            viewer._element.style.cursor = "";
            document.body.classList.add("drawCur");
          } else {
            viewer.enableCursorStyle = true;
            document.body.classList.remove("drawCur");
          }
        });

        handlerPolygon.movingEvt.addEventListener(function (windowPosition) {
          if (handlerPolygon.isDrawing) {
            tooltip.showAt(
              windowPosition,
              "<p>绘制多边形，</p><p>右键结束绘制.</p>"
            );
          } else {
            tooltip.showAt(windowPosition, "<p>点击绘制第一个点</p>");
          }
        });

        handlerPolygon.drawEvt.addEventListener(function (result) {
          let point3dsArray = [];
          let polygon = result.object;
          let positions = [].concat(polygon.positions);
          let point3ds = new Cesium.Point3Ds();

          for (let i = 0; i < positions.length; i++) {
            let cartographic = Cesium.Cartographic.fromCartesian(positions[i]);
            let pntx = Cesium.Math.toDegrees(cartographic.longitude);
            let pnty = Cesium.Math.toDegrees(cartographic.latitude);
            let pntz = cartographic.height + 1000;
            let pnt = new Cesium.Point3D(pntx, pnty, pntz);

            point3ds.add(pnt);
          }
          point3dsArray.push(point3ds);
          let geometry = new Cesium.GeoRegion3D(point3dsArray);
          if (
            that.solidModelsProfile.clippingType ==
            Cesium.ClippingType.KeepOutside
          ) {
            geometry.extrudedHeight = -that.depth;
          } else {
            geometry.extrudedHeight = -7000;
          }

          geometry.isLatLon = false;
          that.solidModelsProfile.setClipGeometry(geometry);
          //封底
          let geometry2 = new Cesium.GeoRegion3D(point3dsArray);
          geometry2.isLatLon = false;
          if (
            that.solidModelsProfile.clippingType ==
            Cesium.ClippingType.KeepOutside
          ) {
            geometry2.bottomAltitude = geometry.extrudedHeight;
            that.solidModelsProfile.addProfileGeometry(geometry2);
          }

          for (let i = 0; i < positions.length; i++) {
            let singleA = [];
            singleA.push(positions[i]);

            if (i == positions.length - 1) {
              singleA.push(positions[0]);
            } else {
              singleA.push(positions[i + 1]);
            }
            that.solidModelsProfile.addProfileGeometry(singleA);
            that.solidModelsProfile.build();
          }

          window.handlerPolygon.clear();
          window.handlerPolygon.deactivate();
          tooltip.setVisible(false);
        });

        this.handlerPoint = new Cesium.DrawHandler(
          viewer,
          Cesium.DrawMode.Point
        );
        let handlerPoint = this.handlerPoint;
        handlerPoint.activeEvt.addEventListener(function (isActive) {
          if (isActive == true) {
            viewer.enableCursorStyle = false;
            viewer._element.style.cursor = "";
            document.body.classList.add("drawCur");
          } else {
            viewer.enableCursorStyle = true;
            document.body.classList.remove("drawCur");
          }
        });
        handlerPoint.movingEvt.addEventListener(function (windowPosition) {
          tooltip.showAt(windowPosition, "<p>点击绘制多个点，右键结束</p>");
        });

        handlerPoint.drawEvt.addEventListener(function (result) {
          let point = Cesium.Cartesian3.clone(result.object.position);
          that.pointsArray.push(point);

          that.handlerPoint.activate(); //再激活，画多个钻孔
        });

        //画点，右键结束
        let handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
        handler.setInputAction(function (movement) {
          tooltip.setVisible(false);
          that.handlerPoint.deactivate();

          for (let i = 0; i < that.pointsArray.length; i++) {
            let point = that.pointsArray[i];
            let cartographic = Cesium.Cartographic.fromCartesian(point);
            let pntx = Cesium.Math.toDegrees(cartographic.longitude);
            let pnty = Cesium.Math.toDegrees(cartographic.latitude);
            let pntz = cartographic.height - 1000;

            let geoCylinder = new Cesium.GeoCylinder(400.0, 400.0, 4000.0);
            geoCylinder.geoPosition = new Cesium.Point3D(pntx, pnty, pntz);
            that.solidModelsProfile.addProfileGeometry(geoCylinder);
          }
          if (that.handlerLine.isDrawing) {
          } else {
            that.solidModelsProfile.build();
          }
        }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);

        //画线，用于剖切地质体
        this.handlerLine = new Cesium.DrawHandler(viewer, Cesium.DrawMode.Line);
        let handlerLine = this.handlerLine;
        handlerLine.activeEvt.addEventListener(function (isActive) {
          if (isActive == true) {
            viewer.enableCursorStyle = false;
            viewer._element.style.cursor = "";
            document.body.classList.add("drawCur");
          } else {
            viewer.enableCursorStyle = true;
            document.body.classList.remove("drawCur");
          }
        });

        handlerLine.movingEvt.addEventListener(function (windowPosition) {
          if (handlerLine.isDrawing) {
            tooltip.showAt(windowPosition, "<p>一次绘制两个点作为一个剖面</p>");
          } else {
            tooltip.showAt(windowPosition, "<p>点击绘制第一个点</p>");
          }
        });

        handlerLine.drawEvt.addEventListener(function (result) {
          tooltip.setVisible(false);

          // result.object.show = false;//隐藏底层的线

          if (!polylineCollection) {
            polylineCollection = scene.primitives.add(
              new Cesium.PolylineCollection({
                lineDisplayType: Cesium.LineDisplayType.OCCLUDED,
                //NON_OCCLUDED: 2
                // OCCLUDED: 0
                // OCCLUDED_TRANSLUCENT: 1
              })
            );
          }

          var polyline = polylineCollection.add({
            positions: result.object.positions,
            width: 2,
            material: Cesium.Material.fromType(Cesium.Material.ColorType, {
              color: Cesium.Color.fromCssColorString("#51ff00"),
            }),
          });

          for (var i = 0; i < result.object.positions.length - 1; i++) {
            var point1 = result.object.positions[i];
            var point2 = result.object.positions[i + 1];

            var pointArray = [];
            pointArray.push(point1);
            pointArray.push(point2);
            //
            // var result = new Cesium.Cartesian3();
            // var result2 = new Cesium.Cartesian3();
            // var Up = Cesium.Cartesian3.subtract(point2, point1, result);
            // var North = Cesium.Cartesian3.cross(point2, point1, result2);

            that.solidModelsProfile.addProfileGeometry(pointArray);
          }
          handlerLine.activate();
        });
      }
    },

    showModel() {
      // let modelDataUrls = this.modelDataUrls;
      let models = [];
      // 也可以不设置纹理，设置颜色
      models.push({
        model: modelDataUrls[0],
        color: new Cesium.Color(179 / 255, 179 / 255, 179 / 255, 1),
      });
      models.push({
        model: modelDataUrls[1],
        color: new Cesium.Color(94 / 255, 179 / 255, 59 / 255, 1),
      });
      models.push({
        model: modelDataUrls[2],
        color: new Cesium.Color(52 / 255, 94 / 255, 35 / 255, 1),
      });
      models.push({
        model: modelDataUrls[3],
        color: new Cesium.Color(115 / 255, 115 / 255, 115 / 255, 1),
      });
      models.push({
        model: modelDataUrls[4],
        color: new Cesium.Color(171 / 255, 85 / 255, 66 / 255, 1),
      });
      models.push({
        model: modelDataUrls[5],
        color: new Cesium.Color(68 / 255, 68 / 255, 68 / 255, 1),
      });

      this.solidModelsProfile.addModels(models);
    },
    drawline() {
      this.handlerLine.clear();
      this.handlerLine.activate();
    },
    profile() {
      this.isDestroyFlag = false; //保留效果
      if (this.handlerLine.active) {
        this.solidModelsProfile.build();
      }
      this.handlerLine.deactivate();
    },
    clip() {
      this.isDestroyFlag = false; //保留效果
      this.solidModelsProfile.clippingType = Cesium.ClippingType.KeepInside;
      window.handlerPolygon.activate();
    },
    dlg() {
      this.isDestroyFlag = false; //保留效果
      this.solidModelsProfile.clippingType = Cesium.ClippingType.KeepOutside;
      window.handlerPolygon.activate();
    },
    addhole() {
      this.isDestroyFlag = false; //保留效果
      this.handlerPoint.activate();
    },
    clear() {
      this.isDestroyFlag = true; //摧毁标志，释放内存
      tooltip.setVisible(false);
      this.solidModelsProfile.clearProfile();
      window.handlerPolygon.deactivate();
      window.handlerPolygon.clear();
      this.pointsArray = [];
      this.handlerPoint.deactivate();
      this.handlerPoint.clear();
      this.handlerLine.deactivate();
      this.handlerLine.clear();
      this.stretchHeight = 1;
      this.depth = 500;

      //清除后面添加的线
      if (polylineCollection) {
        polylineCollection.removeAll();
        scene.primitives.remove(polylineCollection);
        polylineCollection = undefined;
      }
    },
    closetoolbar() {
      this.show = false;
    },
    beforeDestroy() {
      if (this.isDestroyFlag && this.solidModelsProfile) {
        this.clear();
        this.solidModelsProfile.destory();
        this.solidModelsProfile = undefined;
      }
    },
  },
  watch: {
    isInitViewer(val) {
      this.init();
    },
    GeologicComb(val) {
      if (val && this.isInitViewer) {
        this.init();
      }
    },
    modelUrls: {
      immediate: true,
      handler: function (newValue, oldValue) {
        if (newValue) {
          modelDataUrls = newValue;
        }
      },
    },
    depth: function (newValue) {},
    stretchHeight: function (newValue) {
      for (let url of modelDataUrls) {
        let instance = this.solidModelsProfile._s3mInstanceCollection._group[
          url
        ].instances._array[0];
        instance.updateScale(new Cesium.Cartesian3(1, 1, newValue));
      }
    },
  },
};
</script>
<style lang="scss" scoped>
@import "GeologicBodyOperation";
</style>
