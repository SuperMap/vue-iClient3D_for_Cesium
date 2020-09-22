module.exports = {
    base: '/webgl/examples/component/dist/',
    locales: {
        // 每个语言对象的键(key)，是语言的访问路径。
        // 然而，一种特例是将 '/' 作为默认语言的访问路径。
        '/': {
            lang: 'zh-CN',
            title: 'SuperMap/Vue-iClient3D-WebGL',
            description: 'SuperMap/Vue-iClient3D-WebGL'
        }
        // '/en/': {
        //   lang: 'en-US', // 这个值会被设置在 <html> 的 lang 属性上
        //   title: 'Vue-iClient3D-WebGL',
        //   description: 'Vue-iClient3D-WebGL'
        // }
    },
    dest: process.argv[5],
    title: 'vue components by supermap',
    description: 'vue components',
    themeConfig: {
        // logo: '/avatar.png',  // 左上角logo
        lastUpdated: '最后更新时间',
        // activeHeaderLinks: true,
        // repo: 'SuperMap/vue-iclient',
        locales: {
            '/': {
                label: '简体中文',
                selectText: '选择语言',
                nav: [{
                        text: '组件',
                        link: '/zh/api/'
                    },
                    {
                        text: '示例',
                        link: 'http://support.supermap.com.cn:8090/webgl/examples/component/examples.html#layer'
                    },

                ],
                sidebar: {
                    '/zh/api/': [{
                            title: '开发指南',
                            collapsable: false,
                            // children: ['guide/installation', 'guide/quick-start', 'guide/i18n', 'guide/custom-theme']
                            children: ['guide/installation', 'guide/quick-start']
                        },
                        {
                            title: '组件',
                            collapsable: false,
                            children: [{
                                    title: 'Viewer',
                                    collapsable: false,
                                    children: [
                                        'Viewer/viewer',
                                    ]
                                },
                                {
                                    title: '三维分析',
                                    collapsable: false,
                                    children: [
                                        '3DAnalysis/Measure',
                                        '3DAnalysis/ViewShed',
                                        '3DAnalysis/Profile3D',
                                        '3DAnalysis/ShadowQuery',
                                        '3DAnalysis/SightLine',
                                        '3DAnalysis/SkyLine',
                                        '3DAnalysis/OnLineAnalysis',
                                        '3DAnalysis/backLineAnalysis',
                                        '3DAnalysis/limitHeightAnalysis',
                                        '3DAnalysis/GeologicBodyAnalysis',
                                    ]
                                },
                                {
                                    title: '裁剪分析',
                                    collapsable: false,
                                    children: [
                                        'Clip/clipBox',
                                        'Clip/clipCross',
                                        'Clip/clipPlane',
                                        'Clip/clipPolygon',
                                        'Clip/clipBoxByEditor',
                                    ]
                                },
                                {
                                    title: '地形分析',
                                    collapsable: false,
                                    children: [
                                        'terrainAnalysis/terrainOperation',
                                        'terrainAnalysis/terrainFlood',
                                        'terrainAnalysis/terrainSlope',
                                        'terrainAnalysis/terrainIsoline',
                                    ]
                                }
                            ]
                        }
                    ]
                }
            },
            '/en/': {
                label: 'English',
                selectText: 'Languages'
            }
        }
    }
};