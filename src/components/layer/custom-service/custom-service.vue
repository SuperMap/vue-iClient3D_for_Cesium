<template>
  <div id="CustomService-panel" class="sm-panel" v-drag>
    <div class="sm-function-module-sub-section" style="margin:0" v-stopdrag>
      <div class="sm-half-L">
        <label style="width:40%">打开图层</label>
        <select class="sm-select" style="width:58%" v-model="layersType">
          <option value="SCENE">场景</option>
          <option value="S3M">S3M</option>
          <option value="IMG">影像</option>
          <option value="TERRAIN">地形</option>
          <option value="MVT">矢量瓦片</option>
        </select>
      </div>

      <div class="sm-half-L flex-start">
        <input
          type="text"
          class="sm-input sm-margin-M"
          style="width:100%"
          placeholder="URL"
          v-model="layerURL"
        />

        <input
          type="text"
          class="sm-input sm-margin-M"
          style="width:100%"
          placeholder="自定义名称"
          v-model="layerName"
        />
          <!-- v-show="layersType === 'S3M'" -->

        <label class="label-S">添加token</label>
        <input checked type="checkbox" v-model="isAddToken" />
        <input
          type="text"
          class="sm-input sm-margin-M"
          style="width:100%"
          placeholder="token"
          v-model="token"
          v-show="isAddToken"
        />
      </div>
      <div class="sm-half-L flex-start" v-show="layersType === 'TERRAIN'">
        <label class="label-S">isSct</label>
        <input checked type="checkbox" v-model="isSct" />
      </div>

      <div class="boxchild">
        <button class="tbtn tbtn-margin-left" type="button" v-on:click="addLayer">添加</button>
        <button @click="clear" class="tbtn tbtn-margin-left" type="button">取消</button>
      </div>
    </div>
  </div>
</template>

<script>
import layerManagement from "../../../js/common/layerManagement.js";
import tool from "../../../js/tool/tool.js";
import { watch, ref, reactive, toRefs, onBeforeUnmount, onMounted } from "vue";
export default {
  name: "Sm3dCustomService",
  props: {
    //点击确定时回调
    addCallback: {
      type: Function
    },
    //点击取消时回调
    clearCallback: {
      type: Function
    },
    getLayerName:{
        type: Function
    }
  },
  setup(props) {
    // 设置默认值数据
    let state = reactive({
      layersType: "SCENE",
      layerURL: null,
      layerName: null,
      isAddToken: false,
      token: null,
      isSct: false
    });

    let addCallback = () => {};
    let clearCallback = () => {};
    let getLayerName = () => {};

    if (props && props.clearCallback) {
      clearCallback = props.clearCallback;
    }
    if (props && props.addCallback) {
      addCallback = props.addCallback;
    }
      if (props && props.getLayerName) {
      getLayerName = props.getLayerName;
    }

    function check() {
      if (!state.layerURL || state.layerURL === "") {
        tool.Message.warnMsg("请填写正确的URL");
        return false;
      }
      if (
        state.layersType != "SCENE" &&
        (!state.layerName || state.layerName === "")
      ) {
        tool.Message.warnMsg("请补充图层名称");
        return false;
      }
      if (state.isAddToken && !state.token) {
        tool.Message.warnMsg("勾选token后请填写token");
        return false;
      }
      return true;
    }

    function checkLayersType(){
      let arr = state.layerURL.split('/');
      let layer_type = arr[arr.length -1];
      if(layer_type === 'realspace' && state.layersType != "SCENE") return false;
      if(layer_type === 'config' && state.layersType != "S3M") return false;
      if(layer_type === 'image' && state.layersType != "IMG") return false;
      return true;
    }

    function addLayer() {
      if (!checkLayersType())  {
        tool.Message.warnMsg("请检查添加类型是否正常？");
        return;
      };
      getLayerName(state.layerName);
      switch (state.layersType) {
        case "SCENE":
          if (check()) {
            let options = {};
            if (state.isAddToken) options.SceneToken = token;
            layerManagement.addScene(state.layerURL, options, addCallback);
          }
          break;
        case "S3M":
          if (check()) {
            let scps = [
              { url: state.layerURL, options: { name: state.layerName } }
            ];
            layerManagement.addS3mLayers(scps, addCallback);
          }
          break;
        case "IMG":
          if (check()) {
           let layer = layerManagement.addImageLayer(state.layerURL);
            addCallback(layer, "IMG");
          }
          break;
        case "TERRAIN":
          if (check()) {
            layerManagement.addTerrainLayer(state.layerURL, state.isSct);
            addCallback(viewer.terrainProvider, "TERRAIN");
          }
          break;
           case "MVT":
          if (check()) {
            let mvtlayer = layerManagement.addMvtLayer(state.layerURL, state.layerName);
            addCallback(mvtlayer, "MVT");
          }
          break;
      }
      clearState();
    }

    function clearState() {
      state.layerURL = null;
      state.layerName = null;
      state.isAddToken = false;
      state.token = null;
      state.isSct = false;
    }
    function clear() {
      clearState();
      clearCallback();
    }

    return {
      ...toRefs(state),
      addLayer,
      clear
    };
  }
};
</script>



