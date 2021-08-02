<template>
  <div id="draw-panel" class="sm-panel" v-drag>
    <div class="sm-function-module-sub-section" style="margin:0" v-stopdrag>
      <div class="sm-half-L symbolic">
        <div
          v-for="light in config"
          :key="light.id"
          class="symbolic-box"
          :class="{ 'theme-color': light.id ===lightSelectId }"
          @click="lightSelectId = light.id"
        >
          <span class="iconfont" :class="light.iconfont"></span>
          <label style="width:100%">{{light.lightName}}</label>
        </div>
      </div>

      <div class="sm-half-L">
        <label style="width: 35%;">{{Resource.lightColor}}</label>
        <el-color-picker v-model="lightColor" size="mini" show-alpha style="width:63%"></el-color-picker>
      </div>
      <div class="sm-half-L" v-show="lightSelectId!==2">
        <label style="width: 35%;">{{Resource.cutoffDistance}}</label>
        <el-slider
          v-model="cutoffDistance "
          :min="0"
          :max="500"
          :step="1"
          input-size="mini"
          :debounce="500"
          tooltip-class="tooltip-class"
          style="width:63%"
        ></el-slider>
      </div>
      <div class="sm-half-L" v-show="lightSelectId!==2">
        <label style="width: 35%;">{{Resource.lightDecay}}</label>
        <el-slider
          v-model="lightDecay "
          :min="0"
          :max="10"
          :step="0.1"
          input-size="mini"
          :debounce="500"
          tooltip-class="tooltip-class"
          style="width:63%"
        ></el-slider>
      </div>
      <div class="sm-half-L">
        <label style="width: 35%;">{{Resource.lightIntensity}}</label>
        <el-slider
          v-model="lightIntensity "
          :min="0"
          :max="10"
          :step="0.1"
          input-size="mini"
          :debounce="500"
          tooltip-class="tooltip-class"
          style="width:63%"
        ></el-slider>
      </div>
      <div class="sm-half-L" v-show="lightSelectId===1">
        <label style="width: 35%;">{{Resource.spotLightAngle}}</label>
        <el-slider
          v-model="spotLightAngle "
          :min="0"
          :max="90"
          :step="1"
          input-size="mini"
          :debounce="500"
          tooltip-class="tooltip-class"
          style="width:63%"
        ></el-slider>
      </div>
      <div class="sm-half-L flex-between">
        <label style="width:auto">
          <input type="checkbox" v-model="visibleModel" />
          {{Resource.lightModel}}
        </label>
        <label style="width:auto">
          <input type="checkbox" v-model="visiblePositions" />
          {{Resource.lightPositions}}
        </label>
      </div>
      <div class="boxchild" style="padding:0">
        <!-- <div class="flex flex-start" style="width:56%; align-items: center;">
          <input checked type="checkbox" style="margin-right:10%" v-model="showLight" />
          <label style="width:auto">显示光源</label>
        </div>-->
        <button class="tbtn" type="button" style="width:auto" v-on:click="addLight">{{Resource.add}}</button>
        <button
          class="tbtn tbtn-margin-left"
          style="width:auto"
          type="button "
          v-on:click="clearLight"
        >{{Resource.clear}}</button>
      </div>
    </div>
  </div>

  <div id="bubble" class="bubble" ref="bubble" v-show="bubbleShow && visiblePositions">
    <div class="boxchild flex-between">
      <label style="width:auto">{{Resource.visiblePositions}}</label>
      <div class="flex flex-end" style="width:auto">
        <i
          class="el-icon-position"
          title="停靠"
          style="margin-right:8px"
          @click="dockBubble(true)"
          v-show="dockFontShow"
        ></i>
        <i
          class="el-icon-chat-square"
          title="悬浮"
          style="margin-right:8px"
          @click="dockBubble(false)"
          v-show="!dockFontShow"
        ></i>
        <i class="el-icon-close" title="关闭" @click="closeBubble"></i>
      </div>
    </div>
    <div class="sm-half-L">
      <label class="label-S">{{Resource.longitude}}</label>
      <input
        class="sm-input-M"
        style="width:70%;height:20px"
        type="text"
        v-model="modelPosition[0]"
      />
    </div>
    <div class="sm-half-L">
      <label class="label-S">{{Resource.latitude}}</label>
      <input
        class="sm-input-M"
        style="width:70%;height:20px"
        type="text"
        v-model="modelPosition[1]"
      />
    </div>
    <div class="sm-half-L">
      <label class="label-S">{{Resource.altitude}}</label>
      <input
        class="sm-input-M"
        style="width:70%;height:20px"
        type="text"
        v-model="modelPosition[2]"
      />
    </div>
  </div>
</template>

<script>
import light from "./light.js";

export default {
  name: "Sm3dLight",
  props: {
    // 颜色
    lightColor: {
      type: String
    },
    // 扩散距离
    cutoffDistance: {
      type: Number
    },
    // 衰减因子
    lightDecay: {
      type: Number
    },
    // 光源强度
    lightIntensity: {
      type: Number
    },
    // 聚光范围
    spotLightAngle: {
      type: Number
    }
  },
  setup(props) {
    let {
      lightSelectId,
      lightColor,
      cutoffDistance,
      lightDecay,
      lightIntensity,
      spotLightAngle,
      config,
      addLight,
      clearLight,
      visibleModel,
      bubble,
      closeBubble,
      dockBubble,
      dockFontShow,
      modelPosition,
      bubbleShow,
      visiblePositions
    } = light(props);
    return {
      lightSelectId,
      lightColor,
      cutoffDistance,
      lightDecay,
      lightIntensity,
      spotLightAngle,
      config,
      addLight,
      clearLight,
      visibleModel,
      bubble,
      closeBubble,
      dockBubble,
      dockFontShow,
      modelPosition,
      bubbleShow,
      visiblePositions
    };
  }
};
</script>

