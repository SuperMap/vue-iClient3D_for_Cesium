import layerAttribute from './imglayer-attribute.vue';

layerAttribute.install = function(app) {
  app.component(layerAttribute.name, layerAttribute);
};

export default layerAttribute;