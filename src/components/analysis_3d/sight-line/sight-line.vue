<template>
  <div id="profile" class="sm-panel" v-drag>
    <div class="sm-function-module-sub-section" v-stopdrag style="margin:0">
      <!-- <div class="sm-half-L">
        <input checked type="checkbox" v-model="highlightBarrier"/>
        <label style="width:80%">{{ Resource.highlightBarrier }}</label>
      </div>-->
      <div class="boxchild flex-between">
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
      type: String
    },
    //不可见颜色
    hiddenColor: {
      type: String
    },
    //高亮障碍物颜色
    highlightBarrierColor: {
      type: String
    },
    //是否显示高亮障碍物
    highlightBarrier: {
      type: Boolean
    },
    //通视线宽
    lineWidth: {
      type: Number
    }
  },
  setup(props) {
    let { highlightBarrier, analysis, clear } = sightLine(props);
    return {
      highlightBarrier,
      analysis,
      clear
    };
  }
};
</script>


