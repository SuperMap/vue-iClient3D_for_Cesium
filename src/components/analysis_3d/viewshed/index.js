import viewshed from './viewshed.vue';

viewshed.install = function(app) {
  app.component(viewshed.name, viewshed);
};

export default viewshed;
