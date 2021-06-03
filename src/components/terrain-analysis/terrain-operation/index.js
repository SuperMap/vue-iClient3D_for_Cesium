import terrainOperation from './terrain-operation.vue';

terrainOperation.install = function(app) {
  app.component(terrainOperation.name, terrainOperation);
};

export default terrainOperation;