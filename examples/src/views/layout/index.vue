<template>
  <div style="width:100%;height:100%">
    <layout-header></layout-header>
    <layout-aside></layout-aside>
  </div>
</template>

<script>
import LayoutHeader from "./header.vue";
import LayoutAside from "./aside.vue";
export default {
  name: "layout",
    components: {
      LayoutHeader,
      LayoutAside
  },
  // mounted() {}
};
</script>



