<template>
  <div id="terrain-flood-panel" class="sm-panel" v-drag>
    <div class="sm-function-module-sub-section" style="margin:0" v-stopdrag>
      <div class="sm-half-L">
        <label style="width: 40%;">{{Resource.visibleHeight}}</label>
        <el-slider
          v-model="floodHeight"
          :min="0"
          :max="9000"
          range
          :step="1"
          input-size="mini"
          :debounce="500"
          tooltip-class="tooltip-class"
          :format-tooltip="formatTooltip"
          style="width:58%"
        ></el-slider>
      </div>
      <div class="sm-half-L">
        <label style="width: 40%;">{{Resource.currentHeight}}</label>
        <input class="sm-input" disabled  type="number" style="width:58%" v-model="currentHeight" />
      </div>
      <div class="sm-half-L">
        <label style="width: 40%;">{{Resource.floodSpeed}}</label>
          <el-slider
            v-model="floodSpeed"
            :max="1000"
            :min="1"
            input-size="mini"
            :debounce="500"
            tooltip-class="tooltip-class"
             :format-tooltip="formatTooltip2"
            style="width:58%"
          ></el-slider>
      </div>
            <div class="boxchild">
        <button @click="floodBegin" class="tbtn" type="button">{{Resource.analyze}}</button>
        <button
          @click="floodClear"
          class="tbtn tbtn-margin-left"
          type="button"
        >{{Resource.clear}}</button>
      </div>
    </div>
  </div>
</template>

<script>
import terrainFlood from "./terrain-flood.js";
export default {
  name: "Sm3dTerrainFlood",
  props: {
    //最大可见高层
    maxHeight: {
      type: Number,
      default: 8000
    },
    //最小可见高程
    minHeight: {
      type: Number,
      default: 1000
    },
    //选择颜色
    cheackedBand: {
      type: String,
      default: "band1"
    },
    //淹没速度
    floodSpeed: {
      type: Number,
      default: 800
    },
    //透明度
    floodTrans: {
      type: Number,
      default: 0.8
    },
    //初始化传入分析区域
    floodPositions: {
      type: Array
    },
    //是否显示绘制后的线
    lineVisible: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    formatTooltip(val) {
      return val + "米";
    },
    formatTooltip2(val) {
      return val + "米/秒";
    }
    
  },
  setup(props) {
    let {
      floodHeight,
      currentHeight,
      floodSpeed,
      floodBegin,
      floodClear,
    } = terrainFlood(props);

    return {
      floodHeight,
      currentHeight,
      floodSpeed,
      floodBegin,
      floodClear,
    };
  }
};
</script>

