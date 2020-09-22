<template>
  <div v-show="measureComb">
    <div>
      <div class="sm-measure-btn-list">
        <button
          @click="distanceClk"
          class="sm-btn sm-measure-btn"
          id="distance"
          title="空间距离"
          type="button"
        >
          <span class="iconfont iconVue-measure-distance"></span>
        </button>
        <button
          @click="GroundDistanceClk"
          class="sm-btn sm-measure-btn"
          id="GroundDistance"
          title="依地距离"
          type="button"
        >
          <span class="iconfont iconVue-measure-GroundDistance"></span>
        </button>

        <button @click="areaClk" class="sm-btn sm-measure-btn" id="area" title="空间面积" type="button">
          <span class="iconfont iconVue-measure-area"></span>
        </button>
        <button
          @click="GroundAreaClk"
          class="sm-btn sm-measure-btn"
          id="GroundArea"
          title="依地面积"
          type="button"
        >
          <span class="iconfont iconVue-measure-GroundArea"></span>
        </button>

        <button
          @click="heightClk"
          class="sm-btn sm-measure-btn"
          id="height"
          title="高度"
          type="button"
        >
          <span class="iconfont iconVue-measure-height"></span>
        </button>

        <button
          @click="ProjectArea"
          class="sm-btn sm-measure-btn"
          id="ProjectArea"
          title="投影面积"
          type="button"
        >
          <span class="iconfont iconVue-measure-GroundArea"></span>
        </button>

        <button @click="clear" class="sm-btn sm-measure-btn" id="clear" title="清除" type="button">
          <span class="iconfont iconVue-measure-clear"></span>
        </button>
      </div>
      <div class="sm-half sm-measure-half" v-show="isShowEllipsoid">
        <label class="sm-function-module-sub-section-caption" style>椭球:</label>
        <select class="sm-select sm-measure-select" id="EllipsoidMode" v-model="EllipsoidMode">
          <option selected value="圆球">圆球</option>
          <option selected value="CGCS2000">CGCS2000</option>
          <option value="XIAN80">XIAN80</option>
          <option value="WGS84">WGS84</option>
        </select>
      </div>
      <div v-show="isShowDVH">
        <label class="third">
          <input checked id="showLine" type="checkbox" v-model="isShowLine" />
          <span>显示等高线</span>
        </label>
      </div>
    </div>
  </div>
  <!-- </div> -->
</template>

<script>
let isoline;
let height = 0;

export default {
  name: "Sm3dMeasure",
  props: {
    collapsed: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      sharedState: store.state,
      index: null, //当前插入界面位置
      isShowEllipsoid: false,
      EllipsoidMode: "圆球",
      Ellipsoid: null,
      isProject: false, //投影面积
      clampMode: Cesium.ClampMode.Space,
      isShowDVH: false, //显示勾选界面
      isShowLine: true, //显示等高线
      interval: 20, //等高距
      singleLine: true, //单条或多条等高线
      transparentFlag: true,
    };
  },

  // 监听viewer

  computed: {
    measureComb: function () {
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
    cName.push("量算");
  },
  methods: {
    init() {
      let that = this;
      //父组件加载完毕
      if (this.layers) {
        return;
      }
      this.layers = viewer.scene.layers;

      this.ScreenSpaceEventHandler = new Cesium.ScreenSpaceEventHandler(
        scene.canvas
      );
      let screenSpaceEventHandler = this.ScreenSpaceEventHandler;

      screenSpaceEventHandler.setInputAction(function (e) {
        var pickedObject = scene.pickPosition(e.position);

        if (that.clampMode === Cesium.ClampMode.Space) {
          if (that.transparentFlag) {
            //添加被遮挡的实线
            if (!that.polylineCollection) {
              that.polylineCollection = new Cesium.PolylineCollection({
                opaqueRS: Cesium.RenderState.fromCache({
                  depthMask: true,
                  depthTest: {
                    enabled: true,
                  },
                }),
              });
            }

            if (!that.polylineNoTransparent) {
              that.polylineNoTransparent = that.polylineCollection.add({
                width: 2,
                positions: [pickedObject, pickedObject],
                material: Cesium.Material.fromType(Cesium.Material.ColorType, {
                  color: Cesium.Color.fromCssColorString("#51ff00"),
                }),
              });
              viewer.scene.primitives.add(that.polylineCollection);
            }

            that.transparentFlag = false;
          } else {
            if (that.polylineNoTransparent) {
              that.polylineNoTransparent.show = true;
              that.polylineNoTransparent.positions = [
                pickedObject,
                pickedObject,
              ];
            }

            if (that.handlerArea.active) {
              if (that.polygonTransparent) {
                that.polygonTransparent.show = false;
              }
            }
          }
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

      //初始化测量距离
      this.handlerDis = new Cesium.MeasureHandler(
        viewer,
        Cesium.MeasureMode.Distance,
        this.clampMode
      );
      let handlerDis = this.handlerDis;
      //注册测距功能事件
      handlerDis.measureEvt.addEventListener(function (result) {
        if (that.clampMode === Cesium.ClampMode.Ground && that.Ellipsoid) {
          //贴地、椭球
          var polylineGeometry = new Cesium.PolylineGeometry({
            positions: result.positions,
          });
          var dis = Number(
            scene.globe.computeSurfaceDistance(polylineGeometry, that.Ellipsoid)
          );
          var distance =
            dis > 1000 ? (dis / 1000).toFixed(2) + "km" : dis.toFixed(2) + "m";
          handlerDis.disLabel.text = "距离:" + distance;
        } else {
          if (that.polylineNoTransparent) {
            that.polylineNoTransparent.positions = result.positions;
          }

          var dis = Number(result.distance);
          var distance =
            dis > 1000 ? (dis / 1000).toFixed(2) + "km" : dis.toFixed(2) + "m";
          handlerDis.disLabel.text = "距离:" + distance;
        }
      });

      handlerDis.activeEvt.addEventListener(function (isActive) {
        if (isActive == true) {
          that.handlerDis.clampMode = that.clampMode;
          viewer.enableCursorStyle = false;
          viewer._element.style.cursor = "";
          document.body.classList.add("measureCur");

          if (that.clampMode === Cesium.ClampMode.Space) {
            that.handlerDis.lineColor = Cesium.Color.fromCssColorString(
              "#51ff00"
            ).withAlpha(0.2);
            that.handlerDis.lineWidth = 4;
          } else {
            that.handlerDis.lineColor = Cesium.Color.fromCssColorString(
              "#51ff00"
            );
            that.handlerDis.lineWidth = 2;
          }
        } else {
          viewer.enableCursorStyle = true;
          document.body.classList.remove("measureCur");
        }
      });

      //初始化测量面积
      this.handlerArea = new Cesium.MeasureHandler(
        viewer,
        Cesium.MeasureMode.Area,
        this.clampMode
      );
      let handlerArea = this.handlerArea;

      handlerArea.activeEvt.addEventListener(function (isActive) {
        if (isActive == true) {
          handlerArea.clampMode = that.clampMode;
          viewer.enableCursorStyle = false;
          viewer._element.style.cursor = "";
          document.body.classList.add("measureCur");

          that.polygonPositions = [];
          if (that.clampMode === Cesium.ClampMode.Space) {
            that.handlerArea.lineColor = Cesium.Color.fromCssColorString(
              "#51ff00"
            ).withAlpha(0.2);
            that.handlerArea.lineWidth = 4;
            // that.handlerArea.fillColor = Cesium.Color.ORANGE.withAlpha(0.5);
          } else {
            that.handlerArea.lineColor = Cesium.Color.fromCssColorString(
              "#51ff00"
            );
            that.handlerArea.lineWidth = 2;
            // that.handlerArea.fillColor = Cesium.Color.ORANGE.withAlpha(0.5);
          }
        } else {
          viewer.enableCursorStyle = true;
          document.body.classList.remove("measureCur");
        }
      });

      handlerArea.measureEvt.addEventListener(function (result) {
        if (that.clampMode === Cesium.ClampMode.Ground && that.Ellipsoid) {
          //贴地、椭球
          var polygonGeometry = new Cesium.PolygonGeometry.fromPositions({
            positions: result.positions,
          });
          var mj = Number(
            scene.globe.computeSurfaceArea(polygonGeometry, that.Ellipsoid)
          );
          var area =
            mj > 1000000
              ? (mj / 1000000).toFixed(2) + "km²"
              : mj.toFixed(2) + "㎡";
          handlerArea.areaLabel.text = "面积:" + area;
        } else {
          that.polygonPositions = result.positions;
          if (that.polylineNoTransparent) {
            that.polylineNoTransparent.positions = result.positions;
          }

          var mj;

          //投影面积，6度带
          if (that.isProject) {
            var positions = result.positions;
            var totalLon = 0;
            for (var i = 0; i < positions.length; i++) {
              var cartographic = Cesium.Cartographic.fromCartesian(
                positions[i]
              );

              var lon = Cesium.Math.toDegrees(cartographic.longitude);
              totalLon += lon;
            }
            var dh = Math.round((totalLon / positions.length + 6) / 6); // 带号
            var centralMeridian = dh * 6 - 3;
            // 高斯投影
            var projection = new Cesium.CustomProjection({
              name: "tmerc",
              centralMeridian: centralMeridian,
              primeMeridian: 0,
              standardParallel_1: 0,
              standardParallel_2: 0,
              eastFalse: 500000.0,
              northFalse: 0.0,
              semimajorAxis: 6378137,
              inverseFlattening: 298.257222101,
            });
            var cartesians = [];
            for (var i = 0; i < positions.length; i++) {
              var cartographic = Cesium.Cartographic.fromCartesian(
                positions[i]
              );
              var cartesian = projection.project(cartographic);
              cartesians.push(cartesian);
            }
            cartesians.push(cartesians[0]); // 首尾相接
            mj = Cesium.getPreciseArea(
              cartesians,
              "China2000",
              centralMeridian,
              dh,
              1
            );
            var area =
              mj > 1000000
                ? (mj / 1000000).toFixed(2) + "km²"
                : mj.toFixed(2) + "㎡";
            handlerArea.areaLabel.text = "投影面积:" + area;
          } else {
            mj = Number(result.area);
            var area =
              mj > 1000000
                ? (mj / 1000000).toFixed(2) + "km²"
                : mj.toFixed(2) + "㎡";
            handlerArea.areaLabel.text = "面积:" + area;
          }
        }
      });

      screenSpaceEventHandler.setInputAction(function (movement) {
        if (
          that.clampMode === Cesium.ClampMode.Space &&
          that.handlerArea.isDrawing
        ) {
          //绘制过程
          var perPositionHeight = Cesium.ClampMode.Space === that.clampMode;
          var clampToS3M = Cesium.ClampMode.S3mModel === that.clampMode;

          if (!that.polygonInstance) {
            that.polygonInstance = new Cesium.GeometryInstance({
              geometry: new Cesium.PolygonGeometry({
                polygonHierarchy: new Cesium.PolygonHierarchy(
                  that.polygonPositions
                ),
                perPositionHeight: perPositionHeight,
              }),
              attributes: {
                color: new Cesium.ColorGeometryInstanceAttribute(
                  1,
                  165 / 255,
                  0,
                  0.3
                ),
                // color: new Cesium.Color.ORANGE.withAlpha(0.3),
              },
            });
          }
          if (!that.polygonTransparent) {
            that.polygonTransparent = viewer.scene.primitives.add(
              new Cesium.Primitive({
                geometryInstances: that.polygonInstance,
                appearance: new Cesium.PerInstanceColorAppearance({
                  renderState: {
                    depthTest: false,
                  },
                }),
              })
            );
          }

          that.polygonInstance.geometry._polygonHierarchy.positions =
            that.polygonPositions;
          that.polygonTransparent.show = true;
        }
      }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);

      //初始化测量高度
      this.handlerHeight = new Cesium.MeasureHandler(
        viewer,
        Cesium.MeasureMode.DVH
      );
      let handlerHeight = this.handlerHeight;

      handlerHeight.measureEvt.addEventListener(function (result) {
        var distance =
          result.distance > 1000
            ? (result.distance / 1000).toFixed(2) + "km"
            : result.distance + "m";
        var vHeight =
          result.verticalHeight > 1000
            ? (result.verticalHeight / 1000).toFixed(2) + "km"
            : result.verticalHeight + "m";
        var hDistance =
          result.horizontalDistance > 1000
            ? (result.horizontalDistance / 1000).toFixed(2) + "km"
            : result.horizontalDistance + "m";

        if (that.isShowLine) {
          //获取高度值
          var position = result.directionalPositions[1];
          var cartographic = Cesium.Cartographic.fromCartesian(position);
          var longitude = Cesium.Math.toDegrees(cartographic.longitude);
          var latitude = Cesium.Math.toDegrees(cartographic.latitude);
          height = cartographic.height + 3;
          // height = scene.globe.getHeight(new Cesium.Cartographic.fromDegrees(longitude, latitude, 0)) + 3;
          that.createIsoline(result.verticalHeight);
        }

        handlerHeight.disLabel.text = "空间距离:" + distance;
        handlerHeight.vLabel.text = "垂直高度:" + vHeight;
        handlerHeight.hLabel.text = "水平距离:" + hDistance;
      });
      this.handlerHeight.activeEvt.addEventListener(function (isActive) {
        if (isActive == true) {
          viewer.enableCursorStyle = false;
          viewer._element.style.cursor = "";
          document.body.classList.add("measureCur");
        } else {
          viewer.enableCursorStyle = true;
          document.body.classList.remove("measureCur");
        }
      });
    },
    clearAll() {
      this.deactiveAll();
      this.EllipsoidMode = "圆球";

      this.handlerDis && this.handlerDis.clear();
      this.handlerArea && this.handlerArea.clear();
      this.handlerHeight && this.handlerHeight.clear();
      this.clearLine();

      this.transparentFlag = true;
      if (this.polylineCollection) {
        this.polylineCollection.removeAll();
      }
      if (this.polylineNoTransparent) {
        viewer.scene.primitives.remove(this.polylineNoTransparent);
        this.polylineNoTransparent = undefined;
      }

      if (this.polygonTransparent) {
        viewer.scene.primitives.remove(this.polygonTransparent);
        this.polygonTransparent = undefined;
      }
    },
    clearLine() {
      viewer.scene.globe.HypsometricSetting = undefined;
      if (this.isoline) {
        for (var i = 0; i < this.layers.length; i++) {
          this.layers[i].hypsometricSetting = undefined;
        }
      }
    },
    deactiveAll() {
      this.handlerDis && this.handlerDis.deactivate();
      this.handlerArea && this.handlerArea.deactivate();
      this.handlerHeight && this.handlerHeight.deactivate();
      this.isShowDVH = false;
      this.isShowEllipsoid = false;
      // this.EllipsoidMode = "圆球";
      this.Ellipsoid = null;
      this.isProject = false;
    },
    createIsoline(verticalHeight) {
      if (!isoline) {
        isoline = new Cesium.HypsometricSetting();
      }
      isoline.DisplayMode = Cesium.HypsometricSettingEnum.DisplayMode.LINE;
      isoline._lineColor = Cesium.Color.YELLOW;
      isoline.LineInterval = this.interval;
      if (this.singleLine) {
        isoline.MinVisibleValue = height - this.interval;
        isoline.MaxVisibleValue = height;
      } else {
        isoline.MinVisibleValue = height;
        isoline.MaxVisibleValue = height + parseFloat(verticalHeight);
      }
      var colorTable = new Cesium.ColorTable();
      isoline.ColorTable = colorTable;
      isoline.Opacity = 0.4;
      viewer.scene.globe.HypsometricSetting = {
        hypsometricSetting: isoline,
        analysisMode: Cesium.HypsometricSettingEnum.AnalysisRegionMode.ARM_ALL,
      };
      for (var i = 0; i < this.layers.length; i++) {
        this.layers[i].hypsometricSetting = {
          hypsometricSetting: isoline,
          analysisMode:
            Cesium.HypsometricSettingEnum.AnalysisRegionMode.ARM_ALL,
        };
      }
    },

    distanceClk() {
      this.clampMode = Cesium.ClampMode.Space;
      this.deactiveAll();
      this.handlerDis && this.handlerDis.activate();

      if (this.polylineNoTransparent) {
        this.polylineNoTransparent.show = true;
      }
    },
    GroundDistanceClk() {
      this.deactiveAll();
      this.isShowEllipsoid = true;
      this.clampMode = Cesium.ClampMode.Ground;
      this.handlerDis && this.handlerDis.activate();
    },
    areaClk() {
      this.clampMode = Cesium.ClampMode.Space;
      this.deactiveAll();
      this.handlerArea && this.handlerArea.activate();

      if (this.polylineNoTransparent) {
        this.polylineNoTransparent.show = true;
      }

      // 清空上一次画的透明面
      if (this.polygonInstance) {
        this.polygonInstance = undefined;
      }
      if (this.polygonTransparent) {
        viewer.scene.primitives.remove(this.polygonTransparent);
        this.polygonTransparent = undefined;
      }
    },
    GroundAreaClk() {
      this.deactiveAll();
      this.isShowEllipsoid = true;
      this.clampMode = Cesium.ClampMode.Ground;
      this.handlerArea && this.handlerArea.activate();
    },
    ProjectArea() {
      this.deactiveAll();
      this.isProject = true;
      // this.clampMode = Cesium.ClampMode.Ground;
      this.handlerArea && this.handlerArea.activate();
    },

    heightClk() {
      this.clearLine();
      this.deactiveAll();
      this.isShowDVH = true;
      this.handlerHeight && this.handlerHeight.activate();
    },
    clear() {
      this.clearAll();
    },
  },
  watch: {
    measureComb: function (val) {
      if (val && this.isInitViewer) {
        this.init(val);
      }
    },
    isInitViewer(val) {
      console.log("fd");
      this.init();
    },
    isShowLine: function (newValue) {
      if (!newValue) {
        this.clearLine();
      }
    },
    EllipsoidMode: function (newValue) {
      let value = newValue;
      if (value == "XIAN80") {
        this.Ellipsoid = Cesium.Ellipsoid.XIAN80;
      } else if (value == "CGCS2000") {
        this.Ellipsoid = Cesium.Ellipsoid.CGCS2000;
      } else if (value == "WGS84") {
        this.Ellipsoid = Cesium.Ellipsoid.WGS84;
      } else {
        this.Ellipsoid = null;
      }
    },
    collapsed: {
      immediate: true,
      handler: function (newValue, oldVal) {
        if (newValue) {
          this.show = !newValue;
        }
      },
    },
  },
};
</script>
<style lang="scss" scoped>
@import "Measure";
</style>
