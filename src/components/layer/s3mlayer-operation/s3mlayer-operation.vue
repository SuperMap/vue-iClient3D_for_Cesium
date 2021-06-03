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
        <label style="width:100%">
          <input type="checkbox" v-model="selectedoffset" />
          {{Resource.selectedoffset}}
        </label>
        <div class="sm-half-L">
          <label style="width: 35%;">{{Resource.offsetX}}</label>
          <el-slider
            v-model="offsetX "
            :min="-50"
            :max="50"
            :step="1"
            input-size="mini"
            :debounce="500"
            tooltip-class="tooltip-class"
            style="width:63%"
          ></el-slider>
        </div>
        <div class="sm-half-L">
          <label style="width: 35%;">{{Resource.offsetY}}</label>
          <el-slider
            v-model="offsetY "
            :min="-50"
            :max="50"
            :step="1"
            input-size="mini"
            :debounce="500"
            tooltip-class="tooltip-class"
            style="width:63%"
          ></el-slider>
        </div>
        <div class="sm-half-L">
          <label style="width: 35%;">{{Resource.offsetZ}}</label>
          <el-slider
            v-model="offsetZ "
            :min="-50"
            :max="50"
            :step="1"
            input-size="mini"
            :debounce="500"
            tooltip-class="tooltip-class"
            style="width:63%"
          ></el-slider>
        </div>
      </div>
      <div class="sm-half-L">
        <label style="width:100%">
          <input type="checkbox" v-model="polygonOffset" />
          {{Resource.polygonOffset}}
        </label>
        <div class="sm-half-L">
          <label style="width: 35%;">{{Resource.polygonOffsetFactor}}</label>
          <el-slider
            v-model="polygonOffsetFactor "
            :min="-20"
            :max="20"
            :step="1"
            input-size="mini"
            :debounce="500"
            tooltip-class="tooltip-class"
            style="width:63%"
          ></el-slider>
        </div>
        <div class="sm-half-L">
          <label style="width: 35%;">{{Resource.polygonOffsetUnit}}</label>
          <el-slider
            v-model="polygonOffsetUnit "
            :min="0"
            :max="20"
            :step="1"
            input-size="mini"
            :debounce="500"
            tooltip-class="tooltip-class"
            style="width:63%"
          ></el-slider>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import s3mlayerOperation from "./s3mlayer-operation.js";
export default {
  name: "Sm3dS3mlayerOperation",
  props: {
    //默认选择图层名称
    selectedLayerName: {
      type: String
    },
    //选中偏移
    selectedoffset: {
      type: Boolean
    },
    //沿X轴偏移
    offsetX: {
      type: Number
    },
    //沿Y轴偏移
    offsetY: {
      type: Number
    },
    //沿Z轴偏移
    offsetZ: {
      type: Number
    },
    //多边形偏移
    polygonOffset: {
      type: Boolean
    },
    //偏移因子
    polygonOffsetFactor: {
      type: Number
    },
    //偏移单位
    polygonOffsetUnit: {
      type: Number
    }
  },
  setup(props) {
    let {
      layerNames,
      selectedLayerName,
      selectedoffset,
      offsetX, //沿X轴偏移
      offsetY, //沿X轴偏移
      offsetZ, //沿Z轴偏移
      polygonOffset, //多边形偏移
      polygonOffsetFactor, //偏移因子
      polygonOffsetUnit //偏移单位
    } = s3mlayerOperation(props);
    return {
      layerNames,
      selectedLayerName,
      selectedoffset,
      offsetX, //沿X轴偏移
      offsetY, //沿X轴偏移
      offsetZ, //沿Z轴偏移
      polygonOffset, //多边形偏移
      polygonOffsetFactor, //偏移因子
      polygonOffsetUnit //偏移单位
    };
  }
};
</script>

