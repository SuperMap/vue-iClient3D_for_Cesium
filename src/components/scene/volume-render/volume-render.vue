<template>
  <div id="volume-panel" class="sm-panel" v-drag>
    <div class="sm-function-module-sub-section" style="margin:0" v-stopdrag>
      <div class="sm-half-L">
        <label style="width:auto">
          <input type="radio" value="addDate" v-model="operationType" />
          数据加载
        </label>
        <label style="width:auto">
          <input type="radio" value="operation" v-model="operationType" />
          数据操作
        </label>
      </div>
      <!-- 数据加载 -->
      <div class="sm-half-L" v-show="!variables || variables.length===0">
        <label style="width:auto">数据加载中···</label>
      </div>
      <div v-show="operationType==='addDate' && variables.length>0" style="width:100%">
        <div class="sm-half-L">
          <label style="width:30%">数据名称</label>
          <select class="sm-select-m" style="width:68%" v-model="selectedDateName">
            <option
              :value="variable.name"
              v-for="(variable,index) in variables"
              :key="index"
            >{{variable.name}}</option>
          </select>
        </div>

        <div class="sm-half-L">
          <label style="width:30%">X轴方向</label>
          <select class="sm-select-m" style="width:68%" v-model="xDim">
            <option
              :value="dimension.name"
              v-for="(dimension,index) in dimensions"
              :key="index"
            >{{dimension.name+':'+dimension.size}}</option>
          </select>
        </div>
        <div class="sm-half-L">
          <label style="width:30%">Y轴方向</label>
          <select class="sm-select-m" style="width:68%" v-model="yDim">
            <option
              :value="dimension.name"
              v-for="(dimension,index) in dimensions"
              :key="index"
            >{{dimension.name+':'+dimension.size}}</option>
          </select>
        </div>
        <div class="sm-half-L">
          <label style="width:30%">Z轴方向</label>
          <select class="sm-select-m" style="width:68%" v-model="zDim">
            <option
              :value="dimension.name"
              v-for="(dimension,index) in dimensions"
              :key="index"
            >{{dimension.name+':'+dimension.size}}</option>
          </select>
        </div>
        <div class="sm-half-L">
          <label style="width:30%">时间纬度</label>
          <select class="sm-select-m" style="width:68%" v-model="timeDim">
            <option
              :value="dimension.name"
              v-for="(dimension,index) in dimensions"
              :key="index"
            >{{dimension.name+':'+dimension.size}}</option>
          </select>
        </div>
        <div class="boxchild" style="padding-bottom:0">
          <button class="tbtn" type="button" v-on:click="startRender">加载</button>
          <button class="tbtn tbtn-margin-left" type="button" v-on:click="clear">清除</button>
        </div>
      </div>
      <!-- 操作模式 -->
      <div v-show="operationType==='operation'" style="width:100%">
        <div class="sm-half-L">
          <label style="width:38%">绘制模式</label>
          <select class="sm-select-m" style="width:60%" v-model="drawMode">
            <option value="volume">数值模式</option>
            <option value="slice">剖切模式</option>
            <option value="gradient">等值面模式</option>
          </select>
        </div>
        <!-- 数值模式 -->
        <div v-show="drawMode==='volume'" style="width:100%">
          <div class="sm-half-L">
            <label style="width:auto">
              <input checked type="checkbox" v-model="useGradientOpacity" />使用梯度透明度
            </label>
          </div>
          <div class="sm-half-L" v-show="useGradientOpacity">
            <label style="width: 40%;">梯度作用域</label>
            <el-slider
              v-model="gradientOpacityValue"
              :min="0"
              :max="1"
              range
              :step="0.01"
              input-size="mini"
              :debounce="500"
              tooltip-class="tooltip-class"
              style="width:58%"
            ></el-slider>
          </div>
          <div class="sm-half-L" v-show="useGradientOpacity">
            <label style="width: 40%;">梯度透明度</label>
            <el-slider
              v-model="gradientOpacity"
              :min="0"
              :max="1"
              range
              :step="0.01"
              input-size="mini"
              :debounce="500"
              tooltip-class="tooltip-class"
              style="width:58%"
            ></el-slider>
          </div>

          <div class="sm-half-L">
            <label style="width: 40%;">透明范围</label>
            <el-slider
              v-model="opacityInterval"
              :min="0"
              :max="1"
              range
              :step="0.01"
              input-size="mini"
              :debounce="500"
              tooltip-class="tooltip-class"
              style="width:58%"
            ></el-slider>
          </div>
        </div>
        <!-- 剖切模式 -->
        <div v-show="drawMode==='slice'" style="width:100%">
          <div class="sm-half-L">
            <label style="width:40%;">沿X轴偏移</label>
            <el-slider
              v-model="xOffset"
              :min="0"
              :max="1"
              :step="0.01"
              input-size="mini"
              :debounce="500"
              tooltip-class="tooltip-class"
              style="width:58%"
            ></el-slider>
          </div>
          <div class="sm-half-L">
            <label style="width:40%;">沿Y轴偏移</label>
            <el-slider
              v-model="yOffset"
              :min="0"
              :max="1"
              :step="0.01"
              input-size="mini"
              :debounce="500"
              tooltip-class="tooltip-class"
              style="width:58%"
            ></el-slider>
          </div>
          <div class="sm-half-L">
            <label style="width:40%;">沿Z轴偏移</label>
            <el-slider
              v-model="zOffset"
              :min="0"
              :max="1"
              :step="0.01"
              input-size="mini"
              :debounce="500"
              tooltip-class="tooltip-class"
              style="width:58%"
            ></el-slider>
          </div>
        </div>
        <!-- 等值面 -->
        <div class="sm-half-L" v-show="drawMode==='gradient'">
          <label style="width:40%;">等值面</label>
          <el-slider
            v-model="contourValue "
            :min="contourRange[0]"
            :max="contourRange[1]"
            :step="1"
            input-size="mini"
            :debounce="500"
            tooltip-class="tooltip-class"
            style="width:58%"
          ></el-slider>
        </div>
        <!-- 公共部分 -->
        <div class="sm-half-L" v-show="drawMode!=='gradient'">
          <label style="width:40%;">沿Z轴缩放</label>
          <el-slider
            v-model="zScale "
            :min="1"
            :step="0.1"
            input-size="mini"
            :debounce="500"
            tooltip-class="tooltip-class"
            style="width:58%"
          ></el-slider>
        </div>
        <div class="sm-half-L" v-show="drawMode!=='gradient'">
          <label style="width: 40%;">颜色范围</label>
          <el-slider
            v-model="colorInterval"
            :min="0"
            :max="1"
            range
            :step="0.01"
            input-size="mini"
            :debounce="500"
            tooltip-class="tooltip-class"
            style="width:58%"
          ></el-slider>
        </div>
        <div class="sm-half-L">
          <label style="width: 40%;">时间序列</label>
          <el-slider
            v-model="timeOrder"
            :min="0"
            :max="timeRange[1]"
            input-size="mini"
            :debounce="500"
            tooltip-class="tooltip-class"
            style="width:58%"
          ></el-slider>
        </div>
        <div class="sm-half-L" v-show="showClipPlane">
          <label style="width:40%;">裁剪面X方向</label>
          <el-slider
            v-model="clipX"
            :min="0"
            :max="1"
            :step="0.01"
            input-size="mini"
            :debounce="500"
            tooltip-class="tooltip-class"
            style="width:58%"
          ></el-slider>
        </div>
        <div class="sm-half-L" v-show="showClipPlane">
          <label style="width:40%;">裁剪面Y方向</label>
          <el-slider
            v-model="clipY"
            :min="0"
            :max="1"
            :step="0.01"
            input-size="mini"
            :debounce="500"
            tooltip-class="tooltip-class"
            style="width:58%"
          ></el-slider>
        </div>
        <div class="sm-half-L" v-show="showClipPlane">
          <label style="width:40%;">裁剪面旋转</label>
          <el-slider
            v-model="clipRotate"
            :min="-180"
            :max="180"
            input-size="mini"
            :debounce="500"
            tooltip-class="tooltip-class"
            style="width:58%"
          ></el-slider>
        </div>
        <div class="sm-half-L">
          <label style="width:auto">
            <input type="checkbox" v-model="openLight" />开启光照
          </label>
        </div>
        <div class="boxchild" style="padding-bottom:0" v-show="drawMode==='volume'">
          <button class="tbtn" type="button" v-on:click="addClipPlane" style="width:auto">添加裁剪面</button>
          <button
            class="tbtn tbtn-margin-left"
            type="button"
            style="width:auto"
            v-on:click="removeClipPlane"
          >移除裁剪面</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import volume from "./volume-render";
export default {
  name: "Sm3dVolumeRender",
  props: {
    //数据地址
    dataUrl: {
      type: String,
      required: true
    }
  },
  setup(props) {
    let {
      operationType,
      dimensions,
      variables,
      selectedDateName,
      xDim,
      yDim,
      zDim,
      timeDim,
      drawMode,
      opacityInterval,
      useGradientOpacity,
      gradientOpacityValue,
      gradientOpacity,
      openLight,
      showClipPlane,
      clipX,
      clipY,
      clipRotate,
      addClipPlane,
      removeClipPlane,
      xOffset,
      yOffset,
      zOffset,
      contourValue,
      zScale,
      colorInterval,
      timeOrder,
      startRender,
      contourRange,
      timeRange,
      clear
    } = volume(props);
    return {
      operationType,
      dimensions,
      variables,
      selectedDateName,
      xDim,
      yDim,
      zDim,
      timeDim,
      drawMode,
      opacityInterval,
      useGradientOpacity,
      gradientOpacityValue,
      gradientOpacity,
      openLight,
      showClipPlane,
      clipX,
      clipY,
      clipRotate,
      addClipPlane,
      removeClipPlane,
      xOffset,
      yOffset,
      zOffset,
      contourValue,
      zScale,
      colorInterval,
      timeOrder,
      startRender,
      contourRange,
      timeRange,
      clear
    };
  }
};
</script>

