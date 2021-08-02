<template>
  <div id="skyLine-panel" class="sm-panel" v-drag>
    <div class="sm-function-module-sub-section" v-stopdrag style="margin:0">
      <div class="sm-half-L">
        <label style="width:35%">{{ Resource.displayMode }}</label>
        <select class="sm-select" style="width:63%" v-model="skylineMode">
          <option selected value="0">{{ Resource.polylineShow }}</option>
          <option value="1">{{ Resource.polygonShow }}</option>
          <option value="2">{{ Resource.bodyShow }}</option>
        </select>
      </div>
      <div class="sm-half-L">
        <label style="width: 35%;">{{Resource.skylineRadius}}</label>
        <input type="number" class="sm-input" style="width:63%" v-model="skylineRadius" />
      </div>
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
        <label style="width: 35%;">{{Resource.skylineColor}}</label>
        <el-color-picker v-model="skylineColor" size="mini" show-alpha style="width:63%"></el-color-picker>
      </div>
      <div class="sm-half-L">
        <label style="width: 35%;">{{Resource.skyBodyColor}}</label>
        <el-color-picker v-model="skyBodyColor" size="mini" show-alpha style="width:63%"></el-color-picker>
      </div>
      <div class="sm-half-L">
        <label style="width: 35%;">{{Resource.barrierColor}}</label>
        <el-color-picker v-model="barrierColor" size="mini" show-alpha style="width:63%"></el-color-picker>
      </div>

      <div class="sm-half-L">
        <label style="width:auto">
          <input type="checkbox" v-model="getSkyline2d" />
          {{Resource.graphDisplay}}
        </label>
        <label style="width:auto">
          <input type="checkbox" v-model="highlightBarrier" />
          {{Resource.highlightBarrier}}
        </label>
      </div>

      <div class="sm-half-L flex-start">
        <input checked type="checkbox" v-model="ignoreGlobe" />
        <label >{{ Resource.ignoreGlobe }}</label>
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
    skylineSpatialAnalysisUrl: {
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
    },
    //忽略地表参与分析
    ignoreGlobe: {
      type: Boolean,
      default: true
    }
  },

  setup(props) {
    let {
      skylineRadius,
      lineWidth,
      skylineColor,
      skyBodyColor,
      barrierColor,
      highlightBarrier,
      getSkyline2d,
      skyLineAnalysis,
      setLimitBody,
      clear,
      echarts_box,
      skylineMode,
      ignoreGlobe
    } = skyLine(props);

    return {
      skylineRadius,
      lineWidth,
      skylineColor,
      skyBodyColor,
      barrierColor,
      highlightBarrier,
      getSkyline2d,
      skyLineAnalysis,
      setLimitBody,
      clear,
      echarts_box,
      skylineMode,
      ignoreGlobe
    };
  }
};
</script>

