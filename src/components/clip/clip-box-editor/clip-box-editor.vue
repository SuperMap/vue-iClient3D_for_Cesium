<template>
  <div id="clip-box-panel" class="sm-panel" v-drag>
    <div class="sm-function-module-sub-section" style="margin:0" v-stopdrag>
      <div class="sm-half-L">
        <label style="width:auto">
          <input type="radio" value="ClipInside" v-model="clipModel" />{{Resource.clipInside}}
        </label>
        <label style="width:auto">
          <input type="radio" value="ClipOutside" v-model="clipModel" />{{Resource.clipOutside}}
        </label>
      </div>
      <div class="boxchild">
        <button @click="BoxClipByEitor" class="tbtn" type="button">{{Resource.clip}}</button>
        <button
          @click="clearBoxClipByEitor"
          class="tbtn tbtn-margin-left"
          type="button"
        >{{Resource.clear}}</button>
      </div>
    </div>
  </div>
</template>

<script>
import clipBoxByeditor from "./clip-box-editor.js";

export default {
  name: "Sm3dClipBoxByeditor",
  props: {
    //裁剪模式
    clipModel: {
      type: String,
      default: "ClipInside"
    }
  },
  setup(props) {
    let { clipModel, BoxClipByEitor, clearBoxClipByEitor } = clipBoxByeditor(
      props
    );

    return {
      clipModel,
      BoxClipByEitor,
      clearBoxClipByEitor
    };
  }
};
</script>


