var store = {
    debug: true,
    state: {
        isInitViewer: false,
        // 控制界面显隐，组件名称及类型
        componentShows:[],   //1代表显示，0代表隐藏
        componentNames:[],
        componentTypes:[],
        isEdit:true,
        isEditZ: false,
    },
    setisInitViewer(newValue) {
        this.state.isInitViewer = newValue;
    },
    // 设置组件显隐
    setComponentShow(newValue) {
        this.state.componentShows = newValue;
    },
    // 点击组件切换
    clickComponentShow(index) {
        if(this.state.componentShows[index]===1){
            return;
        }
        let arr = this.state.componentShows;
        for(let i =0,j=arr.length;i<j;i++){
            arr[i] = 0;
        }
        arr[index] = 1;
        this.setComponentShow([...arr])
    },
    // 设置组件名称
    setComponentName(newValue) {
        this.state.componentNames = newValue;
    },
    // 设置组件类型数组
    setComponentType(newValue) {
        this.state.componentTypes = newValue;
    },
    // 设置编辑
    setIsEdit(newValue) {
        this.state.isEdit = newValue;
    },
    setIsEditZ(newValue) {
        this.state.isEditZ = newValue;
    },
   
}



export default store