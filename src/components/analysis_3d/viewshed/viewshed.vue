<template>
  <div id="viewshed" class="sm-panel" v-drag>
    <div class="sm-function-module-sub-section" v-stopdrag style="margin:0">
      <div class="sm-half-L">
        <input checked type="checkbox" v-model="visibleBody" />
        <label style="width:80%">{{ Resource.displayVisualsBody }}</label>
      </div>
      <div class="sm-half-L">
        <input checked type="checkbox" v-model="invisibleBody" />
        <label style="width:80%">{{ Resource.displayInvisibleBody }}</label>
      </div>
      <div class="sm-half-L">
        <input checked type="checkbox" v-model="viewshedAnimation" />
        <label style="width:80%">{{ Resource.viewshedAnimation }}</label>
      </div>
      <div class="boxchild flex-between">
        <button type="button" class="tbtn" v-on:click="analysis">{{ Resource.analyze }}</button>
        <button type="button" class="tbtn tbtn-margin-left" @click="clear">{{ Resource.clear }}</button>
      </div>
    </div>
  </div>
</template>

<script>
import viewshed from "./viewshed.js";
export default {
  name: "Sm3dViewshed",
  props: {
    //可视域体数据服务
    viewshedSpatialUrl: {
      type: String
    },
    //初始化观察者信息
    observerInformation: {
      type: Object
    },
    //方向角
    direction: {
      type: Number
    },
    //俯仰角
    pitch: {
      type: Number
    },
    //附加高度
    addheight: {
      type: Number
    },
    //可视域距离
    distance: {
      type: Number
    },
    //水平视角
    verticalFov: {
      type: Number
    },
    //垂直视角
    horizontalFov: {
      type: Number
    },
    //可视线颜色
    hintLineColor: {
      type: String
    },
    //可视区域颜色
    visibleAreaColor: {
      type: String
    },
    //不可视域颜色
    hiddenAreaColor: {
      type: String
    },
    //可视域体颜色
    visibleBodyColor: {
      type: String
    },
    //不可视域体颜色
    invisibleBodyColor: {
      type: String
    },
    //显示可视域体
    visibleBody: {
      type: Boolean
    },
    //显示不可视域体
    invisibleBody: {
      type: Boolean
    },
    //动态可视域设置
    viewshedAnimation: {
      type: Boolean
    },
    //动态可视域路线点
    DynamicLine: {
      type: Array
    },
    //动态分析行进速度
    DynamicSpeed: {
      type: Number
    }
  },

  setup(props) {
    let {
      visibleBody,
      invisibleBody,
      viewshedAnimation,
      analysis,
      clear
    } = viewshed(props);
    return {
      visibleBody,
      invisibleBody,
      viewshedAnimation,
      analysis,
      clear
    };
  }
};
</script>

