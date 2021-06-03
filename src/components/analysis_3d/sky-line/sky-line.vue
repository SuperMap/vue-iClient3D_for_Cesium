<template>
  <div id="skyLine-panel" class="sm-panel" v-drag>
    <div class="sm-function-module-sub-section" v-stopdrag style="margin:0">
      <div class="sm-half-L">
        <label style="width:40%">{{ Resource.displayMode }}</label>
        <select class="sm-select" style="width:58%" v-model="skylineMode">
          <option selected value="0">{{ Resource.polylineShow }}</option>
          <option value="1">{{ Resource.polygonShow }}</option>
          <option value="2">{{ Resource.bodyShow }}</option>
        </select>
      </div>
      <div class="sm-half-L flex-start">
        <label style="width:42%">{{ Resource.graphDisplay }}</label>
        <input checked type="checkbox" v-model="getSkyline2d" />
      </div>
      <div class="boxchild">
        <button class="tbtn" type="button" v-on:click="skyLineAnalysis">{{ Resource.analyze }}</button>
        <button
          class="tbtn tbtn-margin-left"
          type="button "
          v-on:click="setLimitBody"
        >{{ Resource.limitBody }}</button>
        <button @click="clear" class="tbtn tbtn-margin-left" type="button">{{ Resource.clear }}</button>
      </div>
    </div>
  </div>
  <div ref="echarts_box" id="echarts_box" v-show="getSkyline2d"></div>
</template>

<script>
import skyLine from "./sky-line.js";
export default {
  name: "Sm3dSkyline",
  props: {
    //分析服务地址
    spatialAnalysisUrl: {
      type: String
    },
    //观察者信息：查看或设置观察者信息
    observerInformation: {
      type: Object
    },
    //天际线分析半径
    skylineRadius: {
      type: Number
    },
    //天际线宽度
    lineWidth: {
      type: Number
    },
    //天际线颜色
    skylineColor: {
      type: String
    },
    //天际体颜色
    skyBodyColor: {
      type: String
    },
    //高亮障碍物颜色
    highlightBarrierColor: {
      type: String
    },
    //显示高亮障碍物
    highlightBarrier: {
      type: Boolean,
      default: false
    },
    //天际线分析模式：线，面，体
    skylineMode: {
      type: Number
    },
    //显示二维分析结果
    getSkyline2d: {
      type: Boolean,
      default: false
    }
  },

  setup(props) {
    let {
      getSkyline2d,
      skyLineAnalysis,
      setLimitBody,
      clear,
      echarts_box,
      skylineMode
    } = skyLine(props);

    return {
      getSkyline2d,
      skyLineAnalysis,
      setLimitBody,
      clear,
      echarts_box,
      skylineMode
    };
  }
};
</script>

