<template>
  <div id="fly-route-panel" class="sm-panel" v-drag>
    <div class="sm-function-module-sub-section" style="margin:0" v-stopdrag>
      <div class="sm-half-L">
        <label style="width:auto">
          <input type="radio" value="designatedRoute" v-model="routeType" />
          {{Resource.designatedRoute}}
        </label>
        <label style="width:auto">
          <input type="radio" value="customRoute" v-model="routeType" />
          {{Resource.customRoute}}
        </label>
      </div>

      <!-- 指定路线面板 -->
      <div class="sm-half-L" v-show="routeType === 'designatedRoute'">
        <div class="sm-half-L" v-show="!fpfUrl">
          <label style="width: 35%;">{{Resource.routeType}}</label>
          <input
            type="text"
            class="sm-input"
            disabled
            style="width:63%;position:relative;padding-right: 30px;"
            v-model="fileSrc"
            placeholder="选择飞行线路文件"
          />
          <span class="iconfont iconwenjianjia fpfFile" @click="chooseFile"></span>
          <input type="file" accept=".fpf" id="flyFile" style="display:none" ref="flyFile_dom" />
        </div>
        <div class="sm-half-L" v-show="currentStopNames.length>0">
          <label style="width:35%">{{Resource.selectStop}}</label>
          <select class="sm-select" style="width:63%" v-model="selectedStopIndex">
            <option :value="index" v-for=" (stop,index) in currentStopNames" :key="index">{{stop}}</option>
          </select>
        </div>

        <div class="sm-half-L flex-between">
          <label style="width:auto">
            <input type="checkbox" v-model="showRoute" />
            {{Resource.showRoute}}
          </label>
          <label style="width:auto">
            <input type="checkbox" v-model="showStop" />
            {{Resource.showStop}}
          </label>
        </div>
        <div class="sm-half-L flex-around">
          <div>
            <span
              class="iconfont iconbofang"
              style="font-size: 32px; color: var(--theme-bg-color)"
              @click="flyStart"
              :title="Resource.start"
            ></span>
          </div>
          <div>
            <span
              class="iconfont iconzanting"
              style="font-size: 32px; color: var(--theme-bg-color)"
              @click="flyPause"
              :title="Resource.pause"
            ></span>
          </div>
          <div>
            <span
              class="iconfont icontingzhi"
              style="font-size: 32px; color: var(--theme-bg-color)"
              @click="flyStop"
              :title="Resource.stop"
            ></span>
          </div>
        </div>
      </div>

      <!-- 自定义路线面板 -->
      <div class="sm-half-L" v-show="routeType === 'customRoute'">
        <div class="sm-half-L">
          <label style="width: 35%;">{{Resource.flySpeed}}</label>
          <input type="number" class="sm-input" style="width:63%" v-model="routeSpeed" />
        </div>
        <div class="sm-half-L" v-show="routeStops.length>0">
          <label style="width:35%">{{Resource.addedStops}}</label>
          <select class="sm-select" style="width:63%" v-model="selectedAddedStopIndex">
            <option
              :value="index"
              v-for=" (stop,index) in routeStops"
              :key="index"
            >{{stop.stopName}}</option>
          </select>
        </div>
        <div class="boxchild">
          <button @click="addStop" class="tbtn" type="button">{{Resource.add}}</button>
          <button @click="clearStop" class="tbtn tbtn-margin-left" type="button">{{Resource.delete}}</button>
          <button @click="restStops" class="tbtn tbtn-margin-left" type="button">{{Resource.reset}}</button>
          <button @click="saveStop" class="tbtn tbtn-margin-left" type="button">{{Resource.save}}</button>
        </div>

        <!-- 保存飞行路线操作  v-show="customRouteNames.length>0" -->
        <div class="sm-half-L" v-show="customRouteNames.length>0">
          <div style="margin: 15px 0 5px 0">
            <div class="sm-point"></div>
            {{Resource.customRouteOperating}}
          </div>
          <div class="sm-half-L">
            <label style="width:35%">{{Resource.routeType}}</label>
            <select class="sm-select" style="width:63%" v-model="customRouteSelectedIndex">
              <option
                :value="index"
                v-for=" (route,index) in customRouteNames"
                :key="index"
              >{{route}}</option>
            </select>
          </div>
          <div class="sm-half-L" v-show="currentStopNames.length>0">
            <label style="width:35%">{{Resource.selectStop}}</label>
            <select class="sm-select" style="width:63%" v-model="selectedStopIndex">
              <option :value="index" v-for=" (stop,index) in currentStopNames" :key="index">{{stop}}</option>
            </select>
          </div>
          <div class="sm-half-L flex-between">
            <label style="width:auto">
              <input type="checkbox" v-model="showRoute" />
              {{Resource.showRoute}}
            </label>
            <label style="width:auto">
              <input type="checkbox" v-model="showStop" />
              {{Resource.showStop}}
            </label>
          </div>
          <div class="sm-half-L flex-around">
            <div>
              <span
                class="iconfont iconbofang"
                style="font-size: 32px; color: var(--theme-bg-color)"
                @click="flyStart"
                :title="Resource.start"
              ></span>
            </div>
            <div>
              <span
                class="iconfont iconzanting"
                style="font-size: 32px; color: var(--theme-bg-color)"
                @click="flyPause"
                :title="Resource.pause"
              ></span>
            </div>
            <div>
              <span
                class="iconfont icontingzhi"
                style="font-size: 32px; color: var(--theme-bg-color)"
                @click="flyStop"
                :title="Resource.stop"
              ></span>
            </div>
            <div class="boxchild" style="margin-bottom:-5px">
              <button @click="downLoad" class="tbtn" type="button">{{Resource.downLoad}}</button>
              <button
                @click="clearRoute"
                class="tbtn tbtn-margin-left"
                type="button"
              >{{Resource.clear}}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import flyRoute from "./fly-route.js";
export default {
  name: "Sm3dFlyRoute",
  props: {
    //指定fpf路径
    fpfUrl: {
      type: String
    },
    //显示路线
    showRoute: {
      type: Boolean
    },
    //显示站点
    showStop: {
      type: Boolean
    },
    //设置站点模式:默认停留,StopAround :环绕
    stopPlayMode: {
      type: String
    },
    //停留时间
    waitTime: {
      type: Number
    },
    //环绕模式时间
    surroundDuration: {
      type: Number
    },
    //飞行路线是否是沿线飞行
    isAlongline: {
      type: Boolean
    },
    //飞行路线速度
    routeSpeed: {
      type: Number
    }
  },
  setup(props) {
    let {
      routeType,
      fileSrc,
      fpfUrl,
      selectedStopIndex,
      showRoute,
      showStop,
      flyFile_dom,
      chooseFile,
      currentStopNames,
      flyStart,
      flyPause,
      flyStop,
      routeStops,
      selectedAddedStopIndex,
      routeSpeed,
      clearStop,
      addStop,
      saveStop,
      restStops,
      customRouteNames,
      customRouteSelectedIndex,
      downLoad,
      clearRoute
    } = flyRoute(props);
    return {
      routeType,
      fileSrc,
      fpfUrl,
      selectedStopIndex,
      showRoute,
      showStop,
      flyFile_dom,
      chooseFile,
      currentStopNames,
      flyStart,
      flyPause,
      flyStop,
      routeStops,
      selectedAddedStopIndex,
      routeSpeed,
      clearStop,
      addStop,
      saveStop,
      restStops,
      customRouteNames,
      customRouteSelectedIndex,
      downLoad,
      clearRoute
    };
  }
};
</script>

