<template>
  <div id="geological-body-panel" class="sm-panel" v-drag>
    <div class="sm-function-module-sub-section" style="margin:0" v-stopdrag>
      <div class="sm-half-L">
        <label style="width:33%">{{Resource.operationType}}</label>
        <select class="sm-select-m" style="width:65%" v-model="operationType">
          <option value="stretch_cut">{{Resource.stretch_cut}}</option>
          <option value="dig">{{Resource.excavation}}</option>
          <option value="drilling">{{Resource.drilling}}</option>
          <option value="clip">{{Resource.clip}}</option>
          <!-- <option value="volume">叠加体元</option> -->
        </select>
      </div>
      <!-- 拉伸与剖切 -->
      <div v-show="operationType ==='stretch_cut'">
        <div class="sm-half-L">
          <label style="width: 33%;">{{Resource.stretchHeight}}</label>
          <input type="number" class="sm-input" style="width:65%" min="1" v-model="stretchHeight" />
        </div>
        <div class="boxchild" style="padding-bottom:0">
          <button class="tbtn" type="button" v-on:click="drawLine">{{Resource.drawLine}}</button>
          <button
            class="tbtn tbtn-margin-left"
            type="button "
            v-on:click="startCut"
          >{{Resource.cut}}</button>
          <button
            class="tbtn tbtn-margin-left"
            type="button "
            v-on:click="clearCut"
          >{{Resource.clear}}</button>
        </div>
      </div>
      <!-- 开挖 -->
      <div v-show="operationType ==='dig'">
        <div class="sm-half-L">
          <label style="width: 33%;">{{Resource.terrainExcavationDepth}}</label>
          <input type="number" class="sm-input" style="width:65%" min="1" v-model="digHeight" />
        </div>
        <div class="boxchild" style="padding-bottom:0">
          <button class="tbtn" type="button" v-on:click="startDig">{{Resource.excavation}}</button>
          <button
            class="tbtn tbtn-margin-left"
            type="button "
            v-on:click="clearDig"
          >{{Resource.clear}}</button>
        </div>
      </div>
      <!-- 钻孔 -->
      <div v-show="operationType ==='drilling'">
        <div class="sm-half-L">
          <label style="width: 33%;">{{Resource.drillRadius}}</label>
          <input type="number" class="sm-input" style="width:65%" min="1" v-model="drillRadius" />
        </div>
        <div class="sm-half-L">
          <label style="width: 33%;">{{Resource.drillHeight}}</label>
          <input type="number" class="sm-input" style="width:65%" min="1" v-model="drillHeight" />
        </div>
        <div class="boxchild" style="padding-bottom:0">
          <button class="tbtn" type="button" v-on:click="startDrilling">{{Resource.drilling}}</button>
          <button
            class="tbtn tbtn-margin-left"
            type="button "
            v-on:click="clearDrilling"
          >{{Resource.clear}}</button>
        </div>
      </div>
      <!-- 裁剪 -->
      <div v-show="operationType ==='clip'" style="width:100%">
        <div class="sm-half-L">
          <label style="width:auto">
            <input type="radio" value="drawClip" v-model="clipType" />
            {{Resource.drawClip}}
          </label>
          <label style="width:auto">
            <input type="radio" value="boxClip" v-model="clipType" />
            {{Resource.boxClip}}
          </label>
        </div>
        <div class="sm-half-L" v-show="clipType==='drawClip'">
          <label style="width:33%">{{Resource.clipMode}}</label>
          <select class="sm-select-m" style="width:65%" v-model="drawClipMode">
            <option value="KeepInside">{{Resource.clipOutside}}</option>
            <option value="KeepOutside">{{Resource.clipInside}}</option>
          </select>
        </div>
        <div class="boxchild" style="padding-bottom:0">
          <button class="tbtn" type="button" v-on:click="startClip">{{Resource.clip}}</button>
          <button
            class="tbtn tbtn-margin-left"
            type="button "
            v-on:click="clearClip"
          >{{Resource.clear}}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import geologicalBody from "./geological-body.js";
export default {
  name: "Sm3dGeologicalBody",
  props: {},

  setup(props) {
    let {
      operationType,
      stretchHeight,
      drawLine,
      startCut,
      clearCut,
      digHeight,
      startDig,
      clearDig,
      startDrilling,
      clearDrilling,
      drillHeight,
      drillRadius,
      startClip,
      clearClip,
      clipType,
      drawClipMode
    } = geologicalBody(props);
    return {
      operationType,
      stretchHeight,
      drawLine,
      startCut,
      clearCut,
      digHeight,
      startDig,
      clearDig,
      startDrilling,
      clearDrilling,
      drillHeight,
      drillRadius,
      startClip,
      clearClip,
      clipType,
      drawClipMode
    };
  }
};
</script>

