<template>
  <div id="shadowquery-panel" class="sm-panel" v-drag>
    <div class="sm-function-module-sub-section" v-stopdrag style="margin:0">
      <div class="sm-half-L">
        <div class="sm-slider-input-box-M">
          <el-slider
            v-model="timeValue"
            :max="96"
            :step="0.5"
            range
            :marks="marks"
            tooltip-class="tooltip-class"
            :format-tooltip="formatTooltip"
            @change="timeChanged"
          ></el-slider>
        </div>
        <img
          src="../../../style/images/start.png"
          :title="Resource.title1"
          style="width:36px;height:36px;margin-top: -20px;"
          @click="sunLightForTime(true)"
          v-show="showStartImgForTime"
        />
        <img
          src="../../../style/images/stop.png"
          :title="Resource.title0"
          style="width:36px;height:36px;margin-top: -20px;"
          @click="sunLightForTime(false)"
          v-show="!showStartImgForTime"
        />
      </div>

      <div class="sm-half-L">
        <div class="sm-slider-input-box-M" style="height:34px">
          <el-date-picker v-model="currentDate" type="date" size="small" :clearable="false"></el-date-picker>
        </div>
        <img
          src="../../../style/images/start.png"
          :title="Resource.title2"
          style="width:36px;height:36px"
          @click="sunLightForDate(true)"
          v-show="showStartImgForDate"
        />
        <img
          src="../../../style/images/stop.png"
          :title="Resource.title0"
          style="width:36px;height:36px"
          @click="sunLightForDate(false)"
          v-show="!showStartImgForDate"
        />
      </div>
      <div class="sm-half-L">
        <label style="width: 40%;">{{Resource.stretchHeight}}</label>
        <el-slider
          v-model="extrudeHeight"
          :min="0"
          :max="150"
          :step="1"
          input-size="mini"
          :debounce="500"
          :format-tooltip="formatTooltip3"
          tooltip-class="tooltip-class"
          style="width:58%"
        ></el-slider>
        <!-- <input class="sm-input-S" min="1" step="1" type="number" v-model="clipWidth" /> -->
      </div>
      <!-- <div class="sm-half-L">
        <label style="width: 40%;">分析间距</label>
        <el-slider
          v-model="spacing"
          :min="0.5"
          :max="50"
          :step="0.5"
          input-size="mini"
          :debounce="500"
          :format-tooltip="formatTooltip3"
          tooltip-class="tooltip-class"
          style="width:58%"
        ></el-slider>
      </div> -->
      <div class="flex flex-start" style="width:35%; align-items: center;">
        <input checked type="checkbox" style="margin-right:10%" v-model="shadowBodyShow" />
        <label style="width:auto">{{Resource.bodyShow}}</label>
      </div>
      <div class="sm-half-L" v-show="shadowBodyShow">
        <label style="width: 40%;">{{Resource.daylightFilter}}</label>
        <el-slider
          v-model="shadowBodyFilter"
          :min="0"
          :max="100"
          range
          :step="1"
          input-size="mini"
          :debounce="500"
          tooltip-class="tooltip-class"
          @change="filterChanged"
          :format-tooltip="formatTooltip2"
          style="width:58%"
        ></el-slider>
      </div>

      <div class="boxchild flex-between" style="padding:0">
        <div class="flex flex-start" style="width:35%; align-items: center;">
          <input checked type="checkbox" style="margin-right:10%" v-model="shadowShow" />
          <label style="width:auto">{{Resource.shadowShow}}</label>
        </div>
        <div class="flex flex-end" style="width:auto">
          <button @click="analysis" class="tbtn tbtn-width" type="button" style>{{Resource.analyze}}</button>
          <button
            @click="clear"
            class="tbtn tbtn-width tbtn-margin-left"
            type="button"
          >{{Resource.clear}}</button>
        </div>
      </div>
    </div>
  </div>
  
  <div id="bubble" class="bubble" ref="bubble" v-show="shadowRadio.isShow">
    <div class="boxchild flex-between">
      <label style="width:auto">分析结果</label>
      <div class="flex flex-end" style="width:auto">
        <i
          class="el-icon-position"
          title="停靠"
          style="margin-right:8px"
          @click="dockBubble(true)"
          v-show="dockFontShow"
        ></i>
        <i
          class="el-icon-chat-square"
          title="悬浮"
          style="margin-right:8px"
          @click="dockBubble(false)"
          v-show="!dockFontShow"
        ></i>
        <i class="el-icon-close" title="关闭" @click="closeBubble"></i>
      </div>
    </div>
    <div class="sm-half-L">
      <label class="label-S">采光率</label>
      <input
        class="sm-input-M"
        style="width:70%;height:20px"
        type="text"
        v-model="shadowRadio.shadowRadio"
      />
    </div>
    <div class="sm-half-L">
      <label class="label-S">经度</label>
      <input
        class="sm-input-M"
        style="width:70%;height:20px"
        type="text"
        v-model="shadowRadio.longitude"
      />
    </div>
    <div class="sm-half-L">
      <label class="label-S">纬度</label>
      <input
        class="sm-input-M"
        style="width:70%;height:20px"
        type="text"
        v-model="shadowRadio.latitude"
      />
    </div>
    <div class="sm-half-L">
      <label class="label-S">高程</label>
      <input
        class="sm-input-M"
        style="width:70%;height:20px"
        type="text"
        v-model="shadowRadio.height"
      />
    </div>
  </div>
  <div class="legend" v-show="legendShow">
    <img src="public/img/other/legend_shadow.png" alt />
  </div>
</template>

<script>
import shadowquery from "./shadow-query.js";
export default {
  name: "Sm3dShadowquery",
  props: {
    //开始结束时间
    timeValue: {
      type: Array
    },
    //当前日期
    currentDate: {
      type: Object
    },
    //显示阴影
    shadowShow: {
      type: Boolean,
      default: true
    },
    //时间间隔
    timeInterval: {
      type: Number
    },
    //间距（米）
    spacing: {
      type: Number
    },
    //底部高程（米）
    bottomHeight: {
      type: Number
    },
    //拉伸高度（米）
    extrudeHeight: {
      type: Number
    },
    //分析区域
    shadowQueryRegion: {
      type: Array
    },
    //图层上阴影类型
    layerShadowType: {
      type: Number
    },
    //确定地形是否投射或接受来自太阳的阴影
    terrainShadows: {
      type: Number
    },
    //显示时间轴开始图标
    showStartImgForTime: {
      type: Boolean,
      default: true
    },
    //显示日期开始图标
    showStartImgForDate: {
      type: Boolean,
      default: true
    },
    //停靠图标显示
    dockFontShow: {
      type: Boolean,
      default: true
    },
    //图例显示
    legendShow: {
      type: Boolean,
      default: false
    },
    //阴影率体显示
    shadowBodyShow: {
      type: Boolean,
      default: false
    },
    //过滤区间
    shadowBodyFilter: {
      type: Array
    }
  },
  methods: {
    formatTooltip2(val) {
      return "采光率：" + val + "%";
    },
    // 滑块提示函数
    formatTooltip3(val) {
      return val + "米";
    }
  },

  setup(props) {
    let {
      marks,
      timeValue, //开始结束时间
      currentDate, //当前日期
      shadowShow,
      timeChanged,
      formatTooltip,
      sunLightForTime,
      sunLightForDate,
      analysis,
      clear,
      showStartImgForTime, //显示时间轴开始图标
      showStartImgForDate,
      shadowRadio,
      bubble,
      closeBubble,
      dockBubble,
      dockFontShow,
      legendShow,
      shadowBodyShow,
      shadowBodyFilter,
      filterChanged,
      extrudeHeight,
      spacing
    } = shadowquery(props);

    return {
      marks,
      timeValue,
      currentDate,
      shadowShow,
      timeChanged,
      formatTooltip,
      sunLightForTime,
      sunLightForDate,
      analysis,
      clear,
      showStartImgForTime,
      showStartImgForDate,
      shadowRadio,
      bubble,
      closeBubble,
      dockBubble,
      dockFontShow,
      legendShow,
      shadowBodyShow,
      shadowBodyFilter,
      filterChanged,
      extrudeHeight,
      spacing
    };
  }
};
</script>


