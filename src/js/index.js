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
import clipBox from "../components/clip/clip-box/clip-box.js"   
import measure from "../components/analysis_3d/measure/measure.js"   
import skyLine from "../components/analysis_3d/sky-line/sky-line.js"   
import shadowquery from "../components/analysis_3d/shadow-query/shadow-query.js"   
import viewshed from "../components/analysis_3d/viewshed/viewshed.js"   
import profile from "../components/analysis_3d/profile/profile.js"   
import sightLine from "../components/analysis_3d/sight-line/sight-line.js"   
import openness from "../components/analysis_3d/openness/openness.js"   
import spatialQuery3d from "../components/space-search/spatial-query3d/spatial-query3d.js"  


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

}

// 全部导出
export default webgl_3d;

// 判断是否是直接引入文件
if (typeof window !== 'undefined' && window.Vue) {
    window.webgl3d = webgl_3d
  }






