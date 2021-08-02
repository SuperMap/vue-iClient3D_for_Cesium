<template>
  <div id="facade-panel" class="sm-panel" v-drag>
    <div class="sm-function-module-sub-section" style="margin:0" v-stopdrag>
      <div class="sm-half-L">
        <label style="width: 35%;">{{Resource.facadeDistance}}</label>
        <el-slider
          v-model="maxDistance "
          :min="1"
          :max="1000"
          :step="1"
          input-size="mini"
          :debounce="500"
          :format-tooltip="formatTooltip"
          tooltip-class="tooltip-class"
          style="width:63%"
        ></el-slider>
      </div>
      <div class="sm-half-L">
        <label style="width: 35%;">{{Resource.facadeHeight}}</label>
        <el-slider
          v-model="maxHeight "
          :min="1"
          :max="200"
          :step="1"
          input-size="mini"
          :debounce="500"
          :format-tooltip="formatTooltip"
          tooltip-class="tooltip-class"
          style="width:63%"
        ></el-slider>
      </div>
      <div class="sm-half-L">
        <label style="width:100%">
          <input type="checkbox" v-model="setLodrange" />
          {{Resource.setLodrange}}
        </label>
        <div class="sm-half-L" v-show="setLodrange">
          <label style="width:35%">{{Resource.selectedLayer}}</label>
          <select class="sm-select" style="width:63%" v-model="selectedLayerName">
            <option v-for="(layer, index) in layerNames" :key="index" :value="layer">{{ layer }}</option>
            <option v-show="layerNames.length == 0" value="none">{{Resource.noLayer}}</option>
          </select>
        </div>
        <div class="sm-half-L" v-show="setLodrange">
          <label style="width: 35%;">{{Resource.lodrange}}</label>
          <el-slider
            v-model="lodrange "
            :min="0.01"
            :max="2"
            :step="0.01"
            input-size="mini"
            :debounce="500"
            tooltip-class="tooltip-class"
            style="width:63%"
          ></el-slider>
        </div>
      </div>
      <div class="boxchild flex-between">
        <button
          class="tbtn"
          type="button"
          style="width:auto"
          v-on:click="setRegion"
        >{{Resource.setRegion}}</button>
        <button
          class="tbtn"
          type="button"
          style="width:auto"
          v-on:click="execute"
        >{{Resource.execute}}</button>
        <button @click="clear" class="tbtn" type="button">{{ Resource.clear}}</button>
      </div>
    </div>
  </div>
</template>

<script>
import facade from "./facade.js";
export default {
  name: "Sm3dFacade",
  props: {
    //最大宽度
    maxDistance: {
      type: Number
    },
    //最大高度
    maxHeight: {
      type: Number
    },
    //设置模型精细度
    setLodrange: {
      type: Boolean
    },
    //设置图层的lOD层级切换距离缩放系数
    lodrange: {
      type: Number
    },
    //默认选择图层名称
    selectedLayerName: {
      type: String
    }
  },
  methods: {
    // 滑块提示函数
    formatTooltip(val) {
      return val + Resource.meter;
    }
  },
  setup(props) {
    let {
      maxDistance,
      maxHeight,
      layerNames,
      setLodrange,
      selectedLayerName,
      lodrange,
      setRegion,
      execute,
      clear
    } = facade(props);
    return {
      maxDistance,
      maxHeight,
      setLodrange,
      layerNames,
      selectedLayerName,
      lodrange,
      setRegion,
      execute,
      clear
    };
  }
};
</script>

