<template>
  <div>
    <!-- 导航 -->
    <van-nav-bar title="首页|搜索" fixed/>
    <!-- 内容
    1. tabs切换
    2. list列表: 加载更多+下拉刷新

     -->
    <van-tabs v-model="activeChannelIndex" class="channel-tabs">
      <van-tab :title="item.name" v-for="item in channels" :key="item.id">

        <van-pull-refresh v-model="item.downPullLoading" @refresh="onRefresh">

          <!-- 列表  van-list -->
          <!--
            频道1 -> loading->false -> true
            频道2 -> loading->false ->
           -->
          <van-list v-model="item.upPullLoading" :finished="item.upPullFinished" finished-text="没有更多了" @load="onLoad">
            <van-cell v-for="item in item.articles" :key="item.art_id" :title="item.title" />
          </van-list>

        </van-pull-refresh>

      </van-tab>

    </van-tabs>

  </div>
</template>

<script>
import { getChannelsUserOrDefault } from '@/api/channel.js'
import { getArticles } from '@/api/article.js'

import { mapState } from 'vuex'

export default {
  name: 'HomeIndex',
  data() {
    return {
      activeChannelIndex: 1,
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
  computed: {
    ...mapState(['user']),
    activeChannel() {
      return this.channels[this.activeChannelIndex]
    }
  },
  methods: {
    async loadChannels() {
      // 取出本地数据
      const lsChannels = JSON.parse(window.localStorage.getItem('channels'))

      try {
        if (this.user || (!this.user && !lsChannels)) {
          const data = await getChannelsUserOrDefault()

          data.channels.forEach(item => {
            // id和name
            item.downPullLoading = false // 当前频道下拉状态
            item.upPullLoading = false // 当前频道上拉加载更多
            item.upPullFinished = false // 当前频道加载完毕
            item.timestamp = Date.now() // 为每个频道添加默认时间戳属性
            item.articles = [] // 为了控制每个频道自己的文章列表数据
          })
          this.channels = data.channels
        }

        if (!this.user && lsChannels) {
          this.channels = lsChannels
        }
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

    // 获取文章列表数据
    async loadArticles() {
      const { id: channel_id, timestamp } = this.activeChannel

      const data = await getArticles({
        // 当前激活的频道的id<-当前激活的频道<-activeChannel
        channel_id,
        // timestamp: Date.now(),
        // timestamp,
        timestamp,
        with_top: 1
      })
      return data
    },
    // 加载更多的方法
    async onLoad() {
      // 延迟执行是独立作用的函数->多次使用
      // 1. 函数
      // 2. 模块.js
      // 3. 挂载Vue的实例上  ->  this.$sleep()

      await this.$sleep(800)

      let data = []
      // 第一次发送请求
      data = await this.loadArticles()
      // console.log(data) // -->    {results:[],pre_time:1556789000001}

      // 有历史时间戳
      if (data.pre_timestamp && data.results.length === 0) {
        // 更新timestamp时间戳
        this.activeChannel.timestamp = data.pre_timestamp
        // 根据当前的有效时间戳发送新请求
        data = await this.loadArticles()
        // console.log(data)
      }

      // 所有数据加载完毕
      if (!data.pre_timestamp) {
        this.activeChannel.upPullLoading = false
        this.activeChannel.upPullFinished = true

        return
      }

      // 更新最新的时间戳
      this.activeChannel.timestamp = data.pre_timestamp
      // 时间戳 ->   频道数据channels  和  当前文章列表数据data.results
      this.activeChannel.articles.push(...data.results)
      // 停止加载中的动画
      this.activeChannel.upPullLoading = false
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
