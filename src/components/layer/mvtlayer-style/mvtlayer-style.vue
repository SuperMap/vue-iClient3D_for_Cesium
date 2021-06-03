<template>
  <div id="mvtlayer-panel" class="sm-panel" v-drag>
    <div class="sm-function-module-sub-section" style="margin:0" v-stopdrag>
      <div class="sm-half-L">
        <label style="width:28%">选择图层</label>
        <select class="sm-select" style="width:70%" v-model="selectedLayerIndex">
          <option v-for="(layer, index) in layerNames" :key="index" :value="index">{{ layer }}</option>
          <option v-show="layerNames.length == 0" value="none">暂无mvt图层</option>
        </select>
      </div>

      <div class="sm-half-L">
        <label style="width: 28%;">透明度</label>
        <el-slider
          v-model="mvtAlpha"
          :min="0"
          :max="1"
          :step="0.05"
          input-size="mini"
          :debounce="500"
          tooltip-class="tooltip-class"
          style="width:70%"
        ></el-slider>
      </div>
      <div class="sm-half-L">
        <label style="width:auto">
          <input type="checkbox" v-model="showLayer" />显示图层
        </label>
        <label style="width:auto">
          <input type="checkbox" v-model="textAvoidance" />文字避让
        </label>
        <label style="width:auto">
          <input type="checkbox" v-model="isClickShowProperty" />显示图层要素
        </label>
        <label style="width:auto">
          <input type="checkbox" v-model="openFilter" />查询过滤
        </label>
      </div>
      <div v-show="openFilter">
        <div class="sm-half-L" style="margin-top:5px">
          <label style="width:28%">选择子图层</label>
          <select class="sm-select" style="width:70%" v-model="selectedChildLayerIndex">
            <option
              v-for="(Clayer, index) in childLayerNames"
              :key="index"
              :value="index"
            >{{ Clayer }}</option>
          </select>
        </div>
        <div class="sm-half-L">
          <label style="width:auto">
            <input type="checkbox" v-model="isShowproPerties" />显示子图层属性
          </label>
          <label style="width:auto">
            <input type="checkbox" v-model="isShowSymbol" />显示运算符号
          </label>
        </div>
        <div class="sm-half-L">
          <label style="width: 28%;">设置条件</label>
          <input
            type="text"
            min="0"
            class="sm-input"
            style="width:70%"
            v-model="setFilterString"
            ref="setFilterString_dom"
          />
        </div>
        <div class="boxchild">
          <button class="tbtn" type="button" style="width:auto" v-on:click="propertySearch">查询</button>
          <button
            class="tbtn tbtn-margin-left"
            type="button"
            style="width:auto"
            v-on:click="propertyFilter"
          >过滤</button>
          <button
            class="tbtn tbtn-margin-left"
            style="width:auto"
            type="button "
            v-on:click="clear"
          >清除</button>
        </div>
      </div>
    </div>
  </div>
  <div
    id="mvtlayer-drop-left-panel"
    class="sm-panel"
    v-show="isShowproPerties && propertyKeys.length>0"
    v-drag
  >
    <div class="sm-function-module-sub-section" style="margin:0" v-stopdrag>
      <div
        class="sm-half-L"
        v-for="(key) in propertyKeys"
        :key="key"
        @click="clickProperty(key)"
      >{{key}}</div>
    </div>
  </div>
  <div
    id="mvtlayer-drop-right-panel"
    class="sm-panel"
    style="width:130px"
    v-show="isShowSymbol"
    v-drag
  >
    <div class="sm-function-module-sub-section" style="margin:0" v-stopdrag>
      <div
        class="sm-half"
        style="justify-content: center"
        v-for="(key) in symbols"
        :key="key"
        @click="clickProperty(key)"
      >{{key}}</div>
    </div>
  </div>

  <div id="bubble" class="bubble-tabel" ref="bubble" v-drag v-show="bubbleShow">
    <div class="boxchild flex-between">
      <label style="width:auto">对象属性</label>
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
    <table class="tab">
      <tbody>
        <tr>
          <th>属性</th>
          <th>值</th>
        </tr>
        <tr>
          <td>图层</td>
          <td>{{clickGetFeature.layer.id}}</td>
        </tr>
        <tr>
          <td>$id</td>
          <td>{{clickGetFeature.id}}</td>
        </tr>
        <tr v-for="(value,key,index) in clickGetFeature.properties" :key="index">
          <td>{{key}}</td>
          <td>{{value}}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import mvtlayerStyle from "./mvtlayer-style.js";
export default {
  name: "Sm3dMvtlayerStyle",
  setup(props) {
    let {
      layerNames,
      selectedLayerIndex,
      childLayerNames,
      selectedChildLayerIndex,
      mvtAlpha,
      showLayer,
      textAvoidance,
      clickProperty,
      isShowproPerties,
      isShowSymbol,
      propertyKeys,
      symbols,
      openFilter,
      setFilterString,
      propertySearch,
      propertyFilter,
      clear,
      setFilterString_dom,
      isClickShowProperty,
      clickGetFeature,
      bubble,
      closeBubble,
      dockBubble,
      dockFontShow,
      bubbleShow
    } = mvtlayerStyle(props);
    return {
      layerNames,
      selectedLayerIndex,
      childLayerNames,
      selectedChildLayerIndex,
      mvtAlpha,
      showLayer,
      textAvoidance,
      clickProperty,
      isShowproPerties,
      isShowSymbol,
      propertyKeys,
      symbols,
      openFilter,
      setFilterString,
      propertySearch,
      propertyFilter,
      clear,
      setFilterString_dom,
      isClickShowProperty,
      clickGetFeature,
      bubble,
      closeBubble,
      dockBubble,
      dockFontShow,
      bubbleShow
    };
  }
};
</script>

