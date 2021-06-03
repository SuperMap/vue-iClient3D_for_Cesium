

import flyRoute from './fly-route.vue';

flyRoute.install = function(app) {
  app.component(flyRoute.name, flyRoute);
};

export default flyRoute;