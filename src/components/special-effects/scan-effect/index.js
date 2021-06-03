


import effect from './scan-effect.vue';

effect.install = function(app) {
  app.component(effect.name, effect);
};

export default effect;