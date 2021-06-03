import terrainFlood from './terrain-flood.vue';

terrainFlood.install = function(app) {
  app.component(terrainFlood.name, terrainFlood);
};

export default terrainFlood;