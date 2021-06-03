export default [
    {
        id: "webServe",
        name: "公共服务",
        children: [
            // layers:删除图层配置
            // style：图层风格配置
            {
                type: "REALSPACE",
                thumbnail: "public/img/webServeImg/CBD.png",
                proxiedUrl: 'http://www.supermapol.com/realspace/services/3D-CBD/rest/realspace',
                name: "CBD",
                layers: [{ type: 'S3M', layerName: 'Building@CBD' }, { type: 'S3M', layerName: 'Tree@CBD' }, { type: 'S3M', layerName: 'Xiaopin@CBD' },{ type: 'S3M', layerName: 'Lake@CBD' }, { type: 'S3M', layerName: 'Ground@CBD' }, { type: 'S3M', layerName: 'Ground2@CBD' }, { type: 'S3M', layerName: 'Bridge@CBD' }],
                state: 0
            },
            {
                type: "REALSPACE",
                thumbnail: "public/img/webServeImg/铁岭.png",
                proxiedUrl: "http://www.supermapol.com/realspace/services/3D-QingXieSheYingMoXing/rest/realspace",
                name: "倾斜摄影模型",
                layers: [{ type: 'S3M', layerName: 'qingxie' }],
                state: 0
            },
            {
                type: "REALSPACE",
                thumbnail: "public/img/webServeImg/白模.png",
                proxiedUrl: 'http://www.supermapol.com/realspace/services/3D-CQmodel_wireframe_2000/rest/realspace',
                name: "白模",
                layers: [{ type: 'S3M', layerName: 'CQmodel' }],
                style: { fillStyle: 'Fill_And_WireFrame' },  
                state: 0
            },
            {
                type: "REALSPACE",
                thumbnail: "public/img/webServeImg/BIM.png",
                proxiedUrl: "http://www.supermapol.com/realspace/services/3D-wireFrame/rest/realspace",
                name: "BIM建筑",
                layers: [{ type: 'S3M', layerName: "wireFrame" }],
                state: 0
            },
            // {
            //     type: "REALSPACE",
            //     thumbnail: "public/img/webServeImg/四姑娘山.png",
            //     proxiedUrl: 'http://www.supermapol.com/realspace/services/3D-dixingyingxiang/rest/realspace',
            //     name: "四姑娘山",
            //     layers: [{ type: 'TERRAIN', layerName: 'DatasetDEM' }, { type: 'IMG', layerName: 'MosaicResult' }],
            //     state: 0
            // },
            {
                type: "REALSPACE",
                thumbnail: "public/img/webServeImg/珠峰.png",
                proxiedUrl: "https://www.supermapol.com/realspace/services/3D-ZF_normal/rest/realspace",
                name: "珠峰地形影像",
                layers: [{ type: 'IMG', layerName: 'image' }, { type: 'TERRAIN', layerName: 'srtm_54_07%40zhufeng' }],
                state: 0
            },
            {
                type: "REALSPACE",
                thumbnail: "public/img/webServeImg/点云.png",
                proxiedUrl: "https://www.supermapol.com/realspace/services/3D-cloud/rest/realspace",
                name: "点云",
                layers: [{ type: 'S3M', layerName: 'POINTCLOUD23' }],
                state: 0
            },
            {
                type: "MVT",
                thumbnail: "public/img/webServeImg/MVT.jpg",
                proxiedUrl: "http://www.supermapol.com/realspace/services/map-mvt-JingJinDiQuDiTu/restjsr/v1/vectortile/maps/%E4%BA%AC%E6%B4%A5%E5%9C%B0%E5%8C%BA%E5%9C%B0%E5%9B%BE",
                name: "京津地区MVT",
                layers: [{ type: 'MVT', layerName: '京津地区MVT' }],
                state: 0
            },
        ]
    },
    {
        id: "baseLayer",
        name: "在线底图",
        children: [
            {
                proxiedUrl: "public/img/baseLayer/baseImage.png",
                name: "本地图片",
                thumbnail: "public/img/baseLayer/image.png",
                title: 'Image',
                type: 'IMAGE',
                state: 0
            },
            {
                proxiedUrl: '//dev.virtualearth.net',
                name: 'BingMap',
                thumbnail: 'public/img/baseLayer/Bing.png',
                title: 'BingMap',
                type: 'BINGMAP',
                state: 1
            },
            {
                proxiedUrl: 'https://[subdomain].tianditu.gov.cn/img_w/wmts',
                name: '天地图',
                thumbnail: 'public/img/baseLayer/tianditu.png',
                title: '天地图',
                type: 'TIANDITU',
                state: 0
            },
            {
                proxiedUrl: 'https://a.tile.openstreetmap.org/',
                name: 'Open Street Map',
                thumbnail: 'public/img/baseLayer/OSM.png',
                title: 'Open Street Map',
                type: 'OSM',
                state: 0
                // serviceType : Resource.osmServiceType
            },
            // {
            //     proxiedUrl : 'https://www.supermapol.com/iserver/services/map_China/rest/maps/China_Dark',
            //     name : 'SuperMap China_Dark Map',
            //     thumbnail : 'public/img/baseLayer/SuperMapDark.png',
            //     title : 'SuperMap China_Dark Map',
            //     type : 'SUPERMAPDARK',
            //     state: 0
            // },
            {
                proxiedUrl: 'https://www.supermapol.com/iserver/services/map_China/rest/maps/China_Light',
                name: 'Grid Image Map',
                thumbnail: 'public/img/baseLayer/grad.png',
                title: 'Grid Image Map',
                type: 'GRIDIMAGERY',
                state: 0
            },
            // {
            //     proxiedUrl : 'https://www.supermapol.com/iserver/services/map_China/rest/maps/China_Light',
            //     name : 'SuperMap China_Light Map',
            //     thumbnail : 'public/img/baseLayer/SuperMapLight.png',
            //     title : 'SuperMap China_Light Map',
            //     type : 'SUPERMAPLIGHT',
            //     state: 0
            // }

        ]
    },
    {
        id: "onlineTerrain",
        name: "在线地形",
        children: [
            {
                proxiedUrl: 'https://maptiles.supermapol.com/iserver/services/3D-local3DCache-GlobalTIN30M/rest/realspace/datas/Global_TIN_30M',
                name: 'SuperMapOnline 地形',
                thumbnail: 'public/img/baseLayer/SuperMapOnline.png',
                title: 'Online地形',
                type: 'supermapOnlineTerrain',
                state: 0
            },
            {
                proxiedUrl: '',
                name: '天地图地形',
                thumbnail: 'public/img/baseLayer/天地图地形.png',
                title: '天地图地形',
                type: 'tianDiTuTerrain',
                state: 0
            },
            {
                proxiedUrl: "https://www.supermapol.com/realspace/services/3D-stk_terrain/rest/realspace/datas/info/data/path",
                name: 'STK地形',
                thumbnail: 'public/img/baseLayer/STK地形.png',
                title: 'STK地形',
                type: 'STKTerrain',
                state: 0
            }

        ]
    }
]





