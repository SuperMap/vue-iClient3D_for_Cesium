import clipPolygon from './clip-polygon.vue';

clipPolygon.install = function(app) {
  app.component(clipPolygon.name, clipPolygon);
};

export default clipPolygon;
