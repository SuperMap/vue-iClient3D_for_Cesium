<template>
  <div id="openness-panel" class="sm-panel" v-drag>
    <div class="sm-function-module-sub-section" style="margin:0" v-stopdrag>
      <div class="sm-half-L">
        <label style="width: 40%;">{{Resource.observeRadius}}</label>
        <el-slider
          v-model="viewDomeRadius"
          :min="1"
          :step="1"
          :max="1000"
          input-size="mini"
          :debounce="500"
          :format-tooltip="formatTooltip"
          tooltip-class="tooltip-class"
          style="width:58%"
        ></el-slider>
        <!-- <input class="sm-input-S" min="1" step="1" type="number" v-model="clipWidth" /> -->
      </div>
      <div class="sm-half-L">
        <label style="width:40%">{{ Resource.displayMode }}</label>
        <select class="sm-select" style="width:58%" v-model="domeType">
          <option value="ALLDOME">{{Resource.allShow}}</option>
          <option value="VISIBLEDOME">{{Resource.visibleShow}}</option>
          <option value="HIDDENDOME">{{Resource.hiddenShow}}</option>
        </select>
      </div>
      <div class="boxchild">
        <button
          class="tbtn "
          type="button"
          v-on:click="analysis"
        >{{ Resource.analyze }}</button>
        <button @click="clear" class="tbtn " style='margin-left:4px' type="button">{{ Resource.clear }}</button>
      </div>
    </div>
  </div>
</template>

<script>
import openness from "./openness.js";
export default {
  name: "Sm3dOpennessAnalysis",
  props: {
    //附加高度
    addHeight: {
      type: Number
    },
    //分析位置
    viewPosition: {
      type: Array
    },
    //分析半径
    viewDomeRadius: {
      type: Number
    },
    //分析类型
    domeType: {
      type: String
    },
    //是否封口
    isClosed: {
      type: Boolean
    },
    //可见区颜色
    visibleAreaColor: {
      type: String
    },
    //不可见颜色
    hiddenAreaColor: {
      type: String
    },
    //开始角度
    startAngle: {
      type: Number
    },
    //终止角度
    endAngle: {
      type: Number
    }
  },
  methods: {
    // 滑块提示函数
    formatTooltip(val) {
      return val + "米";
    }
  },
  setup(props) {
    let { viewDomeRadius, domeType, analysis, clear } = openness(props);
    return {
      viewDomeRadius,
      domeType,
      analysis,
      clear
    };
  }
};
</script>

<style lang="scss" scoped>
</style>

