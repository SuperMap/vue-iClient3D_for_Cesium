<template>
  <div id="clip-plane-panel" class="sm-panel" v-drag>
    <div class="sm-function-module-sub-section" style="margin:0" v-stopdrag>
      <div class="boxchild" >
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
import clipPlaneAnalysis from './clip-plane.js'
export default {
  name: "Sm3dClipPlane",
  props: {
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
    PlanePositions: {
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
      isEdit,
      isEditZ,
      clipPlaneStart,
      clearClipPlane,
      planePosition
    } = clipPlaneAnalysis(props);

    return {
      isEdit,
      isEditZ,
      clipPlaneStart,
      clearClipPlane,
      planePosition
    };
  }
};
</script>




