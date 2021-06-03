<template>
  <div id="scan-effect-panel" class="sm-panel" v-drag>
    <div class="sm-function-module-sub-section" style="margin:0" v-stopdrag>
      <div class="sm-half-L symbolic">
        <div
          v-for="particle in particles"
          :key="particle.id"
          class="symbolic-box"
          :class="{ 'theme-color': particle.id ===particleSelectedId }"
          @click="particleSelectedId = particle.id"
        >
          <span class="iconfont" :class="particle.iconfont"></span>
          <label style="width:100%">{{particle.particleName}}</label>
        </div>
      </div>
      <div class="sm-half-L" v-show="particleSelectedId === 0">
        <label style="width:30%">{{Resource.type}}</label>
        <select class="sm-select-m" style="width:66%" v-model="flameTyle">
          <option value="0">{{Resource.flame}}</option>
          <option value="1">{{Resource.ringFire}}</option>
          <option value="2">{{Resource.jetFire}}</option>
          <option value="3">{{Resource.flowFire}}</option>
          <option value="4">{{Resource.explosionFire}}</option>
        </select>
      </div>
      <div class="sm-half-L" v-show="particleSelectedId === 1">
        <label style="width:30%">{{Resource.type}}</label>
        <select class="sm-select-m" style="width:66%" v-model="fountainTyle">
          <option value="0">{{Resource.fountain}}</option>
          <option value="1">{{Resource.fireWater}}</option>
        </select>
      </div>
      <div class="sm-half-L flex-between" v-show="particleSelectedId !== 2">
        <label style="width:auto">
          <input type="checkbox" v-model="visibleModel" />
          {{Resource.isEdit}}
        </label>
        <label style="width:auto">
          <input type="checkbox" v-model="visibleParameter" />
          {{Resource.setting}}
        </label>
      </div>
      <div v-show="visibleParameter">
        <div class="sm-half-L" v-show="flameTyle === '1'">
          <label style="width: 30%;">{{Resource.ringRadius}}</label>
          <el-slider
            v-model="ringRadius"
            :min="0"
            :max="50"
            range
            :step="1"
            input-size="mini"
            :debounce="500"
            tooltip-class="tooltip-class"
            :format-tooltip="formatTooltip"
            style="width:66%"
          ></el-slider>
        </div>
        <div class="sm-half-L">
          <label style="width: 30%;">{{Resource.emissionRate}}</label>
          <input class="sm-input" style="width:66%" min="0" type="number" v-model="emissionRate" />
        </div>
        <div class="sm-half-L">
          <label style="width: 30%;">{{Resource.particleSize}}</label>
          <el-slider
            v-model="particleSize "
            :min="0"
            :step="1"
            :max="60"
            input-size="mini"
            :debounce="500"
            tooltip-class="tooltip-class"
            style="width:66%"
          ></el-slider>
        </div>
        <div class="sm-half-L">
          <label style="width: 30%;">{{Resource.particleLife}}</label>
          <el-slider
            v-model="particleLife"
            :min="0"
            :max="15"
            range
            :step="0.1"
            input-size="mini"
            :debounce="500"
            tooltip-class="tooltip-class"
            :format-tooltip="formatTooltip"
            style="width:66%"
          ></el-slider>
        </div>
        <div class="sm-half-L">
          <label style="width: 30%;">{{Resource.speedRange}}</label>
          <el-slider
            v-model="speed"
            :min="0"
            :max="15"
            range
            :step="1"
            input-size="mini"
            :debounce="500"
            tooltip-class="tooltip-class"
            :format-tooltip="formatTooltip"
            style="width:66%"
          ></el-slider>
        </div>
        <div class="sm-half-L">
          <label style="width: 30%;">{{Resource.startScale}}</label>
          <el-slider
            v-model="startScale "
            :min="0"
            :step="0.1"
            :max="10"
            input-size="mini"
            :debounce="500"
            tooltip-class="tooltip-class"
            style="width:66%"
          ></el-slider>
        </div>
        <div class="sm-half-L">
          <label style="width: 30%;">{{Resource.endScale}}</label>
          <el-slider
            v-model="endScale "
            :min="0"
            :step="0.1"
            :max="20"
            input-size="mini"
            :debounce="500"
            tooltip-class="tooltip-class"
            style="width:66%"
          ></el-slider>
        </div>
        <div class="sm-half-L">
          <label style="width: 30%;">{{Resource.gravity}}</label>
          <el-slider
            v-model="gravity "
            :min="-10"
            :step="0.1"
            :max="10"
            input-size="mini"
            :debounce="500"
            tooltip-class="tooltip-class"
            style="width:67%"
          ></el-slider>
        </div>
        <div class="sm-half-L" v-show="flameTyle === 'ordinary'">
          <label style="width:30%">{{Resource.launchType}}</label>
          <select class="sm-select-m" style="width:66%" v-model="particleSystemType">
            <option value="circular">{{Resource.circularRadiation}}</option>
            <option value="spheroid">{{Resource.spheroidRadiation}}</option>
            <option value="conical">{{Resource.conicalRadiation}}</option>
            <option value="box">{{Resource.boxedRadiation}}</option>
          </select>
        </div>
      </div>
      <div class="boxchild">
        <button @click="addParticle" class="tbtn" type="button">{{Resource.add}}</button>
        <button @click="clear" class="tbtn tbtn-margin-left" type="button">{{Resource.clear}}</button>
      </div>
    </div>
  </div>
</template>

<script>
import particleSystem from "./particle-system";
export default {
  name: "Sm3dParticleSystem",
  props: {
    //扫描线模式lineMode/ringMode
    scanMode: {
      type: String
    }
  },
  data() {
    return {};
  },
  setup(props) {
    let {
      particles,
      particleSelectedId,
      flameTyle,
      fountainTyle,
      ringRadius,
      emissionRate,
      particleSize,
      particleLife,
      speed,
      startScale,
      endScale,
      gravity,
      particleSystemType,
      visibleModel,
      visibleParameter,
      addParticle,
      clear
    } = particleSystem(props);
    return {
      particles,
      particleSelectedId,
      flameTyle,
      fountainTyle,
      ringRadius,
      emissionRate,
      particleSize,
      particleLife,
      speed,
      startScale,
      endScale,
      gravity,
      particleSystemType,
      visibleModel,
      visibleParameter,
      addParticle,
      clear
    };
  }
};
</script>

