/*
*模块说明：
*1.导出组件逻辑
*2.导出常用工具
*/

// 工具类导入
import tool from './tool/tool.js'
import initDrag from './drag/drag.js'  //拖拽指令
import layerManagement from './common/layerManagement.js'  //
import camera from './common/camera.js'  //

// 组件类导入
import initViewer from '../components/viewer/viewer.js'       //viewer组件
import terrainOperation from "../components/terrain-analysis/terrain-operation/terrain-operation.js"   //地形操作
import terrainSlope from "../components/terrain-analysis/terrain-slope/terrain-slope.js"   
import terrainIsoline from "../components/terrain-analysis/terrain-isoline/terrain-isoline.js"   
import terrainFlood from "../components/terrain-analysis/terrain-flood/terrain-flood.js"   
import clipBoxEditor from "../components/clip/clip-box-editor/clip-box-editor.js"   //裁剪操作
import clipPolygon from "../components/clip/clip-polygon/clip-polygon.js"   
import clipPlane from "../components/clip/clip-plane/clip-plane.js"   
import clipCross from "../components/clip/clip-cross/clip-cross.js"   
import measure from "../components/analysis_3d/measure/measure.js"   
import skyLine from "../components/analysis_3d/sky-line/sky-line.js"   
import shadowquery from "../components/analysis_3d/shadow-query/shadow-query.js"   
import viewshed from "../components/analysis_3d/viewshed/viewshed.js"   
import profile from "../components/analysis_3d/profile/profile.js"   
import sightLine from "../components/analysis_3d/sight-line/sight-line.js"   
import openness from "../components/analysis_3d/openness/openness.js"   
import spatialQuery3d from "../components/space-search/spatial-query3d/spatial-query3d.js"  
import splitScreen from "../components/scene/split-screen/split-screen.js"
import roller from "../components/scene/roller/roller.js"
import layerManage from "../components/layer/layer-manage/layer-manage.js"
import mvtlayerStyle from "../components/layer/mvtlayer-style/mvtlayer-style.js"
import s3mlayerAttribute from "../components/layer/s3mlayer-attribute/s3mlayer-attribute.js"
import s3mlayerStyle from "../components/layer/s3mlayer-style/s3mlayer-style.js"
import s3mlayerOperation from "../components/layer/s3mlayer-operation/s3mlayer-operation.js"
import modelFlood from "../components/layer/model-flood/model-flood.js"
import photography from "../components/layer/oblique-photography/oblique-photography.js"
import imglayerAttribute from "../components/layer/imglayer-attribute//imglayer-attribute.js"
import sceneAttribute from "../components/scene/scene-attribute/scene-attribute.js"
import facade from "../components/scene/facade/facade.js"
import compass from "../components/scene/compass/compass.js"
import flyRoute from "../components/fly/fly-route/fly-route.js"
import drawLineSrface from "../components/draw/draw-line-surface/draw-line-surface.js"
import symbol from "../components/draw/add-point-symbol/add-point-symbol.js"
import light from "../components/scene/light/light.js"
import projection from "../components/scene/projection-image/projection-image.js"
import scanEffect from "../components/special-effects/scan-effect/scan-effect.js"
import geologicalBody from "../components/model/geological-body/geological-body.js"
import volume from "../components/scene/volume-render/volume-render.js"
import particle from "../components/special-effects/particle-system/particle-system.js"
const webgl_3d = {
    // 工具类
    initDrag,
    tool,
    layerManagement,
    camera,
    // 组件类
    initViewer,
    terrainOperation,
    terrainSlope,
    terrainIsoline,
    terrainFlood,
    clipBoxEditor,
    clipPolygon,
    clipPlane,
    clipCross,
    clipBox,
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
    layerManage,
    mvtlayerStyle,
    s3mlayerAttribute,
    s3mlayerStyle,
    s3mlayerOperation,
    modelFlood,
    photography,
    imglayerAttribute,
    sceneAttribute,
    facade,
    compass,
    flyRoute,
    drawLineSrface,
    symbol,
    light,
    projection,
    scanEffect,
    geologicalBody,
    volume,
    particle
}

// 全部导出
export default webgl_3d;

// 判断是否是直接引入文件
if (typeof window !== 'undefined' && window.Vue) {
    window.webgl3d_mc = webgl_3d
  }






