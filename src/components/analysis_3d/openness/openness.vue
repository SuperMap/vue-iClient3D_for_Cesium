<template>
  <div id="openness-panel" class="sm-panel" v-drag>
    <div class="sm-function-module-sub-section" style="margin:0" v-stopdrag>
      <div class="sm-half-L">
        <label style="width: 35%;">{{Resource.addheight}}</label>
        <el-slider
          v-model="addHeight"
          :min="0"
          :step="0.1"
          :max="10"
          input-size="mini"
          :debounce="500"
          tooltip-class="tooltip-class"
          style="width:63%"
        ></el-slider>
      </div>
      <div class="sm-half-L">
        <label style="width: 35%;">{{Resource.startAngle}}</label>
        <el-slider
          v-model="startAngle"
          :min="0"
          :max="360"
          input-size="mini"
          :debounce="500"
          tooltip-class="tooltip-class"
          style="width:63%"
        ></el-slider>
      </div>
      <div class="sm-half-L">
        <label style="width: 35%;">{{Resource.endAngle}}</label>
        <el-slider
          v-model="endAngle"
          :min="0"
          :max="360"
          input-size="mini"
          :debounce="500"
          tooltip-class="tooltip-class"
          style="width:63%"
        ></el-slider>
      </div>
      <div class="sm-half-L">
        <label style="width: 35%;">{{Resource.observeRadius}}</label>
        <el-slider
          v-model="viewDomeRadius"
          :min="1"
          :step="1"
          :max="1000"
          input-size="mini"
          :debounce="500"
          :format-tooltip="formatTooltip"
          tooltip-class="tooltip-class"
          style="width:63%"
        ></el-slider>
        <!-- <input class="sm-input-S" min="1" step="1" type="number" v-model="clipWidth" /> -->
      </div>
      <div class="sm-half-L">
        <label style="width: 35%;">{{Resource.visibleAreaColor}}</label>
        <el-color-picker v-model="visibleAreaColor" size="mini" show-alpha style="width:63%"></el-color-picker>
      </div>
      <div class="sm-half-L">
        <label style="width: 35%;">{{Resource.hiddenAreaColor}}</label>
        <el-color-picker v-model="hiddenAreaColor" size="mini" show-alpha style="width:63%"></el-color-picker>
      </div>

      <div class="sm-half-L">
        <label style="width:35%">{{ Resource.displayMode }}</label>
        <select class="sm-select" style="width:63%" v-model="domeType">
          <option value="ALLDOME">{{Resource.allShow}}</option>
          <option value="VISIBLEDOME">{{Resource.visibleShow}}</option>
          <option value="HIDDENDOME">{{Resource.hiddenShow}}</option>
        </select>
      </div>
      <div class="sm-half-L">
        <label style="width:auto">
          <input type="checkbox" v-model="isClosed" />
          {{Resource.isClosed}}
        </label>
      </div>
      <div class="boxchild">
        <button class="tbtn" type="button" v-on:click="analysis">{{ Resource.analyze }}</button>
        <button
          @click="clear"
          class="tbtn"
          style="margin-left:4px"
          type="button"
        >{{ Resource.clear }}</button>
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
    let {
      addHeight, //附加高度
      viewDomeRadius, //分析半径
      domeType, //分析类型
      isClosed, //是否封口
      visibleAreaColor, //可见区颜色
      hiddenAreaColor, //不可见颜色
      startAngle, //开始角度
      endAngle, //终止角度
      analysis,
      clear
    } = openness(props);
    return {
      addHeight, //附加高度
      viewDomeRadius, //分析半径
      domeType, //分析类型
      isClosed, //是否封口
      visibleAreaColor, //可见区颜色
      hiddenAreaColor, //不可见颜色
      startAngle, //开始角度
      endAngle, //终止角度
      analysis,
      clear
    };
  }
};
</script>

<style lang="scss" scoped>
</style>

