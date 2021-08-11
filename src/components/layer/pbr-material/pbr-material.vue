<template>
  <div id="pbr-panel" class="sm-panel" v-drag>
    <div class="sm-function-module-sub-section" style="margin:0" v-stopdrag>
      <div class="sm-half-L">
        <label style="width:35%">{{Resource.selectedLayer}}</label>
        <select class="sm-select" style="width:63%" v-model="selectedLayerName">
          <option v-for="(layer, index) in layerNames" :key="index" :value="layer">{{ layer }}</option>
          <option v-show="layerNames.length == 0" value="none">{{Resource.noLayer}}</option>
        </select>
      </div>
      <div class="sm-half-L">
        <label style="width:35%">{{Resource.selectedPbr}}</label>
        <select class="sm-select" style="width:63%" v-model="selectedPbr">
          <option v-for="(value, key, index) in pbrLibrary" :key="index" :value="key">{{value}}</option>
        </select>
      </div>
      <div class="boxchild">
        <button type="button" class="tbtn" v-on:click="addPBR">{{ Resource.add }}</button>
        <button type="button" class="tbtn tbtn-margin-left" @click="clear">{{ Resource.clear }}</button>
      </div>
    </div>
  </div>
</template>

<script>
import pbrMaterial from "./pbr-material.js";
export default {
  name: "Sm3dAddPbr",
  props: {
    //默认选择图层名称
    selectedLayerName: {
      type: String
    }
  },
  setup(props) {
    let {
      layerNames,
      selectedLayerName,
      pbrLibrary,
      selectedPbr,
      addPBR,
      clear
    } = pbrMaterial(props);
    return {
      layerNames,
      selectedLayerName,
      pbrLibrary,
      selectedPbr,
      addPBR,
      clear
    };
  }
};
</script>

