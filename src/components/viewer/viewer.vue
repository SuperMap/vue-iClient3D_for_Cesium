<template>
  <div id="cesiumContainer" ref="viewer">
    <slot></slot>
  </div>
</template>

<script>
import { onMounted } from "vue";
import initViewer from "./viewer.js";
// import {initViewer} from "../../../dist/vue-webgl2.min";

export default {
  name: "Sm3dViewer",
  props: {
    sceneUrl: {
      //场景接口
      type: String
    },
    s3mScps: {
      //s3m图层接口
      type: Array
    },
    afterInitviewer: {
      //初始化viewer后回调函数
      type: Function
    },
    openingAnimation: {
      //开场动画
      type: Boolean
    }
  },
  setup(props) {
    onMounted(() => {
      initViewer(props);
    });
  }
};
</script>



