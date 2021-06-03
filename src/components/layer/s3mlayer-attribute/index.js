import layerAttribute from './s3mlayer-attribute.vue';

layerAttribute.install = function(app) {
  app.component(layerAttribute.name, layerAttribute);
};

export default layerAttribute;