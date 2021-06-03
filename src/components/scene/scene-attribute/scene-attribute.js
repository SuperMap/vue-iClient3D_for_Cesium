
// 引入依赖
import { watch, ref, reactive, toRefs, onBeforeUnmount, onMounted } from "vue";
import { storeState } from '../../../js/store/store.js'   //简单局部状态管理
import tool from '../../../js/tool/tool.js'        //提示等工具
import resource from '../../../js/local/lang.js'  //语言资源

function s3mlayerAttribute(props) {

    // 设置默认值数据
    let state = reactive({
        earthShow: true,  //地球显影
        shadows: false,  //场景阴影
        cloud: false,    //云层
        skyBox: false,   //天空盒
        sunShow: false,   //太阳
        timeline: false,   //时间轴
        depthAgainst: true,  //深度检测
        atomsphereRender: true,  //大气渲染
        fogEffect: true,   //雾化效果
        underground: true,   //开启地下
        frameRate: false,   //帧率
        rain: false,
        snow: false,
        // Facade: false,  //立面图
        surfaceTransparency: 1,  //地表透明度
        cloudsUrl: 'public/img/skyboxs/clouds/clouds1.png',  //云层纹理路径
        skyboxSources: null, //天空盒资源
        skyboxType: 'bluesky', //天空盒类型
        uspeed: 0,  //获取或者设置天空盒子绕x轴运动的动画速度。设置为1时表示0.01弧度每秒
        vspeed: 0,  //获取或者设置天空盒子绕y轴运动的动画速度。
        wspeed: 0.5,  //获取或者设置天空盒子绕z轴运动的动画速度。
        viewMode: '3D',  //视图模式
        rainAngle: 45,
        rainSpeed: 8,
        snowDesity: 10,
        snowSpeed: 4,
        snowAngle: 10,
        snowType: '0',
        compass:false,
        isCompass:''
    });
    // 设置天空盒默认值
    state.skyboxSources = {
        bluesky: {
            positiveX: 'public/img/skyboxs/bluesky/Right.jpg',
            negativeX: 'public/img/skyboxs/bluesky/Left.jpg',
            positiveY: 'public/img/skyboxs/bluesky/Front.jpg',
            negativeY: 'public/img/skyboxs/bluesky/Back.jpg',
            positiveZ: 'public/img/skyboxs/bluesky/Up.jpg',
            negativeZ: 'public/img/skyboxs/bluesky/Down.jpg'
        },
        sunsetglow: {
            positiveX: 'public/img/skyboxs/sunsetglow/Right.jpg',
            negativeX: 'public/img/skyboxs/sunsetglow/Left.jpg',
            positiveY: 'public/img/skyboxs/sunsetglow/Front.jpg',
            negativeY: 'public/img/skyboxs/sunsetglow/Back.jpg',
            positiveZ: 'public/img/skyboxs/sunsetglow/Up.jpg',
            negativeZ: 'public/img/skyboxs/sunsetglow/Down.jpg'
        }
    };

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

    // 初始化数据
    let cloudBox = new Cesium.CloudBox({ url: state.cloudsUrl });
    let skyboxs = {}, defaultSkybox;
    for (let key in state.skyboxSources) {
        let skybox = new Cesium.SkyBox({ sources: state.skyboxSources[key] });
        skybox.USpeed = state.uspeed;
        skybox.VSpeed = state.vspeed;
        skybox.WSpeed = state.wspeed;
        skyboxs[key] = skybox;
    };
    function initialSkyBox() {
        if (viewer.scene.frameState.passes.render) {
            for (let key in skyboxs) {
                skyboxs[key].update(viewer.scene.frameState, true);
                skyboxs[key].show = false;
            }
            viewer.scene.postRender.removeEventListener(initialSkyBox);
        }
    };

    function watchCameraHeight() {
        if (state.skyBox) {
            let cameraHeight = viewer.scene.camera.positionCartographic.height;
            if (cameraHeight > 22e4) {
                viewer.scene.skyBox.show = false;
                state.atomsphereRender = true;
            } else {
                viewer.scene.skyBox.show = true;
                state.atomsphereRender = false;
            }
        }
    }

    if (storeState.isViewer) {
        defaultSkybox = viewer.scene.skyBox;
        viewer.scene.postRender.addEventListener(initialSkyBox);
        viewer.scene.postProcessStages.snow.uniforms.density = parseFloat(state.snowDesity);
        viewer.scene.postProcessStages.snow.uniforms.speed = parseFloat(state.snowSpeed);
        viewer.scene.postProcessStages.rain.uniforms.speed = parseFloat(state.rainSpeed);
        watchCameraHeight();
    }
    //viewer 初始化完成的监听
    watch(() => storeState.isViewer, val => {
        if (val) {
            defaultSkybox = viewer.scene.skyBox;
            viewer.scene.postRender.addEventListener(initialSkyBox);
            viewer.scene.postProcessStages.snow.uniforms.density = parseFloat(state.snowDesity);
            viewer.scene.postProcessStages.snow.uniforms.speed = parseFloat(state.snowSpeed);
            viewer.scene.postProcessStages.rain.uniforms.speed = parseFloat(state.rainSpeed);
            watchCameraHeight();
        }
    });

    // 销毁
    onBeforeUnmount(() => {
        cloudBox.destroy();
        for (let key in skyboxs) {
            skyboxs[key].destroy();
        };
        viewer.scene.skyBox = defaultSkybox;
    });

    // 监听
    watch(() => state.earthShow, val => {
        viewer.scene.globe.show = val;
    });
    watch(() => state.shadows, val => {
        viewer.scene.shadows = val;
    });
    watch(() => state.sunShow, val => {
        viewer.scene.globe.enableLighting = val;
    });
    watch(() => state.timeline, val => {
        let timeline = document.getElementsByClassName(
            "cesium-viewer-timelineContainer"
        )[0];
        if (val) {
            timeline.style.visibility = "visible";
        } else {
            timeline.style.visibility = "hidden";
        }
    });
    watch(() => state.depthAgainst, val => {
        viewer.scene.globe.depthTestAgainstTerrain = val;
    });
    watch(() => state.atomsphereRender, val => {
        viewer.scene.skyAtmosphere.show = val;
    });
    watch(() => state.fogEffect, val => {
        viewer.scene.fog.enabled = val;
    });
    watch(() => state.surfaceTransparency, val => {
        viewer.scene.globe.globeAlpha = parseFloat(val);
    });
    watch(() => state.underground, val => {
        viewer.scene.undergroundMode = val;
    });
    watch(() => state.frameRate, val => {
        viewer.scene.debugShowFramesPerSecond = val;
    });
    watch(() => state.cloud, val => {
        if (val) {
            viewer.scene.cloudBox = cloudBox;
        } else {
            viewer.scene.cloudBox = null;
        }
    });
    watch(() => state.cloudsUrl, val => {
        viewer.scene.cloudBox.url = val;
    });
    watch(() => state.skyBox, val => {
        if (val) {
            let cameraHeight = viewer.scene.camera.positionCartographic.height;
            viewer.scene.postRender.addEventListener(watchCameraHeight);
            viewer.scene.skyBox = skyboxs[state.skyboxType];
            if (cameraHeight < 22e4) {
                viewer.scene.skyBox.show = true;
                state.atomsphereRender = false
            } else {
                state.atomsphereRender = true
            }
        } else {
            state.atomsphereRender = true;
            viewer.scene.skyBox.show = false;
            viewer.scene.skyBox = defaultSkybox;
            viewer.scene.postRender.removeEventListener(watchCameraHeight);
        }
    });
    watch(() => state.skyboxType, val => {
        if (state.skyBox) {
            skyboxs[val].show = true;
            viewer.scene.skyBox = skyboxs[val];
        }
    });
    watch(() => state.uspeed, val => {
        skyboxs[state.skyboxType].USpeed = Number(val);
        if (state.skyBox) {
            viewer.scene.skyBox.USpeed = Number(val);
        }
    });
    watch(() => state.vspeed, val => {
        skyboxs[state.skyboxType].VSpeed = Number(val);
        if (state.skyBox) {
            viewer.scene.skyBox.VSpeed = Number(val);
        }
    });
    watch(() => state.wspeed, val => {
        skyboxs[state.skyboxType].WSpeed = Number(val);
        if (state.skyBox) {
            viewer.scene.skyBox.WSpeed = Number(val);
        }
    });
    watch(() => state.viewMode, val => {
        if (val === "2D") {
            viewer.scene.mode = Cesium.SceneMode.SCENE2D;
        } else if (val === "3D") {
            viewer.scene.mode = Cesium.SceneMode.SCENE3D;
        } else {
            viewer.scene.mode = Cesium.SceneMode.COLUMBUS_VIEW;
        }
    });
    watch(() => state.rain, val => {
        viewer.scene.postProcessStages.rain.enabled = val;
    });
    watch(() => state.snow, val => {
        viewer.scene.postProcessStages.snow.enabled = val;
        console.log(viewer.scene.postProcessStages.snow.uniforms)
    });
    watch(() => state.rainAngle, val => {
        viewer.scene.postProcessStages.rain.uniforms.angle = parseFloat(val);
    });
    watch(() => state.rainSpeed, val => {
        viewer.scene.postProcessStages.rain.uniforms.speed = parseFloat(val)
    });
    watch(() => state.snowDesity, val => {
        viewer.scene.postProcessStages.snow.uniforms.density = parseFloat(val);
    });
    watch(() => state.snowSpeed, val => {
        viewer.scene.postProcessStages.snow.uniforms.speed = parseFloat(val);
    });
    watch(() => state.snowAngle, val => {
        viewer.scene.postProcessStages.snow.uniforms.angle = parseFloat(val);
    });
    watch(() => state.snowType, val => {
        switch (val) {
            case '0':
                state.snowDesity = 5;
                state.snowSpeed = 2;
                break;
            case '1':
                state.snowDesity = 10;
                state.snowSpeed = 4;
                break;
            case '2':
                state.snowDesity = 15;
                state.snowSpeed = 6;
                break;
            case '3':
                state.snowDesity = 20;
                state.snowSpeed = 10;
                break;
            default:
                state.snowDesity = 5;
                state.snowSpeed = 2;
                break;
        }
    });
    watch(() => state.isCompass, val => {
        if(val){
            state.compass = 'Sm3dCompass'
        }else{
            state.compass = ''
        }
        
    });
    

    return {
        ...toRefs(state),
    };
};

export default s3mlayerAttribute

