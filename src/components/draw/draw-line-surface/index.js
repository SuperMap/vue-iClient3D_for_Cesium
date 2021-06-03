

import draw from './draw-line-surface.vue';
draw.install = function(app) {
  app.component(draw.name, draw);
};

export default draw;