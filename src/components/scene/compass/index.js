

import compass from './compass.vue';

compass.install = function(app) {
  app.component(compass.name, compass);
};

export default compass;