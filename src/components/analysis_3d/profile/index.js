import profile from './profile.vue';

profile.install = function(app) {
  app.component(profile.name, profile);
};

export default profile;
