<template>
  <div id="fly-route-panel" class="sm-panel" v-drag>
    <div class="sm-function-module-sub-section" style="margin:0" v-stopdrag>
      <div class="sm-half-L">
        <label style="width: 30%;">{{Resource.videoUrl}}</label>
        <input
          type="text"
          class="sm-input"
          style="width:65%;position:relative;padding-right: 30px;"
          v-model="fileText"
          :placeholder="Resource.fileType"
        />
        <span class="iconfont iconwenjianjia fpfFile" @click="chooseFile"></span>
        <input type="file" accept="*.mp4" id="vedioFile" style="display:none" ref="vedioFile_dom" />
      </div>
      <div class="sm-half-L">
        <label style="width: 30%;">{{Resource.horizontal}}</label>
        <el-slider
          v-model="horizontal "
          :min="0.5"
          :max="60"
          :step="0.5"
          input-size="mini"
          :debounce="500"
          tooltip-class="tooltip-class"
          style="width:65%"
        ></el-slider>
      </div>
      <div class="sm-half-L">
        <label style="width: 30%;">{{Resource.vertical}}</label>
        <el-slider
          v-model="vertical "
          :min="0.5"
          :max="60"
          :step="0.5"
          input-size="mini"
          :debounce="500"
          tooltip-class="tooltip-class"
          style="width:65%"
        ></el-slider>
      </div>
      <div class="sm-half-L">
        <label style="width: 30%;">{{Resource.projectDistance}}</label>
        <el-slider
          v-model="distance "
          :min="1"
          :max="500"
          input-size="mini"
          :debounce="500"
          tooltip-class="tooltip-class"
          style="width:65%"
        ></el-slider>
      </div>

      <div class="sm-half-L">
        <label style="width: 30%;">{{Resource.clipMode}}</label>
        <div class="sm-half" style="width:68%">
          <label style="width:auto">
            <input type="radio" value="clip-inside" v-model="clipMode" />
            {{Resource.clipInside}}
          </label>
          <label style="width:auto">
            <input type="radio" value="clip-outside" v-model="clipMode" />
            {{Resource.clipOutside}}
          </label>
        </div>
      </div>
      <div class="sm-half-L flex-between">
        <label style="width:auto">
          <input type="checkbox" v-model="visibleLine" />
          {{Resource.visibleLine}}
        </label>
        <!-- <label style="width:auto">
          <input type="checkbox" v-model="visibleLine" />显示投放线
        </label>-->
      </div>
      <div class="boxchild" style="padding:0">
        <button class="tbtn" type="button" v-on:click="startProjection">{{Resource.projection}}</button>
        <button
          class="tbtn tbtn-margin-left"
          type="button"
          v-on:click="clipProjectImg"
        >{{Resource.clip}}</button>
        <button class="tbtn tbtn-margin-left" type="button " v-on:click="clear">{{Resource.clear}}</button>
      </div>
      <div id="videoContain" style="width:0;height:0">
        <video
          id="trailer-0"
          style="visibility: hidden"
          autoplay
          loop
          crossorigin
          controls
          muted
          multiple
        >
          <source src="public/data/media/video.mp4" type="video/mp4" />
        </video>
      </div>
    </div>
  </div>
</template>

<script>
import projection from "./projection-image.js";

export default {
  name: "Sm3dProjectionImage",
  props: {
    // 选中符号类型id
    selectedTypeId: {
      type: Number
    },
    // 颜色
    lightColor: {
      type: String
    },
    // 扩散距离
    cutoffDistance: {
      type: Number
    },
    // 衰减因子
    lightDecay: {
      type: Number
    },
    // 光源强度
    lightIntensity: {
      type: Number
    },
    // 聚光范围
    spotLightAngle: {
      type: Number
    },
    //通过文件同时添加多个视频进行投放。
    // fromInfo{
    // infoUrl:xx,
    // baseUrl:xx,
    // }
    fromInfo: {
      type: Object
    }
  },
  setup(props) {
    let {
      horizontal,
      vertical,
      distance,
      clipMode,
      visibleLine,
      fileText,
      chooseFile,
      vedioFile_dom,
      startProjection,
      clear,
      clipProjectImg
    } = projection(props);
    return {
      horizontal,
      vertical,
      distance,
      clipMode,
      visibleLine,
      fileText,
      chooseFile,
      vedioFile_dom,
      startProjection,
      clear,
      clipProjectImg
    };
  }
};
</script>

