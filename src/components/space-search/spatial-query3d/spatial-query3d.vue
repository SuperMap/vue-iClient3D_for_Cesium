<template>
  <div id="openness-panel" class="sm-panel" v-drag>
    <div class="sm-function-module-sub-section" style="margin:0" v-stopdrag>
      <div class="sm-half-L">
        <label style="width: 40%;">{{Resource.scale}}</label>
        <el-slider
          v-model="scale"
          :min="0.2"
          :max="10"
          :step="0.2"
          input-size="mini"
          :debounce="500"
          tooltip-class="tooltip-class"
          style="width:58%"
        ></el-slider>
        <!-- <input class="sm-input-S" min="1" step="1" type="number" v-model="clipWidth" /> -->
      </div>
      <div class="sm-half-L">
        <label style="width:40%">{{Resource.searchLayers}}</label>
        <select class="sm-select" style="width:58%" v-model="selectedLayerName">
          <option v-for="(layer, index) in layerNames" :key="index" :value="layer">{{ layer }}</option>
        </select>
      </div>
      <div class="sm-half-L">
        <label style="width:40%">{{Resource.positionMode}}</label>
        <select class="sm-select" style="width:58%" v-model="positionMode">
          <option value="intersects">{{Resource.intersects}}</option>
          <option value="disjoint">{{Resource.disjoint}}</option>
          <option value="contains">{{Resource.contains}}</option>
        </select>
      </div>
      <div class="sm-half-L" v-show="GeometryBodyNames.length>0">
        <label style="width:40%">{{Resource.geometryType}}</label>
        <select class="sm-select" style="width:58%" v-model="geometryType">
          <option value="box">{{Resource.box}}</option>
          <option
            v-for="(geometry, index) in GeometryBodyNames"
            :key="index"
            :value="index"
          >{{ geometry }}</option>
        </select>
      </div>
      <div class="boxchild">
        <button class="tbtn" type="button" v-on:click="analysis">{{Resource.search}}</button>
        <button
          @click="clear"
          class="tbtn"
          style="margin-left:4px"
          type="button"
        >{{ Resource.clear}}</button>
      </div>
    </div>
  </div>
</template>

<script>
import spatialQuery3d from "./spatial-query3d.js";
import tool from "../../../js/tool/tool.js";
export default {
  name: "Sm3dSpatialQuery3d",
  props: {
    //默认选择图层名称
    selectedLayerName: {
      type: String
    },
    //x旋转
    Xpitch: {
      type: Number
    },
    //y旋转
    Yroll: {
      type: Number
    },
    //z旋转
    Zheading: {
      type: Number
    },
    //缩放
    scale: {
      type: Number
    },
    //位置模式
    positionMode: {
      type: String
    },
    //选择模型类型
    geometryType: {
      type: String
    },
    //模型显示类型
    drawType: {
      type: String
    },
    //模型填充颜色
    FillColor: {
      type: String
    },
    //模型线框颜色
    WireFrameColor: {
      type: String
    },
    //查询结果颜色
    searchColor: {
      type: String
    },
    //设置长方体类型参数
    boxParameters: {
      type: Array
    },
    //设置球体类型参数
    sphereParameters: {
      type: Array
    },
    //设置圆锥类型参数
    coneParameters: {
      type: Array
    },
    //设置圆柱类型参数
    cylinderParameters: {
      type: Array
    },
    //设置椭圆类型参数
    ellicpseParameters: {
      type: Array
    },
    //圆锥绕点旋转方式
    rotateOrigin: {
      type: String
    }
  },
  setup(props) {
    let {
      scale,
      selectedLayerName,
      layerNames,
      positionMode,
      GeometryBodyNames,
      geometryType,
      analysis,
      clear
    } = spatialQuery3d(props);

    return {
      scale,
      selectedLayerName,
      layerNames,
      positionMode,
      GeometryBodyNames,
      geometryType,
      analysis,
      clear
    };
  }
};
</script>



