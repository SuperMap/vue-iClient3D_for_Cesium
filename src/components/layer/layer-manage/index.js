import layerManagement from './layer-manage.vue';

layerManagement.install = function(app) {
  app.component(layerManagement.name, layerManagement);
};

export default layerManagement;