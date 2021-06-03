<template>
  <div id="terrain-slope-panel" class="sm-panel" v-drag>
    <div class="sm-function-module-sub-section" style="margin:0" v-stopdrag>
      <div class="sm-half-L">
        <label class="label-S">{{Resource.analysisArea}}</label>
        <select class="sm-select-m" style="width:60%" v-model="analysisArea">
          <option value="ARM_REGION">{{Resource.specifyPolygon}}</option>
          <option value="ARM_ALL">{{Resource.allRegionsAnalysis}}</option>
          <option value="ARM_NONE">{{Resource.allRegionsNOAnalysis}}</option>
        </select>
      </div>
      <div class="sm-half-L">
        <label style="width: 40%;">{{Resource.slopeRange}}</label>
        <el-slider
          v-model="slopeInterval"
          :min="0"
          :max="90"
          range
          :step="1"
          input-size="mini"
          :debounce="500"
          tooltip-class="tooltip-class"
          :format-tooltip="formatTooltip"
          style="width:58%"
        ></el-slider>
      </div>
      <div class="boxchild">
        <button @click="startSlope" class="tbtn" type="button">{{Resource.analyze}}</button>
        <button @click="clearSlope" class="tbtn tbtn-margin-left" type="button">{{Resource.clear}}</button>
      </div>
    </div>
  </div>
</template>

<script>
import terrainSlope from "./terrain-slope.js";
export default {
  name: "Sm3dTerrainSlope",
  props: {
    //分析区域
    analysisArea: {
      type: String
    },
    //显示模式
    displayMode: {
      type: String
    },
    //最大坡度
    wideMaxR: {
      type: Number
    },
    //最小坡度
    wideMinR: {
      type: Number
    },
    //透明度
    trans: {
      type: Number
    },
    //是否编辑
    isEdit: {
      type: Boolean,
      default: false
    },
    //初始化传入分析区域
    slopePositions: {
      type: Array
    },
    //是否显示绘制后的线
    lineVisible: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    formatTooltip(val) {
      return Resource.slope + val + "°";
    }
  },
  setup(props) {
    let {
      analysisArea,
      displayMode,
      wideMaxR,
      wideMinR,
      trans,
      isEdit,
      slopeInterval,
      startSlope,
      clearSlope
    } = terrainSlope(props);

    return {
      analysisArea,
      displayMode,
      wideMaxR,
      wideMinR,
      trans,
      isEdit,
      slopeInterval,
      startSlope,
      clearSlope
    };
  }
};
</script>


