<template>

  <van-dialog :value="value" closeOnClickOverlay @input="$emit('input')" :showConfirmButton="false" :show-cancel-button="false">
    <van-cell-group v-if="!isReport">
      <van-cell icon="location-o" title="不感兴趣" @click="handleDislikeArticle()" />
      <van-cell icon="location-o" title="反馈垃圾内容" is-link @click="isReport=true" />
      <van-cell icon="location-o" title="拉黑作者" />
    </van-cell-group>

    <van-cell-group v-else>
      <van-cell icon="arrow-left" @click="isReport=false" />
      <van-cell title="侵权" icon="location-o" />
      <van-cell title="色情" icon="location-o" />
      <van-cell title="暴力" icon="location-o" />
      <van-cell title="低俗" icon="location-o" />
      <van-cell title="不适" icon="location-o" />
      <van-cell title="错误" icon="location-o" />
      <van-cell title="其他" icon="location-o" />
    </van-cell-group>
  </van-dialog>

</template>

<script>
import { dislikeArticle } from '@/api/article.js'

export default {
  name: 'MoreAction',
  data() {
    return {
      isReport: false
    }
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    currentArticle: {
      type: Object,
      // default:{}
      // 如果default的值是非基本类型,此时数据默认值应该作为函数的返回值
      // default:function(){
      //   return {}
      // }
      // default:()=>{
      //   return {}
      // }
      // default:()=>{return {}}
      // default:()=>[]
      default: () => {}
    }
  },
  methods: {
    async handleDislikeArticle() {
      const { art_id: article_Id } = this.currentArticle

      try {
        // 传递当前文章id<-自己声明<-形参<-已有数据props和data<-来源于外部<-文章列表组件
        await dislikeArticle(article_Id)
        // 移除当前文章->让父组件移动当前文章
        this.$emit('dislike-success')
        // 关闭对话框
        this.$emit('input', false)
        // 提示
        this.$toast('操作成功')
      } catch (error) {
        console.dir(error)
      }
    }
  }
}
</script>

<style lang='less' scoped>
</style>
