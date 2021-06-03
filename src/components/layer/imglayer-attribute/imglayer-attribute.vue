<template>
  <div id="s3mlayer-attribute-panel" class="sm-panel" v-drag>
    <div class="sm-function-module-sub-section" style="margin:0" v-stopdrag>
      <div class="sm-half-L">
        <label style="width:35%">{{Resource.selectedLayer}}</label>
        <select class="sm-select" style="width:63%" v-model="selectedLayerName">
          <option v-for="(layer, index) in layerNames" :key="index" :value="layer">{{ layer }}</option>
          <option v-show="layerNames.length == 0" value="none">{{Resource.noImgLayer}}</option>
        </select>
      </div>
      <div class="sm-half-L">
        <label style="width: 35%;">{{Resource.brightness}}</label>
        <el-slider
          v-model="brightness "
          :min="0"
          :max="3"
          :step="0.05"
          input-size="mini"
          :debounce="500"
          tooltip-class="tooltip-class"
          style="width:63%"
        ></el-slider>
      </div>
      <div class="sm-half-L">
        <label style="width: 35%;">{{Resource.contrast}}</label>
        <el-slider
          v-model="contrast "
          :min="0"
          :max="3"
          :step="0.05"
          input-size="mini"
          :debounce="500"
          tooltip-class="tooltip-class"
          style="width:63%"
        ></el-slider>
      </div>
      <div class="sm-half-L">
        <label style="width: 35%;">{{Resource.hue}}</label>
        <el-slider
          v-model="hue "
          :min="0"
          :max="3"
          :step="0.05"
          input-size="mini"
          :debounce="500"
          tooltip-class="tooltip-class"
          style="width:63%"
        ></el-slider>
      </div>
      <div class="sm-half-L">
        <label style="width: 35%;">{{Resource.saturation}}</label>
        <el-slider
          v-model="saturation "
          :min="0"
          :max="3"
          :step="0.05"
          input-size="mini"
          :debounce="500"
          tooltip-class="tooltip-class"
          style="width:63%"
        ></el-slider>
      </div>
      <div class="sm-half-L">
        <label style="width: 35%;">{{Resource.gamma}}</label>
        <el-slider
          v-model="gamma "
          :min="0"
          :max="3"
          :step="0.05"
          input-size="mini"
          :debounce="500"
          tooltip-class="tooltip-class"
          style="width:63%"
        ></el-slider>
      </div>
      <div class="sm-half-L">
        <label style="width: 35%;">{{Resource.alpha}}</label>
        <el-slider
          v-model="alpha"
          :min="0"
          :max="1"
          :step="0.01"
          input-size="mini"
          :debounce="500"
          tooltip-class="tooltip-class"
          style="width:63%"
        ></el-slider>
      </div>
           <div class="sm-half-L">
        <label style="width: 35%;">{{Resource.transparentColor}}</label>
        <el-color-picker v-model="transparentBackColor" size="mini"  style="width:63%"></el-color-picker>
      </div>
       <div class="sm-half-L">
        <label style="width: 35%;">{{Resource.transparentColorTolerance}}</label>
        <el-slider
          v-model="transparentBackColorTolerance"
          :min="0"
          :max="1"
          :step="0.01"
          input-size="mini"
          :debounce="500"
          tooltip-class="tooltip-class"
          style="width:63%"
        ></el-slider>
      </div>
    </div>
  </div>
</template>

<script>
import layerAttribute from "./imglayer-attribute.js";
export default {
  name: "Sm3dImglayerAttribute",
  props: {
    //默认选择图层名称
    selectedLayerName: {
      type: String
    },
    //默认亮度
    brightness: {
      type: Number
    },
    //对比度
    contrast: {
      type: Number
    },
    //色调
    hue: {
      type: Number
    },
    //饱和度
    saturation: {
      type: Number
    },
    //伽马
    gamma: {
      type: Number
    },
    alpha: {
      type: Number
    },
      transparentBackColor: {
      type: String
    },
      transparentBackColorTolerance: {
      type: Number
    },
    
  },
  setup(props) {
    let {
      layerNames,
      selectedLayerName,
      brightness,
      contrast,
      hue,
      saturation,
      gamma,
      alpha,
      transparentBackColor,
      transparentBackColorTolerance
    } = layerAttribute(props);
    return {
      layerNames,
      selectedLayerName,
      brightness,
      contrast,
      hue,
      saturation,
      gamma,
      alpha,
      transparentBackColor,
      transparentBackColorTolerance
    };
  }
};
</script>

