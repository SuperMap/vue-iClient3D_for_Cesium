<template>
  <div v-show="flood">
    <div class="sm-function-module-content">
      <div class="sm-function-module-sub-section">
        <label class="label-container">最大可见高程(米) :</label>
        <input class="sm-input-long" type="number" min="0" v-model="MaxHeight" />
      </div>
      <div class="sm-function-module-sub-section">
        <label class="label-container">最小可见高程(米) :</label>
        <input class="sm-input-long" type="number" min="0" v-model="MinHeight" />
      </div>
      <div class="sm-function-module-sub-section">
        <label class="label-container">当前高程(米) :</label>
        <input class="sm-input-long" disabled type="number" min="0" v-model="speedElevation" />
      </div>
      <div class="sm-function-module-sub-section">
        <label class="label-container">颜色选择 :</label>
        <button class="sm-select sm-select-color" @click="showColor">
          <span class="label2" :class="'band'+bntColor" style>&nbsp;</span>
        </button>
        <div class="color-select" v-if="colorSelect">
          <span
            :id="band.id"
            v-for="band in bands"
            :class="band.name"
            class="label ban"
            @click="changeColor"
            :key="band.id"
          >&nbsp;</span>
        </div>
      </div>
      <div class="sm-function-module-sub-section">
        <label class="label-container">透明度 ：</label>
        <div class="sm-solider-input-box">
          <input
            style="width:63%"
            class="min-solider"
            type="range"
            v-model="transFlood"
            min="0"
            max="1"
            step="0.01"
          />
          <input
            style="width:34%; height:25px"
            class="min-solider"
            type="number"
            v-model="transFlood"
            min="0"
            max="1"
            step="0.01"
          />
        </div>
      </div>
      <div class="sm-function-module-sub-section">
        <label class="label-container">速度（m/s） ：</label>
        <div class="sm-solider-input-box">
          <input
            style="width:63%"
            class="min-solider"
            type="range"
            v-model="speed"
            min="0"
            max="1000"
            step="1"
          />
          <input
            style="width:34%; height:25px"
            class="min-solider"
            type="number"
            v-model="speed"
            min="0"
            max="1000"
            step="1"
          />
        </div>
      </div>
      <div class="boxchild">
        <button @click="floodBegin" class="tbtn tbn1" type="button">分析</button>
        <button @click="floodClear" class="tbtn" type="button">清除</button>
      </div>
    </div>
  </div>
</template>

<script>
let hypFlood, floodColorTable, interval;
export default {
  name: "Sm3dTerrainFlood",
  data() {
    return {
      colorSelect: false,
      bntColor: 1, //默认颜色选择
      bands: [
        {
          id: "1",
          name: "band1",
        },
        {
          id: "2",
          name: "band2",
        },
        {
          id: "3",
          name: "band3",
        },
        {
          id: "4",
          name: "band4",
        },
        {
          id: "5",
          name: "band5",
        },
      ],
      DisplayModeFlood: Number,
      MaxHeight: 9000,
      MinHeight: 1000,
      transFlood: 0.8,
      speedElevation: 0,
      speed: 1000,
      sharedState: store.state,
      isDestroyFlag: true,
      index: null, //当前插入界面位置
    };
  },
  computed: {
    flood: function () {
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
    cName.push("淹没分析");
  },
  methods: {
    //淹没分析
    //颜色选择
    showColor() {
      this.colorSelect = !this.colorSelect;
    },
    changeColor(e) {
      this.colorSelect = false;
      this.bntColor = e.target.id;
    },
    floodBegin() {
      this.isDestroyFlag = false; //保留效果
      hypFlood.DisplayMode = this.DisplayModeFlood;
      hypFlood._lineColor = new Cesium.Color(1.0, 0.0, 0.0, 1.0);
      hypFlood.MinVisibleValue = this.MinHeight;
      hypFlood.ColorTableMinKey = 1;
      hypFlood.ColorTableMaxKey = 9000;
      hypFlood.ColorTable = floodColorTable;
      hypFlood.Opacity = this.transFlood;
      hypFlood.LineInterval = 200.0;
      this.positions = [];
      common.handlerDrawing("Polygon").then(
        (res) => {
          let handlerPolygon = window.handlerPolygon;
          this.floodStart(res.positions);
          handlerPolygon.polygon.show = false;
          // handlerPolygon.polyline.show = false;
          handlerPolygon.deactivate();
        },
        (err) => {
          console.log(err);
        }
      );
      window.handlerPolygon.activate();
      if (!scene.pickPositionSupported) {
        alert("不支持深度纹理,无法绘制多边形，淹没分析功能无法使用！");
      }
    },
    floodStart(positions) {
      let currentHeight = 0;
      // let hypFlood = this.hypFlood;
      interval = setInterval("flood()", 100);
      hypFlood.MinVisibleValue = this.MinHeight;
      currentHeight = parseFloat(this.MinHeight);
      window.flood = () => {
        if (currentHeight <= this.MaxHeight) {
          this.speedElevation = parseInt(currentHeight);
        }
        if (currentHeight > this.MaxHeight) {
          clearInterval(interval);
          return;
        }
        hypFlood.MaxVisibleValue = currentHeight;
        hypFlood.CoverageArea = positions;
        viewer.scene.globe.HypsometricSetting = {
          hypsometricSetting: hypFlood,
          analysisMode:
            Cesium.HypsometricSettingEnum.AnalysisRegionMode.ARM_REGION,
        };
        currentHeight += parseFloat(this.speed) / 10;
      };
    },
    floodClear() {
      this.isDestroyFlag = true; //摧毁标志，释放内存
      viewer.scene.globe.HypsometricSetting = undefined;
      clearInterval(interval);
      common.clearHandlerDrawing("Polygon");
    },
    init() {
      //淹没分析
      if (hypFlood) {
        return;
      }
      hypFlood = new Cesium.HypsometricSetting();
      this.DisplayModeFlood = Cesium.HypsometricSettingEnum.DisplayMode.FACE;
      floodColorTable = new Cesium.ColorTable();
      // let floodColorTable = floodColorTable;
      floodColorTable.insert(9000, new Cesium.Color(0, 39 / 255, 148 / 255));
      floodColorTable.insert(
        0,
        new Cesium.Color(149 / 255, 232 / 255, 249 / 255)
      );
    },
  },
  beforeDestroy() {
    if (this.isDestroyFlag && hypFlood) {
      hypFlood.destroy();
      floodColorTable.destroy();
      hypFlood = undefined;
      floodColorTable = undefined;
    }
  },
  mounted() {
    if (this.isInitViewer && this.flood) {
      this.init();
    }
  },

  watch: {
    isInitViewer(val) {
      this.init();
    },
    flood(val) {
      if (val && this.isInitViewer) {
        this.init();
      }
    },
    // 淹没分析
    bntColor(val) {
      floodColorTable = new Cesium.ColorTable();
      switch (val) {
        case "1":
          floodColorTable.insert(
            9000,
            new Cesium.Color(0, 39 / 255, 148 / 255)
          );
          floodColorTable.insert(
            0,
            new Cesium.Color(149 / 255, 232 / 255, 249 / 255)
          );
          break;
        case "2":
          floodColorTable.insert(
            9000,
            new Cesium.Color(162 / 255, 251 / 255, 194 / 255)
          );
          floodColorTable.insert(0, new Cesium.Color(1, 103 / 255, 103 / 255));
          break;
        case "3":
          floodColorTable.insert(
            9000,
            new Cesium.Color(230 / 255, 198 / 255, 1)
          );
          floodColorTable.insert(0, new Cesium.Color(157 / 255, 0, 1));
          break;
        case "4":
          floodColorTable.insert(
            9000,
            new Cesium.Color(210 / 255, 15 / 255, 15 / 255)
          );
          floodColorTable.insert(
            6000,
            new Cesium.Color(221 / 255, 224 / 255, 7 / 255)
          );
          floodColorTable.insert(
            5000,
            new Cesium.Color(20 / 255, 187 / 255, 18 / 255)
          );
          floodColorTable.insert(4000, new Cesium.Color(0, 161 / 255, 1));
          floodColorTable.insert(
            0,
            new Cesium.Color(9 / 255, 9 / 255, 212 / 255)
          );
          break;
        case "5":
          floodColorTable.insert(
            9000,
            new Cesium.Color(186 / 255, 1, 229 / 255)
          );
          floodColorTable.insert(
            0,
            new Cesium.Color(26 / 255, 185 / 255, 156 / 255)
          );
          break;
        default:
          break;
      }
      hypFlood.ColorTable = floodColorTable;
      if (interval) {
        viewer.scene.globe.HypsometricSetting = {
          hypsometricSetting: hypFlood,
          analysisMode:
            Cesium.HypsometricSettingEnum.AnalysisRegionMode.ARM_REGION,
        };
      }
    },
    transFlood(val) {
      hypFlood.Opacity = val;
      viewer.scene.globe.HypsometricSetting = {
        hypsometricSetting: hypFlood,
        analysisMode:
          Cesium.HypsometricSettingEnum.AnalysisRegionMode.ARM_REGION,
      };
    },
  },
};
</script>
<style lang="scss" scoped>
@import "TerrainFlood";
</style>
