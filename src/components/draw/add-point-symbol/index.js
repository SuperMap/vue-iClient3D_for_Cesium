
import symbole from './add-point-symbol.vue';
symbole.install = function(app) {
  app.component(symbole.name, symbole);
};

export default symbole;