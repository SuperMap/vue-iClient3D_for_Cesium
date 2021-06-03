<template>
  <div id="profile" class="sm-panel" v-drag>
    <div class="sm-function-module-sub-section" v-stopdrag style="margin:0">
      <div class="sm-half-L">
        <input checked type="checkbox" v-model="profile2d"/>
        <label style="width:80%">{{ Resource.profileInformation }}</label>
      </div>
      <div class="boxchild flex-between">
        <button type="button" class="tbtn" v-on:click="analysis">{{ Resource.analyze }}</button>
        <button type="button" class="tbtn tbtn-margin-left" @click="clear">{{ Resource.clear }}</button>
      </div>
    </div>
  </div>

  <div ref="echarts_box" id="echarts_box" v-show="profile2d" ></div>
</template>

<script>
import profile from "./profile.js";
export default {
  name: "Sm3dProfile",
  props: {
     //显示剖面分析结果
    profile2d: {
      type: Boolean,
       default: false
    },
      //贴线颜色
    polylineColor: {
      type: String
    },
      //贴线宽度
    polylineWidth: {
      type: Number
    },
      //初始化自定义echarts配置对象
    initEchartsOption: {
      type: Object
    },
      //自定义更新echarts配置对象
    updateEchartsOption: {
      type: Object
    },
  },
  setup(props) {
    let { profile2d, analysis, clear, echarts_box } = profile(props);
    return {
      profile2d,
      analysis,
      clear,
      echarts_box
    };
  }
};
</script>

