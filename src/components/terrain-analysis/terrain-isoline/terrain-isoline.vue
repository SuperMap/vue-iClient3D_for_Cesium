<template>
  <div id="terrain-isoline-panel" class="sm-panel" v-drag>
    <div class="sm-function-module-sub-section" style="margin:0" v-stopdrag>
      <div class="sm-half-L">
        <label style="width: 40%;">{{Resource.visibleHeight}}</label>
        <el-slider
          v-model="fillHeight"
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
        <label style="width: 40%;">{{Resource.isolineInterval}}</label>
        <input class="sm-input" style="width:58%" min="0" type="number" v-model="equivalentIsoline" />
      </div>
      <div class="sm-half-L">
        <label style="width: 40%;">{{Resource.displayMode}}</label>
        <select class="sm-select" style="width:58%" id="fillOptions" v-model="fillOptionsSelected">
          <option value="Line">{{Resource.contourFilling}}</option>
          <option value="Region">{{Resource.panelFilling}}</option>
          <option value="Line_Region">{{Resource.contourPanelFilling}}</option>
          <option value="None">{{Resource.noColorTable}}</option>
        </select>
      </div>
      <div class="boxchild">
        <button @click="isoLineAnalysis" class="tbtn" type="button">{{Resource.analyze}}</button>
        <button @click="clearIsoLine" class="tbtn tbtn-margin-left" type="button">{{Resource.clear}}</button>
      </div>
    </div>
  </div>
</template>

<script>
import terrainIsoline from "./terrain-isoline.js";
export default {
  name: "Sm3dTerrainIsoline",
  props: {
    //最大可见高层
    fillMaxHeight: {
      type: Number
    },
    //最小可见高程
    fillMinHeight: {
      type: Number
    },
    //等值距
    equivalentIsoline: {
      type: Number
    },
    //颜色
    lineColor: {
      type: String
    },
    //显示模式
    fillOptionsSelected: {
      type: String
    },
    //是否编辑
    isEdit: {
      type: Boolean,
      default: false
    },
    //初始化传入分析区域
    isolinePositions: {
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
      return val + Resource.meter;
    },
    formatTooltip2(val) {
      return val + Resource.meter_second;
    }
  },
  setup(props) {
    let {
      fillMaxHeight,
      fillMinHeight,
      fillHeight,
      equivalentIsoline,
      lineColor,
      fillOptionsSelected,
      isEdit,
      isoLineAnalysis,
      clearIsoLine
    } = terrainIsoline(props);

    return {
      fillMaxHeight,
      fillMinHeight,
      fillHeight,
      equivalentIsoline,
      lineColor,
      fillOptionsSelected,
      isEdit,
      isoLineAnalysis,
      clearIsoLine
    };
  }
};
</script>






