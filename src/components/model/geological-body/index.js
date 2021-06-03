
import geological from './geological-body.vue';

geological.install = function(app) {
  app.component(geological.name, geological);
};

export default geological;
