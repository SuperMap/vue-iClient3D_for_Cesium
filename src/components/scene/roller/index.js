import roller from './roller.vue';

roller.install = function(app) {
  app.component(roller.name, roller);
};

export default roller;