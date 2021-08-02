<template >
  <el-container>
    <!-- 侧边栏 --start -->
    <el-aside :class="asideWidth" id="el-aside">
      <el-menu
        :collapse="isCollapse"
        :uniqueOpened="true"
        default-active="2"
        class="el-menu-vertical-demo"
        text-color="#fff"
        background-color="#424242"
        active-text-color="#FFFFFF"
        :collapse-transition="false"
        @open="open"
      >
        <!-- 展开收缩控制按钮 -->
        <el-menu-item index="0" @click="isCollapse=!isCollapse" id="fold">
          <i
            class="iconfont iconshouqi iconfont2"
            style="display:block;margin:0"
            :class="isCollapse?'rotate':'rotate2'"
          ></i>
        </el-menu-item>

        <!-- 加载数据 -->
        <el-submenu index="1">
          <template #title>
            <i class="iconfont iconshuju iconfont2"></i>
            <span>数据服务</span>
          </template>
          <el-submenu v-for="(data,index) in server_config" :key="data.id" :index="data.id">
            <template #title>{{data.name}}</template>
            <div class="box" :index="index">
              <div
                class="imgbox"
                v-for="data2 in data.children"
                :key="data2.name"
                @click="addDatas(data.id,data2)"
              >
                <img :src="data2.thumbnail" alt class="img" />
                <img src="public/img/common/cross.png" alt class="cross" v-show="data2.state != 0" />
                <span>{{data2.name}}</span>
                <el-popconfirm
                  title="确定删除吗？"
                  confirmButtonText="确认"
                  cancelButtonText="取消"
                  @confirm="DeleteDates(data.id,data2)"
                >
                  <template #reference>
                    <i
                      class="el-icon-circle-close"
                      v-show="data2.state != 0 && data.id !='baseLayer'"
                      title="删除"
                    ></i>
                  </template>
                </el-popconfirm>
              </div>
            </div>
          </el-submenu>
          <el-menu-item index="1-5" @click="addCustomService">自定义服务</el-menu-item>
          <div v-for="(service,index) in addCustomServices" :key="index">
            <el-menu-item :index="'1-5-'+index" @click="flytoCustomService(service)" title="点击定位">
              {{service.name}}
              <el-popconfirm
                title="确定删除吗？"
                confirmButtonText="确认"
                cancelButtonText="取消"
                @confirm="DeleteServices(service,index)"
              >
                <template #reference>
                  <i class="el-icon-circle-close" title="删除"></i>
                </template>
              </el-popconfirm>
            </el-menu-item>
          </div>
        </el-submenu>

        <!-- 加载组件 -->
        <el-submenu v-for="(data,index) in config" :key="index" :index="data.id">
          <template #title>
            <i :class="data.icon" class="iconfont2"></i>
            <span>{{data.name}}</span>
          </template>
          <div class="box">
            <div
              class="imgbox"
              v-for="data2 in data.children"
              :key="data2.component"
              @click="change(data2.component,data2.destroy)"
            >
              <img :src="data2.imgSrc" alt class="img" />
              <img
                src="public/img/common/cross.png"
                alt
                class="cross"
                v-show="data2.component === view || data2.component === view2"
              />
              <span>{{data2.name}}</span>
            </div>
          </div>
        </el-submenu>
      </el-menu>
    </el-aside>
    <!-- 侧边栏部分--end -->

    <!-- 右侧内容展示部分 -->
    <el-main>
      <loading-bar></loading-bar>
      <!-- 添加自定义服务组件 -->
      <component
        :is="addService"
        :clear-callback="addCustomService"
        :add-callback="addCallback"
        :get-layer-name="getName"
      ></component>
      <!-- viewer组件 -->
      <component :is="initViewer" :after-initviewer="removeLoad" :opening-animation="true"></component>
      <!-- 分析功能组件 -->
      <keep-alive>
        <component
          :is="view"
          :delete-callback="deleteCallback"
          data-url="public/data/netcdf/result_100_200_9_40.nc"  
          skylineSpatialAnalysisUrl="http://www.supermapol.com/realspace/services/spatialAnalysis-data_all/restjsr/spatialanalyst/geometry/3d/skylinesectorbody.json"
        ></component>
      </keep-alive>
      <!-- 地质体组件,单独展示，需要销毁 -->
      <component :is="view2"></component>
    </el-main>
  </el-container>
</template>

<script>
import config from "config/views_config.js";  //组件配置
import server_config from "config/server_config.js";  //服务配置
import server_flyTo_config from "config/server_position_config";  //服务坐标配置
import layerManagement from "@/js/common/layerManagement.js";  //图层管理封装方法
import camera from "@/js/common/camera.js";  //相机操作
import loadingBar from "../../components/loading.vue";  //加载动画

export default {
  name: "layout-aside",
  components: {
    loadingBar
  },
  data() {
    return {
      // activeIndex: "1",
      // activeIndex2: "1",
      isCollapse: false,
      asideWidth: "asideWidth1",
      view: "",
      view2: "",
      initViewer: "",
      addService: "",
      sceneURL:
        "http://www.supermapol.com/realspace/services/3D-ZF_normal/rest/realspace",
      config: config,
      server_config: server_config,
      baseLayerObj: server_config[1].children[0],
      terrainLayerObj: null,
      addCustomServices: [],
      getNames: [],  //记录自定义服务名称
      varName: null, //临时保存当前自定义名称
    };
  },

  methods: {
    // 区分地质体组件（需销毁）和其他组件
    change(val, val2) {
      if (val2) {
        this.view = "";
        if (val === this.view2) {
          this.view2 = "";
          return;
        }
        this.view2 = val;
      } else {
        this.view2 = "";
        if (val === this.view) {
          this.view = "";
          return;
        }
        this.view = val;
      }
    },

    //添加公共服务
    addWebServe(obj) {
      if (obj.state === 0) {
        // add mvt
        if (obj.type === "MVT") {
          layerManagement.addMvtLayer(obj.proxiedUrl, obj.name, () => {
            obj.state = 1;
            store.actions.setChangeLayers();
          });
          return;
        }
        // add scene
        layerManagement.addScene(
          obj.proxiedUrl,
          { autoSetView: true },
          layers => {
            obj.state = 1;
            store.actions.setChangeLayers();
            // 白膜添加线框
            if (obj.style && obj.style.fillStyle) {
              layers[0].style3D.lineColor = Cesium.Color.fromCssColorString(
                "rgb(67,67,67)"
              );
              layers[0].style3D.fillStyle =
                Cesium.FillStyle[obj.style.fillStyle];
            }
          }
        );
        this.flyTo(obj.name, server_flyTo_config);
      } else {
        this.flyTo(obj.name, server_flyTo_config);
      }
    },
    // 添加底图
    addBaseLayer(obj) {
      if (this.baseLayerObj.type === obj.type) return;
      this.baseLayerObj.state = 0;
      obj.state = 1;
      this.baseLayerObj = obj;
      let type = obj.type;
      let url = obj.proxiedUrl;
      let imageryLayerCollection = viewer.scene.globe._imageryLayerCollection;
      let layer = imageryLayerCollection.get(0);
      let imageryProvider;
      if (imageryLayerCollection.get(2)) {
        imageryLayerCollection.remove(imageryLayerCollection.get(2));
      }
      if (imageryLayerCollection.get(1)) {
        imageryLayerCollection.remove(imageryLayerCollection.get(1));
      }
      switch (type) {
        case "BINGMAP":
          imageryProvider = new Cesium.BingMapsImageryProvider({
            url: url,
            key:
              "Aq0D7MCY5ErORA9vrwFtfE9aancUq5J6uNjw0GieF0ostaIrVuJZ8ScXxNHHvEwS"
          });
          break;
        case "TIANDITU":
          imageryProvider = new Cesium.TiandituImageryProvider({
            url: url,
            // mapStyle: Cesium.TiandituMapsStyle["IMG_C"],
            token: "4a00a1dc5387b8ed8adba3374bd87e5e"
          });
          break;
        case "IMAGE":
          imageryProvider = new Cesium.SingleTileImageryProvider({
            url: url
          });
          break;
        case "OSM":
          imageryProvider = new Cesium.createOpenStreetMapImageryProvider({
            url: url
          });
          break;
        case "MAPBOX":
          imageryProvider = new Cesium.MapboxImageryProvider({
            mapId: "mapbox.dark"
          });
          break;
        case "SUPERMAPDARK":
          imageryProvider = new Cesium.SuperMapImageryProvider({
            url: url
          });
          break;
        case "SUPERMAPLIGHT":
          imageryProvider = new Cesium.SuperMapImageryProvider({
            url: url
          });
          break;
        case "GRIDIMAGERY":
          imageryProvider = imageryProvider;
          break;
        default:
          imageryProvider = new Cesium.SingleTileImageryProvider({
            url: url
          });
          break;
      }
      // if (type === "IMAGE") {
      //   imageryLayerCollection.remove(layer);
      //   return;
      // }
      if (type != "GRIDIMAGERY") {
        imageryLayerCollection.addImageryProvider(imageryProvider, 0);
        imageryLayerCollection.remove(layer);
      }
      if (type == "GRIDIMAGERY") {
        imageryLayerCollection.addImageryProvider(
          new Cesium.TileCoordinatesImageryProvider(),
          1
        );
        imageryLayerCollection.addImageryProvider(
          new Cesium.GridImageryProvider(),
          2
        );
      }
    },
    // 添加在线地形
    addOnlineTerrain(obj) {
      if (this.terrainLayerObj) this.terrainLayerObj.state = 0;
      obj.state = 1;
      this.terrainLayerObj = obj;
      let type = obj.type;
      let url = obj.proxiedUrl;
      switch (type) {
        case "STKTerrain":
          viewer.terrainProvider = new Cesium.CesiumTerrainProvider({
            url: url,
            isSct: false
          });
          break;
        case "tianDiTuTerrain":
          var t_Provider = new Cesium.TiandituTerrainProvider({
            token: "e90d56e5a09d1767899ad45846b0cefd"
          });
          viewer.terrainProvider = t_Provider;
          break;
        case "supermapOnlineTerrain":
          viewer.terrainProvider = new Cesium.SCTTerrainProvider({
            urls: [url]
          });
          break;
        default:
          break;
      }
    },

    // 移除地形
    removeTerrainLayer() {
      viewer.terrainProvider = new Cesium.EllipsoidTerrainProvider({
        ellipsoid: viewer.scene.globe.ellipsoid
      });
    },

    addDatas(id, obj) {
      switch (id) {
        case "webServe":
          this.addWebServe(obj);
          break;
        case "baseLayer":
          this.addBaseLayer(obj);
          break;
        case "onlineTerrain":
          this.addOnlineTerrain(obj);
          break;
      }
    },
    
    // 初始化viewer后的传入回调：添加底图和清除加载动画
    removeLoad() {
      this.addBaseLayer(server_config[1].children[1]); //默认添加底图BingMap
      setTimeout(() => {
        let loading = document.getElementById("loadingbar");
        if (loading) loading.remove(); //移除加载动画
        document.getElementById("el-aside").classList.remove("disable"); //解除禁止点击
      }, 1000);
    },

    // 删除场景公共服务
    DeleteDates(datatype, obj) {
      switch (datatype) {
        case "webServe":
          obj.layers.forEach(layer => {
            layerManagement.layersDelete(layer.type, layer.layerName, () => {
              obj.state = 0;
              window.store.actions.setChangeLayers();
            });
          });
          break;
        case "baseLayer":
          break;
        case "onlineTerrain":
          this.removeTerrainLayer();
          obj.state = 0;
          break;
      }
    },

    // 删除自定义服务
    DeleteServices(obj, index) {
      obj.layers.forEach(layer => {
        layerManagement.layersDelete(layer.type, layer.layerName, () => {
          this.addCustomServices.splice(index, 1);
          this.getNames.splice(index, 1);
        });
      });
    },
    // 自定义服务点击定位
    flytoCustomService(obj) {
      camera.flyByLayerName(obj.layers[0].type, obj.layers[0].layerName);
    },

    // 控制自定义服务组件显隐
    addCustomService() {
      if (this.addService === "") {
        this.addService = "Sm3dCustomService";
      } else {
        this.addService = "";
      }
    },
    // 自定义服务添加回调函数
    addCallback(layers, add_type) {
      if (!Array.isArray(layers)) {
        layers = [layers];
      }
      let serviceOption = [];
      for (let i = 0; i < layers.length; i++) {
        if (layers[i].hasOwnProperty("_isS3MB")) {
          let option = {
            type: "S3M",
            layerName: layers[i].name
              ? layers[i].name
              : "s3m_" + new Date().getTime().toFixed(6)
          };
          serviceOption.push(option);
          if (!layers[i].maxVisibleAltitude)
            layers[i].maxVisibleAltitude = 8000;
        } else if (viewer.imageryLayers.contains(layers[i])) {
          let option = {
            type: "IMG",
            layerName: layers[i].imageryProvider.tablename
              ? layers[i].imageryProvider.tablename
              : "image" + new Date().getTime().toFixed(6)
          };
          serviceOption.push(option);
        } else if (
          layers[i].imageryLayer &&
          layers[i].imageryLayer._imageryProvider instanceof
            Cesium.MvtProviderGL
        ) {
          let option = {
            type: "MVT",
            layerName: layers[i].name
              ? layers[i].name
              : "mvt" + new Date().getTime().toFixed(6)
          };
          serviceOption.push(option);
          let index = this.addCustomServices.length;
          let obj = {
            name: layers[i].name ? layers[i].name : "自定义服务" + index,
            layers: serviceOption
          };
          this.addCustomServices.push(obj);
          this.addService = "";
          return;
        } else {
          let option = {
            type: "TERRAIN",
            layerName: layers[i].tablename ? layers[i].tablename : "terrain"
          };
          serviceOption.push(option);
        }
      }
      if (this.varName) this.getNames.push(this.varName);
      let index = this.addCustomServices.length;
      let len = this.getNames.length - 1;
      let obj = {
        name: this.varName ? this.varName : "自定义服务" + index,
        layers: serviceOption
      };
      this.addCustomServices.push(obj);
      this.addService = "";
      this.varName = undefined;
      if ((add_type && add_type === "SCENE") || add_type === "TERRAIN") return;
      camera.flyByLayerName(add_type, obj.layers[0].layerName); //定位
    },

    // 自定义服务获取名称回调
    getName(name) {
      this.varName = name;
    },

    // 添加服务飞行函数(公共服务配置好的定位)
    flyTo(webName, obj) {
      let cameraParam = obj[webName];
      if (cameraParam) {
        viewer.scene.camera.flyTo({
          destination: new Cesium.Cartesian3(
            cameraParam.Cartesian3.x,
            cameraParam.Cartesian3.y,
            cameraParam.Cartesian3.z
          ),
          orientation: {
            heading: cameraParam.heading,
            pitch: cameraParam.pitch,
            roll: cameraParam.roll
          },
          duration: 0
        });
        return;
      } else {
      }
    },

    //图层管理右键删除回调
    deleteCallback(node_rightClick) {
      this.server_config[0].children.forEach(sceneObj => {
        sceneObj.layers.forEach(layerObj => {
          if (layerObj.layerName === node_rightClick.label) {
            sceneObj.state = 0;
            return;
          }
        });
      });
    }
  },
  
  watch: {
    isCollapse(val) {
      if (val) {
        this.asideWidth = "asideWidth2";
      } else {
        this.asideWidth = "asideWidth1";
      }
    }
  },
  mounted() {
    document.getElementById("el-aside").classList.add("disable"); //禁止点击
    window.onload = () => {
      this.initViewer = "Sm3dViewer";
      // document.getElementById("el-aside").classList.remove("disable"); //解除禁止点击
    };
  }
};
</script>

<style lang="scss" scoped>
.asideWidth1 {
  width: 246px !important;
  transition-duration: 0.3s;
  // transition-delay: 0.5s;
}
.asideWidth2 {
  transition-duration: 0.5s;
  width: 40px !important;
}

.el-aside {
  background-color: #424242;
  overflow-y: scroll;
  overflow-x: hidden;
  scrollbar-width: none;
  /* firefox */
  -ms-overflow-style: none;

  .el-menu--collapse {
    width: 40px;
  }
  .el-menu {
    border-right: none;
    .el-menu-item,
    .el-submenu__title {
      height: 45px;
      line-height: 45px;
    }

    #fold {
      height: 35px;
      transition-duration: 1s;
      color: #ffffff !important;
      padding-left: 8px !important;
      text-align: center !important;
      line-height: 35px !important;
    }
  }
}
.el-aside::-webkit-scrollbar {
  display: none;
}
.box {
  font-family: "Microsoft Yahei";
  display: flex;
  // background-color: rgb(110, 105, 105);
  width: 100%;
  padding: 0 10px 0 28px;
  justify-content: space-between;
  box-sizing: border-box;
  flex-wrap: wrap;

  .imgbox {
    position: relative;
    width: 100px;
    height: 100px;
    // background-color: rgb(87, 85, 85);
    display: flex;
    box-sizing: border-box;
    margin-bottom: 5px;
    flex-wrap: wrap;
    justify-content: center;
    span {
      font-size: 12px;
      color: #ffffff;
    }
    .img {
      // border: 1px solid transparent;
      width: 100%;
      height: 72px;
      border-radius: 4px;
    }
    .img:hover {
      border: 2px solid rgb(39, 148, 190);
    }
    .cross {
      width: 25px;
      height: 25px;
      position: absolute;
      top: 0;
      left: 0;
    }
    [class^="el-icon-"] {
      margin-right: 0;
      position: absolute;
      right: 0px;
      top: 3px;
      color: #ffffff;
    }
    [class^="el-icon-"]:hover {
      color: #fce5e5;
    }
  }
}
.rotate2 {
  transform: rotate(0deg);
  -ms-transform: rotate(0); /* IE 9 */
  -moz-transform: rotate(0); /* Firefox */
  -webkit-transform: rotate(0); /* Safari 和 Chrome */
  -o-transform: rotate(0); /* Opera */
  transition-duration: 1s;
}
.rotate {
  margin-left: 8px !important;
  line-height: 52px !important;
  transform: rotate(-90deg);
  -ms-transform: rotate(-90deg); /* IE 9 */
  -moz-transform: rotate(-90deg); /* Firefox */
  -webkit-transform: rotate(-90deg); /* Safari 和 Chrome */
  -o-transform: rotate(-90deg); /* Opera */
  transition-duration: 1s;
}

.disable {
  pointer-events: none;
}

.iconfont2 {
  font-size: 20px !important;
  margin-right: 10px;
}
</style>



