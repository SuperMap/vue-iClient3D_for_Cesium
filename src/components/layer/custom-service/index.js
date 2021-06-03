import customService from './custom-service.vue';

customService.install = function(app) {
  app.component(customService.name, customService);
};

export default customService;
