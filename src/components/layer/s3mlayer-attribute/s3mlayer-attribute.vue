<template>
  <div id="s3mlayer-attribute-panel" class="sm-panel" v-drag>
    <div class="sm-function-module-sub-section" style="margin:0" v-stopdrag>
      <div class="sm-half-L">
        <label style="width:35%">{{Resource.selectedLayer}}</label>
        <select class="sm-select" style="width:63%" v-model="selectedLayerName">
          <option v-for="(layer, index) in layerNames" :key="index" :value="layer">{{ layer }}</option>
          <option v-show="layerNames.length == 0" value="none">{{Resource.noS3mLayer}}</option>
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

      <div class="sm-half-L" style="margin-top:6px">
        <label style="width:35%">
          <input type="radio" value="noShadow" v-model="shadowMode" />{{Resource.closeShadow}}
        </label>
        <label style="width:auto">
          <input type="radio" value="allShadow" v-model="shadowMode" />{{Resource.openShadow}}
        </label>
      </div>
      <div class="sm-half-L">
        <label style="width: 35%;">{{Resource.shadowDarkness}}</label>
        <el-slider
          v-model="shadowDarkness"
          :min="0"
          :max="1"
          :step="0.05"
          input-size="mini"
          :debounce="500"
          tooltip-class="tooltip-class"
          style="width:63%"
        ></el-slider>
      </div>
      <div class="sm-half-L">
        <label style="width:auto">
          <input type="checkbox" v-model="selectEnabled" />{{Resource.selectEnabled}}
        </label>
        <label style="width:auto" v-show="selectEnabled">
          <input type="checkbox" v-model="multiChoose" />{{Resource.multiChoose}}
        </label>
        <label style="width:auto">
          <input type="checkbox" v-model="cullEnabled" />{{Resource.cullEnabled}}
        </label>
      </div>
      <div class="sm-half-L">
        <label style="width:35%">{{Resource.visibility}}</label>
        <select class="sm-select" style="width:63%" v-model="visibility">
          <option value="onlyShowSlection">{{Resource.onlyShowSlection}}</option>
          <option value="onlyHideSlection">{{Resource.onlyHideSlection}}</option>
          <option value="showAll">{{Resource.showAll}}</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script>
import layerAttribute from "./s3mlayer-attribute.js";
export default {
  name: "Sm3dS3mlayerAttribute",
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
    //阴影模式
    shadowMode: {
      type: String
    },
    //阴影明暗度
    shadowDarkness: {
      type: Number
    },
    //多选
    multiChoose: {
      type: Boolean
    },
    //双面渲染
    cullEnabled: {
      type: Boolean
    },
    //图层可见性
    visibility: {
      type: String
    }
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
      shadowMode,
      shadowDarkness,
      selectEnabled,
      multiChoose,
      cullEnabled,
      visibility
    } = layerAttribute(props);
    return {
      layerNames,
      selectedLayerName,
      brightness,
      contrast,
      hue,
      saturation,
      gamma,
      shadowMode,
      shadowDarkness,
      selectEnabled,
      multiChoose,
      cullEnabled,
      visibility
    };
  }
};
</script>

