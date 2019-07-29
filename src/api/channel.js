// 频道api
import request from '@/utils/request.js'

/**
 * 获取频道列表数据
 * 1. 如果headers设置了Authorization为token->获取用户关注的频道
 * 2. 反之,获取默认推荐的频道
 */

export const getChannelsUserOrDefault = () => {
    return request({
        method: 'get',
        url: `/app/v1_0/user/channels`
    })
}