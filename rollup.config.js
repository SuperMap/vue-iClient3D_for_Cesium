import babel from 'rollup-plugin-babel';  //转化es6语法
import { terser } from "rollup-plugin-terser";  //压缩
import vue from "rollup-plugin-vue";  //.vue文件
import scss from 'rollup-plugin-scss' // plugin-scss将scss结尾的变为js
import dartSass from 'sass'; // 用于支持插件
import image from '@rollup/plugin-image'; //图片
import alias from 'rollup-plugin-alias'; //别名
const { resolve } = require('path')




export default [
    //工程范例打包
    {
        input: 'examples/src/index.js',
        output: {
            file: 'examples/dist/index.js',
            globals: {
                vue: 'Vue', // 仓库实际依赖vue, vue是不需要打包的，这里说明用了一个全局变量vue
            },
            format: 'umd'
        },
        plugins: [
            scss({ include: /\.scss$/, sass: dartSass }), // 对所有样式文件进行编译
            vue(),
            babel({ exclude: 'node_modules/**' }),// 防止打包node_modules下的文件}
            terser(),
            alias({
                resolve: ['.jsx', '.js'],
                entries: {
                    'public': resolve(__dirname, 'public'),
                    '@': resolve(__dirname, 'src'),
                    'config': resolve(__dirname, 'examples/src/config')
                }
            }),
            // font({
            //     "svg":"./examples/img/svg/logo.svg",
            //     "outDir":"examples/dist/fonts"
            // }),
        ]
    },
    {
        input: 'src/components/components.js',
        output: {
            globals: {
                vue: 'Vue' // 仓库实际依赖vue, vue是不需要打包的，这里说明用了一个全局变量vue
            },
            file: 'examples/dist/components.js',
            name: 'vue-webgl',
            format: 'umd'
        },
        plugins: [
            scss({ include: /\.scss$/, sass: dartSass }), // 对所有样式文件进行编译
            vue(),
            babel(),
            image(),
            terser()
        ]
    },
    /*组件完整包*/
    {
        input: 'src/components/components.js',
        output: {
            file: 'lib/index.js',

        },
        plugins: [
            // scss({ include: /\.scss$/, sass: dartSass }), // 对所有样式文件进行编译
            vue(),
            terser(),
            image()
        ]
    },
    {
        input: 'src/components/components.js',
        output: {
            globals: {
                vue: 'Vue' // 仓库实际依赖vue, vue是不需要打包的，这里说明用了一个全局变量vue
            },
            file: 'lib/index.min.js',
            name: 'vue-webgl',
            format: 'umd'
        },
        plugins: [
            scss({ include: /\.scss$/, sass: dartSass }), // 对所有样式文件进行编译
            vue(),
            babel(),
            image(),
            terser()
        ]
    },

  // 实现组件逻辑js库
    {
        input: 'src/js/index.js',
        output: {
            file: 'lib/index_basis.js',
        },
        plugins: [
            babel(),
            terser()
        ]
    },
    {
        input: 'src/js/index.js',
        output: {
            globals: {
                vue: 'Vue' // 仓库实际依赖vue, vue是不需要打包的，这里说明用了一个全局变量vue
            },
            file: 'lib/index_basis.min.js',
            name: 'vue-webgl-basis',
            format: 'umd',
            // sourcemap: true,
            // sourcemapFile: 'traceKit.min.js.map',
        },
        plugins: [
            babel(),
            terser(),
        ]
    },

    // lib 按需加载
    lang('resourceCN','src/resource/resourceCN.js'),
    // lang('resourceEN','src/resource/resourceEN.js'),
    // lang('resourceJA','src/resource/resourceJA.js'),

    liblist('initDrag', 'src/js/drag/drag.js'),
    liblist('viewer', 'src/components/viewer/index.js'),
    liblist('terrain-slope', 'src/components/terrain-analysis/terrain-slope/index.js'),
    liblist('terrain-isoline', 'src/components/terrain-analysis/terrain-isoline/index.js'),
    liblist('terrain-operation', 'src/components/terrain-analysis/terrain-operation/index.js'),
    liblist('terrain-flood', 'src/components/terrain-analysis/terrain-flood/index.js'),
    liblist('clip-box-editor', 'src/components/clip/clip-box-editor/index.js'),
    liblist('clip-cross', 'src/components/clip/clip-cross/index.js'),
    liblist('clip-plane', 'src/components/clip/clip-plane-new/index.js'),
    liblist('clip-polygon', 'src/components/clip/clip-polygon/index.js'),
    liblist('measure', 'src/components/analysis_3d/measure/index.js'),
    liblist('openness', 'src/components/analysis_3d/openness/index.js'),
    liblist('profile', 'src/components/analysis_3d/profile/index.js'),
    liblist('shadow-query', 'src/components/analysis_3d/shadow-query/index.js'),
    liblist('sight-line', 'src/components/analysis_3d/sight-line/index.js'),
    liblist('sky-line', 'src/components/analysis_3d/sky-line/index.js'),
    liblist('viewshed', 'src/components/analysis_3d/viewshed/index.js'),
    liblist('spatial-query3d', 'src/components/space-search/spatial-query3d/index.js'),

    liblist('split-screen', 'src/components/scene/split-screen/index.js'),
    liblist('roller', 'src/components/scene/roller/index.js'),
    liblist('custom-service', 'src/components/layer/custom-service/index.js'),
    liblist('layer-manage', 'src/components/layer/layer-manage/index.js'),
    liblist('mvtlayer-style', 'src/components/layer/mvtlayer-style/index.js'),
    liblist('s3mlayer-attribute', 'src/components/layer/s3mlayer-attribute/index.js'),
    liblist('s3mlayer-style', 'src/components/layer/s3mlayer-style/index.js'),
    liblist('s3mlayer-operation', 'src/components/layer/s3mlayer-operation/index.js'),

    liblist('model-flood', 'src/components/layer/model-flood/index.js'),
    liblist('oblique-photography', 'src/components/layer/oblique-photography/index.js'),
    liblist('imglayer-attribute', 'src/components/layer/imglayer-attribute/index.js'),
    liblist('scene-attribute', 'src/components/scene/scene-attribute/index.js'),
    liblist('facade', 'src/components/scene/facade/index.js'),
    liblist('compass', 'src/components/scene/compass/index.js'),
    liblist('fly-route', 'src/components/fly/fly-route/index.js'),
    liblist('pbr-material', 'src/components/layer/pbr-material/index.js'),

    liblist('draw-line-surface', 'src/components/draw/draw-line-surface/index.js'),
    liblist('add-point-symbol', 'src/components/draw/add-point-symbol/index.js'),
    liblist('light', 'src/components/scene/light/index.js'),
    liblist('projection-image', 'src/components/scene/projection-image/index.js'),
    liblist('scan-effect', 'src/components/special-effects/scan-effect/index.js'),
    liblist('geological-body', 'src/components/model/geological-body/index.js'),
    liblist('volume-render', 'src/components/scene/volume-render/index.js'),
    liblist('particle-system', 'src/components/special-effects/particle-system/index.js'),
 
];


function liblist(libName, libSrc, type) {  //打包lib按需加载js库
    let format = 'es';
    if (type) {
        format = type
    }
    return {
        input: libSrc,
        output: {
            file: `lib/${libName}.js`,
            format: format
        },
        plugins: [
            scss({ include: /\.scss$/, sass: dartSass }), // 对所有样式文件进行编译
            vue(),
            babel(),
            image(),
            terser()
        ]
    }
};
function lang(Name, libSrc) {  //打包语言库
    return {
        input: libSrc,
        output: {
            file: `lib/lang/${Name}.js`
        },
        plugins: [
            babel(),
            terser()
        ]
    }
};