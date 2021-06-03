
import projection from './projection-image.vue';
projection.install = function(app) {
  app.component(projection.name, projection);
};

export default projection;