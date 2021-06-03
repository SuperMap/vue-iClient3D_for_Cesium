
// 引入依赖
import { watch, ref, reactive, toRefs, onBeforeUnmount, onMounted } from "vue";
import { storeState } from '../../../js/store/store.js'   //简单局部状态管理
import tool from '../../../js/tool/tool.js'        //提示等工具
import resource from '../../../js/local/lang.js'  //语言资源

function compass(props) {

    // 设置默认值数据
    let state = reactive({
        resetPosition: '',  //重置初始位置fromDegrees
        isfull: false,  //全屏标志
    });

    state.resetPosition = new Cesium.Cartesian3.fromDegrees(
        110.60396458865515,
        34.54408834959379,
        30644793.325518917
    );

    // 传入props改变默认值
    if (props) {
        for (let key in props) {
            if (state.hasOwnProperty(key)) {
                state[key] = props[key]
            } else {
                tool.Message.errorMsg(resource.AttributeError + key);
            }
        }
    }
    if (state.isfull) fullscreenchange()

    // 初始化数据
    let scene, scratchWindowPosition;
    let compass_dom = ref(null);
    let zoomIn_timer, zoomOut_timer;
    let isFlyCircle = false;

    if (storeState.isViewer) {
        scene = viewer.scene;
        initCompass()
    }
    //viewer 初始化完成的监听
    watch(() => storeState.isViewer, val => {
        if (val) {
            scene = viewer.scene;
            initCompass()
        }
    });

    //初始化控件
    function initCompass() {
        scratchWindowPosition = new Cesium.Cartesian2();  //获取屏幕中心点
        scratchWindowPosition.x = scene.canvas.clientWidth / 2;
        scratchWindowPosition.y = scene.canvas.clientHeight / 2;
        scene.postRender.addEventListener(listener);  //监听指北针转动
        window.addEventListener('resize', function () {
            scratchWindowPosition.x = scene.canvas.clientWidth / 2;
            scratchWindowPosition.y = scene.canvas.clientHeight / 2;
        });
    };

    //监听指北针转动
    function listener() {
        let heading = scene.camera.heading;
        let x = -Cesium.Math.toDegrees(heading);
        let degrees = "rotate(" + x + "deg)";
        compass_dom.value.style.transform = degrees;
        if (!isFlyCircle) return;
        if (heading <= 0.05 || heading >= 6.23) {
            scene.camera.stopFlyCircle();
            heading = 0;
            isFlyCircle = false;
        }
    };

    /**
   * 分析
   */
    //相机指北
    function reduceCompass() {
        let heading = scene.camera.heading;
        let speed = 8;
        if (heading <= 0.05 || heading >= 6.23) return;
        if (heading <= 0.5 || heading >= 5.8) speed = 2;
        isFlyCircle = true;
        let viewCenter = scene.pickPosition(scratchWindowPosition);
        if (scene.camera.heading - Cesium.Math.PI >= 0) {
            scene.camera.speedRatio = speed;
            scene.camera.flyCircle(viewCenter);
            return;
        }
        scene.camera.speedRatio = -speed;
        scene.camera.flyCircle(viewCenter);
    };

    //重置
    function reset() {
        viewer.camera.flyTo({ destination: state.resetPosition });
    };

    // 放大缩进
    function zoomIn() {
        let speed = 10;
        clearInterval(zoomIn_timer);
        zoomIn_timer = setInterval(() => {
            speed = zoomSpeed();
            viewer.camera.zoomIn(speed);
        }, 30)
    };
    // 鼠标抬起暂停缩进
    function mouseup_zoomIn() {
        clearInterval(zoomIn_timer)
    };
    //缩小远离
    function zoomOut() {
        let speed = 10;
        clearInterval(zoomOut_timer);
        zoomOut_timer = setInterval(() => {
            speed = zoomSpeed();
            viewer.camera.zoomOut(speed);
        }, 30)
    };

    function mouseup_zoomOut() {
        clearInterval(zoomOut_timer)
    };

    // 缩放速度控制
    function zoomSpeed() {
        let viewCenter = scene.pickPosition(scratchWindowPosition);
        let camera_position = viewer.camera.position;
        let distance = Cesium.Cartesian3.distance(viewCenter, camera_position);
        if (distance >= 1000) return distance / 30;
        if (distance >= 20) return distance / 20;
        if (distance > 0) return 0.5;
        return 0
    };


    /**
     * 进入全屏模式。
     */

    function fullscreenchange() {
        if (!document.fullscreenElement) {
            state.isfull = true;
            launchFullscreen(document.documentElement);
        } else {
            state.isfull = false;
            exitFullscreen();
        }
    };

    function launchFullscreen(element) {
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
        }
    };
    /**
     * 退出全屏模式。兼容模式。
     */
    function exitFullscreen() {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
    };

    // 销毁
    onBeforeUnmount(() => {
        scene.postRender.removeEventListener(listener);
    });


    return {
        ...toRefs(state),
        compass_dom,
        reduceCompass,
        reset,
        fullscreenchange,
        zoomIn,
        mouseup_zoomIn,
        zoomOut,
        mouseup_zoomOut
    };
};

export default compass

