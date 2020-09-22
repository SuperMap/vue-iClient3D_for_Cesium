<template>
  <div v-show="slopeShow">
    <div class="sm-function-module-content">
      <div class="sm-function-module-sub-section">
        <label class="label-container">分析区域 ：</label>
        <select class="sm-select sm-select-s" v-model="calModeIndex">
          <option :value="Options.id" v-for="Options in showMode" :key="Options.id">{{Options.name}}</option>
        </select>
      </div>
      <div class="sm-function-module-sub-section">
        <label class="label-container">最小坡度(度) ：</label>
        <div class="sm-solider-input-box">
          <input
            class="min-solider"
            max="90"
            min="0"
            style="width:63%"
            type="range"
            v-model="wideMinR"
          />
          <input
            class="min-solider"
            max="90"
            min="0"
            step="1"
            style="width:34%; height:25px"
            type="number"
            v-model="wideMinR"
          />
        </div>
      </div>
      <div class="sm-function-module-sub-section">
        <label class="label-container">最大坡度(度) ：</label>
        <div class="sm-solider-input-box">
          <input
            class="min-solider"
            max="90"
            min="0"
            style="width:63%"
            type="range"
            v-model="wideMaxR"
          />
          <input
            class="min-solider"
            max="90"
            min="0"
            step="1"
            style="width:34%; height:25px"
            type="number"
            v-model="wideMaxR"
          />
        </div>
      </div>
      <div class="sm-function-module-sub-section">
        <label class="label-container">显示模式 ：</label>
        <select class="sm-select sm-select-s" v-model="showModeIndex">
          <option :value="Options.id" v-for="Options in calMode" :key="Options.id">{{Options.name}}</option>
        </select>
      </div>
      <div class="sm-function-module-sub-section">
        <label class="label-container">透明度 ：</label>
        <div class="sm-solider-input-box">
          <input
            class="min-solider"
            max="1"
            min="0"
            step="0.01"
            style="width:63%"
            type="range"
            v-model="trans"
          />
          <input
            class="min-solider"
            max="1"
            min="0"
            step="0.01"
            style="width:34%; height:25px"
            type="number"
            v-model="trans"
          />
        </div>
      </div>
      <label class="sm-viewshed-label-right">编辑:</label>
      <input style="margin-left: 10px" type="checkbox" v-model="isEdit" />
      <label class="sm-solider-input-box media-hidden" style="font-size:12px">注：（坡度分析需要带法线地形）</label>
      <div class="boxchild">
        <button @click="startSlope" class="tbtn tbn1" type="button">分析</button>
        <button @click="clearSlope" class="tbtn" type="button">清除</button>
      </div>
    </div>
  </div>
</template>

<script>
let slope, SlopColorTable;
export default {
  name: "Sm3dTerrainSlope",
  data() {
    return {
      sharedState: store.state,
      index: null, //当前插入界面位置
      // 坡度坡向
      showMode: [
        {
          id: "0",
          name: "指定多边形区域",
        },
        {
          id: "1",
          name: "全部区域参与分析",
        },
        {
          id: "2",
          name: "全部区域不参与分析",
        },
      ],
      calMode: [
        {
          id: "0",
          name: "显示填充颜色",
        },
        {
          id: "1",
          name: "显示坡向箭头",
        },
        {
          id: "2",
          name: "显示填充颜色和箭头",
        },
      ],
      showModeIndex: 0,
      calModeIndex: 0,
      wide: Number,
      DisplayMode: Number,
      wideMaxR: 78,
      wideMinR: 0,
      trans: 1,
      positions: [],
      //编辑功能
      isEditZ: false,
      isEdit: false,
      EditPositions: [],
      isDestroyFlag: true,
    };
  },
  computed: {
    slopeShow: function () {
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
    cName.push("坡度坡向");
  },
  methods: {
    // 坡度坡向
    startSlope() {
      this.isDestroyFlag = false; //保留效果
      //坡度坡向分析初始化参数
      // let slope = this.slope;
      let wide = this.wide;
      slope.DisplayMode = this.DisplayMode;
      slope.MaxVisibleValue = this.wideMaxR;
      slope.MinVisibleValue = this.wideMinR;
      slope.ColorTable = SlopColorTable;
      slope.Opacity = this.trans;
      // this.positions = [];
      // viewer.scene.globe.enableLighting = true;
      if (viewer.terrainProvider.tablename) {
        common.handlerDrawing("Polygon").then(
          (res) => {
            this.positions = res.positions;
            this.updateSlop(this.positions);
            let handlerPolygon = window.handlerPolygon;
            handlerPolygon.polygon.show = false;
            handlerPolygon.polyline.show = false;
            handlerPolygon.deactivate();
            if (this.isEdit) {
              common.Edit(this, this.updateSlop, "Polygon");
            }
          },
          (err) => {
            console.log(err);
          }
        );
        handlerPolygon.activate();
        if (!scene.pickPositionSupported) {
          alert("不支持深度纹理,无法绘制多边形，坡度坡向功能无法使用！");
        }
      }
    },
    updateSlop(p) {
      if (p) {
        slope.CoverageArea = p;
      }
      viewer.scene.globe.SlopeSetting = {
        slopeSetting: slope,
        analysisMode: this.wide,
      };
    },
    clearSlope() {
      this.positions = [];
      viewer.scene.globe.SlopeSetting = {
        analysisMode: Cesium.HypsometricSettingEnum.AnalysisRegionMode.ARM_NONE,
      };
      common.clearHandlerDrawing("Polygon");
      common.clearEditHandler("Polygon");
      this.isDestroyFlag = true; //摧毁标志，释放内存
    },
    init() {
      //坡度坡向对象
      if (slope) {
        return;
      }
      slope = new Cesium.SlopeSetting();
      this.wide = Cesium.HypsometricSettingEnum.AnalysisRegionMode.ARM_REGION;
      this.DisplayMode = Cesium.SlopeSettingEnum.DisplayMode.FACE;
      SlopColorTable = new Cesium.ColorTable();
      // let SlopColorTable = this.SlopColorTable;
      SlopColorTable.insert(80, new Cesium.Color(255 / 255, 0 / 255, 0 / 255));
      SlopColorTable.insert(
        50,
        new Cesium.Color(221 / 255, 224 / 255, 7 / 255)
      );
      SlopColorTable.insert(
        30,
        new Cesium.Color(20 / 255, 187 / 255, 18 / 255)
      );
      SlopColorTable.insert(20, new Cesium.Color(0, 161 / 255, 1));
      SlopColorTable.insert(0, new Cesium.Color(9 / 255, 9 / 255, 255 / 255));
    },
  },

  beforeDestroy() {
    if (this.isDestroyFlag && slope) {
      slope.destroy();
      SlopColorTable.destroy();
      slope = undefined;
      SlopColorTable = undefined;
    }
  },
  mounted() {
    if (this.terrainShow && this.slopeShow) {
      this.init();
    }
  },
  watch: {
    isInitViewer(val) {
      this.init();
    },
    // 编辑
    slopeShow(val) {
      if (val && this.isInitViewer) {
        this.init();
      }
      if (val && this.isEdit) {
        common.Edit(this, this.updateSlop, "Polygon");
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
        common.Edit(this, this.updateSlop, "Polygon");
      } else {
        common.clearEditHandler("Polygon");
        if (window.handlerPolygon.polygon) {
          window.handlerPolygon.polygon.show = false;
        }
      }
    },
    // 坡度坡向
    wideMaxR(val) {
      slope.MaxVisibleValue = parseFloat(val);
      if (this.positions.length == 0) {
        return;
      }
      viewer.scene.globe.SlopeSetting = {
        slopeSetting: slope,
        analysisMode: this.wide,
      };
    },
    wideMinR(val) {
      slope.MinVisibleValue = parseFloat(val);
      if (this.positions.length == 0) {
        return;
      }
      viewer.scene.globe.SlopeSetting = {
        slopeSetting: slope,
        analysisMode: this.wide,
      };
    },
    showModeIndex(val) {
      switch (val) {
        case "0":
          slope.DisplayMode = Cesium.SlopeSettingEnum.DisplayMode.FACE;
          this.DisplayMode = Cesium.SlopeSettingEnum.DisplayMode.FACE;
          break;
        case "1":
          slope.DisplayMode = Cesium.SlopeSettingEnum.DisplayMode.ARROW;
          this.DisplayMode = Cesium.SlopeSettingEnum.DisplayMode.ARROW;
          break;
        case "2":
          slope.DisplayMode =
            Cesium.SlopeSettingEnum.DisplayMode.FACE_AND_ARROW;
          this.DisplayMode = Cesium.SlopeSettingEnum.DisplayMode.FACE_AND_ARROW;
          break;
        default:
          break;
      }
      if (this.positions.length == 0) {
        return;
      }
      viewer.scene.globe.SlopeSetting = {
        slopeSetting: slope,
        analysisMode: this.wide,
      };
    },
    calModeIndex(val) {
      switch (val) {
        case "0":
          {
            this.wide =
              Cesium.HypsometricSettingEnum.AnalysisRegionMode.ARM_REGION;
          }
          break;
        case "1":
          {
            this.wide =
              Cesium.HypsometricSettingEnum.AnalysisRegionMode.ARM_ALL;
          }
          break;
        case "2":
          {
            this.wide =
              Cesium.HypsometricSettingEnum.AnalysisRegionMode.ARM_NONE;
          }
          break;
        default:
          break;
      }
      if (this.positions.length == 0) {
        return;
      }
      viewer.scene.globe.SlopeSetting = {
        slopeSetting: slope,
        analysisMode: this.wide,
      };
    },
    trans(val) {
      slope.Opacity = val;
      if (this.positions.length == 0) {
        return;
      }
      viewer.scene.globe.SlopeSetting = {
        slopeSetting: slope,
        analysisMode: this.wide,
      };
    },
  },
};
</script>


