<template>
  <layout></layout>
</template>

<script>
// 引入组件逻辑实现js库
import { defineAsyncComponent } from "vue";
import layout from "./views/layout/index.vue";
export default {
  components: {
    layout
      // layout: defineAsyncComponent(() => import("./views/layout/index.vue"))
  },

  data() {
    return {};
  },
  mounted(){
  }
};
</script>


