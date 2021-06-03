
import light from './light.vue';
light.install = function(app) {
  app.component(light.name, light);
};

export default light;