import layerStyle from './s3mlayer-style.vue';

layerStyle.install = function(app) {
  app.component(layerStyle.name, layerStyle);
};

export default layerStyle;