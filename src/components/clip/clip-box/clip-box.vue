<template>
  <div id="viewer-panel" class="sm-panel" v-drag>
    <div class="sm-function-module-sub-section" style="margin:0" v-stopdrag>
      <div class="sm-half-L">
        <label class="label-S">{{Resource.length}}</label>
        <div class="sm-slider-input-box">
          <el-slider
            v-model="clipLength"
            :min="1"
            :step="1"
            input-size="mini"
            :debounce="500"
            :show-tooltip="false"
            style="width:62%"
          ></el-slider>
          <input class="sm-input-S" min="1" step="1" type="number" v-model="clipLength" />
        </div>
      </div>
      <div class="sm-half-L">
        <label class="label-S">{{Resource.width}}</label>
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
        <label class="label-S">{{Resource.height}}</label>
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
        <label class="label-S">{{Resource.rotate}}</label>
        <div class="sm-slider-input-box">
          <el-slider
            v-model="clipRotate"
            :min="-180"
            :max="180"
            :step="1"
            input-size="mini"
            :debounce="500"
            :show-tooltip="false"
            style="width:62%"
          ></el-slider>
          <input
            class="sm-input-S"
            max="180"
            min="-180"
            step="1"
            type="number"
            v-model="clipRotate"
          />
        </div>
      </div>
      <div class="sm-half-L">
        <label class="label-S">{{Resource.ClipModel}}</label>
        <select class="sm-select-m" v-model="boxClipModel">
          <option value="CutInsideBoxNOFrame">{{Resource.CutInsideBoxNOFrame}}</option>
          <option value="CutOutBoxNOFrame">{{Resource.CutOutBoxNOFrame}}</option>
          <option value="CutInsideBoxFrame">{{Resource.CutInsideBoxFrame}}</option>
          <option value="CutOutBoxFrame">{{Resource.CutOutBoxFrame}}</option>
        </select>
      </div>
      <div class="sm-half-L">
        <label style="width:27%">显示盒子</label>
        <div class="sm-half" style="width:72%">
          <input checked type="checkbox" v-model="isShowBox" />
          <div class="boxchild" style="width:auto">
            <button @click="BoxClip" class="tbtn" type="button">{{Resource.clip}}</button>
            <button
              @click="clearBoxClip"
              class="tbtn tbtn-margin-left"
              type="button"
            >{{Resource.eliminate}}</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import clipBoxAnalysis from "./clip-box.js";
export default {
  name: "Sm3dClipBox",
  props: {
    //长度
    clipLength: {
      type: Number,
      default: 10
    },
    //宽度
    clipWidth: {
      type: Number,
      default: 10
    },
    //高
    clipHeight: {
      type: Number,
      default: 10
    },
    //旋转
    clipRotate: {
      type: Number,
      default: 0
    },
    //裁剪模式
    boxClipModel: {
      type: String,
      default: "CutInsideBoxNOFrame"
    },
    //显示盒子
    isShowBox: {
      type: Boolean,
      default: true
    }
  },

  setup(props) {
    let {
      clipLength,
      clipWidth,
      clipHeight,
      clipRotate,
      boxClipModel,
      isShowBox,
      BoxClip,
      clearBoxClip
    } = clipBoxAnalysis(props);

    return {
      clipLength,
      clipWidth,
      clipHeight,
      clipRotate,
      boxClipModel,
      isShowBox,
      BoxClip,
      clearBoxClip
    };
  }
};
</script>

