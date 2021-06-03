<template>
  <div id="measure-panel" class="sm-panel" v-drag>
    <div class="sm-function-module-sub-section" style="margin:0" v-stopdrag>
      <div class="sm-half-L">
        <label class="label-S">{{Resource.selectMode}}</label>
        <select class="sm-select-m" v-model="measureMode">
          <option selected value="Space">{{Resource.measureSpace}}</option>
          <option value="Ground">{{Resource.measureGround}}</option>
          <option selected value="CGCS2000">CGCS2000</option>
          <option value="XIAN80">XIAN80</option>
          <option value="WGS84">WGS84</option>
          <option value="null">{{Resource.planeProjection}}</option>
          <!-- <option value="2">+ Resource.skylinesectorbody +</option> // 需要iServer910支持 -->
        </select>
      </div>

      <button
        @click="distanceClk"
        class="sm-btn"
        id="distance"
        :title="Resource.measureDistance"
        type="button"
        :disabled="measureMode === 'null'"
        :class="measureMode === 'null'?'pointer-events':''"
      >
        <span class="iconfont iconkongjianjuli"></span>
      </button>
      <button
        @click="heightClk"
        class="sm-btn"
        id="height"
        :title="Resource.measureHeight"
        type="button"
        :disabled="measureMode !='Space' && measureMode !='Ground'"
        :class="measureMode !='Space' && measureMode !='Ground'?'pointer-events':''"
      >
        <span class="iconfont icongaoduceliang"></span>
      </button>

      <button
        @click="areaClk"
        class="sm-btn"
        id="area"
        :title="Resource.measureSurface"
        type="button"
      >
        <span class="iconfont iconkongjianmianji"></span>
      </button>
      <button @click="clear" class="sm-btn" id="clear" :title="Resource.clear" type="button">
        <span class="iconfont iconqingchu"></span>
      </button>

      <div class="sm-half-L flex-start" style="margin-top: 6px" v-show="isShowDVH">
        <input checked id="showLine" style="margin-left: 6px" type="checkbox" v-model="isShowLine" />
        <span style="margin-left: 10%">{{ Resource.showContour }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import measure from "./measure.js";
export default {
  name: "Sm3dMeasure",
  setup(props) {
    let {
      measureMode, //测量模式
      clampMode, //贴地模式
      Ellipsoid, //椭球选择
      isShowDVH, //显示勾选界面
      interval, //等值线距
      isShowLine, //显示等高线
      distanceClk, //点击测距函数
      areaClk, //点击测面
      heightClk, //点击测高
      clear //清除
    } = measure(props);

    return {
      measureMode, //测量模式
      clampMode, //贴地模式
      Ellipsoid, //椭球选择
      isShowDVH, //显示勾选界面
      interval, //等值线距
      isShowLine, //显示等高线
      distanceClk,
      areaClk,
      heightClk,
      clear
    };
  }
};
</script>

