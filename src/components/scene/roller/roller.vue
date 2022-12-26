<template>
  <div id="split-screen-panel" class="sm-panel" v-drag>
    <div class="sm-function-module-sub-section" style="margin:0" v-stopdrag>
      <div class="sm-half-L">
        <label style="width:40%">{{Resource.rollerMode}}</label>
        <select class="sm-select-m" style="width:60%" v-model="rollerMode">
          <option value="lrRoller">{{Resource.lrRoller}}</option>
          <option value="tbRoller">{{Resource.tbRoller}}</option>
          <option value="customRoller">{{Resource.customRoller}}</option>
        </select>
      </div>
      <div class="sm-half-L">
        <label style="width:auto">
          <input type="checkbox" v-model="useRoller" />
          {{Resource.useRoller}}
        </label>
      </div>
      <div class="sm-half-L" v-show="rollerMode =='lrRoller' && useRoller">
        <label style="width:auto">
          <input type="radio" value="1" v-model="lrRoller" />
          {{Resource.shieldLeft}}
        </label>
        <label style="width:auto">
          <input type="radio" value="2" v-model="lrRoller" />
          {{Resource.shieldRight}}
        </label>
      </div>
      <div class="sm-half-L" v-show="rollerMode =='tbRoller' && useRoller">
        <label style="width:auto">
          <input type="radio" value="4" v-model="tbRoller" />
          {{Resource.shieldTop}}
        </label>
        <label style="width:auto">
          <input type="radio" value="8" v-model="tbRoller" />
          {{Resource.shieldBottom}}
        </label>
      </div>
      <div class="sm-half-L" v-show="useRoller">
        <el-tree
          :data="TreeDatas"
          show-checkbox
          node-key="id"
          accordion
          ref="tree"
          @check="checkNode"
        ></el-tree>
      </div>
    </div>
  </div>
  <div id="verticalSliderLeft" ref="verticalSliderLeft"></div>
  <div id="verticalSliderRight" ref="verticalSliderRight"></div>
  <div id="horizontalSliderTop" ref="horizontalSliderTop"></div>
  <div id="horizontalSliderBottom" ref="horizontalSliderBottom"></div>
</template>

<script>
import roller from "./roller.js";
export default {
  name: "Sm3dRoller",
  props: {
    //卷帘模式
    rollerMode: {
      type: String
    }
  },
  setup(props) {
    let {
      useRoller,
      rollerMode,
      lrRoller,
      tbRoller,
      TreeDatas,
      tree,
      checkNode,
      verticalSliderLeft,
      verticalSliderRight,
      horizontalSliderTop,
      horizontalSliderBottom
    } = roller(props);
    return {
      useRoller,
      rollerMode,
      lrRoller,
      tbRoller,
      TreeDatas,
      tree,
      checkNode,
      verticalSliderLeft,
      verticalSliderRight,
      horizontalSliderTop,
      horizontalSliderBottom
    };
  }
};
</script>

