

import particle from './particle-system.vue';

particle.install = function(app) {
  app.component(particle.name, particle);
};

export default particle;