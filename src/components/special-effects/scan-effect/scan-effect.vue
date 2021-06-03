<template>
  <div id="scan-effect-panel" class="sm-panel" v-drag>
    <div class="sm-function-module-sub-section" style="margin:0" v-stopdrag>
      <div class="sm-half-L">
        <label style="width: 30%;">{{Resource.scanMode}}</label>
        <div class="sm-half" style="width:68%">
          <label style="width:auto">
            <input type="radio" value="lineMode" v-model="scanMode" style="margin-right: 0"/>
            {{Resource.lineScan}}
          </label>
          <label style="width:auto">
            <input type="radio" value="ringMode" v-model="scanMode" style="margin-right: 0"/>
            {{Resource.circularScan}}
          </label>
        </div>
      </div>
      <div class="sm-half-L" v-show="scanTextures.length>0">
        <label style="width:30%">{{Resource.scanTexture}}</label>
        <select class="sm-select-m" style="width:68%" v-model="selectedTextureIndex">
          <option
            :value="index"
            v-for="(texture,index) in scanTextures"
            :key="index"
          >{{texture.name}}</option>
        </select>
      </div>
      <div class="boxchild" style="padding-bottom:0">
        <button class="tbtn" type="button" v-on:click="addScans">{{Resource.add}}</button>
        <button class="tbtn tbtn-margin-left" type="button " v-on:click="clear">{{Resource.clear}}</button>
      </div>
    </div>
  </div>
</template>

<script>
import scanEffect from "./scan-effect";
export default {
  name: "Sm3dScanEffect",
  props: {
    //扫描线模式lineMode/ringMode
    scanMode: {
      type: String
    },
    scanColor: {
      type: String
    },
    selectedTextureIndex: {
      type: Number
    },
    //开启反光
    bloomShow: {
      type: Boolean
    },
    //开启HDR
    openHDR: {
      type: Boolean
    },
    //亮度阈值
    threshold: {
      type: Number
    },
    //泛光强度
    intensity: {
      type: Number
    },
    //获取或设置线状扫描线的宽度，单位：米。
    lineWidth: {
      type: Number
    },
    //获取或设置扫描线的运行周期，单位：秒。
    period: {
      type: Number
    },
    //获取或设置扫描线的运行速度，单位：米/秒。
    speed: {
      type: Number
    },
    //添加纹理[{name:纹理1,type:'line / ring',url:xxx}]
    addTextures: {
      type: Object
    },
    scanShow: {
      type: Boolean
    }
  },
  setup(props) {
    let {
      scanMode,
      scanTextures,
      selectedTextureIndex,
      addScans,
      clear
    } = scanEffect(props);

    return { scanMode, scanTextures, selectedTextureIndex, addScans, clear };
  }
};
</script>

