<template>
  <div class="sm-component-iframe">
    <loading-bar></loading-bar>
    <iframe :src="src" scrolling="auto" id="ifrm"></iframe>
  </div>
</template>

<script>
import Vue from "vue";
import LoadingBar from "./loading.vue";
export default {
  name: "SmIframe",
  props: {
    src: {
      type: String
    }
  },
  components: {
    LoadingBar
  },
  mounted() {
    var oFrm = document.getElementById("ifrm");
    oFrm.onload = oFrm.onreadystatechange = function() {
      if (oFrm.readyState && oFrm.readyState != "complete") {
        return;
      } else {
        document.querySelector("#loadingbar").remove(); //清除加载动画
      }
    };
  }
};
</script>

<style lang="scss" scoped>
.sm-component-iframe {
  position: relative;
  text-align: center;
  padding-top: 20px;
  & > iframe {
    width: 100%;
    height: 50vh;
    border: none;
    box-shadow: 0 0px 5px rgba(0, 0, 0, 0.2);
    border-radius: 4px;
    background-color: black;
  }
}
</style>
