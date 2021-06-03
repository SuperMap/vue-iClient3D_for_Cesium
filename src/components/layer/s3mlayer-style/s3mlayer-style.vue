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
        <label style="width: 35%;">{{Resource.foreColor}}</label>
        <el-color-picker v-model="foreColor" size="mini" show-alpha style="width:63%"></el-color-picker>
      </div>
      <div class="sm-half-L">
        <label style="width: 35%;">{{Resource.lineColor}}</label>
        <el-color-picker v-model="lineColor" size="mini" show-alpha style="width:63%"></el-color-picker>
      </div>
      <div class="sm-half-L">
        <label style="width: 35%;">{{Resource.selectedColor}}</label>
        <el-color-picker v-model="selectedColor" size="mini" show-alpha style="width:63%"></el-color-picker>
      </div>
      <div class="sm-half-L">
        <label style="width: 35%;">{{Resource.selectColorMode}}</label>
        <div class="sm-half" style="width:63%">
          <label style="width:auto">
            <input type="radio" value="mix" v-model="selectColorMode" />
            {{Resource.mix}}
          </label>
          <label style="width:auto">
            <input type="radio" value="replace" v-model="selectColorMode" />
            {{Resource.replace}}
          </label>
        </div>
      </div>
      <div class="sm-half-L">
        <label style="width: 35%;">{{Resource.bottomAltitude}}</label>
        <el-slider
          v-model="bottomAltitude"
          :min="0"
          :step="1"
          :max="1000"
          input-size="mini"
          :debounce="1000"
          tooltip-class="tooltip-class"
          style="width:63%"
        ></el-slider>
      </div>
      <div class="sm-half-L">
        <label style="width: 35%;">LOD</label>
        <el-slider
          v-model="LODScale"
          :min="0"
          :max="10"
          :step="0.5"
          input-size="mini"
          :debounce="500"
          tooltip-class="tooltip-class"
          style="width:63%"
        ></el-slider>
      </div>
      <div class="sm-half-L">
        <label style="width: 35%;">{{Resource.layerTrans}}</label>
        <el-slider
          v-model="layerTrans"
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
        <label style="width:35%">{{Resource.fillStyle}}</label>
        <select class="sm-select" style="width:63%" v-model="fillStyle">
          <option value="fill">{{Resource.fillMode}}</option>
          <option value="wireframe">{{Resource.lineMode}}</option>
          <option value="fill-and-wireframe">{{Resource.fillAndLine}}</option>
        </select>
      </div>
      <div class="sm-half-L">
        <label style="width: 35%;">{{Resource.visibleDistanceMin}}</label>
        <input type="number" class="sm-input" style="width:63%" v-model="visibleDistanceMin" />
      </div>
      <div class="sm-half-L">
        <label style="width: 35%;">{{Resource.visibleDistanceMax}}</label>
        <input type="number" class="sm-input" style="width:63%" v-model="visibleDistanceMax" />
      </div>
    </div>
  </div>
</template>

<script>
import s3mlayerStyle from "./s3mlayer-style.js";
export default {
  name: "Sm3dS3mlayerStyle",
  props: {
    //默认选择图层名称
    selectedLayerName: {
      type: String
    },
    //前景色
    foreColor: {
      type: String
    },
    //线颜色
    lineColor: {
      type: String
    },
    //选中色
    selectedColor: {
      type: String
    },
    //选中模式
    selectColorMode: {
      type: String
    },
    //底部高层
    bottomAltitude: {
      type: Number
    },
    //lod
    LODScale: {
      type: Number
    },
    //图层透明度
    layerTrans: {
      type: Number
    },
    //填充风格
    fillStyle: {
      type: String
    },
    //最小可见高度
    visibleDistanceMin: {
      type: Number
    },
    //最大可见高度
    visibleDistanceMax: {
      type: Number
    }
  },
  setup(props) {
    let {
      layerNames,
      selectedLayerName,
      foreColor,
      lineColor,
      selectedColor,
      selectColorMode,
      bottomAltitude,
      LODScale,
      layerTrans,
      fillStyle,
      visibleDistanceMin,
      visibleDistanceMax
    } = s3mlayerStyle(props);
    return {
      layerNames,
      selectedLayerName,
      foreColor,
      lineColor,
      selectedColor,
      selectColorMode,
      bottomAltitude,
      LODScale,
      layerTrans,
      fillStyle,
      visibleDistanceMin,
      visibleDistanceMax
    };
  }
};
</script>

