<template>
  <div id="split-screen-panel" class="sm-panel" v-drag>
    <div class="sm-function-module-sub-section" style="margin:0" v-stopdrag>
      <div class="sm-half-L">
        <label style="width:40%">{{Resource.multiViewport}}</label>
        <select class="sm-select-m" style="width:60%" v-model="multiViewport">
          <option value="NONE">{{ Resource.onePort }}</option>
          <option value="HORIZONTAL">{{ Resource.horizontalSnap }}</option>
          <option value="VERTICAL">{{ Resource.verticalSnap }}</option>
          <option value="TRIPLE">{{ Resource.tripeSnap }}</option>
          <option value="QUAD">{{ Resource.quadSnap }}</option>
        </select>
      </div>
      <div class="sm-half-L flex-start" v-show="multiViewport !='NONE'">
        <label style="width:40%">
          <input type="radio" value="0" v-model="selectedViewport" />
          {{ Resource.viewportOne }}
        </label>
        <label style="width:auto">
          <input type="radio" value="1" v-model="selectedViewport" />
          {{ Resource.viewportTwo }}
        </label>
      </div>
      <div class="sm-half-L flex-start" v-show="multiViewport =='TRIPLE' || multiViewport =='QUAD'">
        <label style="width:40%">
          <input type="radio" value="2" v-model="selectedViewport" />
          {{ Resource.viewportThree }}
        </label>
        <label style="width:auto" v-show="multiViewport =='QUAD'">
          <input type="radio" value="3" v-model="selectedViewport" />
          {{ Resource.viewportFour }}
        </label>
      </div>
      <div class="sm-half-L" v-show="multiViewport !='NONE'">
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
</template>

<script>
import splitScreen from "./split-screen.js";
export default {
  name: "Sm3dSplitScreen",

  setup(props) {
    let {
      multiViewport,
      selectedViewport,
      TreeDatas,
      tree,
      checkNode
    } = splitScreen(props);
    return { multiViewport, selectedViewport, TreeDatas, tree, checkNode };
  }
};
</script>

