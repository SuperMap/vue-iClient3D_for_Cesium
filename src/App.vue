<template>
  <sm3d-viewer :scene-url="sceneURL">
    <div id="viewer-panel" class="sm-panel" style="left:1%;">
      <label style="font-size:16px">组件调用测试</label>
      <br />
      <label for>场景</label>
      <br />
      <button @click="changeScene(0)">珠峰</button>
      <button @click="changeScene(1)">BIM</button>
      <button @click="changeScene(2)">CBD</button>
      <br />

      <label for>地形</label>
      <br />
      <button @click="change(0)">地形操作</button>
      <button @click="change(1)">坡度分析</button>
      <button @click="change(2)">淹没分析</button>
      <button @click="change(3)">等值线</button>
      <br />

      <label for>裁剪</label>
      <br />
      <button @click="change(5)">Box裁剪交互</button>
      <button @click="change(6)">cross裁剪</button>
      <button @click="change(7)">平面裁剪</button>
      <button @click="change(8)">多边形</button>
      <br />

      <label for>分析</label>
      <br />
      <button @click="change(10)">量算</button>
      <button @click="change(11)">天际线</button>
      <button @click="change(12)">剖面</button>
      <button @click="change(13)">通视</button>
      <button @click="change(14)">阴影</button>
      <button @click="change(15)">可视域</button>
      <button @click="change(16)">开敞度</button>
      <button @click="change(17)">GPU查询</button>
      <br />
      <label for>图层属性</label>
      <br />
      <button @click="change(18)">s3m图层属性</button>
      <button @click="change(19)">s3m图层风格</button>
      <button @click="change(20)">s3m图层操作</button>
      <button @click="change(21)">卷帘</button>
      <button @click="change(22)">分屏</button>
      <button @click="change(23)">图层管理</button>
      <button @click="change(24)">倾斜开挖</button>
      <button @click="change(25)">img图层属性</button>
      <button @click="change(26)">场景属性</button>
      <button @click="change(27)">立面图</button>
      <button @click="change(28)">罗盘</button>
      <button @click="change(29)">飞行</button>
      <button @click="change(30)">绘制线面</button>
      <button @click="change(31)">绘制点符号</button>
      <button @click="change(32)">灯光</button>
      <button @click="change(33)">视频投放</button>
      <button @click="change(34)">扫描线</button>
      <button @click="change(35)">体渲染</button>
      ...
    </div>

    <!-- <keep-alive :include="keepArr"> -->
    <keep-alive>
      <component :is="view" data-url="public/data/netcdf/result_100_200_9_40.nc"></component>
    </keep-alive>
  </sm3d-viewer>
</template>

<script>
export default {
  data() {
    return {
      keepArr: ["Sm3dTerrainSlope"],
      view: "Sm3dParticleSystem",
      sceneArr: [],
      sceneURL:
        // "http://www.supermapol.com/realspace/services/3D-ZF_normal/rest/realspace"
        // URL_CONFIG.SCENE_WIREFRAME
        // 'http://www.supermapol.com/realspace/services/3D-BIMbuilding/rest/realspace'
        URL_CONFIG.SCENE_CBD
      // "http://www.supermapol.com/realspace/services/3D-JuBuShuJu_Model_GuangZhouJuBuMian-BaiMo1/rest/realspace"
      // 'http://www.supermapol.com/realspace/services/3D-CQmodel_wireframe_2000/rest/realspace',
      // 'http://www.supermapol.com/realspace/services/3D-CQmodel_wireframe_2000/rest/realspace'
      // "http://www.supermapol.com/realspace/services/3D-QingXieSheYingMoXing/rest/realspace"
      // 'http://www.supermapol.com/realspace/services/3D-CBDCache20200416/rest/realspace',
      // "http://localhost:8090/iserver/services/3D-NanWang/rest/realspace"

      // 'http://www.supermapol.com/realspace/services/3D-CBD/rest/realspace/datas/Building@CBD/config'
    };
  },

  mounted() {},
  methods: {
    change(val) {
      switch (val) {
        case 0:
          this.view = "Sm3dTerrainOperation";
          break;
        case 1:
          this.view = "Sm3dTerrainSlope";
          break;
        case 2:
          this.view = "Sm3dTerrainFlood";
          break;
        case 3:
          this.view = "Sm3dTerrainIsoline";
          break;
        case 4:
          this.view = "Sm3dClipBox";
          break;
        case 5:
          this.view = "Sm3dClipBoxByeditor";
          break;
        case 6:
          this.view = "Sm3dClipCross";
          break;
        case 7:
          this.view = "Sm3dClipPlane";
          break;
        case 8:
          this.view = "Sm3dClipPolygon";
          break;
        case 9:
          this.view = "Sm3dTest";
          break;
        case 10:
          this.view = "Sm3dMeasure";
          break;
        case 11:
          this.view = "Sm3dSkyline";
          break;
        case 12:
          this.view = "Sm3dProfile";
          break;
        case 13:
          this.view = "Sm3dSightline";
          break;
        case 14:
          this.view = "Sm3dShadowquery";
          break;
        case 15:
          this.view = "Sm3dViewshed";
          break;
        case 16:
          this.view = "Sm3dOpennessAnalysis";
          break;
        case 17:
          this.view = "Sm3dSpatialQuery3d";
          break;
        case 18:
          this.view = "Sm3dS3mlayerAttribute";
          break;
        case 19:
          this.view = "Sm3dS3mlayerStyle";
          break;
        case 20:
          this.view = "Sm3dS3mlayerOperation";
          break;
        case 21:
          this.view = "Sm3dRoller";
          break;
        case 22:
          this.view = "Sm3dSplitScreen";
          break;
        case 23:
          this.view = "Sm3dLayerManage";
          break;
        case 24:
          this.view = "Sm3dObliquePhotography";
          break;
        case 25:
          this.view = "Sm3dImglayerAttribute";
          break;
        case 26:
          this.view = "Sm3dSceneAttribute";
          break;
        case 27:
          this.view = "Sm3dFacade";
          break;
        case 28:
          this.view = "Sm3dCompass";
          break;
        case 29:
          this.view = "Sm3dFlyRoute";
          break;
        case 30:
          this.view = "Sm3dDrawLinePolygon";
          break;
        case 31:
          this.view = "Sm3dPointSymbol";
          break;
        case 32:
          this.view = "Sm3dLight";
          break;
        case 33:
          this.view = "Sm3dProjectionImage";
          break;
        case 34:
          this.view = "Sm3dScanEffect";
          break;
        case 35:
          this.view = "Sm3dVolumeRender";
          break;
      }
    },
    changeScene(val) {
      switch (val) {
        case 0:
          if (this.sceneArr.includes("珠峰地形影像")) {
            flyByCameraParam(obj["珠峰地形影像"]);
          } else {
            addScene(
              "http://www.supermapol.com/realspace/services/3D-ZF_normal/rest/realspace"
            );
            this.sceneArr.push("珠峰地形影像");
          }
          flyByCameraParam(obj["珠峰地形影像"]);
          break;
        case 1:
          if (this.sceneArr.includes("BIM建筑")) {
            flyByCameraParam(obj["BIM建筑"]);
          } else {
            addScene(URL_CONFIG.SCENE_WIREFRAME);
            this.sceneArr.push("BIM建筑");
          }
          break;
        case 2:
          if (this.sceneArr.includes("CBD")) {
            flyByCameraParam(obj["CBD"]);
          } else {
            addScene(URL_CONFIG.SCENE_CBD);
            this.sceneArr.push("CBD");
          }
          break;
      }
    }
  }
};

let obj = {
  BIM建筑: {
    Cartesian3: {
      x: -2118882.326838297,
      y: 4442023.860393671,
      z: 4057121.066514099
    },
    heading: 4.292795105148317,
    pitch: -0.4310205029408123,
    roll: 1.3660184094987926e-11
  },
  CBD: {
    Cartesian3: {
      x: -2180311.9545472134,
      y: 4380935.491489179,
      z: 4091551.732735441
    },
    heading: 6.240726986091157,
    pitch: -0.4564392939641406,
    roll: 6.283185307179501
  },

  珠峰地形影像: {
    Cartesian3: {
      x: 290799.3584088167,
      y: 5654922.6616128925,
      z: 2964895.841345586
    },
    heading: 6.205059658932406,
    pitch: -0.4335396082759968,
    roll: 9.618661422905461e-10
  }
};
</script>

<style lang="scss" scoped>
button {
  height: 25px;
  box-sizing: border-box;
  margin: 0;
  padding: 0 5px;
}
</style>
