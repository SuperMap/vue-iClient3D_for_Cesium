import clipPlane from './clip-plane.vue';

clipPlane.install = function(app) {
  app.component(clipPlane.name, clipPlane);
};

export default clipPlane;
