<template>
  <div v-show="profile3dComb">
    <div class="sm-function-module-content">
      <div class="sm-point"></div>
      <label class="sm-function-module-sub-section-setting">起点信息</label>
      <div class="sm-function-module-sub-section">
        <div>
          <div class="sm-half">
            <label class="sm-function-module-sub-section-caption">经度(°)</label>
            <input v-model="startlongitude" type="text" class="sm-input-right" />
          </div>
          <div class="sm-half">
            <label class="sm-function-module-sub-section-caption" style="margin-left: 20px">纬度(°)</label>
            <input v-model="startlatitude" type="text" class="sm-input-right" />
          </div>
        </div>
        <div>
          <div class="sm-half">
            <label class="sm-function-module-sub-section-caption">高程(m)</label>
            <input v-model="startheight" type="text" class="sm-input-right" />
          </div>
        </div>
      </div>

      <div class="sm-point"></div>
      <label class="sm-function-module-sub-section-setting">终点信息</label>
      <div class="sm-function-module-sub-section">
        <div>
          <div class="sm-half">
            <label class="sm-function-module-sub-section-caption">经度(°)</label>
            <input v-model="endlongitude" type="text" class="sm-input-right" />
          </div>
          <div class="sm-half">
            <label class="sm-function-module-sub-section-caption" style="margin-left: 20px">纬度(°)</label>
            <input v-model="endlatitude" type="text" class="sm-input-right" />
          </div>
        </div>
        <div>
          <div class="sm-half">
            <label class="sm-function-module-sub-section-caption">高程(m)</label>
            <input v-model="endheight" type="text" class="sm-input-right" />
          </div>
        </div>
      </div>

      <div>
        <input type="checkbox" checked v-model="profileLine" />
        <label class="function-module-sub-section-caption">查看剖面信息</label>
      </div>

      <div v-show="profileLine">
        <label class="function-module-sub-section-caption">剖面信息</label>
        <div>
          <canvas id="pro" height="0" width="0"></canvas>
        </div>
      </div>

      <div class="boxchild">
        <button type="button" class="tbtn tbn1" v-on:click="analysis">分析</button>
        <button type="button" class="tbtn" @click="clear">清除</button>
      </div>
    </div>
  </div>
</template>

<script>
let handlerLine, crossProfile, screenSpaceEventHandler;
export default {
  name: "Sm3dProfile",
  props: {},
  data() {
    return {
      sharedState: store.state,
      index: null, //当前插入界面位置
      profurl: "",
      viewPosition: [],
      resultObject: null,
      // handlerLine: null,
      startlongitude: 0,
      startlatitude: 0,
      startheight: 0,
      endlongitude: 0,
      endlatitude: 0,
      endheight: 0,
      profileLine: false,
      // crossProfile: null
      isDestroyFlag: true,
    };
  },
  computed: {
    profile3dComb: function () {
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
    cName.push("剖面分析");
  },
  beforeDestroy() {
    if (this.isDestroyFlag && handlerLine) {
      if (crossProfile) {
        crossProfile.destroy();
      }
      if (screenSpaceEventHandler) {
        screenSpaceEventHandler.destroy();
      }
      handlerLine.deactivate();
      handlerLine = undefined;
      crossProfile = undefined;
      screenSpaceEventHandler = undefined;
    }
  },
  mounted() {
    if (this.isInitViewer && this.profile3dComb) {
      this.init();
    }
  },

  methods: {
    init() {
      // this.viewPosition = [];
      if (handlerLine) {
        return;
        // handlerLine.clear();
      }
      handlerLine = new Cesium.DrawHandler(viewer, Cesium.DrawMode.Line);
      let that = this;
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
      // handlerLine.movingEvt.addEventListener(function(windowPosition) {});

      handlerLine.drawEvt.addEventListener(function (result) {
        that.resultObject = result.object;
        var linePosition = result.object ? result.object.positions : result;
        var startPoint = linePosition[0];
        var endPoint = linePosition[linePosition.length - 1];

        //起止点相关信息
        var scartographic = Cesium.Cartographic.fromCartesian(startPoint);
        var slongitude = Cesium.Math.toDegrees(scartographic.longitude);
        var slatitude = Cesium.Math.toDegrees(scartographic.latitude);
        var sheight = scartographic.height;

        var ecartographic = Cesium.Cartographic.fromCartesian(endPoint);
        var elongitude = Cesium.Math.toDegrees(ecartographic.longitude);
        var elatitude = Cesium.Math.toDegrees(ecartographic.latitude);
        var eheight = ecartographic.height;

        // var profileStartPosition = slongitude.toFixed(4) + ', ' + slatitude.toFixed(4) + ', ' + sheight.toFixed(2);
        // var profileEndPosition = elongitude.toFixed(4) + ', ' + elatitude.toFixed(4) + ', ' + eheight.toFixed(2);

        that.startlongitude = slongitude.toFixed(6);
        that.startlatitude = slatitude.toFixed(6);
        that.startheight = sheight.toFixed(6);

        that.endlongitude = elongitude.toFixed(6);
        that.endlatitude = elatitude.toFixed(6);
        that.endheight = eheight.toFixed(6);

        // 剖面分析的起止点
        crossProfile.startPoint = [slongitude, slatitude, sheight];
        crossProfile.endPoint = [elongitude, elatitude, eheight];
        crossProfile.extendHeight = 40;
        crossProfile.build(); //三维剖面分析

        //分析完毕的回调函数
        crossProfile.getBuffer(function (buffer) {
          // let crossProfile = that.crossProfile;
          var canvas = document.getElementById("pro");
          canvas.height = crossProfile._textureHeight;
          canvas.width = crossProfile._textureWidth;
          var ctx = canvas.getContext("2d");
          var imgData = ctx.createImageData(
            crossProfile._textureWidth,
            crossProfile._textureHeight
          );
          imgData.data.set(buffer);
          //在canvas上绘制图片
          ctx.putImageData(imgData, 0, 0);
          canvas.style.width = "300px";
          canvas.style.height = "150px";

          that.profileLine = true;
        });
      });
    },
    analysis() {
      // this.init();

      if (!crossProfile) {
        crossProfile = new Cesium.Profile(viewer.scene);
      }
      handlerLine.clear();
      handlerLine.deactivate();
      handlerLine.activate();

      let that = this;
      this.isDestroyFlag = false; //保留效果
      screenSpaceEventHandler = new Cesium.ScreenSpaceEventHandler(
        scene.canvas
      );
      screenSpaceEventHandler.setInputAction(function (e) {
        // let handlerLine = that.handlerLine;
        if (handlerLine.polyline._actualPositions.length == 2) {
          var result = {};
          result.object = handlerLine.polyline;
          handlerLine.drawEvt.raiseEvent(result);
          handlerLine.deactivate();
          screenSpaceEventHandler.removeInputAction(
            Cesium.ScreenSpaceEventType.LEFT_CLICK
          );
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    },
    getBuffer() {},
    clear() {
      this.isDestroyFlag = true; //摧毁标志，释放内存
      viewer.entities.removeAll();
      if (handlerLine) {
        handlerLine.clear();
      }

      this.startlongitude = 0;
      this.startlatitude = 0;
      this.startheight = 0;
      this.endlongitude = 0;
      this.endlatitude = 0;
      this.endheight = 0;

      this.profileLine = false;
      this.viewPosition = [];
    },

    // destory() {
    //   this.clear();
    //   if (crossProfile) {
    //     crossProfile.destroy();
    //   crossProfile = undefined;
    //   }
    // }
  },
  watch: {
    profileLine: function (newValue) {
      if (!newValue || !crossProfile) {
        return; // 没有分析结果，无法提取天际线轮廓
      }
      // 剖面数据
      let that = this;
    },
    isInitViewer(val) {
      this.init();
    },
    profile3dComb(val) {
      if (val && this.isInitViewer) {
        this.init();
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.sm-function-module-sub-section{
    margin-bottom: 0;
}
</style>
