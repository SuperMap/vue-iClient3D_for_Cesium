import Viewer from './viewer.vue';
// import initDrag from "../../js/drag/drag.js"                //按需引入拖拽指令
// import initResource from '../../resource/index.js'  //语言文件

Viewer.install = function (app) {
    // initResource(app);
    // initDrag(app);
    app.component(Viewer.name, Viewer);
};

export default Viewer;
