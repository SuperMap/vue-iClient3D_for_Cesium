
import pbr from './pbr-material.vue';

pbr.install = function(app) {
  app.component(pbr.name, pbr);
};

export default pbr;