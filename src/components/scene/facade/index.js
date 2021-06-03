
import facade from './facade.vue';

facade.install = function(app) {
  app.component(facade.name, facade);
};

export default facade;