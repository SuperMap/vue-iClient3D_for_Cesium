<template>
  <div id="terrain-operation-panel" class="sm-panel" v-drag>
    <div class="sm-function-module-sub-section" style="margin:0" v-stopdrag>
      <div class="sm-half-L">
        <label style="width:auto">
          <input type="radio" value="dig" v-model="operationType" />
          {{Resource.terrainExcavation}}
        </label>
        <label style="width:auto">
          <input type="radio" value="modify" v-model="operationType" />
          {{Resource.terrainModify}}
        </label>
      </div>
      <div class="sm-half-L" v-show="operationType==='dig'">
        <label style="width: 35%">{{Resource.terrainExcavationDepth }}</label>
        <input class="sm-input" style="width:43%" type="number" min="0" v-model="digDepth" />
      </div>
      <div class="sm-half-L">
        <label style="width:auto">
          <input checked type="checkbox" v-model="isEdit" />
          {{Resource.isEdit}}
        </label>
        <label style="width:auto" v-show="operationType==='modify'">
          <input checked type="checkbox" v-model="isEditZ" />
          {{Resource.isEditZ}}
        </label>
      </div>
      <div class="boxchild" v-show="operationType==='modify'">
        <button @click="modifyTerrain" class="tbtn" type="button">{{Resource.modify}}</button>
        <button @click="clearModify" class="tbtn tbtn-margin-left" type="button">{{Resource.clear}}</button>
      </div>
      <div class="boxchild" v-show="operationType==='dig'">
        <button
          @click="digTerrain"
          @touchstart="digTerrain"
          class="tbtn"
          type="button"
        >{{Resource.excavation}}</button>
        <button @click="clearDig" class="tbtn tbtn-margin-left" type="button">{{Resource.clear}}</button>
      </div>
    </div>
  </div>
</template>

<script>
import terrainOperation from "./terrain-operation.js";
export default {
  name: "Sm3dTerrainOperation",
  props: {
    //挖掘深度
    digDepth: {
      type: Number,
      default: 500
    },
    //初始化传入挖掘区域
    digPositions: {
      type: Array
    },
    //初始化传入修改区域
    modifyPositions: {
      type: Array
    },
    //是否编辑
    isEdit: {
      type: Boolean,
      default: false
    },
    //是否编辑Z轴
    isEditZ: {
      type: Boolean,
      default: false
    },
    //是否显示绘制后的线
    lineVisible: {
      type: Boolean,
      default: true
    }
  },

  setup(props) {
    let {
      digDepth,
      isEdit,
      isEditZ,
      terrainVisible,
      digTerrain,
      clearDig,
      modifyTerrain,
      clearModify,
      operationType
    } = terrainOperation(props);
    return {
      digDepth,
      isEdit,
      isEditZ,
      terrainVisible,
      digTerrain,
      clearDig,
      modifyTerrain,
      clearModify,
      operationType
    };
  }
};
</script>



