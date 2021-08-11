

import clipPlane from './clip-plane-new.vue';

clipPlane.install = function(app) {
  app.component(clipPlane.name, clipPlane);
};

export default clipPlane;