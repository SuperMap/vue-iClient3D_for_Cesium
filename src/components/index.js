// 工具配置
import URL_CONFIG from  '../common/js/config';
window.URL_CONFIG = URL_CONFIG;
 // 按需加载第三方库
import { ColorPicker} from 'view-design';
ColorPicker.name = 'ColorPicker';
import axios from '../common/js/axios.min';
window.axios = axios;

import common from "../common/js/common";
import installDrag from "../common/js/drag";
import store from "../store/store.js" // 局部变量状态管理
window.store = store;
window.common = common;
import viewer from "./Viewer/index.js";
import Measure from "./3DAnalysis/Measure/index.js";
import Profile3D from "./3DAnalysis/Profile3D/index.js";
import ShadowQuery from "./3DAnalysis/ShadowQuery/index.js";
import SightLine from "./3DAnalysis/SightLine/index.js";
import SkyLine from "./3DAnalysis/SkyLine/index.js";
import ViewShed from "./3DAnalysis/ViewShed/index.js";
import OnLineAnalysis from "./3DAnalysis/OnLineAnalysis/index.js";
import backLineAnalysis from "./3DAnalysis/backLineAnalysis/index.js";
import limitHeightAnalysis from "./3DAnalysis/limitHeightAnalysis/index.js";

import ClipBox from "./Clip/ClipBox/index.js";
import ClipCross from "./Clip/ClipCross/index.js";
import ClipPlane from "./Clip/ClipPlane/index.js";
import ClipPolygon from "./Clip/ClipPolygon/index.js";
import ClipBoxByEditor from "./Clip/ClpBoxByEditor/index";


import TerrainOperation from "./TerrainAnalysis/TerrainOperation/index.js";
import TerrainFlood from "./TerrainAnalysis/TerrainFlood/index.js";
import TerrainSlope from "./TerrainAnalysis/TerrainSlope/index.js";
import TerrainIsoLine from "./TerrainAnalysis/TerrainIsoLine/index.js";


import GeologicBodyOperation from "./GeologicBodyAnalysis/GeologicBodyOperation/index.js";
// import loadingBar from "./loading/index.js"
// import drawRect from "./AttributeSearch/drawRect/index"

const components = [
  viewer,
  Measure,
  Profile3D,
  ShadowQuery,
  SightLine,
  SkyLine,
  ViewShed,
  OnLineAnalysis,
  backLineAnalysis,
  limitHeightAnalysis,
  GeologicBodyOperation,

  ClipBox,
  ClipCross,
  ClipPlane,
  ClipPolygon,
  ClipBoxByEditor,

  TerrainOperation,
  TerrainFlood,
  TerrainSlope,
  TerrainIsoLine,

  // loadingBar,
  // drawRect,
  ColorPicker
]

const install = function (Vue, opts = {}) {
  if (install.installed) return;
  install.installed = true;
  components.forEach(component => {
    Vue.component(component.name, component);
  });
  installDrag(Vue);

}
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

export default {
  install,
  components,
  
  viewer,
  Measure,
  Profile3D,
  ShadowQuery,
  SightLine,
  SkyLine,
  ViewShed,
  OnLineAnalysis,
  backLineAnalysis,
  limitHeightAnalysis,
  GeologicBodyOperation,
  ClipBox,
  ClipCross,
  ClipPlane,
  ClipPolygon,
  ClipBoxByEditor,
  TerrainOperation,
  TerrainFlood,
  TerrainSlope,
  TerrainIsoLine
}
