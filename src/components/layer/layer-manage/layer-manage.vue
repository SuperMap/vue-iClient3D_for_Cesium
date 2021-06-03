<template>
  <div id="layer-manage-panel" class="sm-panel" v-drag>
    <div class="sm-function-module-sub-section" style="margin:0" v-stopdrag>
      <div class="sm-half-L">
        <el-tree
          :data="TreeDatas"
          show-checkbox
          node-key="id"
          accordion
          ref="tree"
          :default-expanded-keys="expandedKeys"
          :highlight-current="true"
          @check="checkNode"
          @node-contextmenu="nodeContextmenu"
          @node-click="nodeClick"
        ></el-tree>
      </div>
    </div>
  </div>
  <div id="contextmenu" ref="domContextmenu">
    <!-- <span>图层属性</span><br>
          <span>图层风格</span><br>
    <span>图层操作</span><br>-->
    <span @click="deleteLayer" style="color:red">{{Resource.delete}}</span>
  </div>
</template>

<script>
import management from "./layer-manage.js";
export default {
  name: "Sm3dLayerManage",
  props: {
    //删除图层回调，返回删除的树节点
    deleteCallback: {
      type: Function
    }
  },
  setup(props) {
    let {
      nodeContextmenu,  //节点右键点击事件
      nodeClick,  //节点左键点击事件 
      TreeDatas,  //树数据
      tree,  //树节点
      domContextmenu,  //右键弹出操作框节点
      checkNode,   //勾选事件
      deleteLayer,  //删除事件
      expandedKeys  //默认展开keys数组
    } = management(props);
    return {
      nodeContextmenu,
      nodeClick,
      TreeDatas,
      tree,
      domContextmenu,
      checkNode,
      deleteLayer,
      expandedKeys
    };
  }
};
</script>

