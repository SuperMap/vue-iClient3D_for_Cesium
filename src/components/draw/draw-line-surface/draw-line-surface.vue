<template>
  <div id="draw-panel" class="sm-panel" v-drag>
    <div class="sm-function-module-sub-section" style="margin:0" v-stopdrag>
      <div class="sm-half-L">
        <label style="width:auto">
          <input type="radio" value="polyline" v-model="drawType" />
          {{Resource.polyline}}
        </label>
        <label style="width:auto">
          <input type="radio" value="polygon" v-model="drawType" />
          {{Resource.polygon}}
        </label>
      </div>
      <div class="sm-half-L">
        <label style="width:35%">{{Resource.drawModle}}</label>
        <select class="sm-select" style="width:63%" v-model="drawModle">
          <option value="space">{{Resource.space}}</option>
          <option value="stick">{{Resource.stick}}</option>
          <option value="postObject">{{Resource.postObject}}</option>
        </select>
      </div>
      <div class="sm-half-L">
        <label style="width:auto">
          <input type="checkbox" style="margin-right:14px" v-model="isEdit" />
          {{Resource.isEdit}}
        </label>
        <label style="width:auto">
          <input type="checkbox" style="margin-right:14px" v-model="isEditZ" />
          {{Resource.isEditZ}}
        </label>
      </div>
      <!-- 线 -->
      <div v-show="drawType === 'polyline'" style=" width: 100%;">
        <div class="sm-half-L symbolic">
          <div
            v-for="line in config.polyline"
            :key="line.id"
            class="symbolic-box"
            :class="{ 'theme-color': line.id ===currentId }"
            @click="changeSelect(line.id)"
          >
            <span class="iconfont" :class="line.iconfont"></span>
            <label style="width:100%">{{line.lineName}}</label>
          </div>
        </div>
        <div class="sm-half-L">
          <label style="width: 35%;">{{Resource.lineColor}}</label>
          <el-color-picker v-model="lineColor" size="mini" show-alpha style="width:63%"></el-color-picker>
        </div>
        <div class="sm-half-L">
          <label style="width: 35%;">{{Resource.lineWidth}}</label>
          <input type="number" class="sm-input" style="width:63%" v-model="lineWidth" />
        </div>
        <!-- 虚线 -->
        <div class="sm-half-L" v-show="currentId === '2'">
          <label style="width: 35%;">{{Resource.dottedColor}}</label>
          <el-color-picker v-model="dottedColor" size="mini" show-alpha style="width:63%"></el-color-picker>
        </div>
        <div class="sm-half-L" v-show="currentId === '2'">
          <label style="width: 35%;">{{Resource.dottedLength}}</label>
          <input type="number" min="0" class="sm-input" style="width:63%" v-model="dottedLength" />
        </div>
        <!-- 轮廓线 -->
        <div class="sm-half-L" v-show="currentId === '3'">
          <label style="width: 35%;">{{Resource.outLineColor}}</label>
          <el-color-picker v-model="outLineColor" size="mini" show-alpha style="width:63%"></el-color-picker>
        </div>
        <div class="sm-half-L" v-show="currentId === '3'">
          <label style="width: 35%;">{{Resource.outLineWidth}}</label>
          <input type="number" min="0" class="sm-input" style="width:63%" v-model="outLineWidth" />
        </div>
        <!-- 光晕线 -->
        <div class="sm-half-L" v-show="currentId === '5'">
          <label style="width: 35%;">{{Resource.glowStrength}}</label>
          <input
            type="number"
            class="sm-input"
            min="0"
            step="0.1"
            style="width:63%"
            v-model="glowStrength"
          />
        </div>
        <!-- 尾迹线 -->
        <div class="sm-half-L" v-show="currentId === '6'">
          <label style="width: 35%;">{{Resource.trailPercentage}}</label>
          <input
            type="number"
            class="sm-input"
            min="0"
            step="0.1"
            style="width:63%"
            v-model="trailPercentage"
          />
        </div>
      </div>
      <!-- 面 -->
      <div v-show="drawType === 'polygon'" style=" width: 100%;">
        <div class="sm-half-L symbolic">
          <div
            v-for="polygon in config.polygon"
            :key="polygon.id"
            class="symbolic-box"
            :class="{ 'theme-color': polygon.id ===currentId }"
            @click="changeSelect(polygon.id)"
          >
            <span class="iconfont" :class="polygon.iconfont"></span>
            <label style="width:100%">{{polygon.faceName}}</label>
          </div>
        </div>
        <!-- 纯色 -->
        <div class="sm-half-L" v-show="currentId === '1'">
          <label style="width: 35%;">{{Resource.polygonColor}}</label>
          <el-color-picker v-model="solidColor" size="mini" show-alpha style="width:63%"></el-color-picker>
        </div>
        <!-- 网格 -->
        <div class="sm-half-L" v-show="currentId === '2'">
          <label style="width: 35%;">{{Resource.polygonColor}}</label>
          <el-color-picker v-model="gridColor" size="mini" show-alpha style="width:63%"></el-color-picker>
        </div>
        <div class="sm-half-L" v-show="currentId === '2'">
          <label style="width: 35%;">{{Resource.gridWidth}}</label>
          <input type="number" min="0" class="sm-input" style="width:63%" v-model="gridWidth" />
        </div>
        <div class="sm-half-L" v-show="currentId === '2'">
          <label style="width: 35%;">{{Resource.gridCount}}</label>
          <input type="number" min="0" class="sm-input" style="width:63%" v-model="gridCount" />
        </div>
        <div class="sm-half-L" v-show="currentId === '2'">
          <label style="width: 35%;">{{Resource.gridCellAlpha}}</label>
          <input
            type="number"
            class="sm-input"
            min="0"
            step="0.1"
            style="width:63%"
            v-model="gridCellAlpha"
          />
        </div>

        <!-- 条纹 -->
        <div class="sm-half-L" v-show="currentId === '3'">
          <label style="width: 35%;">{{Resource.stripeEvenColor}}</label>
          <el-color-picker v-model="stripeEvenColor" size="mini" show-alpha style="width:63%"></el-color-picker>
        </div>
        <div class="sm-half-L" v-show="currentId === '3'">
          <label style="width: 35%;">{{Resource.stripeOddColor}}</label>
          <el-color-picker v-model="stripeOddColor" size="mini" show-alpha style="width:63%"></el-color-picker>
        </div>
        <div class="sm-half-L" v-show="currentId === '3'">
          <label style="width: 35%;">{{Resource.stripeRepeat}}</label>
          <input type="number" min="0" class="sm-input" style="width:63%" v-model="stripeRepeat" />
        </div>
        <div class="sm-half-L" v-show="currentId === '3'">
          <label style="width: 35%;">{{Resource.stripeOffset}}</label>
          <input type="number" min="0" class="sm-input" style="width:63%" v-model="stripeOffset" />
        </div>
        <div class="sm-half-L" v-show="currentId === '3'">
          <label style="width:auto">
            <input type="radio" value="horizontal" v-model="stripeOrientation" />
            {{Resource.stripeOrientation}}
          </label>
          <label style="width:auto">
            <input type="radio" value="vertical" v-model="stripeOrientation" />
            {{Resource.stripeOrientation}}
          </label>
        </div>
      </div>
      <div class="boxchild">
        <button class="tbtn" type="button" style="width:auto" v-on:click="draw">{{Resource.draw}}</button>
        <button
          class="tbtn tbtn-margin-left"
          style="width:auto"
          type="button "
          v-on:click="clear"
        >{{Resource.clear}}</button>
      </div>
    </div>
  </div>
</template>

<script>
import drawline from "./draw-line-surface.js";
export default {
  name: "Sm3dDrawLinePolygon",
  props: {
  },
  setup(props) {
    let {
      drawModle,
      currentId,
      lineColor,
      lineWidth,
      config,
      draw,
      changeSelect,
      clear,
      isEdit,
      isEditZ,
      dottedColor, //间隔颜色
      dottedLength,
      outLineColor,
      outLineWidth,
      glowStrength,
      trailPercentage,
      drawType,
      solidColor,
      gridColor,
      gridWidth,
      gridCount,
      gridCellAlpha,
      stripeEvenColor,
      stripeOddColor,
      stripeRepeat,
      stripeOffset,
      stripeOrientation
    } = drawline(props);
    return {
      drawModle,
      currentId,
      lineColor,
      lineWidth,
      config,
      draw,
      changeSelect,
      clear,
      isEdit,
      isEditZ,
      dottedColor, //间隔颜色
      dottedLength,
      outLineColor,
      outLineWidth,
      glowStrength,
      trailPercentage,
      drawType,
      solidColor,
      gridColor,
      gridWidth,
      gridCount,
      gridCellAlpha,
      stripeEvenColor,
      stripeOddColor,
      stripeRepeat,
      stripeOffset,
      stripeOrientation
    };
  }
};
</script>

