
class ParticleSystem {
    constructor() {
        this.emitterModelMatrix = new Cesium.Matrix4();
        this.translation = new Cesium.Cartesian3();
        this.rotation = new Cesium.Quaternion();
        this.hpr = new Cesium.HeadingPitchRoll();
        this.trs = new Cesium.TranslationRotationScale();
        this.gravityScratch = new Cesium.Cartesian3();
        this.state = null;
        this.particleSystem = null;
        this.gravity = 1;
        // 烟花
        this.fireWokes = [];
        this.emitterInitialLocation = new Cesium.Cartesian3(0.0, 0.0, 200.0);
        this.emitterModelMatrixScratch = new Cesium.Matrix4();
        this.applyGravity;
    }
    create(state, position, positions) {//模型位置/区域火位置
        if (Cesium.defaultValue(state)) {
            this.state = state;
            this.gravity = state.gravity;
            let applyGravity =(p, dt)=>{
                let position = p.position;
                Cesium.Cartesian3.normalize(position, this.gravityScratch);
                Cesium.Cartesian3.multiplyByScalar(this.gravityScratch, Number(this.gravity) * dt, this.gravityScratch);
                p.velocity = Cesium.Cartesian3.add(p.velocity, this.gravityScratch, p.velocity);
            }
            this.particleSystem = viewer.scene.primitives.add(
                new Cesium.ParticleSystem({
                    image: state.image,
                    startColor: Cesium.Color.fromCssColorString(state.startColor),
                    endColor: Cesium.Color.fromCssColorString(state.endColor),
                    startScale: Number(state.startScale),
                    endScale: Number(state.endScale),
                    minimumParticleLife: Number(state.particleLife[0]),
                    maximumParticleLife: Number(state.particleLife[1]),
                    minimumSpeed: Number(state.speed[0]),
                    maximumSpeed: Number(state.speed[1]),
                    imageSize: new Cesium.Cartesian2(Number(state.particleSize), Number(state.particleSize)),
                    emissionRate: Number(state.emissionRate),
                    lifetime: Number(state.lifetime),
                    //循环是否开启
                    loop: true,
                    //爆炸效果
                    bursts: state.bursts,
                    emitter: this.computeEmitter(state.emitter, positions),
                    // emitter: new Cesium.ConeEmitter(Cesium.Math.toRadians(60)),
                    // emitter:new Cesium.CircleEmitter(42, 35),
                    // emitter:new Cesium.CircleEmitter(2.0),
                    emitterModelMatrix: this.computeEmitterModelMatrix(undefined, undefined, position),
                    updateCallback: applyGravity,
                    sizeInMeters: true,
                    modelMatrix: this.computeModelMatrix(position)
                }))
            return this.particleSystem;
        }
    }

    get getState() {
        return this.state;
    };
    set setNewState(newState) {
        if (!Cesium.defaultValue(newState)) {
            return;
        }
        this.state = newState;
    }

  

    computeModelMatrix(position) {
        if (!position) return Cesium.Matrix4.IDENTITY;
        return Cesium.Transforms.eastNorthUpToFixedFrame(position, undefined, new Cesium.Matrix4())
        // return Cesium.Transforms.eastNorthUpToFixedFrame(Cesium.Cartesian3.fromDegrees(116.381828897766, 39.981967807373));
    }

    computeEmitterModelMatrix(HeadingPitchRoll, translation, position) {
        if (!position) return Cesium.Matrix4.IDENTITY;
        this.hpr = Cesium.HeadingPitchRoll.fromDegrees(0, 0, 0, this.hpr);
        this.trs.translation = Cesium.Cartesian3.fromElements(0, 0, 4, this.translation);
        if (HeadingPitchRoll)
            this.hpr = Cesium.HeadingPitchRoll.fromDegrees(HeadingPitchRoll.heading, HeadingPitchRoll.pitch, HeadingPitchRoll.roll, this.hpr);
        if (translation)
            this.trs.translation = Cesium.Cartesian3.fromElements(translation.x, translation.y, translation.z, this.translation);
        this.trs.rotation = Cesium.Quaternion.fromHeadingPitchRoll(this.hpr, this.rotation);
        console.log(this.hpr)
        return Cesium.Matrix4.fromTranslationRotationScale(this.trs, this.emitterModelMatrix);
    }
    computeEmitterModelMatrixByHpr(hpr, translation) {
        console.log(123)
        // hpr.roll = 0;
        // //调节粒子的发射方向
        // if (translation)
        //     this.trs.translation = Cesium.Cartesian3.fromElements(translation.x, translation.y, translation.z, this.translation);
        // this.trs.rotation = Cesium.Quaternion.fromHeadingPitchRoll(hpr, this.rotation);
        // return Cesium.Matrix4.fromTranslationRotationScale(this.trs, this.emitterModelMatrix);
        for (const key in hpr) {
            if (hpr[key] != 0) this.hpr[key] -= hpr[key];
        }
        this.trs.rotation = Cesium.Quaternion.fromHeadingPitchRoll(this.hpr, this.rotation);
        return Cesium.Matrix4.fromTranslationRotationScale(this.trs, this.emitterModelMatrix);
    }

    computeEmitter(emitterOptions, positions) {
        let emitter;
        let type = emitterOptions[0];
        let data = emitterOptions[1];
        switch (type) {
            case "CircleEmitter":
                emitter = new Cesium.CircleEmitter(...data);
                break;
            case "SphereEmitter":
                emitter = new Cesium.SphereEmitter(...data);
                break;
            case "ConeEmitter":
                emitter = new Cesium.ConeEmitter(Cesium.Math.toRadians(...data));
                break;
            case "BoxEmitter":
                emitter = new Cesium.BoxEmitter(new Cesium.Cartesian3(...data));
                break;
            case "PolygonEmitter":
                emitter = new Cesium.PolygonEmitter(positions);
                //关闭时，拉远看粒子数量不会减少
                // setTimeout(()=>this.particleSystem.lodRangeScale=100,1000)
                break;
            default: emitter = new Cesium.CircleEmitter(2.0);
                break;
        }
        return emitter
    }

    // function computeModelMatrix(entity, time) {
    //     var position = Cesium.Property.getValueOrUndefined(entity.position, time, new Cesium.Cartesian3());
    //     if (!Cesium.defined(position)) {
    //         return undefined;
    //     }
    //     var orientation = Cesium.Property.getValueOrUndefined(entity.orientation, time, new Cesium.Quaternion());
    //     if (!Cesium.defined(orientation)) {
    //         var modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(position, undefined, new Cesium.Matrix4());
    //     } else {
    //         modelMatrix = Cesium.Matrix4.fromRotationTranslation(Cesium.Matrix3.fromQuaternion(orientation, new Cesium.Matrix3()), position, new Cesium.Matrix4());
    //     }
    //     return modelMatrix;
    //  }


    clear() {
        if (!Cesium.defaultValue(this.particleSystem)) return;
        viewer.scene._primitives.remove(this.particleSystem);
    }

    createFirework(offset, color, bursts, centerPosition) {
        let position = Cesium.Cartesian3.add(this.emitterInitialLocation, offset, new Cesium.Cartesian3());
        let emitterModelMatrix = Cesium.Matrix4.fromTranslation(position, this.emitterModelMatrixScratch);
        function applyGravity(particle, dt) {
            let position = particle.position;
            let gravityVector = Cesium.Cartesian3.normalize(position, new Cesium.Cartesian3());
            Cesium.Cartesian3.multiplyByScalar(gravityVector, 1 * dt, gravityVector);
            particle.velocity = Cesium.Cartesian3.add(particle.velocity, gravityVector, particle.velocity);
        }
        let fireWoke = viewer.scene.primitives.add(new Cesium.ParticleSystem({
            // image: getImage(),
            image: 'public/img/particle/flaretrail6.png',
            startColor: color,
            endColor: color.withAlpha(0.0),
            // particleLife: 0.5,
            minimumParticleLife: 1,
            maximumParticleLife: 2,
            speed: 80.0,
            // minimumSpeed: 80,
            // maximumSpeed: 120,
            imageSize: new Cesium.Cartesian2(15, 15),
            emissionRate: 0,
            emitter: new Cesium.SphereEmitter(0.1),
            bursts: bursts,
            lifetime: 12,
            updateCallback: applyGravity,
            modelMatrix: this.computeModelMatrix(centerPosition),
            emitterModelMatrix: emitterModelMatrix
        }));
        this.fireWokes.push(fireWoke);
    }


    clearFireWoke() {
        this.fireWokes.forEach((fw) => { viewer.scene._primitives.remove(fw) });
        this.fireWokes.length = 0;
    }
}


export default ParticleSystem