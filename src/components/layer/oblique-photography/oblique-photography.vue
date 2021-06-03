<template>
  <div id="terrain-operation-panel" class="sm-panel" v-drag>
    <div class="sm-function-module-sub-section" style="margin:0" v-stopdrag>
      <div class="sm-half-L">
        <label style="width:40%">{{Resource.selectedLayer}}</label>
        <select class="sm-select" style="width:58%" v-model="selectedLayerName">
          <option v-for="(layer, index) in layerNames" :key="index" :value="layer">{{ layer }}</option>
          <option v-show="layerNames.length == 0" value="none">{{Resource.noS3mLayer}}</option>
        </select>
      </div>
      <div class="sm-half-L">
        <label style="width:auto">
          <input type="radio" value="Excavation" v-model="operationType" />
          {{Resource.excavation}}
        </label>
        <label style="width:auto">
          <input type="radio" value="Flatten" v-model="operationType" />
          {{Resource.flatten}}
        </label>
      </div>
      <div class="boxchild" v-show="operationType==='Excavation'">
        <button @click="startExcavation" class="tbtn" type="button">{{Resource.excavation}}</button>
        <button
          @click="clearExcavation"
          class="tbtn tbtn-margin-left"
          type="button"
        >{{Resource.clear}}</button>
      </div>
      <div class="boxchild" v-show="operationType==='Flatten'">
        <button @click="startFlatten" @touchstart="startFlatten" class="tbtn" type="button">{{Resource.flatten}}</button>
        <button @click="clearFlatten" class="tbtn tbtn-margin-left" type="button">{{Resource.clear}}</button>
      </div>
    </div>
  </div>
</template>

<script>
import photography from "./oblique-photography.js";
export default {
  name: "Sm3dObliquePhotography",
  props: {
    //默认选择图层名称
    selectedLayerName: {
      type: String
    },
    //操作类型
    operationType: {
      type: String
    },
    //初始化传入挖掘区域
    excavationPositions: {
      type: Array
    },
    //初始化传入压平区域
    flattenPositions: {
      type: Array
    },
    //是否显示绘制后的线
    lineVisible: {
      type: Boolean,
      default: true
    }
  },

  setup(props) {
    let {
      layerNames,
      selectedLayerName,
      operationType,
      startExcavation, //开始挖掘
      clearExcavation,
      startFlatten, //开始压平
      clearFlatten //清除压平
    } = photography(props);
    return {
      layerNames,
      selectedLayerName,
      operationType,
      startExcavation, //开始挖掘
      clearExcavation,
      startFlatten, //开始压平
      clearFlatten //清除压平
    };
  }
};
</script>



