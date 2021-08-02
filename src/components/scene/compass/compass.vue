<template>
  <div id="compass-panel" class="compass-panel">
    <div class="btn_box" style="border-radius: 50%;" @click="reduceCompass" :title="Resource.compass">
      <span id="compass"
       style="transform : rotate(-45deg);display : inline-block;" class="iconfont iconzhibeizhen" ref="compass_dom"></span>
    </div>
    <div class="btn_box" @click="reset" :title="Resource.reset" >
      <span class="iconfont iconzhongzhi"></span>
    </div>
    <div class="btn_box" @mousedown="zoomIn" @mouseup="mouseup_zoomIn" :title="Resource.zoomIn">
      <span class="iconfont iconfangda"></span>
    </div>
    <div class="btn_box" @mousedown="zoomOut" @mouseup="mouseup_zoomOut" :title="Resource.zoomOut">
      <span class="iconfont iconsuoxiao"></span>
    </div>
    <div class="btn_box" @click="fullscreenchange" :title="Resource.fullScreen">
      <span class="iconfont" :class="!isfull?'iconquanping':'iconshouqi1'"></span>
    </div>
  </div>
</template>

<script>
import compass from "./compass.js";
export default {
  name: "Sm3dCompass",
  props: {
    //
    isfull: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    let {
      compass_dom,
      isfull,
      reduceCompass,
      reset,
      fullscreenchange,
      zoomIn,
      mouseup_zoomIn,
      zoomOut,
      mouseup_zoomOut
    } = compass(props);
    return {
      compass_dom,
      isfull,
      reduceCompass,
      reset,
      fullscreenchange,
      zoomIn,
      mouseup_zoomIn,
      zoomOut,
      mouseup_zoomOut
    };
  }
};
</script>

