import attribute from './scene-attribute.vue';

attribute.install = function(app) {
  app.component(attribute.name, attribute);
};

export default attribute;