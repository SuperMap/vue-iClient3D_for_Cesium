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
          <input type="checkbox" v-model="showLayer" />图层显隐
        </label>
        <label style="width:auto">
          <input type="checkbox" v-model="textAvoidance" />文字避让
        </label>
        <label style="width:auto">
          <input type="checkbox" v-model="isClickShowProperty" />图层属性
        </label>
        <label style="width:auto">
          <input type="checkbox" v-model="openFilter" />查询过滤
        </label>
      </div>
      <div v-show="openFilter" style="width:100%">
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

        <div class="sm-half-L" style="padding:6px 0 6px 0">
          <label style="width: 28%;">设置条件</label>
          <div>
            <button class="tbtn" type="button" style="width:auto" v-on:click="addCondition(true)">增行</button>
            <button
              class="tbtn tbtn-margin-left"
              type="button"
              style="width:auto"
              v-on:click="addCondition(false)"
            >删行</button>
          </div>
        </div>
        <div class="sm-half-L">
          <table class="tab tab2">
            <tbody>
              <tr>
                <th>属性</th>
                <th>条件</th>
                <th>值</th>
              </tr>
              <tr v-for="(pro,index) in selectedPropertyKeys" :key="index">
                <td style="position: relative;">
                  <select class="sm-select" v-model="selectedPropertyKeys[index]">
                    <option v-for="(key) in propertyKeys" :key="key" :value="key">{{ key }}</option>
                  </select>
                  <input type="text"  class="input" v-model="inputPropertys[index]"/>
                </td>
                <td style="position: relative;"><select class="sm-select" v-model="selectedSymbols[index]">
                    <option v-for="(key) in symbols" :key="key" :value="key">{{ key }}</option>
                  </select>
                  <input type="text" class="input" v-model="inputSymbols[index]"/></td>
                <td>
                  <input type="text" class="input2" v-model="inputValues[index]"/>
                </td>
              </tr>
            </tbody>
          </table>
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
      propertyKeys,
      symbols,
      openFilter,
      propertySearch,
      propertyFilter,
      clear,
      isClickShowProperty,
      clickGetFeature,
      bubble,
      closeBubble,
      dockBubble,
      dockFontShow,
      bubbleShow,
      selectedPropertyKeys,
      selectedSymbols,
      inputPropertys,
      inputSymbols,
      inputValues,
      addCondition
    } = mvtlayerStyle(props);
    return {
      layerNames,
      selectedLayerIndex,
      childLayerNames,
      selectedChildLayerIndex,
      mvtAlpha,
      showLayer,
      textAvoidance,
      propertyKeys,
      symbols,
      openFilter,
      propertySearch,
      propertyFilter,
      clear,
      isClickShowProperty,
      clickGetFeature,
      bubble,
      closeBubble,
      dockBubble,
      dockFontShow,
      bubbleShow,
      selectedPropertyKeys,
      selectedSymbols,
      inputPropertys,
      inputSymbols,
      inputValues,
      addCondition
    };
  }
};
</script>

