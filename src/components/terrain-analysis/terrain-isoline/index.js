import terrainIsoline from './terrain-isoline.vue';

terrainIsoline.install = function(app) {
  app.component(terrainIsoline.name, terrainIsoline);
};

export default terrainIsoline;