<template>
  <div>
    <!-- 导航 -->
    <van-nav-bar title="首页|搜索" fixed/>
    <!-- 内容
    1. tabs切换
    2. list列表: 加载更多+下拉刷新

     -->
    <van-tabs v-model="activeChannelIndex" class="channel-tabs">
      <van-tab title="我是第1个">
        <van-pull-refresh v-model="isLoading" @refresh="onRefresh">

          <!-- 列表  van-list -->
          <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
            <van-cell v-for="item in list" :key="item" :title="item" />
          </van-list>

        </van-pull-refresh>

      </van-tab>
      <van-tab title="我是第2个"></van-tab>

    </van-tabs>

  </div>
</template>

<script>
import { getChannelsUserOrDefault } from '@/api/channel.js'

export default {
  name: 'HomeIndex',
  data() {
    return {
      activeChannelIndex: 0,
      list: [],
      loading: false,
      finished: false,
      isLoading: false,
      channels: []
    }
  },
  created() {
    this.loadChannels()
  },
  methods: {
    async loadChannels() {
      try {
        const data = await getChannelsUserOrDefault()
        // data->{channels:[{},{}]}
        this.channels = data.channels
      } catch (error) {
        // console.log(error)
        console.dir(error)
      }
    },
    // 下拉刷新的方法
    onRefresh() {
      setTimeout(() => {
        this.$toast('刷新成功')
        this.isLoading = false
      }, 500)
    },
    // 加载更多的方法
    onLoad() {
      console.log('------')

      // 异步更新数据
      setTimeout(() => {
        for (let i = 0; i < 10; i++) {
          this.list.push(this.list.length + 1)
        }
        // 加载状态结束
        this.loading = false

        // 数据全部加载完成
        if (this.list.length >= 40) {
          this.finished = true
        }
      }, 500)
    }
  }
}
</script>

<style lang='less' scoped>
.van-nav-bar {
  background-color: #1989fa;
  .van-nav-bar__title {
    color: #ffffff;
  }
}

// 调整tabs样式
// 解决方案: 如果在scoped的前提下->也能选择当前类名van-tabs__wrap->vue文档scoped的具体用法
// 1. scoped作用当前作用域
// 2. 深度选择   ->   /deep/
// 补充: /deep/的另一种写法 >>> -> 和css预处理器不兼容
// .channel-tabs >>> .van-tabs__wrap {}

// 调整tabs整体底部的距离->为了能看到'没更多数据'
.channel-tabs {
  margin-bottom: 100px;
}
// 调整tab栏的位置
.channel-tabs /deep/ .van-tabs__wrap {
  position: fixed;
  top: 92px; // 46 *2 -> 92
}
// 调整tabs的内容的位置
.channel-tabs /deep/ .van-tabs__content {
  margin-top: 92px;
}
</style>
