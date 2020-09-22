<template>
  <div v-show="viewshedComb">
    <div class="sm-function-module-content">
      <div class="sm-point media-hidden"></div>
      <label class="sm-function-module-sub-section-setting media-hidden">观察者信息</label>
      <div class="sm-function-module-sub-section">
        <div class="sm-half">
          <label class="sm-function-module-sub-section-caption">经度(°)</label>
          <input
            v-model="viewlongitude"
            type="text"
            id="viewshed-observation-place-x"
            class="sm-input-right"
          />
        </div>
        <div class="sm-half">
          <label class="sm-function-module-sub-section-caption" style="margin-left: 20px">纬度(°)</label>
          <input
            v-model="viewlatitude"
            type="text"
            id="viewshed-observation-place-y"
            class="sm-input-right"
          />
        </div>
      </div>
      <div>
        <div class="sm-half">
          <label class="sm-function-module-sub-section-caption">高程(m)</label>
          <input
            v-model="viewheight"
            type="text"
            id="viewshed-observation-place-z"
            class="sm-input-right"
          />
        </div>
      </div>
    </div>
    <div class="sm-function-module-content">
      <div class="sm-point media-hidden"></div>
      <label class="sm-function-module-sub-section-setting media-hidden">参数设置</label>
      <div class="sm-function-module-sub-section">
        <div class="sm-half">
          <label class="sm-function-module-sub-section-caption">附加高度(m)</label>
          <input
            type="number"
            id="addheight"
            class="sm-input sm-input-long"
            step="0.1"
            min="0"
            v-model="addheight"
          />
        </div>
        <div class="sm-half">
          <label class="sm-function-module-sub-section-caption" style="margin-left: 20px">方向角(°)</label>
          <input
            type="number"
            id="direction"
            class="sm-input sm-input-long"
            min="0"
            max="360"
            step="1.0"
            title="方向角"
            v-model="direction"
          />
        </div>
      </div>
      <div class="sm-function-module-sub-section">
        <div class="sm-half">
          <label class="sm-function-module-sub-section-caption">可视距离(m)</label>
          <input
            type="number"
            id="distance"
            class="sm-input sm-input-long"
            min="1"
            step="1"
            title="可视距离"
            v-model="distance"
          />
        </div>
        <div class="sm-half">
          <label class="sm-function-module-sub-section-caption" style="margin-left: 20px">俯仰角(°)</label>
          <input
            type="number"
            id="pitch"
            class="sm-input sm-input-long"
            min="-90"
            max="90"
            step="1.0"
            title="俯仰角"
            v-model="pitch"
          />
        </div>
      </div>

      <div>
        <div class="sm-half">
          <label class="sm-function-module-sub-section-caption">水平视角(°)</label>
          <input
            type="number"
            id="horizontalFov"
            class="sm-input sm-input-long"
            min="1"
            max="120"
            step="1.0"
            title="水平视角"
            v-model="horizontalFov"
          />
        </div>
        <div class="sm-half">
          <label class="sm-function-module-sub-section-caption" style="margin-left: 20px">垂直视角(°)</label>
          <input
            type="number"
            id="verticalFov"
            class="sm-input sm-input-long"
            min="1"
            step="1.0"
            title="垂直视角"
            v-model="verticalFov"
          />
        </div>
      </div>
    </div>
    <div class="sm-function-module-content">
      <div class="sm-point"></div>
      <label class="sm-function-module-sub-section-setting">颜色设置</label>
      <div>
        <label class="sm-function-module-sub-section-caption">提示线颜色</label>
        <ColorPicker class="sm-colorpicker" v-model="hintLineColor" alpha />
      </div>
      <div>
        <input type="checkbox" checked />
        <label class="sm-function-module-sub-section-caption">可见区域</label>
        <ColorPicker class="sm-colorpicker" v-model="visibleAreaColor" alpha />
      </div>
      <div>
        <input type="checkbox" checked />
        <label class="sm-function-module-sub-section-caption">不可见区域</label>
        <ColorPicker class="sm-colorpicker" v-model="hiddenAreaColor" alpha />
      </div>
      <div>
        <input type="checkbox" v-model="visibleBody" />
        <label class="sm-function-module-sub-section-caption">显示可视体</label>
        <ColorPicker class="sm-colorpicker" v-model="visibleBodyColor" alpha />
      </div>
      <div>
        <input type="checkbox" v-model="invisibleBody" />
        <label class="sm-function-module-sub-section-caption">显示不可视体</label>
        <ColorPicker class="sm-colorpicker" v-model="invisibleBodyColor" alpha />
      </div>
      <!-- <div>
              <input type="checkbox" id="visible5" />
              <label class="sm-function-module-sub-section-caption">高亮显示可见体</label>
      </div>-->
      <div class="boxchild">
        <button type="button" class="tbtn tbn1" v-on:click="chooseView">分析</button>
        <button type="button" class="tbtn" @click="clear">清除</button>
      </div>
    </div>
  </div>
</template>

<script>
let viewshed3D, handler, pointHandler, s3mInstanceColc;
export default {
  name: "Sm3dViewshed",
  props: {
    spatialAnalysisUrl: {
      type: String,
    },
  },
  data() {
    return {
      sharedState: store.state,
      index: null, //当前插入界面位置
      spurl: "",
      viewlongitude: 0,
      viewlatitude: 0,
      viewheight: 0,

      direction: 1.0,
      pitch: 1.0,
      addheight: 1.8,
      distance: 1.0,
      verticalFov: 60,
      horizontalFov: 90,
      hintLineColor: "rgb(212,202,45)",
      visibleAreaColor: "rgb(9,199,112)",
      hiddenAreaColor: "rgb(238,114,22)",
      visibleBodyColor: "rgb(44,149,197)",
      invisibleBodyColor: "rgb(200,0,0)",
      visibleBody: false,
      invisibleBody: false,
      isDestroyFlag: true,
      originViewshedObservationPlace: {},
    };
  },
  computed: {
    viewshedComb: function () {
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
    cName.push("可视域分析");
  },
  beforeDestroy() {
    if (this.isDestroyFlag && pointHandler) {
      if (s3mInstanceColc) {
        s3mInstanceColc.destroy();
      }
      viewshed3D.destroy();
      handler.destroy();
      pointHandler.deactivate();
      viewshed3D = undefined;
      handler = undefined;
      pointHandler = undefined;
      s3mInstanceColc = undefined;
    }
  },
  mounted() {
    if (this.analysisShow && this.viewshedComb) {
      this.init();
    }
  },
  methods: {
    init() {
      if (viewshed3D) {
        return;
      }
      // 创建可视域分析对象
      scene = viewer.scene;
      scene.viewFlag = true;
      if (!viewshed3D) {
        viewshed3D = new Cesium.ViewShed3D(scene);
      }

      viewshed3D.hintLineColor = Cesium.Color.fromCssColorString(
        this.hintLineColor
      );
      viewshed3D.visibleAreaColor = Cesium.Color.fromCssColorString(
        this.visibleAreaColor
      );
      viewshed3D.hiddenAreaColor = Cesium.Color.fromCssColorString(
        this.hiddenAreaColor
      );

      let that = this;

      handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
      // 鼠标移动时间回调
      handler.setInputAction(function (e) {
        // 若此标记为false，则激活对可视域分析对象的操作
        if (!scene.viewFlag) {
          //获取鼠标屏幕坐标,并将其转化成笛卡尔坐标
          let position = e.endPosition;
          let last = scene.pickPosition(position);

          //计算该点与视口位置点坐标的距离
          let distance = Cesium.Cartesian3.distance(that.viewPosition, last);

          if (distance > 0) {
            // 将鼠标当前点坐标转化成经纬度
            let cartographic = Cesium.Cartographic.fromCartesian(last);
            let longitude = Cesium.Math.toDegrees(cartographic.longitude);
            let latitude = Cesium.Math.toDegrees(cartographic.latitude);
            let height = cartographic.height;
            // 通过该点设置可视域分析对象的距离及方向
            viewshed3D.setDistDirByPoint([longitude, latitude, height]);
          }
        }
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

      handler.setInputAction(function (e) {
        //鼠标右键事件回调，不再执行鼠标移动事件中对可视域的操作
        if (!scene.viewFlag) {
          scene.viewFlag = true;

          that.direction = viewshed3D.direction.toFixed(2);
          that.pitch = viewshed3D.pitch.toFixed(2);
          that.distance = viewshed3D.distance.toFixed(2);
          that.horizontalFov = viewshed3D.horizontalFov;
          that.verticalFov = viewshed3D.verticalFov;
        }
      }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);

      pointHandler = new Cesium.DrawHandler(viewer, Cesium.DrawMode.Point);
      pointHandler.drawEvt.addEventListener(function (result) {
        let point = result.object;
        let position = point.position;
        that.viewPosition = position;

        // 将获取的点的位置转化成经纬度
        let cartographic = Cesium.Cartographic.fromCartesian(position);
        let longitude = Cesium.Math.toDegrees(cartographic.longitude);
        let latitude = Cesium.Math.toDegrees(cartographic.latitude);
        let height = cartographic.height;
        that.originViewshedObservationPlace = { longitude, latitude, height };

        let additionalHeight = Number(that.addheight);
        let heightnew = cartographic.height + additionalHeight;
        point.position = Cesium.Cartesian3.fromDegrees(
          longitude,
          latitude,
          heightnew
        );

        if (scene.viewFlag) {
          // 设置视口位置
          viewshed3D.viewPosition = [longitude, latitude, heightnew];
          viewshed3D.build();
          // 将标记置为false以激活鼠标移动回调里面的设置可视域操作
          scene.viewFlag = false;

          that.viewlongitude = longitude.toFixed(4);
          that.viewlatitude = latitude.toFixed(4);
          that.viewheight = height.toFixed(2);
        }
      });
    },
    chooseView() {
      // this.init();

      if (pointHandler.active) {
        return;
      }
      this.isDestroyFlag = false; //保留效果
      //先清除之前的可视域分析
      viewer.entities.removeAll();
      viewshed3D.distance = 0.1;
      viewer.scene.viewFlag = true;

      //激活绘制点类
      pointHandler.activate();
    },
    getVisibleResult() {
      if (!viewshed3D) {
        return;
      }
      if (!s3mInstanceColc) {
        s3mInstanceColc = new Cesium.S3MInstanceCollection(scene._context);
        viewer.scene.primitives.add(s3mInstanceColc);
      }

      let that = this;
      var obj = viewshed3D.getViewshedParameter();

      var geometryViewShedBodyvisibleParameter = {
        viewerPoint: obj.viewPosition,
        point3DsList: obj.point3DList,
        radius: obj.distance,
        lonlat: true,
        viewShedType: "VISIBLEBODY",
      };
      var url = this.spurl;
      // "http://www.supermapol.com/realspace/services/spatialAnalysis-data_all/restjsr/spatialanalyst/geometry/3d/viewshedbody.json";
      let queryData = JSON.stringify(geometryViewShedBodyvisibleParameter);
      let color = Cesium.Color.fromCssColorString(this.visibleBodyColor);

      //先发送POST请求
      window.axios
        .post(url, queryData)
        .then(function (response) {
          //再发送一次GET请求  获取到运算结果
          window.axios
            .get(response.data.newResourceLocation + ".json")
            .then(function (response) {
              let data = response.data;

              //失败 没有内容
              if (data.geometry == null) {
                return;
              }

              //将二进制流构建arrayBuffer 添加至S3MInstanceCollection
              var u8 = new Uint8Array(data.geometry.model);
              var ab = u8.buffer;

              //注意  若添加多个模型 请保证各个名称唯一  否则可能引起显示错乱问题
              s3mInstanceColc.add(
                "resultV",
                {
                  id: 1,
                  position: Cesium.Cartesian3.fromDegrees(
                    data.geometry.position.x,
                    data.geometry.position.y,
                    data.geometry.position.z
                  ),
                  hpr: new Cesium.HeadingPitchRoll(0, 0, 0),
                  //scale : new Cesium.Cartesian3(39.37007900000045,39.37007900000045,39.37007900000045),
                  color: color,
                  //offset : new Cesium.Cartesian3(0,0,690)
                },
                ab
              );
            })
            .catch(function (error) {
              console.log(error);
            });
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    getInVisibleResult() {
      if (!viewshed3D) {
        return;
      }
      if (!s3mInstanceColc) {
        s3mInstanceColc = new Cesium.S3MInstanceCollection(scene._context);
        viewer.scene.primitives.add(s3mInstanceColc);
      }
      let that = this;

      var obj = viewshed3D.getViewshedParameter();

      var geometryViewShedBodyvisibleParameter = {
        viewerPoint: obj.viewPosition,
        point3DsList: obj.point3DList,
        radius: obj.distance,
        lonlat: true,
        viewShedType: "HIDDENBODY",
      };
      var url = this.spurl;
      // "http://www.supermapol.com/realspace/services/spatialAnalysis-data_all/restjsr/spatialanalyst/geometry/3d/viewshedbody.json";
      let queryData = JSON.stringify(geometryViewShedBodyvisibleParameter);

      let color = Cesium.Color.fromCssColorString(this.invisibleBodyColor);

      //先发送POST请求
      window.axios
        .post(url, queryData)
        .then(function (response) {
          //再发送一次GET请求  获取到运算结果
          window.axios
            .get(response.data.newResourceLocation + ".json")
            .then(function (response) {
              let data = response.data;

              //失败 没有内容
              if (data.geometry == null) {
                return;
              }

              //将二进制流构建arrayBuffer 添加至S3MInstanceCollection
              var u8 = new Uint8Array(data.geometry.model);
              var ab = u8.buffer;

              //注意  若添加多个模型 请保证各个名称唯一  否则可能引起显示错乱问题
              s3mInstanceColc.add(
                "resultUnV",
                {
                  id: 2,
                  position: Cesium.Cartesian3.fromDegrees(
                    data.geometry.position.x,
                    data.geometry.position.y,
                    data.geometry.position.z
                  ),
                  hpr: new Cesium.HeadingPitchRoll(0, 0, 0),
                  //scale : new Cesium.Cartesian3(39.37007900000045,39.37007900000045,39.37007900000045),
                  color: color,
                  //offset : new Cesium.Cartesian3(0,0,690)
                },
                ab
              );
            })
            .catch(function (error) {
              console.log(error);
            });
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    clear() {
      this.isDestroyFlag = true; //摧毁标志，释放内存
      viewer.entities.removeAll();
      scene.viewFlag = true;
      pointHandler.clear();
      this.viewlongitude = 0;
      this.viewlatitude = 0;
      this.viewheight = 0;

      this.addheight = 1.8;
      this.direction = 1.0;
      this.pitch = 1.0;
      this.distance = 1.0;
      this.horizontalFov = 90;
      this.verticalFov = 60;

      this.hintLineColor = "rgb(212,202,45)";
      this.visibleAreaColor = "rgb(9,199,112)";
      this.hiddenAreaColor = "rgb(238,114,22)";
      this.visibleBodyColor = "rgb(44,149,197)";
      this.invisibleBodyColor = "rgb(200,0,0)";
      //初始化参数
      if (viewshed3D) {
        // viewshed3D.clear();
        viewshed3D.direction = this.direction;
        viewshed3D.pitch = this.pitch;
        viewshed3D.distance = this.distance;
        viewshed3D.horizontalFov = this.horizontalFov;
        viewshed3D.verticalFov = this.verticalFov;
      }
      this.visibleBody = false;
      this.invisibleBody = false;
    },

    destory() {
      if (s3mInstanceColc) {
        s3mInstanceColc.destroy();
        s3mInstanceColc = undefined;
      }
      if (viewshed3D) {
        viewshed3D.destroy();
        viewshed3D = undefined;
      }
    },
  },
  watch: {
    isInitViewer(val) {
      this.init();
    },
    viewshedComb(val) {
      if (val && this.isInitViewer) {
        this.init();
      }
    },
    addheight: function (newValue) {
      let originViewshedObservationPlace = this.originViewshedObservationPlace;
      let longitude = originViewshedObservationPlace.longitude;
      let latitude = originViewshedObservationPlace.latitude;
      if (newValue === "") {
        // 避免删除导致崩溃
        newValue = "0.0";
      }
      let height = originViewshedObservationPlace.height + parseFloat(newValue);
      let cartesian = Cesium.Cartesian3.fromDegrees(
        longitude,
        latitude,
        height
      );
      viewshed3D.viewPosition = [longitude, latitude, height];
    },
    direction: function (newValue) {
      viewshed3D.direction = parseFloat(newValue);
    },
    distance: function (newValue) {
      viewshed3D.distance = parseFloat(newValue);
    },
    pitch: function (newValue) {
      viewshed3D.pitch = parseFloat(newValue);
    },
    verticalFov: function (newValue) {
      viewshed3D.verticalFov = parseFloat(newValue);
    },
    horizontalFov: function (newValue) {
      viewshed3D.horizontalFov = parseFloat(newValue);
    },
    hintLineColor: function (newValue) {
      let color = Cesium.Color.fromCssColorString(newValue);
      viewshed3D.hintLineColor = color;
    },
    visibleAreaColor: function (newValue) {
      let color = Cesium.Color.fromCssColorString(newValue);
      viewshed3D.visibleAreaColor = color;
    },
    hiddenAreaColor: function (newValue) {
      let color = Cesium.Color.fromCssColorString(newValue);
      viewshed3D.hiddenAreaColor = color;
    },
    visibleBodyColor: function (newValue) {
      let color = Cesium.Color.fromCssColorString(newValue);
      if (
        s3mInstanceColc &&
        s3mInstanceColc instanceof Cesium.S3MInstanceCollection
      ) {
        s3mInstanceColc.getInstance("resultV", 1).updateColor(color);
      }
    },
    invisibleBodyColor: function (newValue) {
      let color = Cesium.Color.fromCssColorString(newValue);
      if (
        s3mInstanceColc &&
        s3mInstanceColc instanceof Cesium.S3MInstanceCollection
      ) {
        s3mInstanceColc.getInstance("resultUnV", 2).updateColor(color);
      }
    },
    visibleBody: function (newValue) {
      if (newValue) {
        this.getVisibleResult();
      } else {
        //清除体
        if (
          s3mInstanceColc &&
          s3mInstanceColc instanceof Cesium.S3MInstanceCollection
        ) {
          s3mInstanceColc.removeCollection("resultV");
        }
      }
    },
    invisibleBody: function (newValue) {
      if (newValue) {
        this.getInVisibleResult();
      } else {
        //清除体
        if (
          s3mInstanceColc &&
          s3mInstanceColc instanceof Cesium.S3MInstanceCollection
        ) {
          s3mInstanceColc.removeCollection("resultUnV");
        }
      }
    },
    spatialAnalysisUrl: {
      immediate: true,
      handler: function (val, oldVal) {
        if (val) {
          this.spurl = val;
        }
      },
    },
  },
};
</script>

<style lang="scss" scoped>
@import "ViewShed";
</style>
