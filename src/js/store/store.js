// 创建一个简单的store状态管理

import { reactive } from "vue";

// 全局状态管理（响应式）
const storeState = reactive({
    isViewer: false,   //viewer初始化标志
    changeLayers:0,     //图层改变加载完毕监听
    changeGeometrys:0     //三维分析体改变标志
});
const actions  = {
    setIsViewer(newValue) {
        storeState.isViewer = newValue;
    },
    setChangeLayers(newValue) {
        storeState.changeLayers += 1;
    },
    setGeometrys(newValue) {
        storeState.changeGeometrys += 1;
        console.log(storeDate.geometrys)
    },
}

// 全局公共数据
const storeDate = {
    geometrys:{},  //存储当前存在的三位空间查询体：如天际线体，可视域体
    layers:null
}



export {
    storeState,
    actions,
    storeDate
}

export default {
    storeState,
    actions,
    storeDate 
}
