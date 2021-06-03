
import mvtlayer from './mvtlayer-style.vue';

mvtlayer.install = function(app) {
  app.component(mvtlayer.name, mvtlayer);
};

export default mvtlayer;