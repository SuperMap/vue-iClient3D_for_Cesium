import clipBoxEditor from './clip-box-editor.vue';

clipBoxEditor.install = function(app) {
  app.component(clipBoxEditor.name, clipBoxEditor);
};

export default clipBoxEditor;
