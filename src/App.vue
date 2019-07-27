<template>
  <div id="app">
    App----

    <van-button type="primary">主要按钮</van-button>

    <div class="test"></div>

    <router-view/>
  </div>
</template>

<style lang="less" scoped>
// 需求
// 自己的设计稿的参照尺寸 750
// div满屏宽->750px
.test {
  width: 700px;
  height: 200px;
  background-color: yellow;
}
</style>
