<template>
   <el-header class="el-header">
      <div class="header-left">
        <img src="public/img/svg/logo.svg" alt />
        <span class="title">SuperMap_iClient3D_VUE_for_WebGL</span>
      </div>
      <div class="header-right">
        <ul>
          <li>
            <a href="http://support.supermap.com.cn:8090/webgl/web/index.html" target="_blank">首页</a>
          </li>
          <li>
            <a href="https://www.supermapol.com/earth/vue-iEarth/" target="_blank">SuperMap iEarth</a>
            </li>
          <!-- <li style="background-color:rgb(85, 84, 84,0.8)">Vue组件</li> -->
          <li><a href="https://www.supermapol.com/earth/vue-iEarth/examples/docs/SuperMap_iClient3D_VUE_10i(2020)使用指南.pdf" download >文档</a></li>
          <li title="暂未开放">GitHub</li>
        </ul>
      </div>
    </el-header>
</template>

<script>
export default {
  name: "layout-header",
  data() {
      return {
      };
    },
    methods: {
    },
};
</script>
<style lang="scss" scoped>
.el-header {
  height: 6%;
  background-color: #212121;
  display: flex;
  justify-content: space-between;
  .header-left {
    width: 336px;
    display: flex;
    align-items: center;
    img {
      width: 24px;
      height: 24px;
      display: inline-block;
      margin-right: 6px;
    }
    .title {
      font-size: 20px;
      color: #ffffff;
      font-family: "Microsoft Yahei";
      vertical-align: middle;
      opacity: 0.85;
      font-weight: 400;
    }
  }
  .header-right {
    font-family: "Microsoft Yahei";
    ul,
    li {
      padding: 0;
      margin: 0;
      list-style: none;
    }
    ul {
      height: 100%;
      display: flex;
      justify-content: space-evenly;
      align-items: center;
      li {
        padding: 0 10px;
        font-size: 14px;
        color: #ffffff;
        height: 100%;
        box-sizing: border-box;
        line-height: 60px;
      }
      li:hover {
        background-color: rgb(85, 84, 84);
        background-color: rgb(85, 84, 84);
      }
    }
  }
}
</style>



