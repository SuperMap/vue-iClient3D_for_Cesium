export default [
    {
        id: "Analysis_3d",
        icon: "iconfont iconsanweifenxi",  //图标
        name: "三维分析",
        children: [
            {
                component: "Sm3dMeasure",  //组件名称
                imgSrc: "public/img/componentsImg/measureHandler.png",  
                name: "量算"
            },
            {
                component: "Sm3dShadowQuery",
                imgSrc: "public/img/componentsImg/shadowQuery.png", 
                name: "阴影分析"
            },
            {
                component: "Sm3dSkyline",
                imgSrc: "public/img/componentsImg/skyline.png", 
                name: "天际线分析"
            },
            {
                component: "Sm3dSightline",
                imgSrc: "public/img/componentsImg/sightline.png", 
                name: "通视分析"
            },
            {
                component: "Sm3dProfile",
                imgSrc: "public/img/componentsImg/profile.png", 
                name: "剖面分析"
            },
            {
                component: "Sm3dViewshed",
                imgSrc: "public/img/componentsImg/viewshed.png", 
                name: "可视域分析"
            },
            {
                component: "Sm3dOpennessAnalysis",
                imgSrc: "public/img/componentsImg/opennessAnalysis.png", 
                name: "开敞度分析"
            },
            {
                component: "Sm3dSpatialQuery3d",
                imgSrc: "public/img/componentsImg/spatialQuery3D.png", 
                name: "三维空间查询"
            }
          
        ]
    },
    {
        id: "terrainAnalysis",
        icon: "iconfont icondixing",  //图标
        name: "地形分析",
        children: [
            {
                component: "Sm3dTerrainOperation",  //组件名称
                imgSrc: "public/img/componentsImg/modifyTerrain.png",  
                name: "地形操作"
            },
            {
                component: "Sm3dTerrainFlood",
                imgSrc: "public/img/componentsImg/floodex.png",
                name: "淹没分析"
            },
            {
                component: "Sm3dTerrainSlope",
                imgSrc: "public/img/componentsImg/terrainSlopeAnalysis.png",
                name: "坡度坡向分析"
            },
            {
                component: "Sm3dTerrainIsoline",
                imgSrc: "public/img/componentsImg/Isoline.png",
                name: "等值线分析"
            }
        ]
    },
    {
        id: "clipAnalysis",
        icon: "iconfont iconcaijian",  //图标
        name: "裁剪分析",
        children: [
            // {
            //     component: "Sm3dClipBox",  //组件名称
            //     imgSrc: "public/img/componentsImg/clip.png",  
            //     name: "box裁剪"
            // },
            {
                component: "Sm3dClipBoxByeditor",
                imgSrc: "public/img/componentsImg/clipboxByEdito.png",
                name: "Box裁剪"
            },
            {
                component: "Sm3dClipPlane",
                imgSrc: "public/img/componentsImg/clip.png",
                name: "平面裁剪"
            },
            {
                component: "Sm3dClipCross",
                imgSrc: "public/img/componentsImg/clipCross.png",
                name: "cross裁剪"
            },
            {
                component: "Sm3dClipPolygon",
                imgSrc: "public/img/componentsImg/clipPolygon.png",
                name: "多边形裁剪"
            }
        ]
    },
    {
        id: "layer",
        icon: "iconfont icontuceng",  //图标
        name: "图层",
        children: [
            {
                component: "Sm3dS3mlayerAttribute",  //组件名称
                imgSrc: "public/img/componentsImg/s3mlayerAttribute.png",  
                name: "S3M图层属性设置"
            },
            {
                component: "Sm3dS3mlayerStyle",
                imgSrc: "public/img/componentsImg/s3mlayerStyle.png",
                name: "S3M图层风格设置"
            },
            {
                component: "Sm3dS3mlayerOperation",
                imgSrc: "public/img/componentsImg/s3mlayerOperation.png",
                name: "S3M图层操作"
            },
            {
                component: "Sm3dLayerManage",
                imgSrc: "public/img/componentsImg/layerManage.png",
                name: "图层管理"
            },
            {
                component: "Sm3dImglayerAttribute",
                imgSrc: "public/img/componentsImg/imglayerAttribute.png",
                name: "影像图层属性设置"
            },
            {
                component: "Sm3dObliquePhotography",
                imgSrc: "public/img/componentsImg/photography.png",
                name: "倾斜摄影模型操作"
            },
            {
                component: "Sm3dMvtlayerStyle",
                imgSrc: "public/img/componentsImg/mvt.png",
                name: "MVT矢量瓦片"
            },
            {
                component: "Sm3dAddPbr",
                imgSrc: "public/img/componentsImg/pbr.png",
                name: "PBR"
            }
        ]
    },
    {
        id: "scene",
        icon: "iconfont iconchangjing",  //图标
        name: "场景",
        children: [
            {
                component: "Sm3dSplitScreen",  //组件名称
                imgSrc: "public/img/componentsImg/splitScreen.png",  
                name: "分屏"
            },
            {
                component: "Sm3dRoller",
                imgSrc: "public/img/componentsImg/roller.png",
                name: "卷帘"
            },
            // {
            //     component: "Sm3dFacade",
            //     imgSrc: "public/img/componentsImg/facade.png",
            //     name: "生成立面图"
            // },
            {
                component: "Sm3dSceneAttribute",
                imgSrc: "public/img/componentsImg/sceneAttribute.png",
                name: "场景属性设置"
            },
            // {
            //     component: "Sm3dCompass",
            //     imgSrc: "public/img/componentsImg/clipCross.png",
            //     name: "罗盘"
            // },
            {
                component: "Sm3dLight",
                imgSrc: "public/img/componentsImg/add-light.png",
                name: "灯光"
            },
            {
                component: "Sm3dFlyRoute",
                imgSrc: "public/img/componentsImg/fly-route.png",
                name: "沿线飞行"
            },
            {
                component: "Sm3dProjectionImage",
                imgSrc: "public/img/componentsImg/projector.png",
                name: "视频投放"
            },
            {
                component: "Sm3dVolumeRender",
                imgSrc: "public/img/componentsImg/volume.png",
                name: "带时序的体元栅格的可视化表达",
            },
        ]
    },
    {
        id: "draw",
        icon: "iconfont iconhuizhi",  //图标
        name: "绘制",
        children: [
            {
                component: "Sm3dDrawLinePolygon",  //组件名称
                imgSrc: "public/img/componentsImg/draw-line-surface.png",  
                name: "绘制线面"
            },
            {
                component: "Sm3dPointSymbol",  //组件名称
                imgSrc: "public/img/componentsImg/add-sysmble.png",  
                name: "添加点符号"
            },
        ]
    },
    {
        id: "special",
        icon: "iconfont icontexiao1",  //图标
        name: "特效",
        children: [
            {
                component: "Sm3dScanEffect",  //组件名称
                imgSrc: "public/img/componentsImg/scan.png",  
                name: "扫描线"
            },
            {
                component: "Sm3dParticleSystem",  //组件名称
                imgSrc: "public/img/componentsImg/particle.png",  
                name: "粒子"
            },
            
        ]
    },
    {
        id: "model",
        icon: "iconfont iconmoxing",  //图标
        name: "模型",
        children: [
            {
                component: "Sm3dGeologicalBody",  //组件名称
                imgSrc: "public/img/componentsImg/geological.png",  
                name: "地质体",
                destroy:true   //不使用就立即销毁
            },
        ]
    }
]
