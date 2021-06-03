
import photography from './oblique-photography.vue';

photography.install = function(app) {
  app.component(photography.name, photography);
};

export default photography;
