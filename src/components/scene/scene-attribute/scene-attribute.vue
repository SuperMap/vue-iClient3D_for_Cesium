<template>
  <div id="s3mlayer-attribute-panel" class="sm-panel" v-drag>
    <div class="sm-function-module-sub-section" style="margin:0" v-stopdrag>
      <div class="sm-half-L">
        <label style="width:28%">
          <input type="checkbox" v-model="earthShow" />
          {{Resource.earthShow}}
        </label>
        <label style="width:33%">
          <input type="checkbox" v-model="timeline" />
          {{Resource.timeline}}
        </label>
        <label style="width:33%">
          <input type="checkbox" v-model="atomsphereRender" />
          {{Resource.atomsphereRender}}
        </label>
        <label style="width:28%">
          <input type="checkbox" v-model="sunShow" />
          {{Resource.sunShow}}
        </label>
        <label style="width:33%">
          <input type="checkbox" v-model="fogEffect" />
          {{Resource.fogEffect}}
        </label>
        <label style="width:33%">
          <input type="checkbox" v-model="depthAgainst" />
          {{Resource.depthAgainst}}
        </label>
        <label style="width:28%">
          <input type="checkbox" v-model="shadowMap" />
          {{Resource.shadowMap}}
        </label>
        <label style="width:33%">
          <input type="checkbox" v-model="underground" />
          {{Resource.underground}}
        </label>
        <label style="width:33%">
          <input type="checkbox" v-model="frameRate" />
          {{Resource.frameRate}}
        </label>
        <label style="width:28%">
          <input type="checkbox" v-model="cloud" />
          {{Resource.cloud}}
        </label>
        <label style="width:33%">
          <input type="checkbox" v-model="skyBox" />
          {{Resource.skyBox}}
        </label>
        <label style="width:33%">
          <input type="checkbox" v-model="rain" />
          {{Resource.rain}}
        </label>
        <label style="width:28%">
          <input type="checkbox" v-model="snow" />
          {{Resource.snow}}
        </label>
        <label style="width:33%">
          <input type="checkbox" v-model="isCompass" />
          {{Resource.compass}}
        </label>
        <label style="width:33%"></label>
      </div>
      <div class="sm-half-L">
        <label style="width:35%">{{Resource.viewMode}}</label>
        <select class="sm-select" style="width:63%" v-model="viewMode">
          <option value="3D">3D</option>
          <option value="2.5D">2.5D</option>
          <option value="2D">2D</option>
        </select>
      </div>
      <div class="sm-half-L">
        <label style="width: 35%;">{{Resource.surfaceTransparency}}</label>
        <el-slider
          v-model="surfaceTransparency "
          :min="0"
          :max="1"
          :step="0.01"
          input-size="mini"
          :debounce="500"
          tooltip-class="tooltip-class"
          style="width:63%"
        ></el-slider>
      </div>
      <div class="sm-half-L" v-show="false">
        <label style="width:35%">下雪类型</label>
        <select class="sm-select" style="width:63%" v-model="snowType">
          <option value="0">小雪</option>
          <option value="1">中雪</option>
          <option value="2">大雪</option>
          <option value="3">暴雪</option>
        </select>
      </div>
    </div>
  </div>
  <component :is="compass"></component>
</template>

<script>
import sceneAttribute from "./scene-attribute.js";
export default {
  name: "Sm3dSceneAttribute",
  props: {
    //地球显影
    earthShow: {
      type: Boolean,
      default: true
    },
    //场景阴影
    shadows: {
      type: Boolean,
      default: false
    },
    //云层
    cloud: {
      type: Boolean,
      default: false
    },
    //天空盒
    skyBox: {
      type: Boolean,
      default: false
    },
    //太阳
    sunShow: {
      type: Boolean,
      default: false
    },
    //时间轴
    timeline: {
      type: Boolean,
      default: false
    },
    //深度检测
    depthAgainst: {
      type: Boolean,
      default: true
    },
    //大气渲染
    atomsphereRender: {
      type: Boolean,
      default: true
    },
    //雾化效果
    fogEffect: {
      type: Boolean,
      default: true
    },
    //开启地下
    underground: {
      type: Boolean,
      default: true
    },
    //帧率
    frameRate: {
      type: Boolean,
      default: true
    },
    //天空盒自定义对象
    skyboxSources: {
      type: Object
    },
    //地表透明度
    surfaceTransparency: {
      type: Number
    },
    //云层纹理路径
    cloudsUrl: {
      type: String
    },

    //天空盒类型
    skyboxType: {
      type: String
    },

    //天空盒子绕x轴运动的动画速度
    uspeed: {
      type: Number
    },
    //天空盒子绕y轴运动
    vspeed: {
      type: Number
    },
    //天空盒子绕z轴运动
    wspeed: {
      type: Number
    },
    //视图模式
    viewMode: {
      type: String
    },
    //下雨角度
    rainAngle: {
      type: Number
    },
    //下雨速度
    rainSpeed: {
      type: Number
    },
    //下雪密度
    snowDesity: {
      type: Number
    },
    //下雪速度
    snowSpeed: {
      type: Number
    },
    //下雪角度
    snowAngle: {
      type: Number
    },
    //下雪类型
    snowType: {
      type: String
    },
    //罗盘
    isCompass: {
      type: Boolean
    },
    //下雨
    rain: {
      type: Boolean
    },
    //下雪
    snow: {
      type: Boolean
    }
  },
  setup(props) {
    let {
      earthShow,
      shadows,
      cloud,
      skyBox,
      sunShow,
      timeline,
      depthAgainst,
      atomsphereRender,
      fogEffect,
      underground,
      frameRate,
      Facade,
      surfaceTransparency,
      viewMode,
      rain,
      snow,
      snowType,
      isCompass,
      compass
    } = sceneAttribute(props);
    return {
      earthShow,
      shadows,
      cloud,
      skyBox,
      sunShow,
      timeline,
      depthAgainst,
      atomsphereRender,
      fogEffect,
      underground,
      frameRate,
      Facade,
      surfaceTransparency,
      viewMode,
      rain,
      snow,
      snowType,
      isCompass,
      compass
    };
  }
};
</script>

