import skyLine from './sky-line.vue';

skyLine.install = function(app) {
  app.component(skyLine.name, skyLine);
};

export default skyLine;
