<template>
  <div id="sight-line" class="sm-panel" v-drag>
    <div class="sm-function-module-sub-section" v-stopdrag style="margin:0">
      <div class="sm-half-L">
        <label style="width: 35%;">{{Resource.lineWidth}}</label>
        <el-slider
          v-model="lineWidth"
          :min="1"
          :step="1"
          :max="10"
          input-size="mini"
          :debounce="500"
          tooltip-class="tooltip-class"
          style="width:63%"
        ></el-slider>
      </div>

      <div class="sm-half-L">
        <label style="width: 35%;">{{Resource.visibleColor}}</label>
        <el-color-picker v-model="visibleColor" size="mini" show-alpha style="width:63%"></el-color-picker>
      </div>
      <div class="sm-half-L">
        <label style="width: 35%;">{{Resource.hiddenColor}}</label>
        <el-color-picker v-model="hiddenColor" size="mini" show-alpha style="width:63%"></el-color-picker>
      </div>
      <div class="sm-half-L">
        <label style="width: 35%;">{{Resource.barrierColor}}</label>
        <el-color-picker v-model="barrierColor" size="mini" show-alpha style="width:63%"></el-color-picker>
      </div>

      <div class="sm-half-L">
        <label style="width:auto">
          <input type="checkbox" v-model="showBarrierPoints" />
          {{Resource.showBarrierPoints}}
        </label>
        <label style="width:auto">
          <input type="checkbox" v-model="highlightBarrier" />
          {{Resource.highlightBarrier}}
        </label>
      </div>
      <div class="boxchild ">
        <button type="button" class="tbtn" v-on:click="analysis">{{ Resource.analyze }}</button>
        <button type="button" class="tbtn tbtn-margin-left" @click="clear">{{ Resource.clear }}</button>
      </div>
    </div>
  </div>
</template>

<script>
import sightLine from "./sight-line.js";
export default {
  name: "Sm3dSightline",
  props: {
    //s初始视点位置
    viewPosition: {
      type: Array
    },
    //可见部分颜色
    visibleColor: {
      type: String,
      default: "rgb(0, 200, 0)"
    },
    //不可见颜色
    hiddenColor: {
      type: String,
      default: "rgb(200, 0, 0)"
    },
    //高亮障碍物颜色
    barrierColor: {
      type: String,
      default: "rgba(255, 186, 1, 1)"
    },
    //是否显示高亮障碍物
    highlightBarrier: {
      type: Boolean,
      default: false
    },
    //通视线宽
    lineWidth: {
      type: Number,
      default: 3
    },
    showBarrierPoints: {
      type: Boolean,
      default: true
    }
  },
  setup(props) {
    let {
      lineWidth,
      visibleColor,
      hiddenColor,
      barrierColor,
      highlightBarrier,
      showBarrierPoints,
      analysis,
      clear
    } = sightLine(props);
    return {
      lineWidth,
      visibleColor,
      hiddenColor,
      barrierColor,
      highlightBarrier,
      showBarrierPoints,
      analysis,
      clear
    };
  }
};
</script>


