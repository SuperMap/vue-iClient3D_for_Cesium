<template>
  <div id="clip-plane-panel" class="sm-panel" v-drag>
    <div class="sm-function-module-sub-section" style="margin:0" v-stopdrag>
           <div class="sm-half-L">
        <label style="width:40%">{{ Resource.planeDirection }}</label>
        <select class="sm-select" style="width:58%" v-model="planeDirection">
          <option selected value="vertical">{{ Resource.verticalGround }}</option>
          <option value="parallel">{{ Resource.parallelGround }}</option>
        </select>
      </div>
      <div class="sm-half-L">
        <label style="width:40%">{{ Resource.clipMode }}</label>
        <select class="sm-select" style="width:58%" v-model="clipMode">
          <option selected value="0">{{ Resource.clipInside }}</option>
          <option value="1">{{ Resource.clipOutside }}</option>
        </select>
      </div>
      <div class="boxchild">
        <button @click="clipPlaneStart" class="tbtn" type="button">{{Resource.clip}}</button>
        <button
          @click="clearClipPlane"
          class="tbtn tbtn-margin-left"
          type="button"
        >{{Resource.clear}}</button>
      </div>
    </div>
  </div>
</template>

<script>
import clipPlane from "./clip-plane-new.js";
export default {
  name: "Sm3dClipPlane",
  props: {
  },

  setup(props) {
    let {
      clipPlaneStart,
      clearClipPlane,
      clipMode,
      planeDirection
    } = clipPlane(props);
    return {
       clipPlaneStart,
      clearClipPlane,
      clipMode,
      planeDirection
    };
  }
};
</script>




