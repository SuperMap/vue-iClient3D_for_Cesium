
import flood from './model-flood.vue';

flood.install = function(app) {
  app.component(flood.name, flood);
};

export default flood;
