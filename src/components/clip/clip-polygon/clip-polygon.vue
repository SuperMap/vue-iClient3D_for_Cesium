<template>
  <div id="clip-polygon-panel" class="sm-panel" v-drag>
    <div class="sm-function-module-sub-section" style="margin:0" v-stopdrag>
      <div class="sm-half-L">
        <label style="width:auto">
          <input type="radio" value="ClipInside" v-model="clipModelPolygon" />
          {{Resource.clipInside}}
        </label>
        <label style="width:auto">
          <input type="radio" value="ClipOutside" v-model="clipModelPolygon" />
          {{Resource.clipOutside}}
        </label>
      </div>
      <div class="boxchild">
        <button @click="clipPolygon" class="tbtn" type="button">{{Resource.clip}}</button>
        <button
          @click="clearClipPolygon"
          class="tbtn tbtn-margin-left"
          type="button"
        >{{Resource.clear}}</button>
      </div>
    </div>
  </div>
</template>

<script>
import clipPolygonAnalysis from "./clip-polygon.js";
export default {
  name: "Sm3dClipPolygon",
  props: {
    //裁剪模式
    clipModelPolygon: {
      type: String,
      default: "ClipInside"
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
    //初始化传入分析区域
    polygonPositions: {
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
      clipModelPolygon,
      isEdit,
      isEditZ,
      clipPolygon,
      clearClipPolygon
    } = clipPolygonAnalysis(props);

    return {
      clipModelPolygon,
      isEdit,
      isEditZ,
      clipPolygon,
      clearClipPolygon
    };
  }
};
</script>




