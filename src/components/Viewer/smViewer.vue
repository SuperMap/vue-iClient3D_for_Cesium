<template>
  <div id="cesiumContainer" ref="viewer" >
    <!--    组合拼接头部，同时最多四到五个组件组合-->
      <div v-show="componentShow.length!=0" id="viewer-panel" class="sm-panel" v-drag>
        <div
          class="sm-toggle-btn"
          @click="toggleVisibility"
          :class="{'sm-toggle-btn-only': !show}"
        >
          <span :class="iconfont"></span>
        </div>
        <div class="sm-content" :class="{'sm-content-hidden' : !show}">
          <div class="sm-panel-header">
            <span
              :class="{titleColor:componentShow[index]}"
              class="title-txt"
              v-for="(item,index) in componentName"
              :key="item.name"
              @click="span(index)"
            >{{item}}</span>
          </div>
          <slot></slot>
        </div>
      </div>
  </div>
</template>

<script>
export default {
  name: "sm-viewer",
  props: {
    sceneUrl: {
      //场景接口
      type: String,
    },
    s3mScps: {
      //s3m图层接口
      type: Array,
    },
    collapsed: {
      //是否折叠
      type: Boolean,
    },
  },
  data() {
    return {
      show: true,
      sharedState: store.state,
    };
  },

  computed: {
    iconfont: function () {
      let ifontClass;
      let type = this.sharedState.componentTypes[0];
      switch (type) {
        case "clip":
          ifontClass = "iconfont iconcaijian";
          break;
        case "terrain":
          ifontClass = "iconfont icondixing";
          break;
        case "analysis":
          ifontClass = "iconfont iconsanweifenxi";
          break;
        default:
          null;
          break;
      }
      return ifontClass;
    },
    componentName: function () {
      return this.sharedState.componentNames;
    },
    componentShow: function () {
      return this.sharedState.componentShows;
    },
  },

  methods: {
    toggleVisibility() {
      //控制组件界面显隐
      this.show = !this.show;
    },
    //点击切换组件功能
    span(i) {
      // 验证是否为点击事件，是则继续执行click事件，否则不执行
      let isClick = document
        .getElementById("viewer-panel")
        .getAttribute("data-flag");
      if (isClick !== "true") {
        return false;
      }
      store.clickComponentShow(i);
    },

    init() {
      //初始化viewer
      if (window.viewer) {
        window.viewer.destroy();
        window.viewer = null;
        // return;
      }
      let viewer = new Cesium.Viewer(this.$refs.viewer, {
        selectionIndicator: false,
        infoBox: false,
      });
      let scene = viewer.scene;
      viewer.scene.debugShowFramesPerSecond = true;
      window.viewer = viewer;
      window.scene = scene;
      let widget = viewer.cesiumWidget;

      //打开场景
      let promiseArray = [];
      try {
        if (this.$props.sceneUrl) {
          promiseArray.push(scene.open(this.sceneUrl));
        } else if (this.$props.s3mScps) {
          //加载scps
          let scps = this.$props.s3mScps;
          scps.forEach((element) => {
            promiseArray.push(
              scene.addS3MTilesLayerByScp(element.url, element.options)
            );
          });
        }
      
        Cesium.when.all(
          promiseArray,
          function (layers) {
            window.layers = scene.layers | layers;
            // setTimeout(() => {
            //   document.querySelector("#loadingbar").remove(); //清除加载动画
            // }, 2000);
          },
          function (e) {
            if (widget._showRenderLoopErrors) {
              let title =
                "加载SCP失败，请检查网络连接状态或者url地址是否正确？";
              widget.showErrorPanel(title, undefined, e);
            }
          }
        );
      } catch (e) {
        if (widget._showRenderLoopErrors) {
          let title = "渲染时发生错误，已停止渲染。";
          widget.showErrorPanel(title, undefined, e);
        }
      }
      setTimeout(() => {
        store.setisInitViewer(true); //初始化viewer标志
        common.initHandler("Polygon"); //初始化全局常用的画面的drawhandler
      }, 1000);
    },
  },
  
  mounted() {
    this.init();
  },
  // 跳转路由刷新页面
  beforeMount(){
    if(window.viewer){
        window.location.reload();
    }
  },
  //销毁
  destroyed() {
    store.setComponentShow([]);
    store.setComponentName([]);
    store.setComponentType([]); 
},
};
</script>
<style lang="scss"  scoped>
@import "smViewer";
</style>
