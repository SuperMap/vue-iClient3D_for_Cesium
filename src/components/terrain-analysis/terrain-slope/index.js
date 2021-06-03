import terrainSlope from './terrain-slope.vue'

terrainSlope.install = function(app) {
  app.component(terrainSlope.name, terrainSlope);
};

export default terrainSlope;
