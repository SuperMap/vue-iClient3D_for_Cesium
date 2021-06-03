import splitScreen from './split-screen.vue';

splitScreen.install = function(app) {
  app.component(splitScreen.name, splitScreen);
};

export default splitScreen;