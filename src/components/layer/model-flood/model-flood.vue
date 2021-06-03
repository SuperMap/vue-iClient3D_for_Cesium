<template>
  <div id="terrain-flood-panel" class="sm-panel" v-drag>
    <div class="sm-function-module-sub-section" style="margin:0" v-stopdrag>
      <div class="sm-half-L">
        <label style="width:40%">{{Resource.selectedLayer}}</label>
        <select class="sm-select" style="width:58%" v-model="selectedLayerName">
          <option v-for="(layer, index) in layerNames" :key="index" :value="layer">{{ layer }}</option>
          <option v-show="layerNames.length == 0" value="none">{{Resource.noS3mLayer}}</option>
        </select>
      </div>
      <div class="sm-half-L">
        <label style="width: 40%;">{{Resource.visibleHeight}}</label>
        <el-slider
          v-model="floodHeight"
          :min="0"
          :max="500"
          range
          :step="1"
          input-size="mini"
          :debounce="500"
          tooltip-class="tooltip-class"
          :format-tooltip="formatTooltip"
          style="width:58%"
        ></el-slider>
      </div>
      <div class="sm-half-L">
        <label style="width: 40%;">{{Resource.currentHeight}}</label>
        <input class="sm-input" disabled type="number" style="width:58%" v-model="currentHeight" />
      </div>
      <div class="sm-half-L">
        <label style="width: 40%;">{{Resource.floodSpeed}}</label>
        <el-slider
          v-model="floodSpeed"
          :max="20"
          :min="0.1"
          input-size="mini"
          :debounce="500"
          tooltip-class="tooltip-class"
          :format-tooltip="formatTooltip2"
          style="width:58%"
        ></el-slider>
      </div>
      <div class="boxchild">
        <button @click="floodBegin" class="tbtn" type="button">{{Resource.analyze}}</button>
        <button
          @click="floodClear"
          class="tbtn tbtn-margin-left"
          type="button"
        >{{Resource.clear}}</button>
      </div>
    </div>
  </div>
</template>

<script>
import modelFlood from "./model-flood.js";
export default {
  name: "Sm3dModelFlood",
  methods: {
    formatTooltip(val) {
      return val + Resource.meter;
    },
    formatTooltip2(val) {
      return val + Resource.meter_second;
    }
    
  },
  setup(props) {
    let {
      layerNames,
      selectedLayerName,
      floodHeight,
      currentHeight,
      floodSpeed,
      floodClear,
      floodBegin
    } = modelFlood(props);
    return {
      layerNames,
      selectedLayerName,
      floodHeight,
      currentHeight,
      floodSpeed,
      floodClear,
      floodBegin
    };
  }
};
</script>

