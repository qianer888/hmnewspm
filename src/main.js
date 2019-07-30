import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Vant from 'vant'
import VeeValidate, { Validator } from 'vee-validate'
import 'vant/lib/index.css'
import 'amfe-flexible/index.js'

import zh_CN from 'vee-validate/dist/locale/zh_CN'

Vue.use(Vant)
Vue.use(VeeValidate)
Validator.localize('zh_CN', zh_CN)

// 自定义验证规则
Validator.extend('phone', {
    // 提示消息
    getMessage: field => field + '格式不正确',
    // 自定义规则的具体代码
    validate: value => {
        // 提示: 实际正则不需要写
        return (
            value.length === 11 && /^((13|15|16|18|19)[0-9]{1})\d{8}$/.test(value)
        )
    }
})

// 睡眠
// 看到异步->
// 1. cb -> 回调地狱  ->  层层嵌套
// 2. Promise -> 缺点
//   2.1 一个Promise对应一个异步
//   2.2 .then().catch()
// 3. async await

Vue.prototype.$sleep = time => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve()
        }, time)
    })
}

Vue.config.productionTip = false

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')