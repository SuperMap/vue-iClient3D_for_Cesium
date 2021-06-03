<template>
  <div id="viewer-panel" class="sm-panel" v-drag>
    <div class="sm-function-module-sub-section" style="margin:0" v-stopdrag>
      <div class="sm-half-L">
        <label class="label-S">{{Resource.ClipWidth}}</label>
        <div class="sm-slider-input-box">
          <el-slider
            v-model="clipWidth"
            :min="1"
            :step="1"
            input-size="mini"
            :debounce="500"
            :show-tooltip="false"
            style="width:62%"
          ></el-slider>
          <input class="sm-input-S" min="1" step="1" type="number" v-model="clipWidth" />
        </div>
      </div>

      <div class="sm-half-L">
        <label class="label-S">{{Resource.ClipHeight}}</label>
        <div class="sm-slider-input-box">
          <el-slider
            v-model="clipHeight"
            :min="1"
            :step="1"
            input-size="mini"
            :debounce="500"
            :show-tooltip="false"
            style="width:62%"
          ></el-slider>
          <input class="sm-input-S" min="1" step="1" type="number" v-model="clipHeight" />
        </div>
      </div>
      <div class="sm-half-L">
        <label class="label-S">{{Resource.Xrotation}}</label>
        <div class="sm-slider-input-box">
          <el-slider
            v-model="pitch"
            :min="0"
            :step="1"
            :max="360"
            input-size="mini"
            :debounce="500"
            :show-tooltip="false"
            style="width:62%"
          ></el-slider>
          <input class="sm-input-S" min="0" max="360" step="1" type="number" v-model="pitch" />
        </div>
      </div>
      <div class="sm-half-L">
        <label class="label-S">{{Resource.Yrotation}}</label>
        <div class="sm-slider-input-box">
          <el-slider
            v-model="roll"
            :min="0"
            :step="1"
            :max="360"
            input-size="mini"
            :debounce="500"
            :show-tooltip="false"
            style="width:62%"
          ></el-slider>
          <input class="sm-input-S" min="0" step="1" max="360" type="number" v-model="roll" />
        </div>
      </div>
      <div class="sm-half-L">
        <label class="label-S">{{Resource.Zrotation}}</label>
        <div class="sm-slider-input-box">
          <el-slider
            v-model="heading"
            :min="0"
            :step="1"
            :max="360"
            input-size="mini"
            :debounce="500"
            :show-tooltip="false"
            style="width:62%"
          ></el-slider>
          <input class="sm-input-S" min="0" step="1" max="360" type="number" v-model="heading" />
        </div>
      </div>
      <div class="sm-half-L">
        <label class="label-S">{{Resource.stretchHeight}}</label>
        <div class="sm-slider-input-box">
          <el-slider
            v-model="extrude"
            :min="1"
            :step="1"
            input-size="mini"
            :debounce="500"
            :show-tooltip="false"
            style="width:62%"
          ></el-slider>
          <input class="sm-input-S" min="1" step="1" type="number" v-model="extrude" />
        </div>
      </div>
      <div class="boxchild">
        <button @click="startCross" class="tbtn" type="button">{{Resource.clip}}</button>
        <button
          @click="clearCross"
          class="tbtn tbtn-margin-left"
          type="button"
        >{{Resource.clear}}</button>
      </div>
    </div>
  </div>
</template>

<script>
import clipCrossAnalysis from "./clip-cross.js";
export default {
  name: "Sm3dClipCross",
  props: {
    //宽度
    clipWidth: {
      type: Number,
      default: 5
    },
    //高度
    clipHeight: {
      type: Number,
      default: 5
    },
    //绕X选转
    heading: {
      type: Number,
      default: 0
    },
    //绕Y
    pitch: {
      type: Number,
      default: 0
    },
    //绕Z
    roll: {
      type: Number,
      default: 0
    },
    //拉伸
    extrude: {
      type: Number,
      default: 1
    }
  },

  setup(props) {
    let {
      clipWidth,
      clipHeight,
      heading,
      pitch,
      roll,
      extrude,
      startCross,
      clearCross
    } = clipCrossAnalysis(props);

    return {
      clipWidth,
      clipHeight,
      heading,
      pitch,
      roll,
      extrude,
      startCross,
      clearCross
    };
  }
};
</script>


