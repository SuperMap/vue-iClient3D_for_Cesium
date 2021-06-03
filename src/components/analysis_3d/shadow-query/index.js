import shadowQuery from './shadow-query.vue';

shadowQuery.install = function(app) {
  app.component(shadowQuery.name, shadowQuery);
};

export default shadowQuery;
