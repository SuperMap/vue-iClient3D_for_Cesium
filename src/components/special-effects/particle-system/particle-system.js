
// 引入依赖
import { watch, ref, reactive, toRefs, onBeforeUnmount, onMounted, onUpdated } from "vue";
import { storeState } from '../../../js/store/store.js'   //简单局部状态管理
import tool from '../../../js/tool/tool.js'        //提示等工具
import resource from '../../../js/local/lang.js'  //语言资源
import { initHandler, handlerDrawing, clearHandlerDrawing } from "../../../js/common/drawHandler.js"    //公共handler.js
import createTooltip from '../../../js/tool/tooltip2.js'
import ParticleSystem from './creat-particle-system.js'
import config from './config.js'

function particleSystem(props) {
    // 设置默认值数据
    let state = reactive({
        particles: [
            {
                id: 0,
                iconfont: "iconhuoyan",
                particleName: "火焰"
            },
            {
                id: 1,
                iconfont: "iconshui",
                particleName: "水"
            },
            {
                id: 2,
                iconfont: "iconyanhua",
                particleName: "烟花"
            },
          
        ],
        particleSelectedId: 0,
        flameTyle: '0',
        fountainTyle: '0',
        ringRadius: [30, 25],
        emissionRate: 50,
        particleSize: 2,
        particleLife: [1.5, 1.6],
        speed: [3.5, 4],
        startScale: 2.5,
        endScale: 1,
        gravity: 0,
        lifetime: 6,
        particleSystemType: "conical",
        image: 'public/img/particle/基础火焰.png',
        startColor: 'rgba(255, 255, 255, 0.3)',
        endColor: 'rgba(0, 0, 0, 0)',
        visibleModel: true,
        visibleParameter: false,
        emitter: ['ConeEmitter', [60]],
        bursts: []  //爆炸
    })

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
    let currentSelectedEntity, selectParticleSystem, s3mInstanceColc;
    let isAddParticleSystem = false;
    let entityParticlePairs = new Map(); // Entity和点光源对象的键值对
    let modelUrl = 'public/data/s3m/box.s3m';
    let modelEditor;
    let flowingFires = [];
    //烟花默认参数设置
    let fireWorkSystem;
    let numberOfFireworks = 18;
    let xMin = -600.0;
    let xMax = 600.0;
    let yMin = -600.0;
    let yMax = 600.0;
    let zMin = 0.0;
    let zMax = 200.0;
    let colorOptions = [{
        minimumRed: 0.95,
        green: 0.0,
        minimumBlue: 0.8,
        alpha: 1.0
    }, {
        red: 0.0,
        minimumGreen: 0.75,
        minimumBlue: 0.8,
        alpha: 1.0
    }, {
        red: 0.0,
        green: 0.0,
        minimumBlue: 0.8,
        alpha: 1.0
    }, {
        minimumRed: 0.9,
        minimumGreen: 0.9,
        blue: 0.0,
        alpha: 1.0
    }];




    if (storeState.isViewer) {
        if (!window.tooltip) {
            window.tooltip = createTooltip(viewer._element);
        }
        init()
    }
    //viewer 初始化完成的监听
    watch(() => storeState.isViewer, val => {
        if (val) {
            if (!window.tooltip) {
                window.tooltip = createTooltip(viewer._element);
            }
            init()
        }
    });

    function init() {
        s3mInstanceColc = new Cesium.S3MInstanceCollection(viewer.scene._context);
        viewer.scene.primitives.add(s3mInstanceColc);


    };

    // 火焰
    function addFlame(position) {
        let particleSystem = new ParticleSystem();
        particleSystem.create(state, position);
        addModel(position, particleSystem);
        selectParticleSystem = particleSystem;
        console.log(particleSystem)
    }
    //烟花
    function addFireWork(position) {
        // 参数场景默认
        setSceneForFireWork(true);
        fireWorkSystem = new ParticleSystem();
        for (let i = 0; i < numberOfFireworks; ++i) {
            let x = Cesium.Math.randomBetween(xMin, xMax);
            let y = Cesium.Math.randomBetween(yMin, yMax);
            let z = Cesium.Math.randomBetween(zMin, zMax);
            let offset = new Cesium.Cartesian3(x, y, z);
            let bursts = [];
            for (let j = 0; j < 3; ++j) {
                bursts.push(new Cesium.ParticleBurst({
                    time: Cesium.Math.nextRandomNumber() * 12,
                    minimum: 400,
                    maximum: 400
                }));
            }
            let color = Cesium.Color.fromRandom(colorOptions[i % colorOptions.length]);
            fireWorkSystem.createFirework(offset, color, bursts, position);
        }
        right_click_removeEvent()
    }

    function setSceneForFireWork(isFlage) {
        if (isFlage) {
            // scene.highDynamicRange = true;
            scene.globe.show = false;
            scene.sun.show = false;
            scene.globe.enableLighting = false;
            scene.particlePostRender.quality = 1.0;
            scene.bloomEffect.show = true;
            scene.bloomEffect.threshold = 0.8;
            scene.bloomEffect.bloomIntensity = 3.6;
            viewer.scene.skyAtmosphere.show = false;
            return;
        }
        // scene.highDynamicRange = false;
        scene.globe.show = true;
        scene.sun.show = true;
        scene.globe.enableLighting = true;
        scene.particlePostRender.quality = 0.25;
        scene.bloomEffect.show = false;
        scene.bloomEffect.threshold = 0;
        scene.bloomEffect.bloomIntensity = 1.34;
        viewer.scene.skyAtmosphere.show = true;
    }

    // 喷射火
    function addFJetFire() {
        if (!window.handlerPolyline) {
            initHandler("Polyline");
        }
        let particleSystem = new ParticleSystem();
        handlerDrawing("Polyline").then(
            res => {
                let handlerPolyline = window.handlerPolyline;
                handlerPolyline.polyline.show = false;
                window.polylineTransparent.show = false; //半透线隐藏
                handlerPolyline.deactivate();
                tooltip.setVisible(false);
                let positions = res.result.object.positions;
                particleSystem.create(state, positions[0]);
                selectParticleSystem = particleSystem;
                // let heading0 = tool.getAngleAndRadian(positions[0], positions[1]).radian;
                // heading0 = heading0 >= Cesium.Math.PI ? heading0 - Cesium.Math.PI : heading0 + Cesium.Math.PI;
                // let pitch0 = tool.getPitch(positions[0], positions[1]).radian;
                // pitch0 = pitch0<0?-pitch0:pitch0;
                // addModel(positions[0], selectParticleSystem,{ heading: heading0, pitch: 0, roll: pitch0 });
                addModel(positions[0], selectParticleSystem);
                let heading = tool.getAngleAndRadian(positions[0], positions[1]).angle;
                heading = (heading - 90) >= 0 ? (heading - 90) : heading + 270;
                let pitch = tool.getPitch(positions[0], positions[1]).angle - 90;
                console.log(heading, pitch)
                let hpr = { heading: heading, pitch: pitch, roll: 0 };
                let translation = { x: 0, y: 0, z: 2 }
                selectParticleSystem.particleSystem.emitterModelMatrix = selectParticleSystem.computeEmitterModelMatrix(hpr, translation, true);
            },
            (err) => {
                console.log(err);
            }
        );
        window.handlerPolyline.activate();
    }

    // 流淌火
    function addFlowingFire() {
        flowingFires.forEach((ps) => ps.clear());
        flowingFires.length = 0;
        if (!window.handlerPolygon) {
            initHandler("Polygon");
        }
        handlerDrawing("Polygon", false).then(
            res => {
                tooltip.setVisible(false);
                let handlerPolygon = window.handlerPolygon;
                handlerPolygon.polygon.show = false;
                handlerPolygon.polyline.show = false;
                handlerPolygon.deactivate();
                let particleSystem = new ParticleSystem();
                particleSystem.create(state, undefined, res.result.object.positions);
                selectParticleSystem = particleSystem;
                flowingFires.push(particleSystem);
            },
            err => {
                console.log(err);
            }
        );
        window.handlerPolygon.activate();
    }


    function click_addParticle(e) {
        if (isAddParticleSystem) {
            let centerPosition = viewer.scene.pickPosition(e.message.position);
            if (state.particleSelectedId === 0)
                addFlame(centerPosition);
            else if (state.particleSelectedId === 1)
                addFountain(centerPosition);
            else { addFireWork(centerPosition) }
        } else {
            let symbol = viewer.scene.pick(e.message.position) || viewer.selectedEntity;
            if (symbol && symbol.id && typeof (symbol.id) === 'string' && symbol.id.indexOf("particle-model-") != -1) {
                if (currentSelectedEntity && currentSelectedEntity.id === symbol.id.id) return;
                currentSelectedEntity = symbol;
                selectParticleSystem = entityParticlePairs.get(symbol.id);
                if (!modelEditor) addModelEditor(symbol.primitive)
                else modelEditor.setEditObject(symbol.primitive);
                return;
            }
            currentSelectedEntity = undefined;
            selectParticleSystem = undefined;
            if (modelEditor) modelEditor.deactivate();
        }
    }

    function right_click_removeEvent() {
        window.tooltip.setVisible(false);
        document.body.classList.remove("measureCur");
        // viewer.eventManager.removeEventListener("CLICK", click_addParticle);
        isAddParticleSystem = false;
        viewer.eventManager.removeEventListener("RIGHT_CLICK", right_click_removeEvent); //移除鼠标点击事件监听
    }


    function addParticle() {
        viewer.eventManager.addEventListener("CLICK", click_addParticle, true);
        viewer.eventManager.addEventListener("RIGHT_CLICK", right_click_removeEvent);
        if (state.particleSelectedId == 0 && state.flameTyle == '2') {
            window.tooltip.showAt(' <p>点击鼠标左键开始绘制两点</p><p>右键单击结束绘制</p>', '400px');
            isAddParticleSystem = false;
            addFJetFire();
            return;
        }
        if (state.particleSelectedId == 0 && state.flameTyle == '3') {
            window.tooltip.showAt(' <p>点击鼠标左键绘制区域</p><p>右键单击结束分析</p>', '400px');
            isAddParticleSystem = false;
            addFlowingFire();
            return;
        }
        if (state.particleSelectedId == 1 && state.fountainTyle == '1') {
            window.tooltip.showAt(' <p>点击鼠标左键开始绘制两点</p><p>右键单击结束绘制</p>', '400px');
            isAddParticleSystem = false;
            addFJetFire();
            return;
        }
        viewer.enableCursorStyle = false;
        viewer._element.style.cursor = "";
        document.body.classList.add("measureCur");
        isAddParticleSystem = true;
        if(state.particleSelectedId == 2){
            window.tooltip.showAt(' <p>点击鼠标左键确认烟花中心位置</p>', '400px');
            return;
        }
        window.tooltip.showAt(' <p>点击鼠标左键确认位置</p><p>右键单击结束分析</p><p>选中模型进行编辑</p> ', '400px');

        // if(state.particleSelectedId === 0)
        // addFlame();
    }

    function addModelEditor(model) {
        modelEditor = new Cesium.ModelEditor({
            model: model,
            scene: viewer.scene,
            axesShow: {
                "translation": true,
                "rotation": false,
                "scale": false
            }
        });
        modelEditor.activate();
        modelEditor.changedEvt.addEventListener((param) => {
            let Cartesian3 = new Cesium.Cartesian3();
            Cesium.Matrix4.getTranslation(param.modelMatrix, Cartesian3);
            if (Cartesian3 && selectParticleSystem) {
                selectParticleSystem.particleSystem.modelMatrix = selectParticleSystem.computeModelMatrix(Cartesian3);
                //旋转
                // var Matrix3 = new Cesium.Matrix3();
                // Cesium.Matrix4.getRotation(param.modelMatrix, Matrix3);
                // let quaternion = new Cesium.Quaternion();
                // Cesium.Quaternion.fromRotationMatrix(param.modelMatrix, quaternion);
                // let hpr = new Cesium.HeadingPitchRoll()
                // Cesium.HeadingPitchRoll.fromQuaternion(quaternion, hpr)
                // console.log(hpr)
                // if(hpr)
                selectParticleSystem.particleSystem.emitterModelMatrix = selectParticleSystem.computeEmitterModelMatrixByHpr(param.rotationAddtion)

            }
        })
    }
    function addModel(position, particleSystem, hpr) {
        let id = "particle-model-" + new Date().getTime();
        if (hpr) {
            s3mInstanceColc.add(modelUrl, {
                id: id,
                position: position,
                hpr: hpr
            });

        } else {
            s3mInstanceColc.add(modelUrl, {
                id: id,
                position: position,
                // scale: new Cesium.Cartesian3(6, 6, 6),
                // offset:new Cesium.Cartesian3(0, 0, -3),
            });
        }
        currentSelectedEntity = s3mInstanceColc.getInstance(modelUrl, id);
        entityParticlePairs.set(id, particleSystem);
    }

    function clear() {
        if (selectParticleSystem) selectParticleSystem.clear();
        if (fireWorkSystem) { fireWorkSystem.clearFireWoke(); setSceneForFireWork(false);fireWorkSystem = null };
        if (currentSelectedEntity) {
            entityParticlePairs.delete(currentSelectedEntity.id);
            s3mInstanceColc.removeInstance(modelUrl, currentSelectedEntity.id);
            currentSelectedEntity = null;
        }
        if (entityParticlePairs.size === 0) viewer.eventManager.removeEventListener("CLICK", click_addParticle);
        if (modelEditor) modelEditor.deactivate();
        isAddParticleSystem = false;
        selectParticleSystem = null;
        clearHandlerDrawing();
        viewer.enableCursorStyle = true;
        document.body.classList.remove("measureCur");
        tooltip.setVisible(false);
        clearHandlerDrawing('Polygon');
        flowingFires.forEach((ps) => ps.clear());
        flowingFires.length = 0;
    }

    // 水柱
    function addFountain(position) {
        let particleSystem = new ParticleSystem();
        particleSystem.create(state, position);
        addModel(position, particleSystem);
        selectParticleSystem = particleSystem;
        console.log(particleSystem)
    }

    // 监听

    watch(() => state.particleSelectedId, val => {
        selectParticleSystem = null;
        currentSelectedEntity= null;
        if (val === 2) {state.visibleParameter = false;}
        let particleParameter = {};
        if (val === 0) particleParameter = config[val].particleList[state.flameTyle];
        else if (val === 1) particleParameter = config[val].particleList[state.fountainTyle];
        for (const key in particleParameter) {
            if (state.hasOwnProperty(key)) {
                state[key] = particleParameter[key];
            }
        }
    });
    watch(() => state.flameTyle, val => {
        selectParticleSystem = null;
        currentSelectedEntity= null;
        if (modelEditor) modelEditor.deactivate();
        if (val == '4') state.bursts = [
            new Cesium.ParticleBurst({ time: 1.5, minimum: 80, maximum: 150 }),
            new Cesium.ParticleBurst({ time: 1.7, minimum: 150, maximum: 200 }),
        ];
        else state.bursts = [];
        let particleParameter = config[state.particleSelectedId].particleList[val];
        for (const key in particleParameter) {
            if (state.hasOwnProperty(key)) {
                state[key] = particleParameter[key];
            }
        }
    });
    watch(() => state.fountainTyle, val => {
        selectParticleSystem = null;
        currentSelectedEntity= null;
        if (modelEditor) modelEditor.deactivate();
        let particleParameter = config[state.particleSelectedId].particleList[val];
        for (const key in particleParameter) {
            if (state.hasOwnProperty(key)) {
                state[key] = particleParameter[key];
            }
        }
    });

    watch(() => state.emissionRate, val => {
        if (!selectParticleSystem) return;
        selectParticleSystem.particleSystem.emissionRate = Number(val);
    });
    watch(() => state.particleSize, val => {
        if (!selectParticleSystem) return;
        let particleSize = Number(val);
        selectParticleSystem.particleSystem.minimumImageSize.x = particleSize;
        selectParticleSystem.particleSystem.minimumImageSize.y = particleSize;
        selectParticleSystem.particleSystem.maximumImageSize.x = particleSize;
        selectParticleSystem.particleSystem.maximumImageSize.y = particleSize;
    });
    watch(() => state.particleLife, val => {
        if (!selectParticleSystem) return;
        selectParticleSystem.particleSystem.minimumParticleLife = Number(val[0]);
        selectParticleSystem.particleSystem.maximumParticleLife = Number(val[1]);
    });
    watch(() => state.speed, val => {
        if (!selectParticleSystem) return;
        selectParticleSystem.particleSystem.minimumSpeed = Number(val[0]);
        selectParticleSystem.particleSystem.maximumSpeed = Number(val[1]);
    });
    watch(() => state.startScale, val => {
        if (!selectParticleSystem) return;
        selectParticleSystem.particleSystem.startScale = Number(val);
    });
    watch(() => state.endScale, val => {
        if (!selectParticleSystem) return;
        selectParticleSystem.particleSystem.endScale = Number(val);
    });
    watch(() => state.particleSystemType, val => {
        if (!selectParticleSystem) return;
        switch (val) {
            case "circular":
                selectParticleSystem.particleSystem.emitter = new Cesium.CircleEmitter(2.0);
                break;
            case "spheroid":
                selectParticleSystem.particleSystem.emitter = new Cesium.SphereEmitter(2.5);
                break;
            case "conical":
                selectParticleSystem.particleSystem.emitter = new Cesium.ConeEmitter(Cesium.Math.toRadians(30.0));
                break;
            case "box":
                selectParticleSystem.particleSystem.emitter = new Cesium.BoxEmitter(new Cesium.Cartesian3(10.0, 10.0, 10.0));
                break;
            default:
                break;
        }
    });

    watch(() => state.image, val => {
        if (!selectParticleSystem) return;
        selectParticleSystem.particleSystem.image = val;
    });
    watch(() => state.startColor, val => {
        if (!selectParticleSystem) return;
        selectParticleSystem.particleSystem.startColor = Cesium.Color.fromCssColorString(val)
    });
    watch(() => state.endColor, val => {
        if (!selectParticleSystem) return;
        selectParticleSystem.particleSystem.endColor = Cesium.Color.fromCssColorString(val)
    });
    watch(() => state.visibleModel, val => {
        s3mInstanceColc.visible = val
        if (modelEditor) modelEditor.deactivate();
    })
    watch(() => state.ringRadius, val => {
        if (!selectParticleSystem) return;
        selectParticleSystem.particleSystem.emitter = new Cesium.CircleEmitter(val[1], val[0]);
        if (state.emitter[0] === 'CircleEmitter')
            state.emitter[1] = val;
    })
    watch(() => state.lifetime, val => {
        if (!selectParticleSystem) return;
        selectParticleSystem.particleSystem.lifetime = Number(val);
    })

    watch(() => state.gravity, val => {
        if (!selectParticleSystem) return;
        selectParticleSystem.gravity = (Number(val));
    })






    // 销毁
    onBeforeUnmount(() => {

    });


    return {
        ...toRefs(state),
        addParticle,
        clear
    };
};

export default particleSystem

