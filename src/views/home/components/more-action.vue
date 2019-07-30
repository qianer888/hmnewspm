<template>
  <!-- <van-dialog v-model="show" title="标题" show-cancel-button>
    <img src="https://img.yzcdn.cn/vant/apple-3.jpg">
  </van-dialog> -->
  <van-dialog :value="value" closeOnClickOverlay @input="$emit('input')" :showConfirmButton="false" :show-cancel-button="false">
    更多操作
  </van-dialog>
</template>

<script>
export default {
  name: 'MoreAction',
  // props:['show']
  props: {
    value: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang='less' scoped>
</style>
