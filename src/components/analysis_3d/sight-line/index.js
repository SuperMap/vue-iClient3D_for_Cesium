import sightLine from './sight-line.vue';

sightLine.install = function(app) {
  app.component(sightLine.name, sightLine);
};

export default sightLine;

