

import operation from './s3mlayer-operation.vue';

operation.install = function(app) {
  app.component(operation.name, operation);
};

export default operation;
