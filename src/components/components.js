/***
 * **完整组件js包
 * */


// 引入配置
import store from '../js/store/store.js'
import initDrag from "../js/drag/drag.js"                //按需引入拖拽指令
import ResourceCN from '../resource/resourceCN.js'  //中文语言文件

// 引入组件
import viewer from './viewer/index.js'       //viewer组件
import terrainOperation from "./terrain-analysis/terrain-operation/index.js"   //地形操作
import terrainSlope from "./terrain-analysis/terrain-slope/index.js"
import terrainIsoline from "./terrain-analysis/terrain-isoline/index.js"
import terrainFlood from "./terrain-analysis/terrain-flood/index.js"
import clipBoxEditor from "./clip/clip-box-editor/index.js"   //裁剪操作
import clipPolygon from "./clip/clip-polygon/index.js"
// import clipPlane from "./clip/clip-plane/index.js"
import clipCross from "./clip/clip-cross/index.js"
import clipPlaneNew from "./clip/clip-plane-new/index.js"
import measure from "./analysis_3d/measure/index.js"
import skyLine from "./analysis_3d/sky-line/index.js"
import shadowquery from "./analysis_3d/shadow-query/index.js"
import viewshed from "./analysis_3d/viewshed/index.js"
import profile from "./analysis_3d/profile/index.js"
import sightLine from "./analysis_3d/sight-line/index.js"
import openness from "./analysis_3d/openness/index.js"
import spatialQuery3d from "./space-search/spatial-query3d/index.js"
import splitScreen from "./scene/split-screen/index.js"
import roller from "./scene/roller/index.js"

import customService from "./layer/custom-service/index.js"
import layerManage from "./layer/layer-manage/index.js"
import mvtlayerStyle from "./layer/mvtlayer-style/index.js"
import s3mlayerAttribute from "./layer/s3mlayer-attribute/index.js"
import s3mlayerStyle from "./layer/s3mlayer-style/index.js"
import s3mlayerOperation from "./layer/s3mlayer-operation/index.js"
import modelFlood from "./layer/model-flood/index.js"
import photography from "./layer/oblique-photography/index.js"
import imglayerAttribute from "./layer/imglayer-attribute/index.js"
import sceneAttribute from "./scene/scene-attribute/index.js"
import facade from "./scene/facade/index.js"
import compass from "./scene/compass/index.js"
import flyRoute from "./fly/fly-route/index.js"
import addPbr from "./layer/pbr-material/index.js"

import draw from "./draw/draw-line-surface/index.js"
import symbol from "./draw/add-point-symbol/index.js"
import light from "./scene/light/index.js"
import projection from "./scene/projection-image/index.js"
import scanEffect from "./special-effects/scan-effect/index.js"
import geologicalBody from "./model/geological-body/index.js"
import volume from "./scene/volume-render/index.js"
import particle from "./special-effects/particle-system/index.js"


const components = [
    viewer,
    terrainOperation,
    terrainSlope,
    terrainIsoline,
    terrainFlood,
    clipBoxEditor,
    clipPolygon,
    clipPlaneNew,
    clipCross,
    measure,
    skyLine,
    shadowquery,
    viewshed,
    profile,
    sightLine,
    openness,
    spatialQuery3d,
    splitScreen,
    roller,
    customService,
    layerManage,
    mvtlayerStyle,
    s3mlayerAttribute,
    s3mlayerStyle,
    s3mlayerOperation,
    addPbr,
    modelFlood,
    photography,
    imglayerAttribute,
    sceneAttribute,
    facade,
    compass,
    flyRoute,
    draw,
    symbol,
    light,
    projection,
    scanEffect,
    geologicalBody,
    volume,
    particle,
];

const install = (app, locale) => {
    window.Resource = ResourceCN;
    app.config.globalProperties.Resource = ResourceCN;  //默认中文
    initDrag(app)   //默认可拖拽
    if (locale) app.config.globalProperties.Resource = locale;  //其他语言配置
    if (install.installed) return;
    install.installed = true;
    components.forEach(component => {
        // app.component(component.name, component);
        app.use(component);
    });
};

window.store = store;

// 判断是否是直接引入文件
if (typeof window !== 'undefined' && window.Vue) {
    window.webgl3d = install;
}

export default {
    install,
    components,
};






